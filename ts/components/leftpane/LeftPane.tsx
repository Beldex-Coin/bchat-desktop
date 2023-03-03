import React from 'react';

import { useSelector } from 'react-redux';
import { SectionType, setOverlayMode } from '../../state/ducks/section';
import { BchatTheme } from '../../state/ducks/BchatTheme';
import { getLeftPaneLists } from '../../state/selectors/conversations';
import { getSearchResults, isSearching } from '../../state/selectors/search';
import { getFocusedSection, getOverlayMode } from '../../state/selectors/section';
import { getHideMessageRequestBanner } from '../../state/selectors/userConfig';
import { ActionsPanel } from './ActionsPanel';
// import { LeftPaneContactSection } from './LeftPaneContactSection';
import { LeftPaneMessageSection } from './LeftPaneMessageSection';
import { LeftPaneSettingSection } from './LeftPaneSettingSection';

import { OverlayOpenGroup } from './overlay/OverlayOpenGroup';
import {OverlayClosedGroup} from './overlay/OverlayClosedGroup';

import { getDirectContacts } from '../../state/selectors/conversations';
import { AddressBook } from '../wallet/BchatWalletAddressBook';
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
  const directContact=useSelector(getDirectContacts)
  
  return (
    // tslint:disable-next-line: use-simple-attributes
    <LeftPaneMessageSection
      conversations={lists?.conversations || []}
      contacts={lists?.contacts || []}
      searchResults={searchResults}
      messageRequestsEnabled={messageRequestsEnabled}
      overlayMode={overlayMode}
      directContact={directContact}

    />
  );
};

// const InnerLeftPaneContactSection = () => {
//   return <LeftPaneContactSection />;
// };

 const LeftPaneSection = () => {
  const focusedSection = useSelector(getFocusedSection);


  if (focusedSection === SectionType.Message) {
    return <InnerLeftPaneMessageSection />;
  }
  if (focusedSection ===  SectionType.Closedgroup) {
    return <OverlayClosedGroup />;
  }

 
  
  if (focusedSection === SectionType.Opengroup) {
    return<OverlayOpenGroup />;
  }

  if (focusedSection === SectionType.Wallet) {
    return<AddressBook from={window.i18n('contact')} />;
  }
  

  // if (focusedSection === SectionType.Contact) {
  //   return <InnerLeftPaneContactSection />;
  // }
  if (focusedSection === SectionType.Settings) {
    return <LeftPaneSettingSection />;
  }
  return null;
};

const AddContactFloatingIcon=()=>{
  const focusedSection = useSelector(getFocusedSection);
  const overlayMode = useSelector(getOverlayMode);

  if (focusedSection === SectionType.Message && overlayMode!=='message') {
    // return <InnerLeftPaneMessageSection />;
  return <div className='addContactFloating'>         
    <div className='addContactFloating-content' 
     data-tip="Add Contacts"
     data-offset="{'right':60}"
     data-place="bottom"
     onClick={()=> window.inboxStore?.dispatch(setOverlayMode('message'))}
    >
      <img src="images/wallet/addNewChat.svg"  style={{width:'23px',height:'23px'}} />

      {/* <BchatIcon iconSize={23} iconType="addContact" /> */}
      {/* <img src={"addNewChat.svg"} /> */}
      </div>
  </div>
  }
  return <></>
}

export const LeftPane = () => {
 
  return (
    <BchatTheme>
      <div className="module-left-pane-bchat">
       

        <div className="module-left-pane">
          <LeftPaneSection />
          <AddContactFloatingIcon />
          <ActionsPanel />
           
        </div>
      </div>
    </BchatTheme>
  );
};
