// import child_process from "child_process";
// import { any } from "lodash/fp";

// const request = require("request-promise");
// const queue = require('promise-queue');
// const nodeQueue = require("node-request-queue");
const http = require('http');
import { default as insecureNodeFetch } from 'node-fetch';
import { HTTPError } from '../bchat/utils/errors';
import { updateDaemon } from '../state/ducks/daemon';
import { useDispatch } from 'react-redux';

// const os = require("os");
// const fs = require("fs-extra");
// const path = require("upath");
// const crypto = require("crypto");
// const portscanner = require("portscanner");

class Daemon {
  data_dir: null;
  wallet_dir: null;
  auth: never[];
  heartbeat: any;
  last_height_send_time: number;
  wallet_state: {
    open: boolean;
    name: string;
    password_hash: null;
    balance: null;
    unlocked_balance: null;
    bnsRecords: never[];
  };
  id: number | undefined;
  //   queue: any;
  agent: any;
  dispatch: any;
  constructor() {
    this.data_dir = null;
    this.wallet_dir = null;
    this.auth = [];
    this.heartbeat = null;
    this.heartbeat = null;
    this.wallet_state = {
      open: false,
      name: '',
      password_hash: null,
      balance: null,
      unlocked_balance: null,
      bnsRecords: [],
    };
    this.last_height_send_time = Date.now();
    this.agent = new http.Agent({ keepAlive: true, maxSockets: 10 });
    // this.queue = new queue(1, Infinity);
  }

  daemonHeartbeat() {
    const dispatch = useDispatch();
    clearInterval(this.heartbeat);
    this.heartbeat = setInterval(() => {
      //   this.heartbeatAction();
      this.sendRPC('get_info').then(data => {
        if (!data.hasOwnProperty('error')) {
          dispatch(updateDaemon({ height: data.result.height }));
        }
      });
    }, 1000);
    // this.heartbeatAction(true);
  }
  heartbeatAction() {
    throw new Error('Method not implemented.');
  }

  sendRPC = async (method: any, params = {}) => {
    try {
      console.log('DAEMON_NODE_CURRENT:', window.currentDaemon);
      const currentDaemon: any = window.currentDaemon;
      const url = `http://${currentDaemon.host}:${currentDaemon.port}/json_rpc`;
      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '0',
          method: method,
          params,
        }),
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

// export function startHeartbeat() {
//    throw new Error("Function not implemented.");
// }
//   heartbeatAction(extended = false) {
//     Promise.all([
//       this.sendRPC("get_address", { account_index: 0 }, 5000),
//       this.sendRPC("getheight", {}, 5000),
//       this.sendRPC("getbalance", { account_index: 0 }, 5000)
//     ]).then(data => {
//       let didError = false;
//       let wallet = {
//         status: {
//           code: 0,
//           message: "OK"
//         },
//         info: {
//           name: this.wallet_state.name
//         },
//         transactions: {
//           tx_list: []
//         },
//         address_list: {
//           primary: [],
//           used: [],
//           unused: [],
//           address_book: [],
//           address_book_starred: []
//         }
//       };

//       for (let n of data) {
//         if (n.hasOwnProperty("error") || !n.hasOwnProperty("result")) {
//           // Maybe we also need to look into the other error codes it could give us
//           // Error -13: No wallet file - This occurs when you call open wallet while another wallet is still syncing
//           if (extended && n.error && n.error.code === -13) {
//             didError = true;
//           }
//           continue;
//         }

//         if (n.method == "getheight") {
//           wallet.info.height = n.result.height;
//           this.sendGateway("set_wallet_data", {
//             info: {
//               height: n.result.height
//             }
//           });
//         } else if (n.method == "get_address") {
//           wallet.info.address = n.result.address;
//           this.sendGateway("set_wallet_data", {
//             info: {
//               address: n.result.address
//             }
//           });
//         } else if (n.method == "getbalance") {
//           if (
//             this.wallet_state.balance == n.result.balance &&
//             this.wallet_state.unlocked_balance == n.result.unlocked_balance
//           ) {
//             continue;
//           }

//           this.wallet_state.balance = wallet.info.balance = n.result.balance;
//           this.wallet_state.unlocked_balance = wallet.info.unlocked_balance =
//             n.result.unlocked_balance;
//           this.sendGateway("set_wallet_data", {
//             info: wallet.info
//           });

//           // if balance has recently changed, get updated list of transactions and used addresses
//           let actions = [this.getTransactions(), this.getAddressList()];
//           actions.push(this.getAddressBook());
//           Promise.all(actions).then(data => {
//             for (let n of data) {
//               Object.keys(n).map(key => {
//                 wallet[key] = Object.assign(wallet[key], n[key]);
//               });
//             }
//             this.sendGateway("set_wallet_data", wallet);
//           });
//         }
//       }

//       // Set the wallet state on initial heartbeat
//       if (extended) {
//         if (!didError) {
//           this.sendGateway("set_wallet_data", wallet);
//         } else {
//           this.closeWallet().then(() => {
//             this.sendGateway("set_wallet_error", {
//               status: {
//                 code: -1,
//                 i18n: "notification.errors.failedWalletOpen"
//               }
//             });
//           });
//         }
//       }
//     });
//   }

export const daemon = new Daemon();
