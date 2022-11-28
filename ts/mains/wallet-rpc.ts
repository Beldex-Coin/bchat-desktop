// import ChildProcess from 'child_process';
// import fs from 'fs-extra';
// import path from 'path';
// import os from 'os';
// import { default as insecureNodeFetch } from 'node-fetch';
// import { HTTPError } from '../bchat/utils/errors';
// import request from 'request-promise';
// import portscanner from 'portscanner';
// import { kill } from 'cross-port-killer';
// const crypto = require('crypto');



// export const startWallet = async () => {
//   try {

//     let walletDir = await findDir();

//     const rpcExecutable =
//       process.platform === 'linux'
//         ? '/beldex-wallet-rpc-ubuntu'
//         : process.platform === 'win32'
//         ? '/beldex-wallet-rpc-windows'
//         : '/beldex-wallet-rpc-darwin';
//     let __ryo_bin: string;
//     if (process.env.NODE_ENV == 'production') {
//       __ryo_bin = path.join(__dirname, '../../../bin'); //production
//     } else {
//       __ryo_bin = path.join(__dirname, '../../bin'); //dev
//     }
//     const rpcPath = await path.join(__ryo_bin, rpcExecutable);
//     if (!fs.existsSync(rpcPath)) {
//       // console.log("NOO")
//     } else {
//       // console.log("YES")
//     }
//     if (!fs.existsSync(walletDir)) {
//       // console.log("NOO")
//       fs.mkdirpSync(walletDir);
//     } else {
//       // console.log("YES")
//     }
//     portscanner
//       .checkPortStatus(64371, '127.0.0.1')
//       .catch(() => 'closed')
//       .then(async status => {
//         console.log("status:",status)
//         if (status === 'closed') {
//           await walletRpc(rpcPath, walletDir);
//         } else {
//           kill(64371)
//             .then()
//             .catch(err => {
//               throw new HTTPError('beldex_rpc_port', err);
//             });
//           await walletRpc(rpcPath, walletDir);
//         }
//       });
//   } catch (e) {
//     console.log('exception during wallet-rpc:', e);
//   }
// };

// async function walletRpc(rpcPath: string, walletDir: string) {
//   let currentDaemon: any = window.currentDaemon;
//   const generateCredentials = await crypto.randomBytes(64 + 64);
//   let auth = generateCredentials.toString('hex');
//   window.rpcUserName = auth.substr(0, 64);
//   window.rpcPassword = auth.substr(64, 64);
//   let option =  [
//        '--testnet',
//         // '--rpc-login',
//         '--disable-rpc-login',
//         // `${window.rpcUserName}:${window.rpcPassword}`,
//         // 'test:test',
//         '--rpc-bind-port',
//         '64371',
//         '--daemon-address',
//         `${currentDaemon.host}:${currentDaemon.port}`,
//         '--rpc-bind-ip',
//         '127.0.0.1',
//         '--log-level',
//         '0',
//         '--wallet-dir',
//         `${walletDir}/wallet`,
//         '--log-file',
//         `${walletDir}/wallet-rpc.log`,
//       ];
//       console.log("option:",option)
//   let wallet = await ChildProcess.spawn(rpcPath, option, { detached: true });
//   wallet.stdout.on('data', data => {
//     process.stdout.write(`Wallet: ${data}`);
//   });
//   wallet.stdout.on('error', err => {
//   process.stderr.write(`Wallet: ${err}`)});
//   wallet.stdout.on('close', (code: any) => {
//     process.stderr.write(`Wallet: exited with code ${code} \n`);
//     if (code === null) {
//       // console.log("Failed to start wallet RPC");
//     }
//   });
// }

// async function createWallet(filename: string, password: string, language: string, method: string) {
//   try {
//     let options = {
//       uri: `http://localhost:64371/json_rpc`,
//       method: 'POST',
//       json: {
//         jsonrpc: '2.0',
//         id: '0',
//         method: method,
//         params: {
//           filename,
//           language,
//           password,
//         },
//       },
//       auth: {
//         user: `${window.rpcUserName}`,
//         pass: `${window.rpcPassword}`,
//         sendImmediately: false,
//       },
//       timeout: 0,
//     };
//     let requestData: any = await request(options);

//     if (requestData.hasOwnProperty('error')) {
//       if (requestData.error.code === -21) {
//         let walletDir = os.platform() === 'win32' ? `${findDir()}\\wallet` : `${findDir()}//wallet`;
//         fs.emptyDirSync(walletDir);
//         requestData = await request(options);
//       }
//     }
//     return requestData;
//   } catch (err) {
//     // console.log("ERR:",err)
//   }
// }

// export async function generateMnemonic(props: any): Promise<any> {
//   try {
//     await createWallet(props.displayName, props.password, 'English', 'create_wallet');

//     let getAddress = await walletRPC('get_address');
//     let mnemonic = await walletRPC('query_key', { key_type: 'mnemonic' });
//     localStorage.setItem('userAddress', getAddress.result.address);
//     return mnemonic.result.key;
//   } catch (e) {
//     console.log('exception during wallet-rpc:', e);
//   }
// }


// export const walletheartAction =async () => {
//   try {
//     console.log("wallet:")
//     // Promise.all([
//     let getAddress = await  walletRPC("getheight")
//      let getBalance = await walletRPC("getbalance", { account_index: 0 })
//      console.log("getAdd:",getAddress)
//      console.log("getBALANCE:",getBalance)
//     // ]).then( data =>{
//     //   console.log("walletheartAction?::::",data)

//     // });
    
//   } catch (error) {
//     throw new HTTPError('exception during wallet-rpc:', error);

//   }
  
// }

// export const walletRPC = async (method: string, params = {}) => {
//   try {
//     const url = 'http://localhost:64371/json_rpc';
//     const fetchOptions = {
//       method: 'POST',
//       body: JSON.stringify({
//         jsonrpc: '2.0',
//         id: '0',
//         method: method,
//         params,
//       }),
//       headers: {
//         Authorization: 'Basic ' + btoa(`${window.rpcUserName}:${window.rpcPassword}`),
//       },
//     };
//     const response = await insecureNodeFetch(url, fetchOptions);
//     if (!response.ok) {
//       throw new HTTPError('beldex_rpc error', response);
//     }

//     let result = await response.json();

//     if (result.hasOwnProperty('error').code === -1) {
//       if (result.error.code === -1) return result;
//     }
//     return result;
//   } catch (e) {
//     throw new HTTPError('exception during wallet-rpc:', e);
//   }
// };

// export const getLatestHeight = async () => {
//   try {
//     const response = await insecureNodeFetch('http://explorer.beldex.io:19091/get_height', {
//       method: 'POST',
//       body: JSON.stringify({}),
//     });
//     if (!response.ok) {
//       throw new HTTPError('Beldex_rpc error', response);
//     }
//     let result = await response.json();
//     return result.height;
//   } catch (e) {
//     throw new HTTPError('exception during wallet-rpc:', e);
//   }
// };

// export const restoreWallet = async (
//   displayName: string,
//   password: string,
//   userRecoveryPhrase: string
// ) => {
//   let restoreWallet;
//   try {
//     restoreWallet = await walletRPC('restore_deterministic_wallet', {
//       restore_height: await getLatestHeight(),
//       filename: displayName,
//       password: password,
//       seed: userRecoveryPhrase,
//     });

//     if (restoreWallet.hasOwnProperty('error')) {
//       if (restoreWallet.error.code === -1)
//         restoreWallet = await deleteWallet(displayName, password, userRecoveryPhrase);
//     }
//     // if(restoreWallet.hasOwnProperty('result')){
//     //   kill(64371).then().catch(err => {throw new HTTPError('beldex_rpc_port', err) } )
//     // }
//     return restoreWallet;
//   } catch (error) {
//     throw new HTTPError('exception during wallet-rpc:', error);
//   }
// };

// export const findDir = () => {
//   let walletDir;
//   if (os.platform() === 'win32') {
//     walletDir = `${os.homedir()}\\Documents\\Beldex`;
//   } else {
//     walletDir = path.join(os.homedir(), 'Beldex');
//   }
//   // console.log('walletDirwalletDir',walletDir);

//   return walletDir;
// };

// async function deleteWallet(
//   displayName: string,
//   password: string,
//   userRecoveryPhrase: string
// ): Promise<any> {
//   let walletDir = os.platform() === 'win32' ? `${findDir()}\\wallet` : `${findDir()}//wallet`;
//   fs.emptyDirSync(walletDir);
//   return await restoreWallet(displayName, password, userRecoveryPhrase);
// }
