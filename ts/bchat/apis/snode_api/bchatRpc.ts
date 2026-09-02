// eslint-disable-next-line import/no-named-default
import { default as insecureNodeFetch } from 'node-fetch';
import pRetry from 'p-retry';
import { HTTPError, NotFoundError } from '../../utils/errors';
import { Snode } from '../../../data/data';
import { getStoragePubKey } from '../../types';
import { SettingsKey } from '../../../data/settings-key';

import {
  ERROR_421_HANDLED_RETRY_REQUEST,
  bchatOnionFetch,
  processOnionRequestErrorAtDestination,
  snodeHttpsAgent,
  SnodeResponse,
} from './onions';

interface FetchOptions {
  method: string;
  body?: string;
  agent?: any;
}

/**
 * A small wrapper around node-fetch which deserializes response
 * returns insecureNodeFetch response or false
 */
async function bchatFetch({
  options,
  url,
  associatedWith,
  targetNode,
  timeout,
}: {
  url: string;
  options: FetchOptions;
  targetNode?: Snode;
  associatedWith?: string;
  timeout: number;
}): Promise<undefined | SnodeResponse> {
  const method = options.method || 'GET';

  const fetchOptions = {
    ...options,
    timeout,
    method,
  };

  try {
    // Absence of targetNode indicates that we want a direct connection
    // (e.g. to connect to a seed node for the first time)
    // The user-facing "Onion Routing" setting (Settings > Chat) is the sole source of truth here,
    // and defaults to OFF (direct connection) until the user explicitly opts in.
    const onionRoutingSetting = window.getSettingValue(SettingsKey.settingsOnionRouting);
    const useOnionRequests =
      onionRoutingSetting === undefined ? false : Boolean(onionRoutingSetting);
    if (useOnionRequests && targetNode) { 
      const fetchResult = await bchatOnionFetch({
        targetNode,
        body: fetchOptions.body,
        associatedWith,
      });
      if (!fetchResult) {
        return undefined;
      }
      

      return fetchResult;
    }
    if (url.match(/https:\/\//)) {
      // import that this does not get set in bchatFetch fetchOptions
      fetchOptions.agent = snodeHttpsAgent;
    }

    (fetchOptions as any).headers = {
      'User-Agent': 'WhatsApp',
      'Accept-Language': 'en-us',
    };

    window?.log?.warn(`insecureNodeFetch => bchatFetch of ${url}`);

    const response = await insecureNodeFetch(url, fetchOptions);
    const result = await response.text();

    if (!response.ok) {
      if (targetNode) {
        // Mirrors what the onion path already does with the destination's response
        // (swarm redirects on 421, clock-skew on 406, etc.) so a direct request gets the
        // same recovery instead of just failing outright.
        await processOnionRequestErrorAtDestination({
          statusCode: response.status,
          body: result,
          destinationEd25519: targetNode.pubkey_ed25519,
          associatedWith,
        });
      }
      throw new HTTPError('beldex_rpc error', response);
    }

    return {
      body: result,
      status: response.status,
    };
  } catch (e) {
    if (e.code === 'ENOTFOUND') {
      throw new NotFoundError('Failed to resolve address', e);
    }
    if (e.message === ERROR_421_HANDLED_RETRY_REQUEST) {
      throw new pRetry.AbortError(ERROR_421_HANDLED_RETRY_REQUEST);
    }
    throw e;
  }
}

/**
 * This function will throw for a few reasons.
 * The BChat-important ones are
 *  -> if we try to make a request to a path which fails too many times => user will need to retry himself
 *  -> if the targetNode gets too many errors => we will need to try to do this request again with another target node
 * The
 */
export async function snodeRpc(
  {
    method,
    params,
    targetNode,
    associatedWith,
    timeout = 10000,
  }: {
    method: string;
    params: Record<string, any>;
    targetNode: Snode;
    associatedWith?: string;
    timeout?: number;
  } //the user pubkey this call is for. if the onion request fails, this is used to handle the error for this user swarm for instance
): Promise<undefined | SnodeResponse> {
  const url = `https://${targetNode.ip}:${targetNode.port}/storage_rpc/v1`;

  // TODO: The jsonrpc and body field will be ignored on storage server
  if (params.pubKey) {
    // Ensure we always take a copy
    params = {
      ...params,
      pubKey: getStoragePubKey(params.pubKey),
    };
  }
  const body = {
    jsonrpc: '2.0',
    id: '0',
    method,
    params,
  };
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return bchatFetch({
    url,
    options: fetchOptions,
    targetNode,
    associatedWith,
    timeout,
  });
}
