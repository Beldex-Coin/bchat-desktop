// import request from 'request-promise';
// import { wallet } from './wallet-rpc';
import { walletSettingsKey } from '../data/settings-key';
import { ToastUtils} from '../bchat/utils';
import fetch from 'node-fetch';


// export async function workingStatusForDeamon(currentdeamon: any, type?: string) {
//   try {
//     const options = {
//       uri: `http://${currentdeamon.host}:${currentdeamon.port}/json_rpc`,
//       method: 'POST',
//       json: {
//         jsonrpc: '2.0',
//         id: '0',
//         method: 'getinfo',
//       },

//       timeout: 0,
//     };
//     let requestData: any = await request(options);
//     if (requestData.result) {
//       return requestData.result;
//     }
//   } catch (err) {
//     if (window.globalOnlineStatus && !type) {
//       ToastUtils.pushToastError(
//         'daemonRpcDown',
//         'Your current daemon down.Please choose another daemon from settings.'
//       );
//     }
//     return { status: 'NOT_OK', host: currentdeamon.host, port: currentdeamon.port };
//   }
// }

export async function workingStatusForDeamon(
  currentdeamon: any,
  type?: string
) {
  const controller = new AbortController();
  const timeoutMs = 10_000; // 10 seconds (adjust if needed)

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  try {
    const response = await fetch(
      `http://${currentdeamon.host}:${currentdeamon.port}/json_rpc`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '0',
          method: 'getinfo',
        }),
        signal: controller.signal, // 👈 abort signal
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: any = await response.json();

    if (data?.result) {
      return data.result;
    }

    throw new Error('Invalid RPC response');
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.warn('Daemon request timed out');
    }

    if (window.globalOnlineStatus && !type) {
      ToastUtils.pushToastError(
        'daemonRpcDown',
        'Your current daemon down. Please choose another daemon from settings.'
      );
    }

    return {
      status: 'NOT_OK',
      host: currentdeamon.host,
      port: currentdeamon.port,
    };
  } finally {
    clearTimeout(timeoutId); 
  }
}
export async function deamonvalidation() {
  let list_deamon = window.getSettingValue(walletSettingsKey.settingsDeamonList);
  let getcurrentWorkingDeamon = window.getSettingValue('current-deamon');
  const currentDaemon: any = getcurrentWorkingDeamon
    ? getcurrentWorkingDeamon
    : window.currentDaemon;
  if (!list_deamon) {
    const deamon_list = window.deamon_list;
    window.setSettingValue('deamon-List', deamon_list);
  }
  const deamonStatus = await workingStatusForDeamon(currentDaemon);
  if (deamonStatus.status === 'OK') {
    window.setSettingValue('current-deamon', currentDaemon);
    // await wallet.startWallet('settings');
  } else {
    for (let index = 0; index < list_deamon.length; index++) {
      const deamonStatus = await workingStatusForDeamon(list_deamon[index]);
      if (deamonStatus.status === 'OK') {
        window.setSettingValue('current-deamon', currentDaemon);
        // await wallet.startWallet('settings');
        break;
      }
    }
  }
}

export function loadRecipient() {
  if (!window.getSettingValue('save-recipient')) {
    window.setSettingValue('save-recipient', true);
  }
}
export function loadFiatCurrency() {
  if (!window.getSettingValue('fiat-currency')) {
    window.setSettingValue('fiat-currency', 'USD');
  }
}
