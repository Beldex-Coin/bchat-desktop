import ChildProcess from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { default as insecureNodeFetch } from 'node-fetch';
import { HTTPError } from '../bchat/utils/errors';
import request from 'request-promise';
import portscanner from 'portscanner';
import { kill } from 'cross-port-killer';
const crypto = require('crypto');
// import { updateBalance } from '../state/ducks/wallet';
// import { useDispatch } from 'react-redux';
import { daemon } from './daemon-rpc';
import { ToastUtils } from '../bchat/utils';
import { updateBalance } from '../state/ducks/wallet';

class Wallet {
  heartbeat: any;
  wallet_state: {
    open: boolean;
    name: string;
    balance: number;
    unlocked_balance: number;
  };
  constructor() {
    this.heartbeat = null;
    this.wallet_state = {
      open: false,
      name: '',
      balance: 0,
      unlocked_balance: 0,
    };
  }

  startWallet = async () => {
    try {
      const status = await this.runningStatus();
      console.log('stat:', status);
      if (status == true) {
        return;
      }
      console.log('statuslive:', status);
      let walletDir = await this.findDir();
      const rpcExecutable =
        process.platform === 'linux'
          ? '/beldex-wallet-rpc-ubuntu'
          : process.platform === 'win32'
          ? '/beldex-wallet-rpc-windows'
          : '/beldex-wallet-rpc-darwin';
      let __ryo_bin: string;
      if (process.env.NODE_ENV == 'production') {
        __ryo_bin = path.join(__dirname, '../../../bin'); //production
      } else {
        __ryo_bin = path.join(__dirname, '../../bin'); //dev
      }
      const rpcPath = await path.join(__ryo_bin, rpcExecutable);
      if (!fs.existsSync(rpcPath)) {
        // console.log("NOO")
      } else {
        // console.log("YES")
      }
      if (!fs.existsSync(walletDir)) {
        // console.log("NOO")
        fs.mkdirpSync(walletDir);
      } else {
        // console.log("YES")
      }
      portscanner
        .checkPortStatus(64371, '127.0.0.1')
        .catch(() => 'closed')
        .then(async status => {
          if (status === 'closed') {
            await this.walletRpc(rpcPath, walletDir);
          } else {
            kill(64371)
              .then()
              .catch(err => {
                throw new HTTPError('beldex_rpc_port', err);
              });
            await this.walletRpc(rpcPath, walletDir);
          }
        });
    } catch (e) {
      console.log('exception during wallet-rpc:', e);
    }
  };

  runningStatus = () => {
    return portscanner
      .checkPortStatus(64371, '127.0.0.1')
      .catch(() => 'closed')
      .then(
        async (status): Promise<any> => {
          console.log('status:', status);
          if (status === 'closed') {
            return false;
          } else {
            return true;
          }
        }
      );
  };

  walletRpc = async (rpcPath: string, walletDir: string) => {
    const currentDaemon: any = window.currentDaemon;
    const generateCredentials = await crypto.randomBytes(64 + 64);
    const auth = generateCredentials.toString('hex');
    window.rpcUserName = auth.substr(0, 64);
    window.rpcPassword = auth.substr(64, 64);
    const option = [
      '--testnet',
      // '--rpc-login',
      '--disable-rpc-login',
      // `${window.rpcUserName}:${window.rpcPassword}`,
      // 'test:test',
      '--rpc-bind-port',
      '64371',
      '--daemon-address',
      `${currentDaemon.host}:${currentDaemon.port}`,
      '--rpc-bind-ip',
      '127.0.0.1',
      '--log-level',
      '0',
      '--wallet-dir',
      `${walletDir}/wallet`,
      '--log-file',
      `${walletDir}/wallet-rpc.log`,
    ];
    const wallet = await ChildProcess.spawn(rpcPath, option, { detached: true });
    wallet.stdout.on('data', data => {
      process.stdout.write(`Wallet: ${data}`);
    });
    wallet.stdout.on('error', err => {
      process.stderr.write(`Wallet: ${err}`);
    });
    wallet.stdout.on('close', (code: any) => {
      process.stderr.write(`Wallet: exited with code ${code} \n`);
      if (code === null) {
        // console.log("Failed to start wallet RPC");
      }
    });
  };

  createWallet = async (filename: string, password: string, language: string, method: string) => {
    try {
      const options = {
        uri: `http://localhost:64371/json_rpc`,
        method: 'POST',
        json: {
          jsonrpc: '2.0',
          id: '0',
          method: method,
          params: {
            filename,
            language,
            password,
          },
        },
        auth: {
          user: `${window.rpcUserName}`,
          pass: `${window.rpcPassword}`,
          sendImmediately: false,
        },
        timeout: 0,
      };
      let requestData: any = await request(options);

      if (requestData.hasOwnProperty('error')) {
        if (requestData.error.code === -21) {
          let walletDir =
            os.platform() === 'win32' ? `${this.findDir()}\\wallet` : `${this.findDir()}//wallet`;
          fs.emptyDirSync(walletDir);
          requestData = await request(options);
        }
      }
      return requestData;
    } catch (err) {
      // console.log("ERR:",err)
    }
  };

  generateMnemonic = async (props: any): Promise<any> => {
    try {
      await this.createWallet(props.displayName, props.password, 'English', 'create_wallet');

      const getAddress = await this.sendRPC('get_address');
      const mnemonic = await this.sendRPC('query_key', { key_type: 'mnemonic' });
      if (!getAddress.hasOwnProperty('error') && !mnemonic.hasOwnProperty('error')) {
        localStorage.setItem('userAddress', getAddress.result.address);
        return mnemonic.result.key;
      }
    } catch (e) {
      console.log('exception during wallet-rpc:', e);
    }
  };

  restoreWallet = async (
    displayName: string,
    password: string,
    userRecoveryPhrase: string,
    refreshDetails: any
  ) => {
    let restoreWallet;
    let restore_height;
    try {
      if (refreshDetails.refresh_type == 'date') {
        //   // Convert timestamp to 00:00 and move back a day
        //   // Core code also moved back some amount of blocks
        restore_height = await daemon.timestampToHeight(
          refreshDetails.refresh_start_timestamp_or_height
        );
        if (restore_height === false) {
          ToastUtils.pushToastError('invalidRestoreDate', window.i18n('invalidRestoreDate'));
        }
      } else {
        restore_height = Number.parseInt(refreshDetails.refresh_start_timestamp_or_height);
        // if the height can't be parsed just start from block 0
        if (!restore_height) {
          restore_height = 0;
        }
      }

      restoreWallet = await this.sendRPC('restore_deterministic_wallet', {
        restore_height: restore_height,
        filename: displayName,
        password: password,
        seed: userRecoveryPhrase,
      });
      if (restoreWallet.hasOwnProperty('error')) {
        if (restoreWallet.error.code === -1)
          restoreWallet = await this.deleteWallet(
            displayName,
            password,
            userRecoveryPhrase,
            refreshDetails
          );
      }
      if (restoreWallet.hasOwnProperty('result')) {
        kill(64371)
          .then()
          .catch(err => {
            throw new HTTPError('beldex_rpc_port', err);
          });
      }
      return restoreWallet;
    } catch (error) {
      throw new HTTPError('exception during wallet-rpc:', error);
    }
  };

  getLatestHeight = async () => {
    try {
      const response = await insecureNodeFetch('http://explorer.beldex.io:19091/get_height', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new HTTPError('Beldex_rpc error', response);
      }
      const result = await response.json();
      return result.height;
    } catch (e) {
      throw new HTTPError('exception during wallet-rpc:', e);
    }
  };

  deleteWallet = async (
    displayName: string,
    password: string,
    userRecoveryPhrase: string,
    refreshDetails: object
  ): Promise<any> => {
    let walletDir =
      os.platform() === 'win32' ? `${this.findDir()}\\wallet` : `${this.findDir()}//wallet`;
    fs.emptyDirSync(walletDir);
    return await this.restoreWallet(displayName, password, userRecoveryPhrase, refreshDetails);
  };

  findDir = () => {
    let walletDir;
    if (os.platform() === 'win32') {
      walletDir = `${os.homedir()}\\Documents\\Beldex`;
    } else {
      walletDir = path.join(os.homedir(), 'Beldex');
    }

    return walletDir;
  };

  startHeartbeat() {
    clearInterval(this.heartbeat);
    this.heartbeat = setInterval(async () => {
      this.heartbeatAction();
    }, 8000);
    // this.heartbeatAction(true);
  }
  async heartbeatAction() {
    Promise.all([
      this.sendRPC('getheight', {}, 5000),
      this.sendRPC('getbalance', { account_index: 0 }, 5000),
    ]).then(async data => {
      // const dispatch = useDispatch();
      let wallet = {
        info: {
          height: 0,
          balance: 0,
          unlocked_balance: 0,
          balanceConvert: 0,
        },
        transactions: {
          tx_list: [],
        },
      };

      for (let n of data) {
        if (n.hasOwnProperty('error') || !n.hasOwnProperty('result')) {
          // Maybe we also need to look into the other error codes it could give us
          // Error -13: No wallet file - This occurs when you call open wallet while another wallet is still syncing
          if (n.error && n.error.code === -13) {
            // didError = true;
          }
          continue;
        }

        if (n.method == 'getheight') {
          wallet.info.height = n.result.height;
        } else if (n.method == 'getbalance') {
          wallet.info.balance = n.result.balance / 1000000000;
          wallet.info.unlocked_balance = n.result.unlocked_balance / 1000000000;
        }
      }
      const balanceConversation = await this.currencyConv(wallet.info.balance);
      console.log('balance:', balanceConversation);
      window.inboxStore?.dispatch(
        updateBalance({
          balance: wallet.info.balance,
          unlocked_balance: wallet.info.unlocked_balance,
          height: wallet.info.height,
          balanceConvert: balanceConversation,
        })
      );
    });
  }
  currencyConv = async (balance: number) => {
    const currency = 'usd';
    const response = await insecureNodeFetch(`https://api.beldex.io/price/${currency}`);
    const currencyValue: any = await response.json();
    return response.ok ? balance * currencyValue[currency] : 0;
  };

  getTransfer = async (filter: any) => {
    let params = {
      in:
        filter === window.i18n('filterAll')
          ? true
          : filter === window.i18n('filterIncoming')
          ? true
          : false,
      out:
        filter === window.i18n('filterAll')
          ? true
          : filter === window.i18n('filterIncoming')
          ? false
          : true,
      pending: filter === window.i18n('filterAll') ? true : false,
      failed: filter === window.i18n('filterAll') ? true : false,
      pool: filter === window.i18n('filterAll') ? true : false,
    };
    let data = await wallet.sendRPC('get_transfers', params);
    console.log('data::', data);
    if (data.hasOwnProperty('error') || !data.hasOwnProperty('result')) {
      return [];
    }
    function concateData() {
      let wallet: any = [];
      const types = ['in', 'out', 'pending', 'failed', 'pool', 'miner', 'mnode', 'gov', 'stake'];
      types.forEach(type => {
        if (data.result.hasOwnProperty(type)) {
          wallet = wallet.concat(data.result[type]);
        }
      });
      return wallet;
    }

    let combineData =
      filter === window.i18n('filterAll')
        ? // ? data.result.in.concat(data.result.out)
          concateData()
        : filter === window.i18n('filterIncoming')
        ? data.result.in
        : data.result.out;
    console.log('concateData(data.result) ::', concateData());
    return (combineData = combineData.sort(
      (a: any, b: any) => parseFloat(b.timestamp) - parseFloat(a.timestamp)
    ));
    ;
  };

  sendFund=async(address:string,amount:number,priority:number)=>{
    const params = {
      destinations: [{ amount: amount, address: address }],
      priority: priority,    // 0 flash -> important // 1 normal -> unimportant 
      do_not_relay: true,
      get_tx_metadata: true,

      account_index:0,
      subaddr_indices:[0],

      ring_size:7,
      get_tx_key: true
    };
    const data=await this.sendRPC("transfer",params);
    console.log("sendFunddata ::",data);
    
  }

  sendRPC = async (method: string, params = {}, timeout = 0) => {
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
      if (!response.ok) {
        throw new HTTPError('beldex_rpc error', response);
      }

      const result = await response.json();
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

export const wallet = new Wallet();
