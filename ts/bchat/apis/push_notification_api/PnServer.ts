import { callUtilsWorker } from '../../../webworker/workers/util_worker_interface';
import { sendViaOnionToNonSnode } from '../../onions/onionSend';

const pnServerPubkeyHex = '54e8ce6a688f6decd414350408cae373ab6070d91d4512e17454d2470c7cf911';

export const hrefPnServerProd = 'notification.rpcnode.stream';

export const hrefPnServerDev = 'notification.rpcnode.stream';
const pnServerUrl = `http://${hrefPnServerProd}`;
console.log("pnServerUrl:", pnServerUrl)
export async function notifyPnServer(wrappedEnvelope: ArrayBuffer, sentTo: string) {
  const options: ServerRequestOptionsType = {
    method: 'post',
    objBody: {
      data: await callUtilsWorker('arrayBufferToStringBase64', wrappedEnvelope),
      send_to: sentTo,
    },
  };
  const endpoint = 'notify';
  // console.log("endpoint", endpoint);
  console.log("options:",options)
  const ret = await serverRequest(`${pnServerUrl}/${endpoint}`, options);
  console.log("pnServerUrl---------ret:", ret)
  if (!ret) {
    window?.log?.warn('Push notification server request returned false');
  }
}

type ServerRequestOptionsType = {
  method: string;
  objBody: any;
};

/** The PN server only speaks onion request language */
// tslint:disable-next-line: max-func-body-length
// tslint:disable-next-line: cyclomatic-complexity
const serverRequest = async (
  endpoint: string,
  options: ServerRequestOptionsType
): Promise<boolean> => {
  const { method, objBody } = options;

  const url = new URL(endpoint);
  const fetchOptions: any = {};
  const headers: any = {};
  try {
    headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(objBody);
    fetchOptions.headers = headers;
    fetchOptions.method = method;
  } catch (e) {

    window?.log?.error('onionSend:::notifyPnServer - set up error:', e.code, e.message);
    return false;
  }

  try {
    console.log("url:",url)
    console.log("pn server.......", pnServerPubkeyHex, url, fetchOptions)
    const onionResponse = await sendViaOnionToNonSnode(pnServerPubkeyHex, url, fetchOptions);
    console.log("onionResponse:", onionResponse)
    if (
      !onionResponse ||
      !onionResponse.result ||
      (onionResponse.result.status as number) !== 200
    ) {
      throw new Error(`Failed to do PN notify call, no response, ${onionResponse}`);
    }
  } catch (e) {
    window?.log?.error(
      'onionSend:::serverRequest error',
      e.code,
      e.message,
      'attempting connection to',
      url.toString()
    );

    return false;
  }

  return true;
};
