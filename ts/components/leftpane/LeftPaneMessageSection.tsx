import React from 'react';
// import { AutoSizer, List } from 'react-virtualized';
import {
  ConversationListItemProps,
  MemoConversationListItemWithDetails,
} from './conversation-list-item/ConversationListItem';
import { ReduxConversationType } from '../../state/ducks/conversations';
import { SearchResults, SearchResultsProps } from '../search/SearchResults';
// import { LeftPaneSectionHeader } from './LeftPaneSectionHeader';
import autoBind from 'auto-bind';
import _ from 'lodash';
import { MessageRequestsBanner } from './MessageRequestsBanner';

// import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatSearchInput } from '../BchatSearchInput';
// import { RowRendererParamsType } from './LeftPane';
// import { OverlayOpenGroup } from './overlay/OverlayOpenGroup';
// import { OverlayMessageRequest } from './overlay/OverlayMessageRequest';
// import { OverlayMessage } from './overlay/OverlayMessage';
// import { OverlayClosedGroup } from './overlay/OverlayClosedGroup';
import {
  OverlayMode,
  SectionType,
  setOverlayMode,
  showLeftPaneSection,
  showSettingsSection,
} from '../../state/ducks/section';
import { SpacerSM } from '../basic/Text';
import classNames from 'classnames';
import { BchatSettingCategory } from '../settings/BchatSettings';
// import { AddressBook } from '../wallet/BchatWalletAddressBook';

export interface Props {
  contacts: Array<ReduxConversationType>;
  conversations?: Array<ConversationListItemProps>;
  searchResults?: SearchResultsProps;

  messageRequestsEnabled?: boolean;
  overlayMode: OverlayMode;
  directContact: any;
  conversationRequestsUnread: any;
}

export class LeftPaneMessageSection extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);

    autoBind(this);
  }

  // public renderRow = ({ index, key, style }: RowRendererParamsType): JSX.Element | null => {
  public renderRow = (item: any, key: any): JSX.Element | null => {
    // const { conversations } = this.props;
    const conversation = item;

    //assume conversations that have been marked unapproved should be filtered out by selector.
    // if (!conversations) {
    //   throw new Error('renderRow: Tried to render without conversations');
    // }

    // const conversation = conversations[index];
    if (!conversation) {
      throw new Error('renderRow: conversations selector returned element containing falsy value.');
    }

    return <MemoConversationListItemWithDetails key={key} {...conversation} />;
  };

  public renderList(): JSX.Element | Array<JSX.Element | null> {
    const { conversations, searchResults } = this.props;

    if (searchResults) {
      return <SearchResults {...searchResults} />;
    }

    if (!conversations) {
      throw new Error('render: must provided conversations if no search results are provided');
    }

    // const length = conversations.length;
    const listKey = 0;

    // Note: conversations is not a known prop for List, but it is required to ensure that
    //   it re-renders when our conversation data changes. Otherwise it would just render
    //   on startup and scroll.
    const list = (
      <div className="module-left-pane__list" key={listKey}>
        {/*  <AutoSizer>
          {({height,  width }) => (
            <List
              className="module-left-pane__virtual-list"
              conversations={conversations}
              height={height}
              rowCount={length}
              rowHeight={64}
              rowRenderer={this.renderRow}
             
              width={width}
              autoHeight={false}
            />
          )}
        </AutoSizer>
   */}
        {conversations.map((item, key) => this.renderRow(item, key))}
      </div>
    );

    return [list];
  }

  public render(): JSX.Element {
    // const { overlayMode } = this.props;
    const { conversations, conversationRequestsUnread, directContact } = this.props;
    const convolen: boolean =
      conversations?.length === 0 && conversationRequestsUnread === 0 && directContact.length === 0;
    return (
      <div
        className={classNames('bchat-left-pane-section-content', convolen && 'd-none')}
        // className={classNames('bchat-left-pane-section-content')}

        // style={{ display: conversations?.length === 0 ? 'none' : 'flex' }}
      >
        {/* <LeftPaneSectionHeader/> */}
        {/* {overlayMode ? this.renderClosableOverlay() : null} */}
        {/* {overlayMode ? null : <> */}
        {this.renderConversations()}
        {/* </>} */}
      </div>
    );
  }

  public renderConversations() {
    // const {
    //   conversations,
    //   // directContact
    //  } = this.props;
    return (
      <div className="module-conversations-list-content">
        <SpacerSM />
        {/* {conversations?.length !== 0 && */}
        <BchatSearchInput />
        {/* } */}

        <MessageRequestsBanner
          handleOnClick={() => {
            // window.inboxStore?.dispatch(setOverlayMode('message-requests'));
            // show open settings
            window.inboxStore?.dispatch(showLeftPaneSection(SectionType.Settings));
            window.inboxStore?.dispatch(setOverlayMode(undefined));
            window.inboxStore?.dispatch(showSettingsSection(BchatSettingCategory.MessageRequests));
          }}
        />
        {/* <SpacerMD /> */}
        {/* {directContact.length === 0 && conversations?.length === 0 ?
          <div className='bchatEmptyScrBox'>
            <div className='addContactImg'>
            </div>
            <h4 className='module-left-pane__empty_contact'>{window.i18n('noContactsYet')}</h4>
            <div style={{ display: "flex" }}>
              <button className='nextButton' onClick={() => window.inboxStore?.dispatch(setOverlayMode('message'))}>Add Contacts + </button>
            </div>
          </div>
          :  */}
        {this.renderList()}
        {/* } */}
        {/* {this.renderBottomButtons()} */}
      </div>
    );
  }

  //   private renderClosableOverlay() {
  //     const { overlayMode } = this.props;
  //     switch (overlayMode) {
  //       case 'open-group':
  //         return <OverlayOpenGroup />;
  //       case 'closed-group':
  //         return <OverlayClosedGroup />;

  //       case 'message':
  //         return <OverlayMessage />;
  //       case 'message-requests':
  //         return <OverlayMessageRequest leftPane={true} />;
  //       // case 'wallet':
  //       //   return <AddressBook from={'leftpane'}  />
  //       default:
  //         return null;
  //     }
  //   }

  // private renderBottomButtons(): JSX.Element {
  //   const joinSocialGroup = window.i18n('joinSocialGroup');
  //   const newSecretGroup = window.i18n('newSecretGroup');

  //   return (
  //     <div className="left-pane-contact-bottom-buttons">
  //       <BchatButton
  //         // text={joinSocialGroup}
  //         icon={true}
  //         buttonType={BchatButtonType.SquareOutline}
  //         buttonColor={BchatButtonColor.Green}
  //         onClick={() => {
  //           window.inboxStore?.dispatch(setOverlayMode('open-group'));
  //         }}
  //         style={{background: "url(images/bchat/secret-group.svg) no-repeat ",backgroundSize: 'cover',height: "19px",color: "rgb(0, 0, 0)",width: "29px",margin:'30px 30px'}}

  //       />
  //       <BchatButton
  //         icon={true}
  //         style={{background: "url(images/bchat/socialgroup.svg) no-repeat ",backgroundSize: 'cover',height: "19px",color: "rgb(0, 0, 0)",width: "29px",margin:'30px 30px'}}

  //         // text={newSecretGroup}
  //         buttonType={BchatButtonType.SquareOutline}
  //         buttonColor={BchatButtonColor.White}
  //         onClick={() => {
  //           window.inboxStore?.dispatch(setOverlayMode('closed-group'));
  //         }}
  //       />
  //     </div>
  //   );
  // }
}
