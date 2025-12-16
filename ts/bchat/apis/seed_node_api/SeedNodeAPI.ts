// eslint-disable-next-line import/no-named-default
import { Constants } from '../..';
import { default as insecureNodeFetch } from 'node-fetch';
import https from 'https';
import _ from 'lodash';

import tls from 'tls';
import { sha256 } from '../../crypto';
import * as Data from '../../../data/data';
import pRetry from 'p-retry';
import { SeedNodeAPI } from '.';
import { allowOnlyOneAtATime } from '../../utils/Promise';
// import { callapi } from '../../../testHttps/httpsValid';


/**
 * Fetch all snodes from seed nodes.
 * Exported only for tests. This is not to be used by the app directly
 * @param seedNodes the seednodes to use to fetch snodes details
 */
export async function fetchSnodePoolFromSeedNodeWithRetries(
  seedNodes: Array<string>
): Promise<Array<Data.Snode>> {
  try {
    window?.log?.info(`fetchSnodePoolFromSeedNode with seedNodes.length ${seedNodes.length}`);

    let snodes = await getSnodeListFromSeednodeOneAtAtime(seedNodes);
    // make sure order of the list is random, so we get version in a non-deterministic way
    snodes = _.shuffle(snodes);
    // commit changes to be live
    // we'll update the version (in case they upgrade) every cycle
    const fetchSnodePool = snodes.map(snode => ({
      ip: snode.public_ip,
      port: snode.storage_port,
      pubkey_x25519: snode.pubkey_x25519,
      pubkey_ed25519: snode.pubkey_ed25519,
    }));

    window?.log?.info(
      'SeedNodeAPI::fetchSnodePoolFromSeedNodeWithRetries - Refreshed random snode pool with',
      snodes.length,
      'mnodes'
    );
    return fetchSnodePool;
  } catch (e) {
    window?.log?.warn(
      'BchatSnodeAPI::fetchSnodePoolFromSeedNodeWithRetries - error',
      e.code,
      e.message
    );

    throw new Error('Failed to contact seed node');
  }
}

const getSslAgentForSeedNode = async (seedNodeHost: string, isSsl = false) => {
  let certContent = '';
  let pubkey256 = '';
  let cert256 = '';

  if (!isSsl) {
    return undefined;
  }


  switch (seedNodeHost) {
    case 'publicnode1.rpcnode.stream':
      certContent = Buffer.from(storageSeed1Crt, 'utf-8').toString();
      pubkey256 =
        // 'jQJTbIh0grw0/1TkHSumWb+Fs0Ggogr621gT3PvPKG0='
        'C5+lpZ7tcVwmwQIMcRtPbsQtWLABXhQzejna0wHFr8M=';
      cert256 =
        '6D:99:FB:26:5E:B1:C5:B3:74:47:65:FC:BC:64:8F:3C:D8:E1:BF:FA:FD:C4:C2:F9:9B:9D:47:CF:7F:F1:C2:4F'
      // '67:AD:D1:16:6B:02:0A:E6:1B:8F:5F:C9:68:13:C0:4C:2A:A5:89:96:07:96:86:55:72:A3:C7:E7:37:61:3D:FD'
      break;
    case 'publicnode2.rpcnode.stream':
      certContent = Buffer.from(storageSeed3Crt, 'utf-8').toString();
      pubkey256 = 'C5+lpZ7tcVwmwQIMcRtPbsQtWLABXhQzejna0wHFr8M=';
      cert256 =
        '6D:99:FB:26:5E:B1:C5:B3:74:47:65:FC:BC:64:8F:3C:D8:E1:BF:FA:FD:C4:C2:F9:9B:9D:47:CF:7F:F1:C2:4F';
      break;
    case 'publicnode3.rpcnode.stream':
      certContent = Buffer.from(publicBeldexFoundationCtr, 'utf-8').toString();
      pubkey256 = 'C5+lpZ7tcVwmwQIMcRtPbsQtWLABXhQzejna0wHFr8M=';
      cert256 =
        '6D:99:FB:26:5E:B1:C5:B3:74:47:65:FC:BC:64:8F:3C:D8:E1:BF:FA:FD:C4:C2:F9:9B:9D:47:CF:7F:F1:C2:4F';
      break;
    case 'publicnode4.rpcnode.stream':
      certContent = Buffer.from(publicBeldexFoundationCtr, 'utf-8').toString();
      pubkey256 = 'C5+lpZ7tcVwmwQIMcRtPbsQtWLABXhQzejna0wHFr8M=';
      cert256 =
        '6D:99:FB:26:5E:B1:C5:B3:74:47:65:FC:BC:64:8F:3C:D8:E1:BF:FA:FD:C4:C2:F9:9B:9D:47:CF:7F:F1:C2:4F';
      break;
    case 'publicnode5.rpcnode.stream':
      console.log(storageSeed3Crt, storageSeed1Crt)
      certContent = Buffer.from(publicBeldexFoundationCtr, 'utf-8').toString();
      pubkey256 = 'C5+lpZ7tcVwmwQIMcRtPbsQtWLABXhQzejna0wHFr8M=';
      cert256 =
        '6D:99:FB:26:5E:B1:C5:B3:74:47:65:FC:BC:64:8F:3C:D8:E1:BF:FA:FD:C4:C2:F9:9B:9D:47:CF:7F:F1:C2:4F';
      break;

    default:
      throw new Error(`Unknown seed node: ${seedNodeHost}`);
  }


  // read the cert each time. We only run this request once for each seed node nevertheless.
  const sslOptions: https.AgentOptions = {
    // as the seed nodes are using a self signed certificate, we have to provide it here.
    ca: certContent,
    // we have to reject them, otherwise our errors returned in the checkServerIdentity are simply not making the call fail.
    // so in production, rejectUnauthorized must be true.
    rejectUnauthorized: false,
    keepAlive: false,
    checkServerIdentity: (host: string, cert: any) => {
      // Make sure the certificate is issued to the host we are connected to
      const err = tls.checkServerIdentity(host, cert);

      if (err) {
        return err;
      }
      // Pin the public key, similar to HPKP pin-sha25 pinning
      if (sha256(cert.pubkey) !== pubkey256) {
        const msg =
          'Certificate verification error: ' +
          `The public key of '${cert.subject.CN}' ` +
          'does not match our pinned fingerprint';
        return new Error(msg);
      }

      // Pin the exact certificate, rather than the pub key
      if (cert.fingerprint256 !== cert256) {
        const msg =
          'Certificate verification error: ' +
          `The certificate of '${cert.subject.CN}' ` +
          'does not match our pinned fingerprint';
        return new Error(msg);
      }
      return undefined;
    },
  };

  // we're creating a new Agent that will now use the certs we have configured
  return new https.Agent(sslOptions);
};

export interface SnodeFromSeed {
  public_ip: string;
  storage_port: number;
  pubkey_x25519: string;
  pubkey_ed25519: string;
}

const getSnodeListFromSeednodeOneAtAtime = async (seedNodes: Array<string>) =>
  allowOnlyOneAtATime('getSnodeListFromSeednode', () =>
    getSnodeListFromSeednode(seedNodes)
  ) as Promise<Array<SnodeFromSeed>>;

/**
 * This call will try 4 times to contact a seed nodes (random) and get the snode list from it.
 * If all attempts fails, this function will throw the last error.
 * The returned list is not shuffled when returned.
 */
async function getSnodeListFromSeednode(seedNodes: Array<string>): Promise<Array<SnodeFromSeed>> {
  const SEED_NODE_RETRIES = 4;

  return pRetry(
    async () => {
      window?.log?.info('getSnodeListFromSeednode starting...');
      if (!seedNodes.length) {
        window?.log?.info('beldex_mnode_api::getSnodeListFromSeednode - seedNodes are empty');
        throw new Error('getSnodeListFromSeednode - seedNodes are empty');
      }
      // do not try/catch, we do want exception to bubble up so pRetry, well, retries
      const snodes = await SeedNodeAPI.TEST_fetchSnodePoolFromSeedNodeRetryable(seedNodes);

      return snodes;
    },
    {
      retries: SEED_NODE_RETRIES - 1,
      factor: 2,
      minTimeout: SeedNodeAPI.getMinTimeout(),
      onFailedAttempt: e => {
        window?.log?.warn(
          `fetchSnodePoolFromSeedNodeRetryable attempt #${e.attemptNumber} failed. ${e.retriesLeft} retries left... Error: ${e.message}`
        );
      },
    }
  );
}

export function getMinTimeout() {
  return 1000;
}

/**
 * This functions choose randonly a seed node from seedNodes and try to get the snodes from it, or throws.
 * This function is to be used with a pRetry caller
 */
export async function TEST_fetchSnodePoolFromSeedNodeRetryable(
  seedNodes: Array<string>
): Promise<Array<SnodeFromSeed>> {
  window?.log?.info('fetchSnodePoolFromSeedNodeRetryable starting...');

  if (!seedNodes.length) {
    window?.log?.info('beldex_mnode_api::fetchSnodePoolFromSeedNodeRetryable - seedNodes are empty');
    throw new Error('fetchSnodePoolFromSeedNodeRetryable: Seed nodes are empty');
  }

  const seedNodeUrl = _.sample(seedNodes);
  if (!seedNodeUrl) {
    window?.log?.warn(
      'beldex_mnode_api::fetchSnodePoolFromSeedNodeRetryable - Could not select random snodes from',
      seedNodes
    );
    throw new Error('fetchSnodePoolFromSeedNodeRetryable: Seed nodes are empty #2');
  }

  const tryUrl = new URL(seedNodeUrl);

  const snodes = await getSnodesFromSeedUrl(tryUrl);
  if (snodes.length === 0) {
    window?.log?.warn(
      `beldex_mnode_api::fetchSnodePoolFromSeedNodeRetryable - ${seedNodeUrl} did not return any snodes`
    );
    throw new Error(`Failed to contact seed node: ${seedNodeUrl}`);
  }

  return snodes;
}

/**
 * Try to get the snode list from the given seed node URL, or throws.
 * This function throws for whatever reason might happen (timeout, invalid response, 0 valid snodes returned, ...)
 * This function is to be used inside a pRetry function
 */
async function getSnodesFromSeedUrl(urlObj: URL): Promise<Array<any>> {
  // Removed limit until there is a way to get snode info
  // for individual nodes (needed for guard nodes);  this way
  // we get all active nodes
  window?.log?.info(`getSnodesFromSeedUrl starting with ${urlObj.href}`);
  // callapi()

  const params = {
    active_only: true,
    ours_only: true,
    fields: {
      public_ip: true,
      storage_port: true,
      pubkey_x25519: true,
      pubkey_ed25519: true,
    },
  };

  const endpoint = 'json_rpc';
  const url = `${urlObj.href}${endpoint}`;

  const body = {
    jsonrpc: '2.0',
    id: '0',
    method: 'get_n_master_nodes',
    params,
  };

  const sslAgent = await getSslAgentForSeedNode(
    urlObj.hostname,
    urlObj.protocol !== Constants.PROTOCOLS.HTTP
  );

  const fetchOptions = {
    method: 'POST',
    timeout: 5000,
    body: JSON.stringify(body),
    headers: {
      'User-Agent': 'WhatsApp',
      'Accept-Language': 'en-us',
    },
    agent: sslAgent,
  };
  window?.log?.info('insecureNodeFetch => plaintext for getSnodesFromSeedUrl');


  const response = await insecureNodeFetch(url, fetchOptions);
  if (response.status !== 200) {
    window?.log?.error(
      `beldex_mnode_api:::getSnodesFromSeedUrl - invalid response from seed ${urlObj.toString()}:`,
      response
    );
    throw new Error(
      `getSnodesFromSeedUrl: status is not 200 ${response.status} from ${urlObj.href}`
    );
  }

  if (response.headers.get('Content-Type') !== 'application/json') {
    window?.log?.error('Response is not json');
    throw new Error(`getSnodesFromSeedUrl: response is not json Content-Type from ${urlObj.href}`);
  }

  try {
    const json = await response.json();
    const result = json.result;

    if (!result) {
      window?.log?.error(
        `beldex_mnode_api:::getSnodesFromSeedUrl - invalid result from seed ${urlObj.toString()}:`,
        response
      );
      throw new Error(`getSnodesFromSeedUrl: json.result is empty from ${urlObj.href}`);
    }
    // Filter 0.0.0.0 nodes which haven't submitted uptime proofs
    const validNodes = result.master_node_states.filter(
      (snode: any) => snode.public_ip !== '0.0.0.0'
    );

    if (validNodes.length === 0) {
      throw new Error(`Did not get a single valid snode from ${urlObj.href}`);
    }
    return validNodes;
  } catch (e) {
    window?.log?.error('Invalid json response');
    throw new Error(`getSnodesFromSeedUrl: cannot parse content as JSON from ${urlObj.href}`);
  }
}



const storageSeed1Crt = `-----BEGIN CERTIFICATE-----
MIIFYDCCBEigAwIBAgIQQAF3ITfU6UK47naqPGQKtzANBgkqhkiG9w0BAQsFADA/
MSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT
DkRTVCBSb290IENBIFgzMB4XDTIxMDEyMDE5MTQwM1oXDTI0MDkzMDE4MTQwM1ow
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwggIiMA0GCSqGSIb3DQEB
AQUAA4ICDwAwggIKAoICAQCt6CRz9BQ385ueK1coHIe+3LffOJCMbjzmV6B493XC
ov71am72AE8o295ohmxEk7axY/0UEmu/H9LqMZshftEzPLpI9d1537O4/xLxIZpL
wYqGcWlKZmZsj348cL+tKSIG8+TA5oCu4kuPt5l+lAOf00eXfJlII1PoOK5PCm+D
LtFJV4yAdLbaL9A4jXsDcCEbdfIwPPqPrt3aY6vrFk/CjhFLfs8L6P+1dy70sntK
4EwSJQxwjQMpoOFTJOwT2e4ZvxCzSow/iaNhUd6shweU9GNx7C7ib1uYgeGJXDR5
bHbvO5BieebbpJovJsXQEOEO3tkQjhb7t/eo98flAgeYjzYIlefiN5YNNnWe+w5y
sR2bvAP5SQXYgd0FtCrWQemsAXaVCg/Y39W9Eh81LygXbNKYwagJZHduRze6zqxZ
Xmidf3LWicUGQSk+WT7dJvUkyRGnWqNMQB9GoZm1pzpRboY7nn1ypxIFeFntPlF4
FQsDj43QLwWyPntKHEtzBRL8xurgUBN8Q5N0s8p0544fAQjQMNRbcTa0B7rBMDBc
SLeCO5imfWCKoqMpgsy6vYMEG6KDA0Gh1gXxG8K28Kh8hjtGqEgqiNx2mna/H2ql
PRmP6zjzZN7IKw0KKP/32+IVQtQi0Cdd4Xn+GOdwiK1O5tmLOsbdJ1Fu/7xk9TND
TwIDAQABo4IBRjCCAUIwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAQYw
SwYIKwYBBQUHAQEEPzA9MDsGCCsGAQUFBzAChi9odHRwOi8vYXBwcy5pZGVudHJ1
c3QuY29tL3Jvb3RzL2RzdHJvb3RjYXgzLnA3YzAfBgNVHSMEGDAWgBTEp7Gkeyxx
+tvhS5B1/8QVYIWJEDBUBgNVHSAETTBLMAgGBmeBDAECATA/BgsrBgEEAYLfEwEB
ATAwMC4GCCsGAQUFBwIBFiJodHRwOi8vY3BzLnJvb3QteDEubGV0c2VuY3J5cHQu
b3JnMDwGA1UdHwQ1MDMwMaAvoC2GK2h0dHA6Ly9jcmwuaWRlbnRydXN0LmNvbS9E
U1RST09UQ0FYM0NSTC5jcmwwHQYDVR0OBBYEFHm0WeZ7tuXkAXOACIjIGlj26Ztu
MA0GCSqGSIb3DQEBCwUAA4IBAQAKcwBslm7/DlLQrt2M51oGrS+o44+/yQoDFVDC
5WxCu2+b9LRPwkSICHXM6webFGJueN7sJ7o5XPWioW5WlHAQU7G75K/QosMrAdSW
9MUgNTP52GE24HGNtLi1qoJFlcDyqSMo59ahy2cI2qBDLKobkx/J3vWraV0T9VuG
WCLKTVXkcGdtwlfFRjlBz4pYg1htmf5X6DYO8A4jqv2Il9DjXA6USbW1FzXSLr9O
he8Y4IWS6wY7bCkjCWDcRQJMEhg76fsO3txE+FiYruq9RUWhiF1myv4Q6W+CyBFC
Dfvp7OOGAN6dEOM4+qR9sdjoSYKEBpsr6GtPAQw4dy753ec5
-----END CERTIFICATE-----
`;

const storageSeed3Crt = `-----BEGIN CERTIFICATE-----
MIIFYDCCBEigAwIBAgIQQAF3ITfU6UK47naqPGQKtzANBgkqhkiG9w0BAQsFADA/
MSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT
DkRTVCBSb290IENBIFgzMB4XDTIxMDEyMDE5MTQwM1oXDTI0MDkzMDE4MTQwM1ow
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwggIiMA0GCSqGSIb3DQEB
AQUAA4ICDwAwggIKAoICAQCt6CRz9BQ385ueK1coHIe+3LffOJCMbjzmV6B493XC
ov71am72AE8o295ohmxEk7axY/0UEmu/H9LqMZshftEzPLpI9d1537O4/xLxIZpL
wYqGcWlKZmZsj348cL+tKSIG8+TA5oCu4kuPt5l+lAOf00eXfJlII1PoOK5PCm+D
LtFJV4yAdLbaL9A4jXsDcCEbdfIwPPqPrt3aY6vrFk/CjhFLfs8L6P+1dy70sntK
4EwSJQxwjQMpoOFTJOwT2e4ZvxCzSow/iaNhUd6shweU9GNx7C7ib1uYgeGJXDR5
bHbvO5BieebbpJovJsXQEOEO3tkQjhb7t/eo98flAgeYjzYIlefiN5YNNnWe+w5y
sR2bvAP5SQXYgd0FtCrWQemsAXaVCg/Y39W9Eh81LygXbNKYwagJZHduRze6zqxZ
Xmidf3LWicUGQSk+WT7dJvUkyRGnWqNMQB9GoZm1pzpRboY7nn1ypxIFeFntPlF4
FQsDj43QLwWyPntKHEtzBRL8xurgUBN8Q5N0s8p0544fAQjQMNRbcTa0B7rBMDBc
SLeCO5imfWCKoqMpgsy6vYMEG6KDA0Gh1gXxG8K28Kh8hjtGqEgqiNx2mna/H2ql
PRmP6zjzZN7IKw0KKP/32+IVQtQi0Cdd4Xn+GOdwiK1O5tmLOsbdJ1Fu/7xk9TND
TwIDAQABo4IBRjCCAUIwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAQYw
SwYIKwYBBQUHAQEEPzA9MDsGCCsGAQUFBzAChi9odHRwOi8vYXBwcy5pZGVudHJ1
c3QuY29tL3Jvb3RzL2RzdHJvb3RjYXgzLnA3YzAfBgNVHSMEGDAWgBTEp7Gkeyxx
+tvhS5B1/8QVYIWJEDBUBgNVHSAETTBLMAgGBmeBDAECATA/BgsrBgEEAYLfEwEB
ATAwMC4GCCsGAQUFBwIBFiJodHRwOi8vY3BzLnJvb3QteDEubGV0c2VuY3J5cHQu
b3JnMDwGA1UdHwQ1MDMwMaAvoC2GK2h0dHA6Ly9jcmwuaWRlbnRydXN0LmNvbS9E
U1RST09UQ0FYM0NSTC5jcmwwHQYDVR0OBBYEFHm0WeZ7tuXkAXOACIjIGlj26Ztu
MA0GCSqGSIb3DQEBCwUAA4IBAQAKcwBslm7/DlLQrt2M51oGrS+o44+/yQoDFVDC
5WxCu2+b9LRPwkSICHXM6webFGJueN7sJ7o5XPWioW5WlHAQU7G75K/QosMrAdSW
9MUgNTP52GE24HGNtLi1qoJFlcDyqSMo59ahy2cI2qBDLKobkx/J3vWraV0T9VuG
WCLKTVXkcGdtwlfFRjlBz4pYg1htmf5X6DYO8A4jqv2Il9DjXA6USbW1FzXSLr9O
he8Y4IWS6wY7bCkjCWDcRQJMEhg76fsO3txE+FiYruq9RUWhiF1myv4Q6W+CyBFC
Dfvp7OOGAN6dEOM4+qR9sdjoSYKEBpsr6GtPAQw4dy753ec5
-----END CERTIFICATE-----
`;

const publicBeldexFoundationCtr = `-----BEGIN CERTIFICATE-----
MIIFYDCCBEigAwIBAgIQQAF3ITfU6UK47naqPGQKtzANBgkqhkiG9w0BAQsFADA/
MSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT
DkRTVCBSb290IENBIFgzMB4XDTIxMDEyMDE5MTQwM1oXDTI0MDkzMDE4MTQwM1ow
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwggIiMA0GCSqGSIb3DQEB
AQUAA4ICDwAwggIKAoICAQCt6CRz9BQ385ueK1coHIe+3LffOJCMbjzmV6B493XC
ov71am72AE8o295ohmxEk7axY/0UEmu/H9LqMZshftEzPLpI9d1537O4/xLxIZpL
wYqGcWlKZmZsj348cL+tKSIG8+TA5oCu4kuPt5l+lAOf00eXfJlII1PoOK5PCm+D
LtFJV4yAdLbaL9A4jXsDcCEbdfIwPPqPrt3aY6vrFk/CjhFLfs8L6P+1dy70sntK
4EwSJQxwjQMpoOFTJOwT2e4ZvxCzSow/iaNhUd6shweU9GNx7C7ib1uYgeGJXDR5
bHbvO5BieebbpJovJsXQEOEO3tkQjhb7t/eo98flAgeYjzYIlefiN5YNNnWe+w5y
sR2bvAP5SQXYgd0FtCrWQemsAXaVCg/Y39W9Eh81LygXbNKYwagJZHduRze6zqxZ
Xmidf3LWicUGQSk+WT7dJvUkyRGnWqNMQB9GoZm1pzpRboY7nn1ypxIFeFntPlF4
FQsDj43QLwWyPntKHEtzBRL8xurgUBN8Q5N0s8p0544fAQjQMNRbcTa0B7rBMDBc
SLeCO5imfWCKoqMpgsy6vYMEG6KDA0Gh1gXxG8K28Kh8hjtGqEgqiNx2mna/H2ql
PRmP6zjzZN7IKw0KKP/32+IVQtQi0Cdd4Xn+GOdwiK1O5tmLOsbdJ1Fu/7xk9TND
TwIDAQABo4IBRjCCAUIwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAQYw
SwYIKwYBBQUHAQEEPzA9MDsGCCsGAQUFBzAChi9odHRwOi8vYXBwcy5pZGVudHJ1
c3QuY29tL3Jvb3RzL2RzdHJvb3RjYXgzLnA3YzAfBgNVHSMEGDAWgBTEp7Gkeyxx
+tvhS5B1/8QVYIWJEDBUBgNVHSAETTBLMAgGBmeBDAECATA/BgsrBgEEAYLfEwEB
ATAwMC4GCCsGAQUFBwIBFiJodHRwOi8vY3BzLnJvb3QteDEubGV0c2VuY3J5cHQu
b3JnMDwGA1UdHwQ1MDMwMaAvoC2GK2h0dHA6Ly9jcmwuaWRlbnRydXN0LmNvbS9E
U1RST09UQ0FYM0NSTC5jcmwwHQYDVR0OBBYEFHm0WeZ7tuXkAXOACIjIGlj26Ztu
MA0GCSqGSIb3DQEBCwUAA4IBAQAKcwBslm7/DlLQrt2M51oGrS+o44+/yQoDFVDC
5WxCu2+b9LRPwkSICHXM6webFGJueN7sJ7o5XPWioW5WlHAQU7G75K/QosMrAdSW
9MUgNTP52GE24HGNtLi1qoJFlcDyqSMo59ahy2cI2qBDLKobkx/J3vWraV0T9VuG
WCLKTVXkcGdtwlfFRjlBz4pYg1htmf5X6DYO8A4jqv2Il9DjXA6USbW1FzXSLr9O
he8Y4IWS6wY7bCkjCWDcRQJMEhg76fsO3txE+FiYruq9RUWhiF1myv4Q6W+CyBFC
Dfvp7OOGAN6dEOM4+qR9sdjoSYKEBpsr6GtPAQw4dy753ec5
-----END CERTIFICATE-----
 `;
