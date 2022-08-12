import React from 'react';

import { useSelector } from 'react-redux';
import { SectionType } from '../../state/ducks/section';
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
  
  return (
    // tslint:disable-next-line: use-simple-attributes
    <LeftPaneMessageSection
      conversations={lists?.conversations || []}
      contacts={lists?.contacts || []}
      searchResults={searchResults}
      messageRequestsEnabled={messageRequestsEnabled}
      overlayMode={overlayMode}
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
  

  // if (focusedSection === SectionType.Contact) {
  //   return <InnerLeftPaneContactSection />;
  // }
  if (focusedSection === SectionType.Settings) {
    return <LeftPaneSettingSection />;
  }
  return null;
};

export const LeftPane = () => {
 
  return (
    <BchatTheme>
      <div className="module-left-pane-bchat">
       

        <div className="module-left-pane">
          <LeftPaneSection />
          <ActionsPanel />
           
        </div>
      </div>
    </BchatTheme>
  );
};
