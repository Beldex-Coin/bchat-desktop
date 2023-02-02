import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppIsFocused } from '../hooks/useAppFocused';
// import os from 'os';
// import path from 'path';
// import fs from 'fs-extra';

import { getFocusedSettingsSection } from '../state/selectors/section';

import { SmartBchatConversation } from '../state/smart/BchatConversation';
import { BchatSettingsView } from './settings/BchatSettings';
//  import { ModalContainer } from './dialog/ModalContainer';
import { getOurPubKeyStrFromCache } from '../bchat/utils/User';
import { getConversationById } from '../data/data';
import { updateBchatUpgradeInstructionModal } from '../state/ducks/modalDialog';
// import { BchatButtonColor } from './basic/BchatButton';
// import { sendConfigMessageAndDeleteEverything } from './dialog/DeleteAccountModal';
import { ModalContainer } from './dialog/ModalContainer';
// import { getCurrentRecoveryPhrase } from '../util/storage';



const FilteredSettingsView = BchatSettingsView as any;

// function removeOldLoginDb() {
//   try {
//     let BChatDbDir;
//     console.log('os.platform ::',os.platform(),path.join(os.homedir(),'\\AppData\\Roaming\\bchat-development-devprod'));

//     if (os.platform() === 'linux' || os.platform() === 'darwin' ||  os.platform() === "win32"  ) {
//       BChatDbDir =
//         os.platform() === 'linux'
//           ? path.join(os.homedir(), '.config//BChat')
//           :os.platform() === "win32"?path.join(os.homedir(),'\\AppData\\Roaming\\bchat-development-devprod'): path.join(os.homedir(), '/Library/Application Support/BChat');
//           console.log("bchBChatDbDir:at:",BChatDbDir)
//       if (fs.existsSync(BChatDbDir)) {
//         // console.log("NOO")
//         window.restart();
//         fs.emptyDirSync(BChatDbDir);
//          console.log('Remove Bchat folder is done');

//       }

//     }
//   } catch (e) {
//     console.log('removeLoginDb in ', e);
//   }
// }

export async function getconverstation() {
  
  console.log("get conver 0");
  //let userDetails= await getConversationById(Storage.get('primaryDevicePubKey') | UserUtils.getOurPubKeyStrFromCache())
  let userDetails = await getConversationById(getOurPubKeyStrFromCache())
  console.log("get conver 1", userDetails);
  let data = userDetails?.attributes
  console.log('get conver 2"', userDetails?.attributes);
  if (!data?.walletCreatedDaemonHeight) {
    console.log('get conver 3 if"', userDetails?.attributes);
    window.inboxStore?.dispatch(
      updateBchatUpgradeInstructionModal({})
        
      
    );
  }
  console.log('get conver 4 if"', userDetails?.attributes);
}

export const BchatMainPanel = () => {
  const focusedSettingsSection = useSelector(getFocusedSettingsSection);
  const isSettingsView = focusedSettingsSection !== undefined;
  useEffect(() => {
    getconverstation()
  }, [])
  // even if it looks like this does nothing, this does update the redux store.
  useAppIsFocused();
  if (isSettingsView) {
    return <FilteredSettingsView category={focusedSettingsSection} />;
  }
  return (
    <div className="bchat-conversation">
      <ModalContainer />
      {/* <div className="bchat-conversation-doodle"> */}
      <SmartBchatConversation />
      {/* </div> */}

    </div>
  );
};


