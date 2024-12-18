import ChildProcess from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { default as insecureNodeFetch } from 'node-fetch';
import { HTTPError } from '../bchat/utils/errors';
import request from 'request-promise';
import { default as http } from 'http';
import portscanner from 'portscanner';
import { kill } from 'cross-port-killer';
const crypto = require('crypto');
import { daemon } from './daemon-rpc';
import { ToastUtils } from '../bchat/utils';
import { updateBalance } from '../state/ducks/wallet';
import { SCEE } from './SCEE';
import {
  updateFiatBalance,
  updateWalletHeight,
  updateWalletRescaning,
} from '../state/ducks/walletConfig';
import { workingStatusForDeamon } from './BchatWalletHelper';
import { walletSettingsKey } from '../data/settings-key';
import { default as queue } from 'promise-queue';

class Wallet {
  heartbeat: any;
  wss: any;
  wallet_dir: string;
  auth: any;
  wallet_state: {
    open: boolean;
    name: string;
    balance: number;
    unlocked_balance: number;
    fiatCurrency: string;
    tx_list: any;
    password_hash: string;
  };
  scee: any;
  id: number;
  agent: any;
  queue: any;
  backend: any;
  last_height_send_time: any;
  height_regexes: any;
  constructor() {
    this.heartbeat = null;
    this.wss = null;
    this.wallet_dir = '';
    this.auth = [];
    this.wallet_state = {
      open: false,
      name: '',
      balance: 0,
      unlocked_balance: 0,
      fiatCurrency: '',
      tx_list: [],
      password_hash: '',
    };
    this.id = 0;
    this.scee = new SCEE();
    this.agent = new http.Agent({ keepAlive: true, maxSockets: 10 });
    this.queue = new queue(1, Infinity);
    this.last_height_send_time = Date.now();
    this.height_regexes = [
      {
        string: /Processed block: <([a-f0-9]+)>, height (\d+)/,
        height: (match: any) => match[2],
      },
      {
        string: /Skipped block by height: (\d+)/,
        height: (match: any) => match[1],
      },
      {
        string: /Skipped block by timestamp, height: (\d+)/,
        height: (match: any) => match[1],
      },
      {
        string: /Blockchain sync progress: <([a-f0-9]+)>, height (\d+)/,
        height: (match: any) => match[2],
      },
    ];
  }

  startWallet = async (type?: string) => {
    try {
      let getFiatCurrency = window.getSettingValue(walletSettingsKey.settingsFiatCurrency);
      if (!getFiatCurrency) {
        window.setSettingValue(walletSettingsKey.settingsFiatCurrency, 'USD');
      }
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
      } else {
      }
      if (!fs.existsSync(walletDir)) {
        fs.mkdirpSync(walletDir);
      } else {
      }
      const status: any = await this.runningStatus(64371);
      if (status == true) {
        if (type == 'settings') {
          return;
        }
        kill(64371)
          .then()
          .catch((err: any) => {
            throw new HTTPError('beldex_rpc_port', err);
          });
        await this.walletRpc(rpcPath, walletDir);
      } else {
        await this.walletRpc(rpcPath, walletDir);
      }
    } catch (e) {
      console.log('exception during wallet-rpc:', e);
    }
  };

  runningStatus = (port: number) => {
    return portscanner
      .checkPortStatus(port, '127.0.0.1')
      .catch(() => 'closed')
      .then(
        async (status): Promise<any> => {
          if (status === 'closed') {
            return false;
          } else {
            return true;
          }
        }
      );
  };

  walletRpc = async (rpcPath: string, walletDir: string) => {
    try {
      let currentDeamonLoc = window.getSettingValue('current-deamon');
      const currentDaemon: any = currentDeamonLoc ? currentDeamonLoc : window.currentDaemon;
      window.setSettingValue('syncStatus', false);
      let rescanStatusUpdate: any = false;
      window.inboxStore?.dispatch(updateWalletRescaning(rescanStatusUpdate));
      if (!window.getSettingValue('balancevisibility')) {
        window.setSettingValue('balancevisibility', true);
      }
      const generateCredentials = await crypto.randomBytes(64 + 64 + 32);
      const auth = generateCredentials.toString('hex');
      this.auth = [
        auth.substr(0, 64), // rpc username
        auth.substr(64, 64), // rpc password
        auth.substr(128, 32), // password salt
      ];
      this.wallet_dir = `${walletDir}/bchat`;
      const option = [
        '--rpc-login',
        this.auth[0] + ':' + this.auth[1],
        '--rpc-bind-port',
        '64371',
        '--daemon-address',
        `${currentDaemon.host}:${currentDaemon.port}`,
        '--rpc-bind-ip',
        '127.0.0.1',
        '--log-level',
        '0',
        '--wallet-dir',
        `${walletDir}/bchat`,
        '--log-file',
        `${walletDir}/bchat/logs/wallet-rpc.log`,
        '--trusted-daemon'
      ];
      if (window.networkType == 'testnet') {
        option.push('--testnet');
      }
      const wallet = await ChildProcess.spawn(rpcPath, option, { detached: true });
      wallet.stdout.on('data', data => {
        process.stdout.write(`Wallet: ${data}`);
        let lines = data.toString().split('\n');
        let match,
          height = null;
        for (const line of lines) {
          for (const regex of this.height_regexes) {
            match = line.match(regex.string);
            if (match) {
              height = regex.height(match);
              break;
            }
          }
        }

        if (height && Date.now() - this.last_height_send_time > 1000) {
          this.last_height_send_time = Date.now();
          window.inboxStore?.dispatch(updateWalletHeight(height));
        }
      });
      wallet.stdout.on('error', err => {
        process.stderr.write(`Wallet: ${err}`);
      });
      wallet.stdout.on('close', (code: any) => {
        process.stderr.write(`Wallet: exited with code ${code} \n`);
        
      });
    } catch (error) {
      console.log('failed to start wallet rpc', error);
    }
  };

  heartRpc = async (method: string, params = {}, timeout = 0) => {
    try {
      const options = {
        uri: `http://localhost:64371/json_rpc`,
        method: 'POST',
        json: {
          jsonrpc: '2.0',
          id: '0',
          method: method,
          params,
        },
        auth: {
          user: this.auth[0],
          pass: this.auth[1],
          sendImmediately: false,
        },
        timeout,
      };

      let requestData: any = await request(options);

      if (requestData.hasOwnProperty('error')) {
        if (requestData.error.code === -21) {
          let walletDir =
            os.platform() === 'win32' ? `${this.findDir()}\\bchat` : `${this.findDir()}//bchat`;
          fs.emptyDirSync(walletDir);
          requestData = await request(options);
        }
      }
      if (requestData.hasOwnProperty('error')) {
        return {
          method: method,
          params: params,
          error: requestData.error,
        };
      }
      return requestData;
    } catch (err) {
      console.log('ERR:', err);
    }
  };

  generateMnemonic = async (props: any): Promise<any> => {
    try {
      await this.heartRpc('create_wallet', {
        filename: props.displayName,
        language: 'English',
        password: props.password,
      });
      const getAddress: any = await this.heartRpc('get_address');
      const mnemonic: any = await this.heartRpc('query_key', { key_type: 'mnemonic' });
      if (!getAddress.hasOwnProperty('error') && !mnemonic.hasOwnProperty('error')) {
        localStorage.setItem('userAddress', getAddress.result.address);
        return mnemonic.result.key;
      }
    } catch (e) {
      console.log('exception during wallet-rpc:', e);
    }
  };

  async getHeigthFromDateAndUserInput(refreshDetails: {
    refresh_type: string;
    refresh_start_timestamp_or_height: string;
  }) {
    let restore_height;
    if (refreshDetails.refresh_type == 'date') {
      //   // Convert timestamp to 00:00 and move back a day
      //   // Core code also moved back some amount of blocks
      restore_height = await daemon.timestampToHeight(
        refreshDetails.refresh_start_timestamp_or_height
      );
      if (restore_height === false) {
        return ToastUtils.pushToastError('invalidRestoreDate', window.i18n('invalidRestoreDate'));
      }
    } else {
      restore_height = Number.parseInt(refreshDetails.refresh_start_timestamp_or_height);
      // if the height can't be parsed just start from block 0
      if (!restore_height) {
        restore_height = 0;
      }
    }
    return restore_height;
  }

  restoreWallet = async (
    displayName: string,
    password: string,
    userRecoveryPhrase: string,
    refreshDetails: any,
    type?: string
  ) => {
    let restoreWallet;
    let restore_height = await this.getHeigthFromDateAndUserInput(refreshDetails);
    try {
      let walletDir =
        os.platform() === 'win32' ? `${this.findDir()}\\bchat` : `${this.findDir()}//bchat`;
      fs.emptyDirSync(walletDir);
      restoreWallet = await this.heartRpc('restore_deterministic_wallet', {
        restore_height: restore_height,
        filename: displayName,
        password: password,
        seed: userRecoveryPhrase,
      });

      if (restoreWallet.hasOwnProperty('error')) {
        restoreWallet = await this.deleteWallet(
          displayName,
          password,
          userRecoveryPhrase,
          refreshDetails,
          type
        );
      }
      if (restoreWallet.hasOwnProperty('result')) {
        this.wallet_state.password_hash = this.passwordEncrypt(password);

        if (!type) {
          console.log('killed...............:', type);
          kill(64371)
            .then(() => console.log('port kill successFull'))
            .catch(err => {
              throw new HTTPError('beldex_rpc_port', err);
            });
        }
      }
      return restoreWallet;
    } catch (error) {
      return { message: 'exception during wallet-rpc', error: error };
      // throw new HTTPError('exception during wallet-rpc:', error);
    }
  };

  async saveWallet() {
    await this.sendRPC('store');
  }
  async closeWallet() {
    await this.saveWallet();
    this.wallet_state.open = false;
    await this.sendRPC('close_wallet');
  }

  getLatestHeight = async () => {
    try {
      let url: string;
      if (window.networkType === 'mainnet') {
        url = 'http://publicnode1.rpcnode.stream:29095';
      } else {
        url = 'http://149.102.156.174:19095';
      }
      const response = await insecureNodeFetch(`${url}/get_height`, {
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

  validateAddres = async (address: string): Promise<any> => {
    const validateAddress = await this.sendRPC('validate_address', { address });
    if (validateAddress.hasOwnProperty('error')) {
      return false;
    }
    return validateAddress.result.valid;
  };

  deleteWallet = async (
    displayName: string,
    password: string,
    userRecoveryPhrase: string,
    refreshDetails: object,
    type?: string
  ): Promise<any> => {
    let walletDir =
      os.platform() === 'win32' ? `${this.findDir()}\\bchat` : `${this.findDir()}//bchat`;
    fs.emptyDirSync(walletDir);
    return await this.restoreWallet(
      displayName,
      password,
      userRecoveryPhrase,
      refreshDetails,
      type
    );
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

  startHeartbeat(type?: string) {
    clearInterval(this.heartbeat);
    this.heartbeat = setInterval(async () => {
      this.heartbeatAction(type);
    }, 8000);
  }

  async heartbeatAction(type?: string) {
    Promise.all([
      this.sendRPC('getheight', {}, 5000),
      this.sendRPC('getbalance', { account_index: 0 }),
    ]).then(async data => {
      let wallet: any = {
        info: {
          height: 0,
          balance: 0,
          unlocked_balance: 0,
          balanceConvert: 0,
        },
        transacations: {
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
        let response: any = n;
        if (n.method == 'getheight') {
          wallet.info.height = response.result.height;
          window.inboxStore?.dispatch(updateWalletHeight(response.result.height));
        } else if (n.method == 'getbalance') {
          let transacationsHistory: any = [];
          // if (type == 'wallet') {
            transacationsHistory = await this.getTransactions();
            transacationsHistory = transacationsHistory.transactions.tx_list;
          // }
          if (
            this.wallet_state.balance == response.result.balance &&
            this.wallet_state.unlocked_balance == response.result.unlocked_balance &&
            this.wallet_state.tx_list == transacationsHistory
          ) {
            continue;
          }
          this.wallet_state.balance = wallet.info.balance = response.result.balance;
          this.wallet_state.unlocked_balance = wallet.info.unlocked_balance =
            response.result.unlocked_balance;
          this.wallet_state.tx_list = transacationsHistory;

          if (type == 'wallet') {
            await this.getFiatBalance();
          }
          window.inboxStore?.dispatch(
            await updateBalance({
              balance: this.wallet_state.balance,
              unlocked_balance: this.wallet_state.unlocked_balance,
              transacations: transacationsHistory,
            })
          );
        }
      }
    });
  }

  getTransactions() {
    return new Promise(resolve => {
      this.sendRPC('get_transfers', {
        in: true,
        out: true,
        pending: true,
        failed: true,
        pool: true,
      }).then(async (data: any) => {
        if (data.hasOwnProperty('error') || !data.hasOwnProperty('result')) {
          resolve({});
          return;
        }
        await this.saveWallet();
        let wallet = {
          transactions: {
            tx_list: [],
          },
        };

        const types = ['in', 'out', 'pending', 'failed', 'bns'];
        // 'pool', 'miner', 'mnode', 'gov', 'stake'];
        types.forEach(type => {
          if (data.result.hasOwnProperty(type)) {
            wallet.transactions.tx_list = wallet.transactions.tx_list.concat(data.result[type]);
          }
        });

        wallet.transactions.tx_list.sort(function (a: any, b: any) {
          if (a.timestamp < b.timestamp) return 1;
          if (a.timestamp > b.timestamp) return -1;
          return 0;
        });
        resolve(wallet);
      });
    });
  }

  getFiatBalance = async (currency?: any) => {
    try {
      const fiatCurrency: any = currency
        ? currency.toLocaleLowerCase()
        : window.getSettingValue(walletSettingsKey.settingsFiatCurrency)?.toLocaleLowerCase();
      const balance = this.wallet_state.balance;
      const response = await insecureNodeFetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=beldex&vs_currencies=${fiatCurrency}`
      );
      const currencyValue: any = await response.json();
      const FiatBalance: any =
        response.ok && currencyValue.beldex[fiatCurrency]
          ? balance * currencyValue.beldex[fiatCurrency]
          : 0;
      window.inboxStore?.dispatch(updateFiatBalance(FiatBalance));
    } catch (error) {
      console.log("Uncaught error Fiat Balance", error)
    }

  };

  transfer = async (address: string, amount: number, priority: number, isSweepAll: Boolean) => {
    const rpc_endpoint = isSweepAll ? 'sweep_all' : 'transfer_split';
    // the call coming from the SN page will have address = wallet primary address
    const rpcSpecificParams = isSweepAll
      ? {
        address,
        // gui wallet only supports one account currently
        account_index: 0,
        // sweep *all* funds from all subaddresses to the address specified
        subaddr_indices_all: true,
      }
      : {
        destinations: [{ amount: amount, address: address }],
      };
    const params = {
      ...rpcSpecificParams,
      account_index: 0,
      priority: priority, // 0 flash -> important // 1 normal -> unimportant
      ring_size: 7,
      get_tx_key: true,
    };
    const data: any = await this.sendRPC(rpc_endpoint, params);
    if (data.result) {
      return data;
    } else {
      return data;
    }
  };
  public passwordEncrypt = (password: string) => {
    return crypto.pbkdf2Sync(password, this.auth[2], 1000, 64, 'sha512').toString('hex');
  };
  openWallet = async (filename: string, password: string) => {

    const openWallet = await this.heartRpc('open_wallet', {
      filename,
      password,
    });
    if (openWallet.hasOwnProperty('error')) {
      return openWallet;
    }

    let address_txt_path = path.join(this.wallet_dir, filename + '.address.txt');

    if (!fs.existsSync(address_txt_path)) {
      this.sendRPC('get_address', { account_index: 0 }).then((data: any) => {
        if (data.hasOwnProperty('error') || !data.hasOwnProperty('result')) {
          return;
        }
        fs.writeFile(address_txt_path, data.result.address, 'utf8', () => { });
      });
    }
    this.wallet_state.name = filename;
    this.wallet_state.open = true;
    this.wallet_state.password_hash = this.passwordEncrypt(password);
    // this.startHeartbeat();
    return openWallet;
  };

  chooseDaemon = async () => {
    let data = window.getSettingValue(walletSettingsKey.settingsDeamonList);
    for (let i = 0; i < data.length; i++) {
      if (data[i].type == 'Remote') {
        const deamonStatus = await workingStatusForDeamon(data[i], 'daemonValidation');
        if (deamonStatus.status === 'OK') {
          return data[i];
        }
      }
    }
  };

  sendRPC(method: string, params = {}, timeout = 0) {
    let id = this.id++;
    let options: any = {
      uri: `http://localhost:64371/json_rpc`,
      method: 'POST',
      json: {
        jsonrpc: '2.0',
        id: id,
        method: method,
      },
      auth: {
        user: this.auth[0],
        pass: this.auth[1],
        sendImmediately: false,
      },
      agent: this.agent,
    };
    if (Object.keys(params).length !== 0) {
      options.json.params = params;
    }
    if (timeout > 0) {
      options.timeout = timeout;
    }
    return this.queue.add(() => {
      return request(options)
        .then((response: any) => {
          if (response.hasOwnProperty('error')) {
            return {
              method: method,
              params: params,
              error: response.error,
            };
          }
          return {
            method: method,
            params: params,
            result: response.result,
          };
        })
        .catch((error: any) => {
          return {
            method: method,
            params: params,
            error: {
              code: -1,
              message: 'Cannot connect to wallet-rpc',
              cause: error.cause,
            },
          };
        });
    });
  }

  rescanBlockchain() {
    this.sendRPC('rescan_blockchain');
  }

  changeWalletPassword = async (old_password: string, new_password: string) => {
    const changePassword = await this.sendRPC('change_wallet_password', {
      old_password,
      new_password,
    });
    return changePassword;
  };
}

export const wallet = new Wallet();
