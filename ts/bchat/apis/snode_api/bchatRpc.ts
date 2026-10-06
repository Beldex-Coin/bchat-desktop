// eslint-disable-next-line import/no-named-default
import { default as insecureNodeFetch } from 'node-fetch';
import pRetry from 'p-retry';
import { HTTPError, NotFoundError } from '../../utils/errors';
import { Snode } from '../../../data/data';
import { getStoragePubKey } from '../../types';
import { getEffectiveOnionRoutingHops } from '../../../data/settings-key';

import {
  ERROR_421_HANDLED_RETRY_REQUEST,
  bchatOnionFetch,
  bchatOneHopOnionFetch,
  incrementBadSnodeCountOrDrop,
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
    // The "Onion Routing" picker in Settings > Chat (0 / 1 / 3 hops - see
    // getEffectiveOnionRoutingHops() in settings-key.ts) is the single source of truth here:
    //  - 3 hops -> bchatOnionFetch, the full onion-routed path.
    //  - 1 hop -> bchatOneHopOnionFetch, a single round trip straight to targetNode, but the
    //    body is encrypted to its x25519 key.
    //  - 0 hops -> falls straight through to the raw insecureNodeFetch request below, no onion
    //    encryption at all - the same request shape as before any onion-request code existed.
    const onionRoutingHops = targetNode ? getEffectiveOnionRoutingHops() : 0;
    if (onionRoutingHops === 3 && targetNode) {
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
    if (onionRoutingHops === 1 && targetNode) {
      const fetchResult = await bchatOneHopOnionFetch({
        targetNode,
        body: fetchOptions.body,
        associatedWith,
      });
      if (!fetchResult) {
        return undefined;
      }

      return fetchResult;
    }
    // 0 hops (or there's no targetNode, e.g. a seed-node bootstrap call) - fall through to the
    // raw request below. Note: at 0 hops, this reintroduces the exact gap the earlier security
    // review flagged - snodeHttpsAgent below has rejectUnauthorized: false, so the TLS
    // certificate isn't checked and the JSON body goes out unencrypted at this layer. That's an
    // explicit, user-chosen product tradeoff for this setting (fastest, least private) - "1 hop"
    // above is the encrypted-but-still-single-round-trip alternative.
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
    // If our own internet is down, this exact failure happens for every node we talk to,
    // regardless of that node's actual health - it's not evidence against this node in
    // particular. This runs on every poll (which never stops), so a real outage can rack up
    // enough "failures" in minutes to drop this node from our swarm below, even though it's
    // perfectly healthy. Skip counting the failure entirely when we already know it's our own
    // connectivity that's the problem.
    const ourOwnConnectivityIsDown =
      e.code === 'ENETUNREACH' || e.code === 'ENETDOWN' || navigator.onLine === false;
    if (
      targetNode &&
      !ourOwnConnectivityIsDown &&
      (e.type === 'system' || e.type === 'request-timeout' || e.code === 'ENOTFOUND')
    ) {
      // node-fetch marks any underlying network failure this way (connection refused, host
      // unreachable, DNS failure, etc. -> type: 'system') and reports a timeout separately as
      // type: 'request-timeout', not 'system' - a node sitting behind a firewall typically times
      // out rather than refusing the connection, so without this check it was never counted as a
      // connection failure and got retried forever instead of eventually being dropped. Either
      // way, we never got a response from this node at all, so
      // processOnionRequestErrorAtDestination never runs for it. Record it as a failure here so
      // a genuinely dead/unreachable node gets dropped from the swarm after repeated failures
      // instead of being retried indefinitely. isConnectionError: true means this won't also
      // blacklist the node from the whole local pool - a connection-level failure like this one
      // doesn't prove the node itself is bad (it could just as easily be this network unable to
      // reach it directly), unlike a real protocol-level failure.
      await incrementBadSnodeCountOrDrop({
        snodeEd25519: targetNode.pubkey_ed25519,
        associatedWith,
        isConnectionError: true,
      });
    }
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
