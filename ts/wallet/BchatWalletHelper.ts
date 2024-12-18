import request from 'request-promise';
// import { wallet } from './wallet-rpc';
import { walletSettingsKey } from '../data/settings-key';
import { ToastUtils} from '../bchat/utils';


export async function workingStatusForDeamon(currentdeamon: any, type?: string) {
  try {
    const options = {
      uri: `http://${currentdeamon.host}:${currentdeamon.port}/json_rpc`,
      method: 'POST',
      json: {
        jsonrpc: '2.0',
        id: '0',
        method: 'getinfo',
      },

      timeout: 0,
    };
    let requestData: any = await request(options);
    if (requestData.result) {
      return requestData.result;
    }
  } catch (err) {
    if (window.globalOnlineStatus && !type) {
      ToastUtils.pushToastError(
        'daemonRpcDown',
        'Your current daemon down.Please choose another daemon from settings.'
      );
    }
    return { status: 'NOT_OK', host: currentdeamon.host, port: currentdeamon.port };
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
