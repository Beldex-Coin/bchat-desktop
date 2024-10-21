import React from 'react';

import { createGlobalStyle } from 'styled-components';

const white = '#F0F0F0';
const black = '#333333';
const warning = '#e7b100';
const destructive = '#ff453a';
const accentLightTheme = '#159B24';
const accentDarkTheme = '#2879FB';
const darkGrey = '#202329';
// const borderLightThemeColor = '#f1f1f1';
// const borderDarkThemeColor = '#ffffff0F';
const baseColor = '#00A803';
// const greyColor = '#2D2D3B';
const lightGreyColor = '#646474';
const greenColor = '#108D32';
const forestGreenColor = '#00A638';

// const bgWhite='#EBEBEB';
const baseWhite = '#F8F8F8';

// DARK COLORS
const darkColorAccent = baseColor;
const darkColorAccentButton = accentDarkTheme;
const darkColorText = white;
const darkColorTextOpposite = white;

const darkColorTextSubtle = `${white}99`;
const darkColorTextAccent = accentDarkTheme;
const darkColorBchatShadow = `0px 3px 5px 0px #00000029`;
const darkColorComposeViewBg = '#232323';
const darkColorSentMessageBg = accentDarkTheme;
const darkSettingsleftPaneHover = '#303041';
const darkSettingsHover = '#4A4A62';
const darkColorSentMessageText = white;
const darkColorClickableHovered = '#2e333d';
const darkColorBchatBorder = `2px solid #1A1A24`;
// const darkColorBchatBorderColor = borderDarkThemeColor;
const darkColorRecoveryPhraseBannerBg = '#1f1f1f';
const darkColorPillDivider = '#3E3E4E';
const darkColorLastSeenIndicator = accentDarkTheme;
const darkColorQuoteBottomBarBg = '#34323F';
const darkColorCellBackground = '#181821';
const darkColorReceivedMessageBg = '#2E333D';
const darkColorReceivedMessageBgHover = '#52505F';
const darkColorReceivedMessageText = white;

const darkColorPillDividerText = '#a0a0a0';
// const darkInputBackground = darkColorCellBackground;
const darkInputBackground = '#202329';

const darkFilterBchatText = 'none';
const darkUnreadBorder = `4px solid ${accentDarkTheme}`;

const darkScrollbarThumb = '#858598';
const darkScrollbarTrack = '#131313';
const darkFakeChatBubbleBg = '#212121';

const darkInboxBackground = '#131313';
const darkLeftPaneOverlayBg = darkInboxBackground;
const darkConversationItemSelected = '#2e333d';
const darkConversationItemHasUnread = '#2e333d';
const darkConversationList = darkScrollbarTrack;

const darkTextHighlight = `${white}88`;
const darkBackgroundPrimary = '#3A3A4E';
const darkButtonGreen = baseColor;
const darkModalBackground = '#101011';

const grey67 = '#1BB51E';
const darkMessageRequestBannerBackground = '#131313';
const darkMessageRequestBannerIconBackground = '#2879FB';
const darkMessageRequestBannerUnreadBackground = grey67;
const darkMessageRequestBannerIcon = '#adadad';

const darkWalletNodeHeader = '#108D32';
const darkWalletSelectHover = '#545469';

const darkWalletCopyHover = '#52505F';
const darkProfileClose = '#4C4C64';
const darkChatTimestamp = '#858598';

// for bchat
const darkColorBg = black;
// const darkunreadBg="#39394A";
const darkBorderBottomColor = '#1A1A24';
const darkHintMessage = '#7B7B86';
const darkSettingIndication = '#2E333D';
const darkProfileBgColor = '#2A2A3B';
const darkSinginTextColor = '#128B17';
const darkHintColor = lightGreyColor;
// const darkCopyIcon = '#fff';
// const darkCopyIconBg = '#353543';
const darkCopyModalbtn = '#444455';
const darkChatHeader = '#131313';
const darkToggleOff = '#363645';
const darkClearBtn = '#3D3D4D';
const darkLeaveGrpBtn = '#20202F';
const darkSmModalBg = '#2A2A3B';
const darkMsgReqModalBg = 'rgba(0,0,0,0.4)';

const darkleftHeaderBg = '#1C1C26';
const darkCancelBtnBg = '#3D3D4E';
const darkDisableText = '#545469';
const darkEmptyChatImg = `url("../images/bchat/emptyMessage.svg")`;
// const darkBgDoodle = `url("../images/bchat/doodle_white.svg")`;
const darkEmptyContact = `url("../images/bchat/empty_address_book_dark.svg")`;
const darkEmptyAddressBook = `url("../images/bchat/empty_address_book_dark.svg")`;
const darkEmptyTransHistory = `url("../images/bchat/no_tx_history_dark.svg")`;
const darkPendingTransHistory = `url("../images/bchat/pending_tx_history_dark.svg")`;
const darkOutgoingTransHistory = `url("../images/bchat/no_outgoing_dark.svg")`;
const darkIncomingTransHistory = `url("../images/bchat/no_incoming_transaction_dark.svg")`;
const darkFailedTransHistory = `url("../images/bchat/failed_tx_history_dark.svg")`;
const darkEmptyTransaction = `url("../images/bchat/no_transactions_found_dark.svg")`;
const darkComposeMsgInput = '#202329';
const darkDayNight = `url("../images/bchat/light_theme.svg")`;
const darkNewChat = `url("../images/bchat/newChat_dark.svg")`;
const darkMsgReqImg = `url("../images/bchat/no_message_request_dark_theme.svg")`;
const darkBlockedContact = `url("../images/bchat/no_blocked_contacts_dark_theme.svg")`;
const darkAddContact = `url("../images/bchat/add_contact.svg")`;
const darkNoMedia = `url("../images/bchat/no_mediaDarkTheme.svg")`;

const darkBlockUserBg = '#202329';
const darkBlockseletedUserBg = '#2C2C3E';

const darkPasswordBorderBottom = '#444455';
const darkbubbleReceivedBg = '#2e333d';

const buttonColor = forestGreenColor;
// const buttonColor = "linear-gradient(to bottom , #13B71A, #006004)";

// Seed color
// Bns link colors
const darkBnsLinkIdBgColor = '#202329';
const darkBnsCameraIconBgColor = '#22222E';

//wallet
const darkWalcontentBg = '#303041';
const darkWalInputBg = '#1c1c26';
const darkWalTransacBtn = '#444455';
const darkWalcancelBtn = '#403e4b';
const darkWalletSyncBar = '#202329';
const darkDownthickArrow = '#fff';
const darkDisableBtn = '#444455';
const darkDisableTxt = '#8F8FA2';
const darkDownArrowBg = '#525262';
const darkDownArrow = '#CACAD8';
const darkLeaveHover = '#4f4f65';

const darkBgModalColor = 'rgba(0, 0, 0, 0.8)';

const darkWalDownThickArrow = `url("../images/wallet/downThickarrow.svg")`;
const darkWalPassword = `url("../images/bchat/passwordIcon.svg")`;
const darkBnsTransactionColor = '#FFFFFF';

// revamp
const darklogoBg = darkGrey;
const darkActionBtnBg = darkGrey;
const darkActionBtnicon = '#a7a7ba';
const darkActionBtnTxt = '#a7a7ba';
const darkThemeSelectedBg = '#242B38';
const darkLeftPaneBg = '#202329';
const darkSearchBorder = '#46465d';
const darkLastMsgTxt = '#A7A7BA';
const darkContextMenuBg = '#1B1E23';
const darkProfileIdBg = '#1C1F25';
const darkProfileIDBorder = '#3A3A41';
const darkSecondaryBtnBg = '#2e333d';
const darkSecondaryBtnHoverBg='#383D47';

const darkQrOuterBg = '#282836';
const darkSettingsRightPaneOption = '#202329';
const darksettingHeaderBorder = '#202329';
const darkToggleBtn = '#9595B5';
const darkSettingsRightPaneOptionBorder = '#4B4B64';
const darkHopBg = '#202329';
const darkHopTxt = '#A7A7BA';
const darkRecoverySeedBg = '#202329';
const darkModalFooter = '#202329';
const darkUntrustMediaBg = '#131313';
const darkUntrustedVerticalBar = '#858598';
const darkIconBtnHover = '#2e333d';
const darkContextMenuHoverBg = '#333842';
const darkWalletSyncBoxBg = '#202329';
const darkProfileHeaderBg = '#2E333D';
const darkChatIdBorder = '#3A3A41';
const darkProfileInfoBorder = '#2E333D';
const darkDisappearTimeHover = '#2E333D';
const darkProfileInfoMediaTitle = '#A7A7BA';
const darkModalBg = '#2e333d';
const darkModalIconBg = '#202329';
const darkChatMultiSelectBg = '#202329';
const darkConfirmModalInnerBg = '#1B1E23';
const darkConfirmModalHoverBg = '#202329';
const darkEnableBtnBg = '#202329';
const darkModalDisableTxt = '#a7a7ba';
const darkWalletStatusTxtBg = '#131313';
const darkWalletUnBalanceLabel = '#858598';
const darkWalletInnerBg = '#202329';
const darkNoTxnTxt = '#A7A7BA';
const darkToastBg = '#131313';
const bodyBg='#131313'
const darkCallOptionBtnHover='#424751';
const darkSpeedPlayBg='#202329';
const darkMoreInfoIncommingChatBg='#202329';
const darkCameraHoverBg='#46465D';
const darkSettingWalletBetaBg='#131313';
const darkPrimaryBtnHoverBg='#1A973C';
const darkOfflineContentBg='#131313'
const darkInputText = '#858598';
const darkIconColor = white;
const darkInviteCardIconBg='#202329';


export const switchHtmlToDarkTheme = () => {
  document.documentElement.style.setProperty('--color-body-bg', darkColorBg);
  document.documentElement.style.setProperty('--color-profile', darkProfileBgColor);
  document.documentElement.style.setProperty('--color-accent', darkColorAccent);
  document.documentElement.style.setProperty('--color-accent-button', darkColorAccentButton);
  document.documentElement.style.setProperty('--color-text', darkColorText);
  document.documentElement.style.setProperty('--color-text-menu-highlighted', lightColorText);
  document.documentElement.style.setProperty('--color-text-subtle', darkColorTextSubtle);
  document.documentElement.style.setProperty('--color-text-accent', darkColorTextAccent);
  document.documentElement.style.setProperty('--color-text-opposite', darkColorTextOpposite);
  document.documentElement.style.setProperty('--color-text-signIn', darkSinginTextColor);
  document.documentElement.style.setProperty('--color-bchat-shadow', darkColorBchatShadow);
  // document.documentElement.style.setProperty('--color-Bchat-hint', darkHintColor);
  document.documentElement.style.setProperty('--color-copyModalbtn', darkCopyModalbtn);
  document.documentElement.style.setProperty(
    '--color-compose-view-button-background',
    darkColorComposeViewBg
  );
  document.documentElement.style.setProperty(
    '--color-sent-message-background',
    darkColorSentMessageBg
  );
  document.documentElement.style.setProperty(
    '--color-settings-leftpane-options-hover',
    darkSettingsleftPaneHover
  );
  document.documentElement.style.setProperty('--color-settings-options-hover', darkSettingsHover);
  document.documentElement.style.setProperty('--color-sent-message-text', darkColorSentMessageText);
  document.documentElement.style.setProperty(
    '--color-clickable-hovered',
    darkColorClickableHovered
  );
  document.documentElement.style.setProperty('--color-bchat-border', darkColorBchatBorder);
  // document.documentElement.style.setProperty('--color-bchat-border', darkColorBchatBorderColor);
  document.documentElement.style.setProperty(
    '--color-recovery-phrase-banner-background',
    darkColorRecoveryPhraseBannerBg
  );
  document.documentElement.style.setProperty('--color-pill-divider', darkColorPillDivider);
  document.documentElement.style.setProperty(
    '--color-last-seen-indicator',
    darkColorLastSeenIndicator
  );
  document.documentElement.style.setProperty(
    '--color-quote-bottom-bar-background',
    darkColorQuoteBottomBarBg
  );
  document.documentElement.style.setProperty('--color-cell-background', darkColorCellBackground);
  document.documentElement.style.setProperty(
    '--color-received-message-text',
    darkColorReceivedMessageText
  );
  document.documentElement.style.setProperty(
    '--color-received-message-background',
    darkColorReceivedMessageBg
  );
  document.documentElement.style.setProperty(
    '--color-received-message-background-hover',
    darkColorReceivedMessageBgHover
  );
  document.documentElement.style.setProperty('--color-pill-divider-text', darkColorPillDividerText);
  document.documentElement.style.setProperty('--color-input-background', darkInputBackground);

  document.documentElement.style.setProperty('--filter-bchat-text', darkFilterBchatText);
  document.documentElement.style.setProperty('--border-unread', darkUnreadBorder);

  document.documentElement.style.setProperty('--color-scroll-bar-thumb', darkScrollbarThumb);
  document.documentElement.style.setProperty('--color-scroll-bar-track', darkScrollbarTrack);
  document.documentElement.style.setProperty(
    '--color-fake-chat-bubble-background',
    darkFakeChatBubbleBg
  );
  document.documentElement.style.setProperty('--color-inbox-background', darkInboxBackground);
  document.documentElement.style.setProperty(
    '--color-left-pane-overlay-background',
    darkLeftPaneOverlayBg
  );
  document.documentElement.style.setProperty(
    '--color-conversation-item-selected',
    darkConversationItemSelected
  );
  document.documentElement.style.setProperty(
    '--color-conversation-item-has-unread',
    darkConversationItemHasUnread
  );
  document.documentElement.style.setProperty('--color-conversation-list', darkConversationList);
  document.documentElement.style.setProperty('--color-text-highlight', darkTextHighlight);
  document.documentElement.style.setProperty('--color-background-primary', darkBackgroundPrimary);
  document.documentElement.style.setProperty('--color-button-green', darkButtonGreen);
  document.documentElement.style.setProperty('--color-modal-background', darkModalBackground);
  document.documentElement.style.setProperty('--border-bchat', darkColorBchatBorder);

  document.documentElement.style.setProperty(
    '--color-request-banner-background',
    darkMessageRequestBannerBackground
  );
  document.documentElement.style.setProperty(
    '--color-request-banner-icon-background',
    darkMessageRequestBannerIconBackground
  );
  document.documentElement.style.setProperty(
    '--color-request-banner-unread-background',
    darkMessageRequestBannerUnreadBackground
  );
  document.documentElement.style.setProperty(
    '--color-request-banner-icon',
    darkMessageRequestBannerIcon
  );

  // document.documentElement.style.setProperty(
  //   '--color-unreadBg',
  //   darkunreadBg
  // );
  document.documentElement.style.setProperty('--color-leaveGrpBtn', darkLeaveGrpBtn);
  document.documentElement.style.setProperty('--color-borderBottomColor', darkBorderBottomColor);
  document.documentElement.style.setProperty('--color-HintMessageText', darkHintMessage);

  document.documentElement.style.setProperty('--color-leftHeaderBg', darkleftHeaderBg);
  document.documentElement.style.setProperty('--color-composeMsgInput', darkComposeMsgInput);

  document.documentElement.style.setProperty('--color-smModal-bg', darkSmModalBg);
  document.documentElement.style.setProperty('--color-MsgReqModal-bg', darkMsgReqModalBg);
  document.documentElement.style.setProperty('--color-cancelBtn-bg', darkCancelBtnBg);
  document.documentElement.style.setProperty('--color-settingIndication', darkSettingIndication);
  document.documentElement.style.setProperty('--color-chatHeader', darkChatHeader);
  document.documentElement.style.setProperty('--color-blockseletedUserBg', darkBlockseletedUserBg);
  document.documentElement.style.setProperty('--color-downArrowBg', darkDownArrowBg);
  document.documentElement.style.setProperty('--color-downArrow', darkDownArrow);

  document.documentElement.style.setProperty('--color-walletNodeHeader', darkWalletNodeHeader);
  document.documentElement.style.setProperty('--color-walletSelectOption', darkWalletSelectHover);

  document.documentElement.style.setProperty('--color-blockUserBg', darkBlockUserBg);

  document.documentElement.style.setProperty(
    '--color-password-borderBottom',
    darkPasswordBorderBottom
  );
  document.documentElement.style.setProperty('--color-toggleOff', darkToggleOff);
  document.documentElement.style.setProperty('--color-clearBtn', darkClearBtn);
  document.documentElement.style.setProperty('--color-clearBtn', darkClearBtn);
  document.documentElement.style.setProperty('--color-disableText', darkDisableText);
  document.documentElement.style.setProperty('--color-caret', lightColorCellBackground);
  document.documentElement.style.setProperty('--color-profile-close', darkProfileClose);
  document.documentElement.style.setProperty('--color-chat-timestamp', darkChatTimestamp);
  document.documentElement.style.setProperty('--color-wallet-copy-hover', darkWalletCopyHover);

  document.documentElement.style.setProperty('--image-DayNight', darkDayNight);
  document.documentElement.style.setProperty('--image-addContact', darkNewChat);
  document.documentElement.style.setProperty('--image-EmptyChatImg', darkEmptyChatImg);
  // document.documentElement.style.setProperty('--image-BgDoodle', darkBgDoodle);
  document.documentElement.style.setProperty('--image-MsgReq', darkMsgReqImg);
  document.documentElement.style.setProperty('--image-BlockedContact', darkBlockedContact);
  document.documentElement.style.setProperty('--image-AddContact', darkAddContact);
  document.documentElement.style.setProperty('--image-EmptyContact', darkEmptyContact);
  document.documentElement.style.setProperty('--image-EmptyAddressBook', darkEmptyAddressBook);
  document.documentElement.style.setProperty('--image-emptyTransHistory', darkEmptyTransHistory);
  document.documentElement.style.setProperty(
    '--image-outgoingTransHistory',
    darkOutgoingTransHistory
  );
  document.documentElement.style.setProperty(
    '--image-incomingTransHistory',
    darkIncomingTransHistory
  );

  document.documentElement.style.setProperty(
    '--image-pendingTransHistory',
    darkPendingTransHistory
  );
  document.documentElement.style.setProperty('--image-failedTransHistory', darkFailedTransHistory);
  document.documentElement.style.setProperty('--image-emptySearch', darkEmptyTransaction);
  document.documentElement.style.setProperty('--image-NoMedia', darkNoMedia);
  document.documentElement.style.setProperty('--green-color', greenColor);
  // document.documentElement.style.setProperty('--button-color', buttonColor);
  document.documentElement.style.setProperty(
    '--message-bubbles-received-background-color',
    darkbubbleReceivedBg
  );
  //Bns link chatid
  document.documentElement.style.setProperty('--color-BnsLinkIdBg', darkBnsLinkIdBgColor);
  document.documentElement.style.setProperty('--color-BnsCameraIconBg', darkBnsCameraIconBgColor);
  //wallet
  document.documentElement.style.setProperty('--color-WalcontentBg', darkWalcontentBg);
  document.documentElement.style.setProperty('--color-walInputBg', darkWalInputBg);
  document.documentElement.style.setProperty('--color-walTransacBtn', darkWalTransacBtn);
  document.documentElement.style.setProperty('--color-walcancelBtn', darkWalcancelBtn);
  document.documentElement.style.setProperty('--color-walSyncbar', darkWalletSyncBar);
  document.documentElement.style.setProperty('--color-walDownthickArrow', darkDownthickArrow);
  document.documentElement.style.setProperty('--color-disableBtn', darkDisableBtn);
  document.documentElement.style.setProperty('--color-disableTxt', darkDisableTxt);
  document.documentElement.style.setProperty('--color-BgModalColor', darkBgModalColor);
  document.documentElement.style.setProperty('--img-walPassword', darkWalPassword);
  document.documentElement.style.setProperty('--img-walDownThickArrow', darkWalDownThickArrow);
  document.documentElement.style.setProperty('--color-leave-button', darkLeaveHover);
  document.documentElement.style.setProperty('--color-bns-transaction', darkBnsTransactionColor);

  // revamp
  document.documentElement.style.setProperty('--color-logo-bg', darklogoBg);
  document.documentElement.style.setProperty('--color-action-btn-bg', darkActionBtnBg);
  document.documentElement.style.setProperty('--color-action-btn-icon', darkActionBtnicon);
  document.documentElement.style.setProperty('--color-action-btn-txt', darkActionBtnTxt);
  document.documentElement.style.setProperty('--color-theme-selected-bg', darkThemeSelectedBg);
  document.documentElement.style.setProperty('--color-left-pane-bg', darkLeftPaneBg);
  document.documentElement.style.setProperty('--color-search-border', darkSearchBorder);
  document.documentElement.style.setProperty('--color-last-msg-txt', darkLastMsgTxt);
  document.documentElement.style.setProperty('--color-context-menu-bg', darkContextMenuBg);
  document.documentElement.style.setProperty('--color-profile-id-bg', darkProfileIdBg);
  document.documentElement.style.setProperty('--color-profile-id-border', darkProfileIDBorder);
  document.documentElement.style.setProperty('--color-secondary-btn-bg', darkSecondaryBtnBg);
  document.documentElement.style.setProperty('--color-qr-outer-bg', darkQrOuterBg);
  document.documentElement.style.setProperty(
    '--color-settings-right-pane-option',
    darkSettingsRightPaneOption
  );
  document.documentElement.style.setProperty(
    '--color-setting-header-border',
    darksettingHeaderBorder
  );
  document.documentElement.style.setProperty('--color-toggle-btn', darkToggleBtn);
  document.documentElement.style.setProperty(
    '--color-settings-right-pane-option-border',
    darkSettingsRightPaneOptionBorder
  );
  document.documentElement.style.setProperty('--color-hop-bg', darkHopBg);
  document.documentElement.style.setProperty('--color-hop-txt', darkHopTxt);
  document.documentElement.style.setProperty('--color-recovery-seed-bg', darkRecoverySeedBg);
  document.documentElement.style.setProperty('--color-modal-footer', darkModalFooter);
  document.documentElement.style.setProperty('--color-untrust-media-bg', darkUntrustMediaBg);
  document.documentElement.style.setProperty(
    '--color-untrusted-vertical-bar',
    darkUntrustedVerticalBar
  );
  document.documentElement.style.setProperty('--color-icon-btn-hover', darkIconBtnHover);
  document.documentElement.style.setProperty(
    '--color-context-menu-hover-bg',
    darkContextMenuHoverBg
  );
  document.documentElement.style.setProperty('--color-wallet-Sync-box-bg', darkWalletSyncBoxBg);
  document.documentElement.style.setProperty('--color-profile-header-bg', darkProfileHeaderBg);
  document.documentElement.style.setProperty('--color-chatId-border', darkChatIdBorder);
  document.documentElement.style.setProperty('--color-profile-info-border', darkProfileInfoBorder);
  document.documentElement.style.setProperty(
    '--color-disappear-time-hover',
    darkDisappearTimeHover
  );
  document.documentElement.style.setProperty(
    '--color-profile-info-media-title',
    darkProfileInfoMediaTitle
  );
  document.documentElement.style.setProperty('--color-modal-bg', darkModalBg);
  document.documentElement.style.setProperty('--color-modal-icon-bg', darkModalIconBg);
  document.documentElement.style.setProperty('--color-chat-multi-select-bg', darkChatMultiSelectBg);
  document.documentElement.style.setProperty(
    '--color-confirm-modal-inner-bg',
    darkConfirmModalInnerBg
  );
  document.documentElement.style.setProperty(
    '--color-confirm-modal-hover-bg',
    darkConfirmModalHoverBg
  );
  document.documentElement.style.setProperty('--color-enable-btn-bg', darkEnableBtnBg);
  document.documentElement.style.setProperty('--color-modal-disable-txt', darkModalDisableTxt);
  document.documentElement.style.setProperty('--color-wallet-status-txt-Bg', darkWalletStatusTxtBg);
  document.documentElement.style.setProperty(
    '--color-wallet-unbalance-label',
    darkWalletUnBalanceLabel
  );
  document.documentElement.style.setProperty('--color-wallet-inner-bg', darkWalletInnerBg);
  document.documentElement.style.setProperty('--color-noTxn-txt', darkNoTxnTxt);
  document.documentElement.style.setProperty('--color-toast-bg', darkToastBg);
  document.documentElement.style.setProperty('--color-call-option-btn-hover', darkCallOptionBtnHover);
  document.documentElement.style.setProperty('--color-speedPlay-bg', darkSpeedPlayBg);
  document.documentElement.style.setProperty('--color-moreInfo-incomming-chat-bg', darkMoreInfoIncommingChatBg);
  document.documentElement.style.setProperty('--color-camera-hover-bg', darkCameraHoverBg);
  document.documentElement.style.setProperty('--color-setting-wallet-beta-bg', darkSettingWalletBetaBg);
  document.documentElement.style.setProperty('--color-secondary-btn-hover-bg', darkSecondaryBtnHoverBg);
  document.documentElement.style.setProperty('--color-primary-btn-hover-bg', darkPrimaryBtnHoverBg);
  document.documentElement.style.setProperty('--color-offline-content-bg', darkOfflineContentBg);
  document.documentElement.style.setProperty('--color-input-text', darkInputText);
  document.documentElement.style.setProperty('--color-icon', darkIconColor);
  document.documentElement.style.setProperty('--color-invite-card-icon-bg', darkInviteCardIconBg);
};

// LIGHT COLORS
const lightColorAccent = '#128b17';
const lightColorAccentButton = black;
const lightColorText = black;
const lightColorTextOpposite = white;
const lightColorTextSubtle = `${black}99`;
const lightColorTextAccent = accentLightTheme;
const lightColorBchatShadow = `0 0 4px 0 #00000029`;
const lightColorComposeViewBg = '#efefef';
const lightColorSentMessageBg = '#2879FB';
const lightSettingsleftpaneHover = '#E3E3E3';
const lightSettingsHover = '#E3E3E3';
const lightColorClickableHovered = '#F8F8F8';
// const lightColorBchatBorderColor = borderLightThemeColor;
const lightColorBchatBorder = `2px solid #E3E3E3 `;
const lightColorRecoveryPhraseBannerBg = white;
const lightColorPillDivider = `#E3E3E3`;
const lightColorLastSeenIndicator = black;
const lightColorQuoteBottomBarBg = '#f8f8f8';
const lightColorCellBackground = '#FAFAFA';
const lightColorReceivedMessageBg = '#F8F8F8';
const whiteColorReceivedMessageBgHover = '#FAFAFA';
const lightColorReceivedMessageText = black;

const lightColorPillDividerText = '#555555';

const lightInputBackground = '#EBEBEB';
const lightFilterBchatText = 'brightness(0) saturate(100%)';
const lightUnreadBorder = `4px solid ${accentLightTheme}`;

const lightScrollbarThumb = '#F8F8F8';
const lightScrollbarTrack = '#EBEBEB';
const lightFakeChatBubbleBg = '#f5f5f5';

const lightInboxBackground = '#F0F0F0';
const lightLeftPaneOverlayBg = '#EDEDED';
const lightConversationItemSelected = '#F8F8F8';
const lightConversationItemHasUnread = '#F8F8F8';
const lightConversationList = '#E6E6E6';

const lightTextHighlight = `${black}88`;

// const lightBackgroundPrimary = '#272726';
const lightBackgroundPrimary = '#E8E8E8';

const lightButtonGreen = '#FFFFFF';
const lightModalBackground = '#fcfcfc';

const lightMessageRequestBannerBackground = lightColorQuoteBottomBarBg;
const lightMessageRequestBannerIconBackground = '#2879FB';
const lightMessageRequestBannerUnreadBackground = greenColor;
const lightMessageRequestBannerIcon = white;

// for bchat
const lightColorBg = white;
// const lightunreadBg="#EDEDED";
const lightMsgReqModalBg = 'rgba(230,230,230,0.4)';
const lightSmModalBg = '#F4F4F4';
const lightCancelBtnBg = '#E8E8E8';

// const lightHintMessageText="black";
// const lightTextAreaColor="black";

// const lightComposeMsgIconBG="#2879fb";
const lightSettingIndication = '#F8F8F8';
const lightSinginTextColor = '#128B17';
// const lightHintColor = lightGreyColor;
// const lightCopyIcon = '#0BB70F';
// const lightCopyIconBg = '#EFEFEF';
const lightCopyModalbtn = '#F8F8F8';

const lightleftHeaderBg = '#F2F2F2';
const lightLeaveGrpBtn = '#F2F2F2';

const lightEmptyChatImg = `url("../images/bchat/emptyMessageWhite.svg")`;
// const lightBgDoodle = `url("../images/bchat/doodle_dark.svg")`;
const lightMsgReqImg = `url("../images/bchat/no_message_request.svg")`;
const lightBlockedContact = `url("../images/bchat/no_blocked_contacts.svg")`;
const lightAddContact = `url("../images/bchat/add_contact_white_theme.svg")`;
const lightEmptyContact = `url("../images/bchat/empty_address_book_White.svg")`;
const lightEmptyAddressBook = `url("../images/bchat/empty_address_book_White.svg")`;
const lightEmptyTransHistory = `url("../images/bchat/no_tx_history_white.svg")`;
const lightIncomingTransHistory = `url("../images/bchat/no_incoming_transaction_white.svg")`;
const whiteOutgoingTransHistory = `url("../images/bchat/no_outgoing_white.svg")`;
const lightPendingTransHistory = `url("../images/bchat/pending_tx_history_white.svg")`;
const lightFailedTransHistory = `url("../images/bchat/failed_tx_history_white.svg")`;
const lightEmptyTransaction = `url("../images/bchat/no_transactions_found_white.svg")`;
const lightNoMedia = `url("../images/bchat/no_mediaWhiteTheme.svg")`;
const lightChatHeader = '#F0F0F0';
const lightComposeMsgInput = '#F8F8F8';

const lightWalletNodeHeader = '#128B17';
const lightWalletSelectHover = '#D3D3D3';

const lightDayNight = `url("../images/bchat/moon.svg")`;
const lightNewChat = `url("../images/bchat/newChat_white.svg")`;
const lightBorderBottomColor = '#E3E3E3';
const lightToggleOff = '#F8F8F8';
const lightClearBtn = '#fff';

const lightBlockUserBg = '#EBEBEB';
const lightPasswordBorderBottom = '#D5D5D5';
const ligntDisableText = '#B9BABF';
const lightProfileBgColor = '#F8F8F8';
const whiteBubbleReceivedBg = '#F8F8F8';
const lightBlockseletedUserBg = '#FFFFFF';
const lightDownArrowBg = '#FFFFFF';
const lightDownArrow = '#A8A8C3';
// Toast Colors

// Seed color
//bns link color
const lightBnsLinkIdBgColor = '#EBEBEB';
const lightBnsCameraIconBgColor = '#FFFFFF';

//wallet
const lightWalcontentBg = '#E8E8E8';
const lightWalInputBg = '#F8F8F8';
const lightWalTransacBtn = '#DEDEDE';
const lightWalcancelBtn = '#F8F8F8';
const lightWalletSyncBar = '#EBEBEB';
const lightDownthickArrow = '#8F8FA2';
const lightDisableBtn = '#DEDEDE';
const lightDisableTxt = '#B1B1B1';
const lightWalPassword = `url("../images/bchat/passwordIconWhite.svg")`;
const lightWalDownThickArrow = `url("../images/wallet/downThickArrowWhite.svg")`;
const lightLeaveHover = '#D9D9D9';
const lightWalletCopyHover = '#EBEBEB';
const lightProfileClose = '#DDDDDD';
const lightChattimestamp = '#333333';
const lightBgModalColor = 'rgba(0, 0, 0, 0.6)';
const lightBnsTransactionColor = '#222222';

// revamp
const lightLogoBg = baseWhite;
const lightActionBtnBg = baseWhite;
const lightActionBtnicon = '#ACACAC';
const lightActionBtnTxt = '#333333';
const lightThemeSelectedBg = '#DEDEDE';
const lightLeftPaneBg = '#EBEBEB';
const lightSearchBorder = '#ACACAC';
const lightLastMsgTxt = '#858598';
const lightContextMenuBg = '#F8F8F8';
const lightProfileIdBg = '#EBEBEB';
const lightProfileIDBorder = '#C5C5C5';
const lightSecondaryBtnBg = '#F8F8F8';
const lightQrOuterBg = '#F8F8F8';
const lightSettingsRightPaneOption = '#EBEBEB';
const lightSettingHeaderBorder = '#ACACAC';
const lightToggleBtn = '#ACACAC';
const ligthSettingsRightPaneOptionBorder = '#ACACAC';
const lightHopBg = '#EBEBEB';
const lightHoptxt = '#333';
const lightRecoverySeedBg = '#F0F0F0';
const lightModalFooter = '#EBEBEB';
const lightUntrustMediaBg = '#EBEBEB';
const lightUntrustedVerticalBar = '#ACACAC';
const lightIconBtnHover = '#F8F8F8';
const lightContextMenuHoverBg = '#EBEBEB';
const lightWalletSyncBoxBg = '#F8F8F8';
const lightProfileHeaderBg = '#EBEBEB';
const lightChatIdBorder = '#C5C5C5';
const lightProfileInfoBorder = '#ACACAC';
const lightDisappearTimeHover = '#EBEBEB';
const lightProfileInfoMediaTitle = '#333333';
const lightModalBg = '#F8F8F8';
const lightModalIconBg = '#EBEBEB';
const lightChatMultiSelectBg = '#DDDDDD';
const lightConfirmModalInnerBg = '#EBEBEB';
const lightConfirmModalHoverBg = '#E4E4E4';
const lightEnableBtnBg = '#EBEBEB';
const lightModalDisableTxt = '#ACACAC';
const lightWalletStatusTxtBg = '#F8F8F8';
const lightWalletUnBalanceLabel = '#333333';
const lightWalletInnerBg = '#EBEBEB';
const lightNoTxnTxt = '#ACACAC';
const lightToastBg = '#F8F8F8';
const lightCallOptionBtnHover='#FFFFFF';
const lightSpeedPlayBg='#ACACAC';
const lightMoreInfoIncommingChatBg='#F0F0F0';
const lightCameraHoverBg ='#DADADA';
const lightSettingWalletBetaBg='#F8F8F8';
const lightSecondaryBtnHoverBg='#FFFFFF';
const lightPrimaryBtnHoverBg='#1A973C';
const lightOfflineContentBg='#F0F0F0';
const lightInputText = '#ACACAC';
const lightIconColor = '#3E4A53';
const lightInviteCardIconBg='#F8F8F8';

export const switchHtmlToLightTheme = () => {
  document.documentElement.style.setProperty('--color-body-bg:', lightColorBg);
  document.documentElement.style.setProperty('--color-profile', lightProfileBgColor);
  document.documentElement.style.setProperty('--color-accent', lightColorAccent);
  document.documentElement.style.setProperty('--color-accent-button', lightColorAccentButton);
  document.documentElement.style.setProperty('--color-text', lightColorText);
  document.documentElement.style.setProperty('--color-text-menu-highlighted', lightColorText);
  document.documentElement.style.setProperty('--color-text-subtle', lightColorTextSubtle);
  document.documentElement.style.setProperty('--color-text-accent', lightColorTextAccent);
  document.documentElement.style.setProperty('--color-text-opposite', lightColorTextOpposite);
  document.documentElement.style.setProperty('--color-text-signIn', lightSinginTextColor);
  // document.documentElement.style.setProperty('--color-Bchat-hint', lightHintColor);
  document.documentElement.style.setProperty('--color-bchat-shadow', lightColorBchatShadow);
  document.documentElement.style.setProperty('--color-copyModalbtn', lightCopyModalbtn);
  document.documentElement.style.setProperty('--color-disableText', ligntDisableText);
  document.documentElement.style.setProperty('--color-downArrow', lightDownArrow);
  document.documentElement.style.setProperty('--color-BgModalColor', lightBgModalColor);
  document.documentElement.style.setProperty(
    '--color-compose-view-button-background',
    lightColorComposeViewBg
  );
  document.documentElement.style.setProperty('--color-leaveGrpBtn', lightLeaveGrpBtn);
  document.documentElement.style.setProperty(
    '--color-sent-message-background',
    lightColorSentMessageBg
  );
  document.documentElement.style.setProperty(
    '--color-settings-leftpane-options-hover',
    lightSettingsleftpaneHover
  );
  document.documentElement.style.setProperty('--color-settings-options-hover', lightSettingsHover);
  document.documentElement.style.setProperty('--color-sent-message-text', darkColorSentMessageText);
  document.documentElement.style.setProperty(
    '--color-clickable-hovered',
    lightColorClickableHovered
  );
  document.documentElement.style.setProperty('--color-bchat-border', lightColorBchatBorder);
  // document.documentElement.style.setProperty(
  //   '--color-bchat-border',
  //   lightColorBchatBorderColor
  // );
  document.documentElement.style.setProperty(
    '--color-recovery-phrase-banner-background',
    lightColorRecoveryPhraseBannerBg
  );
  document.documentElement.style.setProperty('--color-pill-divider', lightColorPillDivider);
  document.documentElement.style.setProperty(
    '--color-last-seen-indicator',
    lightColorLastSeenIndicator
  );
  document.documentElement.style.setProperty(
    '--color-quote-bottom-bar-background',
    lightColorQuoteBottomBarBg
  );
  document.documentElement.style.setProperty('--color-cell-background', lightColorCellBackground);
  document.documentElement.style.setProperty(
    '--color-received-message-text',
    lightColorReceivedMessageText
  );
  document.documentElement.style.setProperty(
    '--color-received-message-background',
    lightColorReceivedMessageBg
  );
  document.documentElement.style.setProperty(
    '--color-received-message-background-hover',
    whiteColorReceivedMessageBgHover
  );
  document.documentElement.style.setProperty(
    '--color-pill-divider-text',
    lightColorPillDividerText
  );
  document.documentElement.style.setProperty('--color-input-background', lightInputBackground);
  document.documentElement.style.setProperty('--filter-bchat-text', lightFilterBchatText);
  document.documentElement.style.setProperty('--border-unread', lightUnreadBorder);

  document.documentElement.style.setProperty('--color-scroll-bar-thumb', lightScrollbarThumb);
  document.documentElement.style.setProperty('--color-scroll-bar-track', lightScrollbarTrack);
  document.documentElement.style.setProperty(
    '--color-fake-chat-bubble-background',
    lightFakeChatBubbleBg
  );
  document.documentElement.style.setProperty('--color-inbox-background', lightInboxBackground);
  document.documentElement.style.setProperty(
    '--color-left-pane-overlay-background',
    lightLeftPaneOverlayBg
  );
  document.documentElement.style.setProperty(
    '--color-conversation-item-selected',
    lightConversationItemSelected
  );
  document.documentElement.style.setProperty(
    '--color-conversation-item-has-unread',
    lightConversationItemHasUnread
  );
  document.documentElement.style.setProperty('--color-conversation-list', lightConversationList);

  document.documentElement.style.setProperty('--color-text-highlight', lightTextHighlight);
  document.documentElement.style.setProperty('--color-background-primary', lightBackgroundPrimary);
  document.documentElement.style.setProperty('--color-button-green', lightButtonGreen);
  document.documentElement.style.setProperty('--color-modal-background', lightModalBackground);
  document.documentElement.style.setProperty('--border-bchat', lightColorBchatBorder);
  document.documentElement.style.setProperty(
    '--color-request-banner-background',
    lightMessageRequestBannerBackground
  );
  document.documentElement.style.setProperty(
    '--color-request-banner-icon-background',
    lightMessageRequestBannerIconBackground
  );
  document.documentElement.style.setProperty(
    '--color-request-banner-unread-background',
    lightMessageRequestBannerUnreadBackground
  );
  document.documentElement.style.setProperty(
    '--color-request-banner-icon',
    lightMessageRequestBannerIcon
  );

  document.documentElement.style.setProperty('--color-settingIndication', lightSettingIndication);
  // document.documentElement.style.setProperty(
  //   '--color-unreadBg',
  //   lightunreadBg
  // );
  document.documentElement.style.setProperty('--color-leftHeaderBg', lightleftHeaderBg);
  document.documentElement.style.setProperty('--color-borderBottomColor', lightBorderBottomColor);
  document.documentElement.style.setProperty('--color-composeMsgInput', lightComposeMsgInput);

  document.documentElement.style.setProperty('--color-walletNodeHeader', lightWalletNodeHeader);
  document.documentElement.style.setProperty('--color-walletSelectOption', lightWalletSelectHover);
  document.documentElement.style.setProperty('--color-MsgReqModal-bg', lightMsgReqModalBg);
  document.documentElement.style.setProperty('--color-smModal-bg', lightSmModalBg);
  document.documentElement.style.setProperty('--color-cancelBtn-bg', lightCancelBtnBg);
  document.documentElement.style.setProperty('--color-chatHeader', lightChatHeader);
  document.documentElement.style.setProperty('--color-blockUserBg', lightBlockUserBg);
  document.documentElement.style.setProperty('--color-blockseletedUserBg', lightBlockseletedUserBg);
  document.documentElement.style.setProperty('--color-downArrowBg', lightDownArrowBg);

  document.documentElement.style.setProperty(
    '--color-password-borderBottom',
    lightPasswordBorderBottom
  );
  document.documentElement.style.setProperty('--color-toggleOff', lightToggleOff);

  document.documentElement.style.setProperty('--color-clearBtn', lightClearBtn);
  document.documentElement.style.setProperty('--color-caret', darkColorCellBackground);
  document.documentElement.style.setProperty('--color-profile-close', lightProfileClose);
  document.documentElement.style.setProperty('--color-chat-timestamp', lightChattimestamp);
  document.documentElement.style.setProperty('--color-wallet-copy-hover', lightWalletCopyHover);
  document.documentElement.style.setProperty('--image-DayNight', lightDayNight);
  document.documentElement.style.setProperty('--image-addContact', lightNewChat);

  document.documentElement.style.setProperty('--image-EmptyChatImg', lightEmptyChatImg);
  // document.documentElement.style.setProperty('--image-BgDoodle', lightBgDoodle);
  document.documentElement.style.setProperty('--image-MsgReq', lightMsgReqImg);
  document.documentElement.style.setProperty('--image-BlockedContact', lightBlockedContact);
  document.documentElement.style.setProperty('--image-AddContact', lightAddContact);
  document.documentElement.style.setProperty('--image-EmptyContact', lightEmptyContact);
  document.documentElement.style.setProperty('--image-EmptyAddressBook', lightEmptyAddressBook);
  document.documentElement.style.setProperty('--image-emptyTransHistory', lightEmptyTransHistory);
  document.documentElement.style.setProperty(
    '--image-outgoingTransHistory',
    whiteOutgoingTransHistory
  );
  document.documentElement.style.setProperty(
    '--image-incomingTransHistory',
    lightIncomingTransHistory
  );
  document.documentElement.style.setProperty(
    '--image-pendingTransHistory',
    lightPendingTransHistory
  );
  document.documentElement.style.setProperty('--image-failedTransHistory', lightFailedTransHistory);
  document.documentElement.style.setProperty('--image-emptySearch', lightEmptyTransaction);
  document.documentElement.style.setProperty('--image-NoMedia', lightNoMedia);
  document.documentElement.style.setProperty('--green-color', greenColor);
  // document.documentElement.style.setProperty('--button-color', buttonColor);
  document.documentElement.style.setProperty(
    '--message-bubbles-received-background-color',
    whiteBubbleReceivedBg
  );
  document.documentElement.style.setProperty('--color-leave-button', lightLeaveHover);

  // bns link selectors
  document.documentElement.style.setProperty('--color-BnsLinkIdBg', lightBnsLinkIdBgColor);
  document.documentElement.style.setProperty('--color-BnsCameraIconBg', lightBnsCameraIconBgColor);

  //wallet
  document.documentElement.style.setProperty('--color-WalcontentBg', lightWalcontentBg);
  document.documentElement.style.setProperty('--color-walInputBg', lightWalInputBg);
  document.documentElement.style.setProperty('--color-walTransacBtn', lightWalTransacBtn);
  document.documentElement.style.setProperty('--color-walcancelBtn', lightWalcancelBtn);
  document.documentElement.style.setProperty('--color-walSyncbar', lightWalletSyncBar);
  document.documentElement.style.setProperty('--color-walDownthickArrow', lightDownthickArrow);
  document.documentElement.style.setProperty('--color-disableBtn', lightDisableBtn);
  document.documentElement.style.setProperty('--color-disableTxt', lightDisableTxt);

  document.documentElement.style.setProperty('--img-walPassword', lightWalPassword);
  document.documentElement.style.setProperty('--img-walDownThickArrow', lightWalDownThickArrow);
  document.documentElement.style.setProperty('--color-bns-transaction', lightBnsTransactionColor);

  // revamp
  document.documentElement.style.setProperty('--color-logo-bg', lightLogoBg);
  document.documentElement.style.setProperty('--color-action-btn-bg', lightActionBtnBg);
  document.documentElement.style.setProperty('--color-action-btn-icon', lightActionBtnicon);
  document.documentElement.style.setProperty('--color-action-btn-txt', lightActionBtnTxt);
  document.documentElement.style.setProperty('--color-theme-selected-bg', lightThemeSelectedBg);
  document.documentElement.style.setProperty('--color-left-pane-bg', lightLeftPaneBg);
  document.documentElement.style.setProperty('--color-search-border', lightSearchBorder);
  document.documentElement.style.setProperty('--color-left-pane-bg', lightLeftPaneBg);
  document.documentElement.style.setProperty('--color-last-msg-txt', lightLastMsgTxt);
  document.documentElement.style.setProperty('--color-context-menu-bg', lightContextMenuBg);
  document.documentElement.style.setProperty('--color-profile-id-bg', lightProfileIdBg);
  document.documentElement.style.setProperty('--color-profile-id-border', lightProfileIDBorder);
  document.documentElement.style.setProperty('--color-secondary-btn-bg', lightSecondaryBtnBg);
  document.documentElement.style.setProperty('--color-qr-outer-bg', lightQrOuterBg);
  document.documentElement.style.setProperty(
    '--color-settings-right-pane-option',
    lightSettingsRightPaneOption
  );
  document.documentElement.style.setProperty(
    '--color-setting-header-border',
    lightSettingHeaderBorder
  );
  document.documentElement.style.setProperty('--color-toggle-btn', lightToggleBtn);
  document.documentElement.style.setProperty(
    '--color-settings-right-pane-option-border',
    ligthSettingsRightPaneOptionBorder
  );
  document.documentElement.style.setProperty('--color-hop-bg', lightHopBg);
  document.documentElement.style.setProperty('--color-hop-txt', lightHoptxt);
  document.documentElement.style.setProperty('--color-recovery-seed-bg', lightRecoverySeedBg);
  document.documentElement.style.setProperty('--color-modal-footer', lightModalFooter);
  document.documentElement.style.setProperty('--color-untrust-media-bg', lightUntrustMediaBg);
  document.documentElement.style.setProperty(
    '--color-untrusted-vertical-bar',
    lightUntrustedVerticalBar
  );
  document.documentElement.style.setProperty('--color-icon-btn-hover', lightIconBtnHover);
  document.documentElement.style.setProperty(
    '--color-context-menu-hover-bg',
    lightContextMenuHoverBg
  );
  document.documentElement.style.setProperty('--color-wallet-Sync-box-bg', lightWalletSyncBoxBg);
  document.documentElement.style.setProperty('--color-profile-header-bg', lightProfileHeaderBg);
  document.documentElement.style.setProperty('--color-chatId-border', lightChatIdBorder);
  document.documentElement.style.setProperty('--color-profile-info-border', lightProfileInfoBorder);
  document.documentElement.style.setProperty(
    '--color-disappear-time-hover',
    lightDisappearTimeHover
  );
  document.documentElement.style.setProperty(
    '--color-profile-info-media-title',
    lightProfileInfoMediaTitle
  );
  document.documentElement.style.setProperty('--color-modal-bg', lightModalBg);
  document.documentElement.style.setProperty('--color-modal-icon-bg', lightModalIconBg);
  document.documentElement.style.setProperty(
    '--color-chat-multi-select-bg',
    lightChatMultiSelectBg
  );
  document.documentElement.style.setProperty(
    '--color-confirm-modal-inner-bg',
    lightConfirmModalInnerBg
  );
  document.documentElement.style.setProperty(
    '--color-confirm-modal-hover-bg',
    lightConfirmModalHoverBg
  );
  document.documentElement.style.setProperty('--color-enable-btn-bg', lightEnableBtnBg);
  document.documentElement.style.setProperty('--color-modal-disable-txt', lightModalDisableTxt);
  document.documentElement.style.setProperty(
    '--color-wallet-status-txt-Bg',
    lightWalletStatusTxtBg
  );
  document.documentElement.style.setProperty(
    '--color-wallet-unbalance-label',
    lightWalletUnBalanceLabel
  );
  document.documentElement.style.setProperty('--color-wallet-inner-bg', lightWalletInnerBg);
  document.documentElement.style.setProperty('--color-noTxn-txt', lightNoTxnTxt);
  document.documentElement.style.setProperty('--color-toast-bg', lightToastBg);
  document.documentElement.style.setProperty('--color-call-option-btn-hover', lightCallOptionBtnHover);
  document.documentElement.style.setProperty('--color-speedPlay-bg', lightSpeedPlayBg);
  document.documentElement.style.setProperty('--color-moreInfo-incomming-chat-bg', lightMoreInfoIncommingChatBg);
  document.documentElement.style.setProperty('--color-camera-hover-bg', lightCameraHoverBg);
  document.documentElement.style.setProperty('--color-setting-wallet-beta-bg', lightSettingWalletBetaBg);
  document.documentElement.style.setProperty('--color-secondary-btn-hover-bg', lightSecondaryBtnHoverBg);
  document.documentElement.style.setProperty('--color-primary-btn-hover-bg', lightPrimaryBtnHoverBg);
  document.documentElement.style.setProperty('--color-offline-content-bg', lightOfflineContentBg);
  document.documentElement.style.setProperty('--color-input-text', lightInputText);
  document.documentElement.style.setProperty('--color-icon', lightIconColor);
  document.documentElement.style.setProperty('--color-invite-card-icon-bg', lightInviteCardIconBg);
};

// default to light theme
export const BchatGlobalStyles = createGlobalStyle`
  html {
    /* FONTS */
    --font-default:  'Poppins';
    --font-font-accent:  'Loor';
    --font-font-mono:  'SpaceMono';
    --font-size-xs:  11px;
    --font-size-sm:  13px;
    --font-size-md:  15px;

    /* MARGINS */
    --margins-xs:  5px;
    --margins-sm:  10px;
    --margins-md:  15px;
    --margins-lg:  20px;

    /* ANIMATIONS */
    --default-duration: '0.25s';
    /* FILTERS */
    --filter-bchat-text: ${darkFilterBchatText};
    /* BORDERS */
    --border-unread: ${darkUnreadBorder};
    --border-bchat:  ${darkColorBchatBorder};

    /* COLORS NOT CHANGING BETWEEN THEMES */
    --color-body-bg:${bodyBg};
    --color-warning:  ${warning};
    --color-destructive:  ${destructive};
    /* COLORS */
    --color-accent: ${darkColorAccent};
    --color-accent-button:  ${darkColorAccentButton};
    
    --color-text:  ${darkColorText};
    --color-text-subtle:  ${darkColorTextSubtle};
    --color-text-accent:  ${darkColorTextAccent};
    --color-text-opposite:  ${darkColorTextOpposite};
    --color-text-signIn:${darkSinginTextColor};
    /* --color-Bchat-hint: ${darkHintColor}; */
    --color-bchat-shadow: ${darkColorBchatShadow};
    --color-compose-view-button-background: ${darkColorComposeViewBg};
    --color-sent-message-background:  ${darkColorSentMessageBg};
    --color-settings-leftpane-options-hover: ${darkSettingsleftPaneHover};
    --color-settings-options-hover: ${darkSettingsHover};
    --color-sent-message-text:  ${darkColorSentMessageText};
    --color-clickable-hovered: ${darkColorClickableHovered};
    --color-bchat-border:  ${darkColorBchatBorder};
    --color-recovery-phrase-banner-background: ${darkColorRecoveryPhraseBannerBg};
    --color-pill-divider:  ${darkColorPillDivider};
    --color-last-seen-indicator: ${darkColorLastSeenIndicator};
    --color-quote-bottom-bar-background:  ${darkColorQuoteBottomBarBg};
    --color-cell-background: ${darkColorCellBackground};
    --color-pill-divider-text:  ${darkColorPillDividerText};
    --color-input-background: ${darkInputBackground};
    --color-scroll-bar-thumb: ${darkScrollbarThumb};
    --color-scroll-bar-track: ${darkScrollbarTrack};
    --color-fake-chat-bubble-background: ${darkFakeChatBubbleBg};
    --color-inbox-background: ${darkInboxBackground};
    --color-left-pane-overlay-background: ${darkLeftPaneOverlayBg};
    --color-conversation-item-selected: ${darkConversationItemSelected};
    --color-conversation-item-has-unread: ${darkConversationItemHasUnread};
    --color-conversation-list: ${darkConversationList};
    --color-text-highlight: ${darkTextHighlight};
 

    --color-modal-background: ${darkModalBackground};
    --color-leftHeaderBg:${darkleftHeaderBg};
    --color-leaveGrpBtn:${darkLeaveGrpBtn}

    --color-MsgReqModal-bg:${darkMsgReqModalBg};
    --color-smModal-bg:${darkSmModalBg};
    --color-cancelBtn-bg:${darkCancelBtnBg};
  
    --color-borderBottomColor:${darkBorderBottomColor};
    --color-HintMessageText:${darkHintMessage};
    
  
    --color-composeMsgInput:${darkComposeMsgInput}
    
  
    --color-walletNodeHeader:${darkWalletNodeHeader}
    --color-walletSelectOption:${darkWalletSelectHover};
    --color-settingIndication:${darkSettingIndication};
    --color-copyModalbtn:${darkCopyModalbtn}

    --color-toggleOff:${darkToggleOff};
    --color-clearBtn:${darkClearBtn};
    --button-color:${buttonColor};
    
    --color-blockUserBg:${darkBlockUserBg};
    --color-downArrowBg:${darkDownArrowBg};
    --color-downArrow:${darkDownArrow}
   
  
    --color-disableText:${darkDisableText};
   
    
    --color-blockseletedUserBg:${darkBlockseletedUserBg};

    --color-profile: ${darkProfileBgColor};
    --color-BnsLinkIdBg:${darkBnsLinkIdBgColor};
   

    --color-caret:${lightColorCellBackground};
    --color-profile-close: ${darkProfileClose};
    --color-chat-timestamp:${darkChatTimestamp};
    --color-WalcontentBg:${darkWalcontentBg};
    --color-walInputBg:${darkWalInputBg};
    --color-walTransacBtn:${darkWalTransacBtn};
    --color-walcancelBtn:${darkWalcancelBtn};
    --color-walSyncbar:${darkWalletSyncBar};
    --color-walDownthickArrow:${darkDownthickArrow};
    --color-disableBtn :${darkDisableBtn};
    --color-disableTxt:${darkDisableTxt};
    --color-leave-button:${darkLeaveHover};
    --color-text:${darkColorText};
    --color-BgModalColor:${darkBgModalColor};
    --color-bns-transaction:${darkBnsTransactionColor};

    --color-logo-bg:${darklogoBg};
    --color-action-btn-bg:${darkActionBtnBg};
    --color-action-btn-icon:${darkActionBtnicon};
    --color-action-btn-txt:${darkActionBtnTxt};
    --color-theme-selected-bg:${darkThemeSelectedBg};
    --color-left-pane-bg: ${darkLeftPaneBg};
    --color-search-border:${darkSearchBorder};
    --color-last-msg-txt:${darkLastMsgTxt};
    --color-context-menu-bg:${darkContextMenuBg};
    --color-profile-id-bg:${darkProfileIdBg};
    --color-profile-id-border:${darkProfileIDBorder};
    --color-secondary-btn-bg:${darkSecondaryBtnBg};
    --color-secondary-btn-hover-bg:${darkSecondaryBtnHoverBg};
    --color-primary-btn-hover-bg:${darkPrimaryBtnHoverBg};
    --color-qr-outer-bg:${darkQrOuterBg};
    --color-settings-right-pane-option:${darkSettingsRightPaneOption};
    --color-setting-header-border:${darksettingHeaderBorder};
    --color-toggle-btn:${darkToggleBtn};
    --color-settings-right-pane-option-border:${darkSettingsRightPaneOptionBorder};
    --color-hop-bg:${darkHopBg};
    --color-hop-txt:${darkHopTxt};
    --color-recovery-seed-bg:${darkRecoverySeedBg};
    --color-modal-footer:${darkModalFooter};
    --color-untrust-media-bg:${darkUntrustMediaBg};
    --color-untrusted-vertical-bar:${darkUntrustedVerticalBar};
    --color-icon-btn-hover:${darkIconBtnHover};
    --color-context-menu-hover-bg:${darkContextMenuHoverBg};
    --color-wallet-Sync-box-bg:${darkWalletSyncBoxBg};
    --color-profile-header-bg:${darkProfileHeaderBg};
    --color-chatId-border:${darkChatIdBorder};
    --color-profile-info-border:${darkProfileInfoBorder};
    --color-disappear-time-hover:${darkDisappearTimeHover};
    --color-profile-info-media-title:${darkProfileInfoMediaTitle};
    --color-modal-bg:${darkModalBg};
    --color-modal-icon-bg:${darkModalIconBg};
    --color-chat-multi-select-bg:${darkChatMultiSelectBg};
    --color-confirm-modal-inner-bg:${darkConfirmModalInnerBg};
    --color-confirm-modal-hover-bg:${darkConfirmModalHoverBg};
    --color-enable-btn-bg:${darkEnableBtnBg};
    --color-modal-disable-txt:${darkModalDisableTxt};
    --color-wallet-status-txt-Bg:${darkWalletStatusTxtBg};
    --color-wallet-unbalance-label:${darkWalletUnBalanceLabel};
    --color-wallet-inner-bg:${darkWalletInnerBg};
    --color-noTxn-txt:${darkNoTxnTxt};
    --color-toast-bg:${darkToastBg};
    --color-call-option-btn-hover:${darkCallOptionBtnHover};
    --color-speedPlay-bg:${darkSpeedPlayBg};
    --color-moreInfo-incomming-chat-bg:${darkMoreInfoIncommingChatBg};
    --color-camera-hover-bg:${darkCameraHoverBg};
    --color-setting-wallet-beta-bg:${darkSettingWalletBetaBg};
    --color-offline-content-bg:${darkOfflineContentBg};
    --color-input-text:${darkInputText};
    --color-icon:${darkIconColor};
    --color-invite-card-icon-bg:${darkInviteCardIconBg};

    

    --image-EmptyChatImg:${darkEmptyChatImg};
    --image-DayNight:${darkDayNight};
    --image-addContact:${darkNewChat};
    --image-MsgReq:${darkMsgReqImg};
    --image-BlockedContact:${darkBlockedContact};
    --image-AddContact:${darkAddContact};
    --image-EmptyContact:${darkEmptyContact};
    --image-EmptyAddressBook:${darkEmptyAddressBook};
    --image-emptyTransHistory':${darkEmptyTransHistory};
    --image-outgoingTransHistory: ${darkOutgoingTransHistory};
    --image-incomingTransHistory:${darkIncomingTransHistory};
    --image-pendingTransHistory:${darkPendingTransHistory};
    --image-failedTransHistory':${darkFailedTransHistory};
    --image-emptySearch:${darkEmptyTransaction};
    --image-NoMedia:${darkNoMedia};
    --message-bubbles-received-background-color:${darkbubbleReceivedBg};
    --img-walPassword:${darkWalPassword};
    --img-walDownThickArrow:${darkWalDownThickArrow};
    

  };
`;

export const BchatTheme = ({ children }: { children: any }) => (
  <>
    <BchatGlobalStyles />
    {children}
  </>
);
