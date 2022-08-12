import { getV2OpenGroupRoomByRoomId, saveV2OpenGroupRoom } from '../../../../data/opengroups';
import { callUtilsWorker } from '../../../../webworker/workers/util_worker_interface';
import { allowOnlyOneAtATime } from '../../../utils/Promise';
import { toHex } from '../../../utils/String';
import { getIdentityKeyPair, getOurPubKeyStrFromCache } from '../../../utils/User';
import { OpenGroupRequestCommonType, OpenGroupV2Request } from './ApiUtil';
import { sendApiV2Request } from './OpenGroupAPIV2';
import { parseStatusCodeFromOnionRequest } from './OpenGroupAPIV2Parser';

async function claimAuthToken(
  authToken: string,
  serverUrl: string,
  roomId: string
): Promise<string | null> {
  // Set explicitly here because is isn't in the database yet at this point
  const headers = { Authorization: authToken };
  const request: OpenGroupV2Request = {
    method: 'POST',
    headers,
    room: roomId,
    server: serverUrl,
    queryParams: { public_key: getOurPubKeyStrFromCache() },
    isAuthRequired: false,
    endpoint: 'claim_auth_token',
  };
  const result = await sendApiV2Request(request);
  const statusCode = parseStatusCodeFromOnionRequest(result);
  if (statusCode !== 200) {
    window?.log?.warn(`Could not claim token, status code: ${statusCode}`);
    return null;
  }
  return authToken;
}

async function oneAtATimeGetAuth({ serverUrl, roomId }: OpenGroupRequestCommonType) {
  return allowOnlyOneAtATime(`getAuthToken${serverUrl}:${roomId}`, async () => {
    try {
      // first try to fetch from db a saved token.
      const roomDetails = await getV2OpenGroupRoomByRoomId({ serverUrl, roomId });
      if (!roomDetails) {
        window?.log?.warn('getAuthToken Room does not exist.');
        return null;
      }

      if (roomDetails?.token) {
        return roomDetails.token;
      }

      window?.log?.info(
        `Triggering getAuthToken with serverUrl:'${serverUrl}'; roomId: '${roomId}'`
      );
      const token = await requestNewAuthToken({ serverUrl, roomId });

      if (!token) {
        window?.log?.warn('invalid new auth token', token);
        return;
      }

      window?.log?.info(`Got AuthToken for serverUrl:'${serverUrl}'; roomId: '${roomId}'`);
      const claimedToken = await claimAuthToken(token, serverUrl, roomId);

      if (!claimedToken) {
        window?.log?.warn('Failed to claim token', claimedToken);
      } else {
        window?.log?.info(`Claimed AuthToken for serverUrl:'${serverUrl}'; roomId: '${roomId}'`);
      }
      // still save it to the db. just to mark it as to be refreshed later
      roomDetails.token = claimedToken || '';
      await saveV2OpenGroupRoom(roomDetails);

      window?.log?.info(`AuthToken saved to DB for serverUrl:'${serverUrl}'; roomId: '${roomId}'`);

      return claimedToken;
    } catch (e) {
      window?.log?.error('Failed to getAuthToken', e);
      throw e;
    }
  });
}

export async function getAuthToken({
  serverUrl,
  roomId,
}: OpenGroupRequestCommonType): Promise<string | null> {
  return oneAtATimeGetAuth({ roomId, serverUrl });
}

// tslint:disable: member-ordering
export async function requestNewAuthToken({
  serverUrl,
  roomId,
}: OpenGroupRequestCommonType): Promise<string | null> {
  const userKeyPair = await getIdentityKeyPair();
  if (!userKeyPair) {
    throw new Error('Failed to fetch user keypair');
  }

  const ourPubkey = getOurPubKeyStrFromCache();
  const parameters = {} as Record<string, string>;
  parameters.public_key = ourPubkey;
  const request: OpenGroupV2Request = {
    method: 'GET',
    room: roomId,
    server: serverUrl,
    queryParams: parameters,
    isAuthRequired: false,
    endpoint: 'auth_token_challenge',
  };
  const json = (await sendApiV2Request(request)) as any;
  // parse the json
  if (!json || !json?.result?.challenge) {
    window?.log?.warn('Parsing failed');
    return null;
  }
  const {
    ciphertext: base64EncodedCiphertext,
    ephemeral_public_key: base64EncodedEphemeralPublicKey,
  } = json?.result?.challenge;

  if (!base64EncodedCiphertext || !base64EncodedEphemeralPublicKey) {
    window?.log?.warn('Parsing failed');
    return null;
  }
  const ciphertext = (await callUtilsWorker(
    'fromBase64ToArrayBuffer',
    base64EncodedCiphertext
  )) as ArrayBuffer;
  const ephemeralPublicKey = (await callUtilsWorker(
    'fromBase64ToArrayBuffer',
    base64EncodedEphemeralPublicKey
  )) as ArrayBuffer;
  try {
    const symmetricKey = (await callUtilsWorker(
      'deriveSymmetricKey',
      new Uint8Array(ephemeralPublicKey),
      new Uint8Array(userKeyPair.privKey)
    )) as ArrayBuffer;

    const plaintextBuffer = await callUtilsWorker(
      'DecryptAESGCM',
      new Uint8Array(symmetricKey),
      new Uint8Array(ciphertext)
    );

    const token = toHex(plaintextBuffer);

    return token;
  } catch (e) {
    window?.log?.error('Failed to decrypt token open group v2');
    return null;
  }
}
