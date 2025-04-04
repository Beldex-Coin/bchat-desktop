import React from 'react';

import { useSelector } from 'react-redux';
import { SectionType } from '../../state/ducks/section';
import { BchatTheme } from '../../state/ducks/BchatTheme';
import { getLeftPaneLists, getUnreadConversationRequests } from '../../state/selectors/conversations';
import { getSearchResults, isSearching } from '../../state/selectors/search';
import { getFocusedSection, getOverlayMode } from '../../state/selectors/section';
import { getHideMessageRequestBanner } from '../../state/selectors/userConfig';
import { ActionsPanel } from './ActionsPanel';
// import { LeftPaneContactSection } from './LeftPaneContactSection';
import { LeftPaneMessageSection } from './LeftPaneMessageSection';
import { LeftPaneSettingSection } from './LeftPaneSettingSection';

import { OverlayOpenGroup } from './overlay/OverlayOpenGroup';
import { OverlayClosedGroup } from './overlay/OverlayClosedGroup';

import { getDirectContacts } from '../../state/selectors/conversations';
import { AddressBook } from '../wallet/BchatWalletAddressBook';
import { OverlayMessage } from './overlay/OverlayMessage';
import PreventScreenshot from '../../hooks/useScreenProtection';

// import { BchatIcon } from '../icon/BchatIcon';




// for test


// from https://github.com/bvaughn/react-virtualized/blob/fb3484ed5dcc41bffae8eab029126c0fb8f7abc0/source/List/types.js#L5
export type RowRendererParamsType = {
  index: number;
  isScrolling: boolean;
  isVisible: boolean;
  key: string;
  parent: Object;
  style: Object;
};

const InnerLeftPaneMessageSection = () => {
  const showSearch = useSelector(isSearching);

  const searchResults = showSearch ? useSelector(getSearchResults) : undefined;

  const lists = showSearch ? undefined : useSelector(getLeftPaneLists);
  const messageRequestsEnabled = useSelector(getHideMessageRequestBanner);
  const overlayMode = useSelector(getOverlayMode);
  const directContact = useSelector(getDirectContacts);
  const conversationRequestsUnread = useSelector(getUnreadConversationRequests).length; 

  return (
    // tslint:disable-next-line: use-simple-attributes
    <LeftPaneMessageSection
      conversations={lists?.conversations || []}
      contacts={lists?.contacts || []}
      searchResults={searchResults}
      messageRequestsEnabled={messageRequestsEnabled}
      overlayMode={overlayMode}
      directContact={directContact}
      conversationRequestsUnread={conversationRequestsUnread}
    />
  );
};

// const InnerLeftPaneContactSection = () => {
//   return <LeftPaneContactSection />;
// };

const LeftPaneSection = () => {
  const focusedSection = useSelector(getFocusedSection);
  const zoomLevel = window.getSettingValue('zoom-factor-setting');
  // const convoList = useSelector(getLeftPaneLists);
  if (focusedSection === SectionType.Message) { 
    return <InnerLeftPaneMessageSection />;
  }
  if (focusedSection === SectionType.NewChat) {
    return  <OverlayMessage />;
  }
  if (focusedSection === SectionType.Closedgroup) {
    // if (convoList?.conversations.length === 0 || convoList.contacts.length === 0 ) {
    //   return<></>;
    // }
    return <OverlayClosedGroup />;
  }

  if (focusedSection === SectionType.Opengroup) {
    return <OverlayOpenGroup />;
  }

  if (focusedSection === SectionType.Wallet) {
    return <div className='wallet-contact-left-pane-wrapper' style={{minWidth:zoomLevel>100?'223px':'',width:zoomLevel>100?'20vw':''}}><AddressBook isContact={true} /></div> ;
  }

  // if (focusedSection === SectionType.Contact) {
  //   return <InnerLeftPaneContactSection />;
  // }
  if (focusedSection === SectionType.Settings) {
    return <LeftPaneSettingSection />;
  }
  return null;
};

// const AddContactFloatingIcon = () => {
//   const focusedSection = useSelector(getFocusedSection);
//   const overlayMode = useSelector(getOverlayMode);
//   const visibleFloatIcon=focusedSection === SectionType.Message && overlayMode !== 'message' && overlayMode !=='message-requests' 
 

//   if (visibleFloatIcon) {
//     // return <InnerLeftPaneMessageSection />;
//     return (
//       <div className="addContactFloating">
//         <div
//           className="addContactFloating-content"
//           data-tip="Add Contacts"
//           //  data-offset="{'right':60}"
//           data-offset="{'top':80,'right':80}"
//           data-place="bottom"
//           onClick={() => window.inboxStore?.dispatch(setOverlayMode('message'))}
//         >
//           <img src="images/wallet/addNewChat.svg" style={{ width: '23px', height: '23px' }} />

//           {/* <BchatIcon iconSize={23} iconType="addContact" /> */}
//           {/* <img src={"addNewChat.svg"} /> */}
//         </div>
//       </div>
//     );
//   }
//   return <></>;
// };

export const LeftPane = () => {

  return (
    <BchatTheme>
      <div className="module-left-pane-bchat">
        <div className="module-left-pane">
           <ActionsPanel />
          <LeftPaneSection />
          <ScreenShotProtector />
          {/* <AddContactFloatingIcon /> */}
          
        </div>
      </div>
    </BchatTheme>
  );
};

const  ScreenShotProtector=()=> {
 const showOverlay=PreventScreenshot()

  return (
    <div className="app">
  
      
      {showOverlay && (
        <div className="overlay">
          {/* Black Screen */}
        </div>
       )} 

      <style>
        {`
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: black;
            z-index: 9999;
          }
        `}
      </style>
    </div>
  );
}


