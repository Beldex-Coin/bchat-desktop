import { HTTPError } from '../../bchat/utils/errors';
import { default as insecureNodeFetch } from 'node-fetch';
import { updateBalance } from '../../state/ducks/wallet';
import { useDispatch } from 'react-redux';

export class Wallet {
  heartbeat: any;
  constructor() {
    this.heartbeat = null;
  }

  daemonHeartbeat() {
    const dispatch = useDispatch();
    clearInterval(this.heartbeat);
    this.heartbeat = setInterval(async () => {
      let getAddress = await this.walletRPC('getheight', {});
      let getBalance = await this.walletRPC('getbalance', { account_index: 0 });
      if (!getAddress.hasOwnProperty('error') && !getBalance.hasOwnProperty('error')) {
        console.log('no error');
        let currentBalance = Number((getBalance.result.balance / 1000000000).toFixed(4));
        let currentHeight = getAddress.result.height;
        dispatch(updateBalance({ balance: currentBalance, height: currentHeight }));
      }
    }, 5000);
    // this.heartbeatAction(true);
  }
  heartbeatAction() {
    throw new Error('Method not implemented.');
  }

  walletRPC = async (method: string, params = {}, timeout = 0) => {
    try {
      const url = 'http://localhost:64371/json_rpc';
      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '0',
          method: method,
          params,
        }),
        headers: {
          Authorization: 'Basic ' + btoa(`${window.rpcUserName}:${window.rpcPassword}`),
        },
        timeout: timeout,
      };
      const response = await insecureNodeFetch(url, fetchOptions);
      console.log('Response:', response);
      if (!response.ok) {
        throw new HTTPError('beldex_rpc error', response);
      }

      let result = await response.json();

      if (result.hasOwnProperty('error')) {
        return {
          method: method,
          params: params,
          error: result.error,
        };
      }
      return {
        method: method,
        params: params,
        result: result.result,
      };
    } catch (e) {
      throw new HTTPError('exception during wallet-rpc:', e);
    }
  };
}
