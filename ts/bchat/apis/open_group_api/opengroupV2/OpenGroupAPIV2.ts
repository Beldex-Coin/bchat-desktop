import {
  getV2OpenGroupRoomByRoomId,
  OpenGroupV2Room,
  saveV2OpenGroupRoom,
} from '../../../../data/opengroups';
import { FSv2 } from '../../file_server_api';
import { sendViaOnionToNonSnode } from '../../../onions/onionSend';
import { PubKey } from '../../../types';
import { OpenGroupRequestCommonType, OpenGroupV2Info, OpenGroupV2Request } from './ApiUtil';
import {
  parseMemberCount,
  parseRooms,
  parseStatusCodeFromOnionRequest,
} from './OpenGroupAPIV2Parser';
import { OpenGroupMessageV2 } from './OpenGroupMessageV2';

import { isOpenGroupV2Request } from '../../file_server_api/FileServerApiV2';
import { getAuthToken } from './ApiAuth';
import pRetry from 'p-retry';
import { callUtilsWorker } from '../../../../webworker/workers/util_worker_interface';
import { UserUtils } from '../../../utils';

// used to be overwritten by testing
export const getMinTimeout = () => 1000;

/**
 * This function returns a base url to this room
 * This is basically used for building url after posting an attachment
 * hasRoomInEndpoint = true means the roomId is already in the endpoint.
 * so we don't add the room after the serverUrl.
 *
 */
function getCompleteEndpointUrl(
  roomInfos: OpenGroupRequestCommonType,
  endpoint: string,
  hasRoomInEndpoint: boolean
) {
  // serverUrl has the port and protocol already
  if (!hasRoomInEndpoint) {
    return `${roomInfos.serverUrl}/${roomInfos.roomId}/${endpoint}`;
  }
  // not room based, the endpoint already has the room in it
  return `${roomInfos.serverUrl}/${endpoint}`;
}

const getDestinationPubKey = async (
  request: OpenGroupV2Request | FSv2.FileServerV2Request
): Promise<string> => {
  if (FSv2.isOpenGroupV2Request(request)) {
    if (!request.serverPublicKey) {
      const roomDetails = await getV2OpenGroupRoomByRoomId({
        serverUrl: request.server,
        roomId: request.room,
      });
      if (!roomDetails?.serverPublicKey) {
        throw new Error('PublicKey not found for this server.');
      }
      return roomDetails.serverPublicKey;
    } else {
      return request.serverPublicKey;
    }
  } else {
    // this is a fileServer call
    return FSv2.fileServerV2PubKey;
  }
};

/**
 *
 * This send function is to be used for all non polling stuff.
 * This function can be used for OpengroupV2 request OR File Server V2 request
 * Download and upload of attachments for instance, but most of the logic happens in
 * the compact_poll endpoint.
 *
 */
export async function sendApiV2Request(
  request: OpenGroupV2Request | FSv2.FileServerV2Request
): Promise<Object | null> {
  const builtUrl = FSv2.buildUrl(request);

  if (!builtUrl) {
    throw new Error('Invalid request');
  }

  if (!window.getGlobalOnlineStatus()) {
    throw new pRetry.AbortError('Network is not available');
  }

  // set the headers sent by the caller, and the roomId.
  const headers = request.headers || {};
  if (FSv2.isOpenGroupV2Request(request)) {
    headers.Room = request.room;
  }

  let body = '';
  if (request.method !== 'GET') {
    body = JSON.stringify(request.queryParams);
  }

  const destinationX25519Key = await getDestinationPubKey(request);

  // Because auth happens on a per-room basis, we need both to make an authenticated request
  if (isOpenGroupV2Request(request) && request.isAuthRequired && request.room) {
    // this call will either return the token on the db,
    // or the promise currently fetching a new token for that same room
    // or fetch from the open group a new token for that room.

    if (request.forcedTokenToUse) {
      window?.log?.info('sendV2Request. Forcing token to use for room:', request.room);
    }
    const token =
      request.forcedTokenToUse ||
      (await getAuthToken({
        roomId: request.room,
        serverUrl: request.server,
      }));

    if (!token) {
      window?.log?.error('Failed to get token for open group v2');
      return null;
    }

    headers.Authorization = token;
    const res = await sendViaOnionToNonSnode(
      destinationX25519Key,
      builtUrl,
      {
        method: request.method,
        headers,
        body,
      },
      { noJson: true }
    );

    const statusCode = parseStatusCodeFromOnionRequest(res);
    if (!statusCode) {
      window?.log?.warn('sendOpenGroupV2Request Got unknown status code; res:', res);
      return res as object;
    }
    // A 401 means that we didn't provide a (valid) auth token for a route that required one. We use this as an
    // indication that the token we're using has expired.
    // Note that a 403 has a different meaning; it means that
    // we provided a valid token but it doesn't have a high enough permission level for the route in question.
    if (statusCode === 401) {
      const roomDetails = await getV2OpenGroupRoomByRoomId({
        serverUrl: request.server,
        roomId: request.room,
      });
      if (!roomDetails) {
        window?.log?.warn('Got 401, but this room does not exist');
        return null;
      }
      roomDetails.token = undefined;
      // we might need to retry doing the request here, but how to make sure we don't retry indefinetely?
      await saveV2OpenGroupRoom(roomDetails);
    }
    return res as object;
  } else {
    // no need for auth, just do the onion request
    const res = await sendViaOnionToNonSnode(destinationX25519Key, builtUrl, {
      method: request.method,
      headers,
      body,
    });
    return res as object;
  }
}

/**
 *
 */
export async function openGroupV2GetRoomInfo({
  serverUrl,
  roomId,
}: {
  roomId: string;
  serverUrl: string;
}): Promise<OpenGroupV2Info | null> {
  const request: OpenGroupV2Request = {
    method: 'GET',
    server: serverUrl,
    room: roomId,
    isAuthRequired: false,
    endpoint: `rooms/${roomId}`,
  };
  const result = await exports.sendApiV2Request(request);
  if (result?.result?.room) {
    const { id, name, image_id: imageId } = result?.result?.room;

    if (!id || !name) {
      window?.log?.warn('getRoominfo Parsing failed');
      return null;
    }
    const info: OpenGroupV2Info = {
      id,
      name,
      imageId,
    };

    return info;
  }
  window?.log?.warn('getInfo failed');
  return null;
}

/**
 * Send the specified message to the specified room.
 * If an error happens, this function throws it
 * Exported only for testing
 */
export const postMessageRetryable = async (
  message: OpenGroupMessageV2,
  room: OpenGroupRequestCommonType
) => {
  const ourKeyPair = await UserUtils.getIdentityKeyPair();

  const signedMessage = await message.sign(ourKeyPair);
  const json = signedMessage.toJson();

  const request: OpenGroupV2Request = {
    method: 'POST',
    room: room.roomId,
    server: room.serverUrl,
    queryParams: json,
    isAuthRequired: true,
    endpoint: 'messages',
  };

  const result = await exports.sendApiV2Request(request);

  const statusCode = parseStatusCodeFromOnionRequest(result);

  if (statusCode !== 200) {
    throw new Error(`Could not postMessage, status code: ${statusCode}`);
  }
  const rawMessage = result?.result?.message;
  if (!rawMessage) {
    throw new Error('postMessage parsing failed');
  }
  // this will throw if the json is not valid
  return OpenGroupMessageV2.fromJson(rawMessage);
};

export const postMessage = async (
  message: OpenGroupMessageV2,
  room: OpenGroupRequestCommonType
) => {
  const result = await pRetry(
    async () => {
      return exports.postMessageRetryable(message, room);
    },
    {
      retries: 3, // each path can fail 3 times before being dropped, we have 3 paths at most
      factor: 2,
      minTimeout: exports.getMinTimeout(),
      maxTimeout: 4000,
      onFailedAttempt: e => {
        window?.log?.warn(
          `postMessageRetryable attempt #${e.attemptNumber} failed. ${e.retriesLeft} retries left...`
        );
      },
    }
  );
  return result;
  // errors are saved on the message itself if this pRetry fails too many times
};

export const banUser = async (
  userToBan: PubKey,
  roomInfos: OpenGroupRequestCommonType,
  deleteAllMessages: boolean
): Promise<boolean> => {
  const queryParams = { public_key: userToBan.key };
  const endpoint = deleteAllMessages ? 'ban_and_delete_all' : 'block_list';
  const request: OpenGroupV2Request = {
    method: 'POST',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: true,
    queryParams,
    endpoint,
  };
  const banResult = await exports.sendApiV2Request(request);
  const isOk = parseStatusCodeFromOnionRequest(banResult) === 200;
  return isOk;
};

export const unbanUser = async (
  userToBan: PubKey,
  roomInfos: OpenGroupRequestCommonType
): Promise<boolean> => {
  const request: OpenGroupV2Request = {
    method: 'DELETE',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: true,
    endpoint: `block_list/${userToBan.key}`,
  };
  const unbanResult = await exports.sendApiV2Request(request);
  const isOk = parseStatusCodeFromOnionRequest(unbanResult) === 200;
  return isOk;
};

/**
 * Deletes messages on open group server
 */
export const deleteMessageByServerIds = async (
  idsToRemove: Array<number>,
  roomInfos: OpenGroupRequestCommonType
): Promise<boolean> => {
  const request: OpenGroupV2Request = {
    method: 'POST',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: true,
    endpoint: 'delete_messages',
    queryParams: { ids: idsToRemove },
  };
  const messageDeletedResult = await exports.sendApiV2Request(request);
  const isOk = parseStatusCodeFromOnionRequest(messageDeletedResult) === 200;
  return isOk;
};

export const getAllRoomInfos = async (roomInfos: OpenGroupV2Room) => {
  // room should not be required here
  const request: OpenGroupV2Request = {
    method: 'GET',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: false,
    endpoint: 'rooms',
    serverPublicKey: roomInfos.serverPublicKey,
  };
  const result = await exports.sendApiV2Request(request);
  const statusCode = parseStatusCodeFromOnionRequest(result);

  if (statusCode !== 200) {
    window?.log?.warn('getAllRoomInfos failed invalid status code');
    return;
  }

  return parseRooms(result);
};

export const getMemberCount = async (
  roomInfos: OpenGroupRequestCommonType
): Promise<number | undefined> => {
  const request: OpenGroupV2Request = {
    method: 'GET',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: true,
    endpoint: 'member_count',
  };
  const result = await exports.sendApiV2Request(request);
  if (parseStatusCodeFromOnionRequest(result) !== 200) {
    window?.log?.warn(
      `getMemberCount failed invalid status code for serverUrl:'${roomInfos.serverUrl}' roomId:'${roomInfos.roomId}; '`,
      result
    );
    return;
  }
  const count = parseMemberCount(result);
  if (count === undefined) {
    window?.log?.warn(
      `getMemberCount failed invalid count for serverUrl:'${roomInfos.serverUrl}' roomId:'${roomInfos.roomId}'`
    );
    return;
  }

  return count;
};

/**
 * File upload and download
 */

export const downloadFileOpenGroupV2 = async (
  fileId: number,
  roomInfos: OpenGroupRequestCommonType
): Promise<Uint8Array | null> => {
  if (!fileId) {
    window?.log?.warn('downloadFileOpenGroupV2: FileId cannot be unset. returning null');
    return null;
  }
  const request: OpenGroupV2Request = {
    method: 'GET',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: true,
    endpoint: `files/${fileId}`,
  };

  const result = await exports.sendApiV2Request(request);
  const statusCode = parseStatusCodeFromOnionRequest(result);
  if (statusCode !== 200) {
    return null;
  }

  // we should probably change the logic of sendOnionRequest to not have all those levels
  const base64Data = result?.result?.result as string | undefined;

  if (!base64Data) {
    return null;
  }
  return new Uint8Array(await callUtilsWorker('fromBase64ToArrayBuffer', base64Data));
};

export const downloadFileOpenGroupV2ByUrl = async (
  pathName: string,
  roomInfos: OpenGroupRequestCommonType
): Promise<Uint8Array | null> => {
  const request: OpenGroupV2Request = {
    method: 'GET',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: false,
    endpoint: pathName,
  };

  const result = await exports.sendApiV2Request(request);
  const statusCode = parseStatusCodeFromOnionRequest(result);
  if (statusCode !== 200) {
    return null;
  }

  // we should probably change the logic of sendOnionRequest to not have all those levels
  const base64Data = result?.result?.result as string | undefined;

  if (!base64Data) {
    return null;
  }
  return new Uint8Array(await callUtilsWorker('fromBase64ToArrayBuffer', base64Data));
};

/**
 * Download the preview image for that opengroup room.
 * The returned value is a base64 string.
 * It can be used directly, or saved on the attachments directory if needed, but this function does not handle it
 */
export const downloadPreviewOpenGroupV2 = async (
  roomInfos: OpenGroupV2Room
): Promise<string | null> => {
  const request: OpenGroupV2Request = {
    method: 'GET',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: false,
    endpoint: `rooms/${roomInfos.roomId}/image`,
    serverPublicKey: roomInfos.serverPublicKey,
  };

  const result = await exports.sendApiV2Request(request);
  const statusCode = parseStatusCodeFromOnionRequest(result);
  if (statusCode !== 200) {
    return null;
  }

  // we should probably change the logic of sendOnionRequest to not have all those levels
  const base64Data = result?.result?.result as string | undefined;

  if (!base64Data) {
    return null;
  }
  return base64Data;
};

/**
 * Returns the id on which the file is saved, or null
 */
export const uploadFileOpenGroupV2 = async (
  fileContent: Uint8Array,
  roomInfos: OpenGroupRequestCommonType
): Promise<{ fileId: number; fileUrl: string } | null> => {
  if (!fileContent || !fileContent.length) {
    return null;
  }
  const queryParams = {
    file: await callUtilsWorker('arrayBufferToStringBase64', fileContent),
  };

  const filesEndpoint = 'files';
  const request: OpenGroupV2Request = {
    method: 'POST',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: true,
    endpoint: filesEndpoint,
    queryParams,
  };

  const result = await exports.sendApiV2Request(request);
  const statusCode = parseStatusCodeFromOnionRequest(result);
  if (statusCode !== 200) {
    return null;
  }

  // we should probably change the logic of sendOnionRequest to not have all those levels
  const fileId = result?.result?.result as number | undefined;
  if (!fileId) {
    return null;
  }
  const fileUrl = getCompleteEndpointUrl(roomInfos, `${filesEndpoint}/${fileId}`, false);
  return {
    fileId: fileId,
    fileUrl,
  };
};

export const uploadImageForRoomOpenGroupV2 = async (
  fileContent: Uint8Array,
  roomInfos: OpenGroupRequestCommonType
): Promise<{ fileUrl: string } | null> => {
  if (!fileContent || !fileContent.length) {
    return null;
  }

  const queryParams = {
    file: await callUtilsWorker('arrayBufferToStringBase64', fileContent),
  };

  const imageEndpoint = `rooms/${roomInfos.roomId}/image`;
  const request: OpenGroupV2Request = {
    method: 'POST',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: true,
    endpoint: imageEndpoint,
    queryParams,
  };

  const result = await exports.sendApiV2Request(request);
  const statusCode = parseStatusCodeFromOnionRequest(result);
  if (statusCode !== 200) {
    return null;
  }
  const fileUrl = getCompleteEndpointUrl(roomInfos, `${imageEndpoint}`, true);
  return {
    fileUrl,
  };
};

/** MODERATORS ADD/REMOVE */

export const addModerator = async (
  userToAddAsMods: PubKey,
  roomInfos: OpenGroupRequestCommonType
): Promise<boolean> => {
  const request: OpenGroupV2Request = {
    method: 'POST',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: true,
    queryParams: { public_key: userToAddAsMods.key, room_id: roomInfos.roomId },
    endpoint: 'moderators',
  };
  const addModResult = await exports.sendApiV2Request(request);
  const isOk = parseStatusCodeFromOnionRequest(addModResult) === 200;
  return isOk;
};

export const removeModerator = async (
  userToAddAsMods: PubKey,
  roomInfos: OpenGroupRequestCommonType
): Promise<boolean> => {
  const request: OpenGroupV2Request = {
    method: 'DELETE',
    room: roomInfos.roomId,
    server: roomInfos.serverUrl,
    isAuthRequired: true,
    endpoint: `moderators/${userToAddAsMods.key}`,
  };
  const removeModResult = await exports.sendApiV2Request(request);
  const isOk = parseStatusCodeFromOnionRequest(removeModResult) === 200;
  return isOk;
};
