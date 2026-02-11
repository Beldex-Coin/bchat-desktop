import { callUtilsWorker } from '../../../webworker/workers/browser/util_worker_interface';
import { sendViaOnionToNonSnode } from '../../onions/onionSend';

const pnServerPubkeyHex = '589f8d0d376933e6a48266423235f323dfa4eb4179903314cf5dfb30d6cf794a';

export const hrefPnServerProd = 'pushnotificationv1.rpcnode.stream';

const pnServerUrl = `http://${hrefPnServerProd}`;
export async function notifyPnServer(wrappedEnvelope: ArrayBuffer, sentTo: string) {
  const options: ServerRequestOptionsType = {
    method: 'post',
    objBody: {
      data: await callUtilsWorker('arrayBufferToStringBase64', wrappedEnvelope),
      send_to: sentTo,
    },
  };
  const endpoint = 'notify';  
  const ret = await serverRequest(`${pnServerUrl}/${endpoint}`, options);
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
    const onionResponse = await sendViaOnionToNonSnode(pnServerPubkeyHex, url, fetchOptions);
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
