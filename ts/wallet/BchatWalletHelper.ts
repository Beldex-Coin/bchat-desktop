// import { WebSocket } from 'ws';
// import { SCEE } from "./SCEE";
// import { EventEmitter } from "events";
import request from 'request-promise';
// import { walletSettingsKey } from '../data/settings-key';
import { wallet } from './wallet-rpc';
import { walletSettingsKey } from '../data/settings-key';
// import { updateDecimalValue } from '../state/ducks/walletConfig';

export async function workingStatusForDeamon(currentdeamon: any) {
  console.log('currentdeamon data::', currentdeamon);

  try {
    const options = {
      uri: `http://${currentdeamon.host}:${currentdeamon.port}/json_rpc`,
      method: 'POST',
      json: {
        jsonrpc: '2.0',
        id: '0',
        method: 'getlastblockheader',
      },

      timeout: 0,
    };
    let requestData: any = await request(options);
    // console.log('requestData::', requestData);
    if (requestData.result) {
      // requestData.result.status==="ok"
      return requestData.result;
    }
  } catch (err) {
    console.log('ERR:', err);
  }
}

export async function deamonvalidation() {
  let list_deamon = window.getSettingValue(walletSettingsKey.settingsDeamonList);
  let getcurrentWorkingDeamon = window.getSettingValue('current-deamon');
  const currentDaemon: any = getcurrentWorkingDeamon
    ? getcurrentWorkingDeamon
    : window.currentDaemon;

  console.log('list_deamon::', list_deamon);
  
  if (!list_deamon) {
    // let currentWorkingDeamon=window.getSettingValue('current-deamon');
    const deamon_list = [{ host: currentDaemon.host, port: currentDaemon.port, active: 1 }];
    window.setSettingValue('deamon-List', deamon_list);
  }

  // let data={host:'38.242.196.753',port:'19095'}
  const deamonStatus = await workingStatusForDeamon(currentDaemon);
  console.log('deamonStatus::', deamonStatus, deamonStatus === 'OK');

  if (deamonStatus.status === 'OK') {
    console.log('ok');

    window.setSettingValue('current-deamon', currentDaemon);
    await wallet.startWallet('settings');
  } else {
    for (let index = 0; index < list_deamon.length; index++) {
      const deamonStatus = await workingStatusForDeamon(list_deamon[index]);
      if (deamonStatus.status === 'OK') {
        window.setSettingValue('current-deamon', currentDaemon);
        await wallet.startWallet('settings');
        break;
      }
    }
    //   list_deamon.every(async(item:any)=>{
    //  const deamonStatus= await workingStatusForDeamon(item);

    //     if(deamonStatus==='OK')
    // {
    //   window.setSettingValue('current-deamon',currentDaemon)
    //   await wallet.startWallet("settings");

    // }
    //   })
  }
}

export function loadRecipient() {
  if (!window.getSettingValue('save-recipient')) {
    window.setSettingValue("save-recipient", true);
    // window.inboxStore?.dispatch(updateDecimalValue(data));
   
  } else {
    let data: any = window.getSettingValue('save-recipient');
   window.setSettingValue("save-recipient", data);

    // window.inboxStore?.dispatch(updateDecimalValue(data));
  }
  

}


// class Helper  {
//   data_dir: null;
//   wallet_dir: null;
//   ws: any;
//   scee: any;
//   constructor() {
//     this.data_dir = null;
//     this.wallet_dir = null;
//     this.ws = null;
//     this.scee = new SCEE();
//   }
// heartbeatAction() {
//   // console.log('HELPER HEART BEAT');
//   setTimeout(() => {
//     this.ws = new WebSocket('ws://127.0.0.1:' + 12313);
//     this.ws.addEventListener('open', () => {
//       this.open();
//     });
//     this.ws.addEventListener('message', (e:any) => {
//       this.receive(e.data);
//     });
//   }, 1000);
// }
// receive(message: any) {
//    let decrypted_data:any = JSON.parse(message);
//   if (
//     typeof decrypted_data !== 'object' ||
//     !decrypted_data.hasOwnProperty('event') ||
//     !decrypted_data.hasOwnProperty('data')
//   ) {
//     return;
//   }
// }

// open() {
//   this.send('core', 'init');
// }
// send(module: any, method: any, data = {}) {
//   let message = {
//     module,
//     method,
//     data,
//   };
//   let encrypted_data = JSON.stringify(message);
//   this.ws.send(encrypted_data);
// }
// }
// export const walletHelper = new Helper();
