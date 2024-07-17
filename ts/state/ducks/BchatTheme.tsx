import React from 'react';

import { createGlobalStyle } from 'styled-components';

const white = '#F2F2F2';
const black = '#131313';
const warning = '#e7b100';
const destructive = '#ff453a';
const accentLightTheme = '#159B24';
const accentDarkTheme = '#2879FB';
// const borderLightThemeColor = '#f1f1f1';
// const borderDarkThemeColor = '#ffffff0F';
const baseColor = '#00A803';
const greyColor = '#2D2D3B';
const lightGreyColor = '#646474';
const greenColor = '#108D32';
const forestGreenColor="#00A638";

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
const darkColorClickableHovered = '#242431';
const darkColorBchatBorder = `2px solid #1A1A24`;
// const darkColorBchatBorderColor = borderDarkThemeColor;
const darkColorRecoveryPhraseBannerBg = '#1f1f1f';
const darkColorPillDivider = '#3E3E4E';
const darkColorLastSeenIndicator = accentDarkTheme;
const darkColorQuoteBottomBarBg = '#34323F';
const darkColorCellBackground = '#181821';
const darkColorReceivedMessageBg = '#34323F';
const darkColorReceivedMessageBgHover = '#52505F';
const darkColorReceivedMessageText = white;

const darkColorPillDividerText = '#a0a0a0';
// const darkInputBackground = darkColorCellBackground;
const darkInputBackground = '#22222E';

const darkFilterBchatText = 'none';
const darkUnreadBorder = `4px solid ${accentDarkTheme}`;

const darkScrollbarThumb = '#504D5D';
const darkScrollbarTrack = '#1C1C26';
const darkFakeChatBubbleBg = '#212121';

const darkInboxBackground = '#131313';
const darkLeftPaneOverlayBg = darkInboxBackground;
const darkConversationItemSelected = '#303041';
const darkConversationItemHasUnread = '#39394A';
const darkConversationList = darkScrollbarTrack;

const darkTextHighlight = `${white}88`;
const darkForegroundPrimary = white;
const darkBackgroundPrimary = '#3A3A4E';
const darkButtonGreen = baseColor;
const darkModalBackground = '#101011';
const darkDisableBorder = '#66667C';

const grey67 = '#1BB51E';
const darkMessageRequestBannerBackground = darkConversationItemHasUnread;
const darkMessageRequestBannerIconBackground = '#2879FB';
const darkMessageRequestBannerUnreadBackground = grey67;
const darkMessageRequestBannerIcon = '#adadad';
const darkcomposeMsgRecordIcon = '#85858F';
const darkWalletNodeHeader = '#20d024';
const darkWalletSelectHover = '#545469';
const darkWalletPriorityHover = '#303042';
const darkWalletCopyHover = '#52505F';
const darkAddMembers = '#313143';
const darkProfileClose = '#4C4C64';
const darkChatTimestamp = '#FFFFFF';

// for bchat
const darkColorBg = black;
// const darkunreadBg="#39394A";
const darkBorderBottomColor = '#1A1A24';
const darkInboxBgColor = '#3A3A4E';
const darkHintMessage = '#7B7B86';
const darkTextAreaColor = '#0BB70F';
const darkComposeMsgBg = '#2B2B38';
const darkComposeMsgIconBG = '#2879FB';
const darkSettingIndication = greyColor;
const darkProfileBgColor = '#2A2A3B';
const darkSinginTextColor = '#128B17';
const darkHintColor = lightGreyColor;
// const darkCopyIcon = '#fff';
// const darkCopyIconBg = '#353543';
const darkCopyModalbtn = '#444455';
const darkChatHeader = '#1c1c26';
const darkToggleOff = '#000';
const darkClearBtn = '#3D3D4D';
const darkLeaveGrpBtn = '#20202F';
const darkSmModalBg = '#2A2A3B';
const darkMsgReqModalBg = 'rgba(0,0,0,0.4)';
const darkOverlayBg = '#1C1C26';
const darkleftHeaderBg = '#1C1C26';
const darkCancelBtnBg = '#3D3D4E';
const darkDisableText = '#545469';
const darkEmptyChatImg = `url("../images/bchat/emptyMessage.svg")`;
// const darkBgDoodle = `url("../images/bchat/doodle_white.svg")`;
const darkEmptyContact = `url("../images/bchat/no_con_scrt_grp_dark_theme.svg")`;
const darkEmptyAddressBook = `url("../images/bchat/empty_address_book_dark.svg")`;
const darkEmptyTransHistory = `url("../images/bchat/no_tx_history_dark.svg")`;
const darkPendingTransHistory = `url("../images/bchat/pending_tx_history_dark.svg")`;
const darkOutgoingTransHistory = `url("../images/bchat/no_outgoing_dark.svg")`;
const darkIncomingTransHistory = `url("../images/bchat/no_incoming_transaction_dark.svg")`;
const darkFailedTransHistory = `url("../images/bchat/failed_tx_history_dark.svg")`;
const darkEmptyTransaction = `url("../images/bchat/no_transactions_found_dark.svg")`;
const darkWalletSyncing = `url("../images/bchat/wallet_syncing_dark.svg")`;
const darkChatIcons = 'white';
const darkComposeMsgInput = '#3F3C4B';
const darkDayNight = `url("../images/bchat/light_theme.svg")`;
const darkNewChat = `url("../images/bchat/newChat_dark.svg")`;
const darkMsgReqImg = `url("../images/bchat/no_message_request_dark_theme.svg")`;
const darkBlockedContact = `url("../images/bchat/no_blocked_contacts_dark_theme.svg")`;
const darkAddContact = `url("../images/bchat/add_contact.svg")`;
const darkNoMedia = `url("../images/bchat/no_mediaDarkTheme.svg")`;

const darkToastSuccessMessage =
  'linear-gradient(to right,rgba(12, 43, 18, 0.8),rgba(4,35,38,0.8),rgba(28,28,38,0.8))';
const darkToastErrorMessage =
  'linear-gradient(to right,rgba(56,13,13,0.8),rgba(38,4,4,0.8),rgba(28,28,38,0.8))';
const darkLeftpaneSetting = darkScrollbarTrack;
const darkBlockUserBg = '#2D2D3B';
const darkBlockseletedUserBg = '##2C2C3E';

const darkPasswordBorderBottom = '#444455';
const darkRightpaneSetting = '#16161D';
const darkbubbleReceivedBg = '#373746';

const buttonColor = forestGreenColor;
// const buttonColor = "linear-gradient(to bottom , #13B71A, #006004)";
const darkAudioRecord = '#3F3C4B';

// Seed color
const darkSeedColor = '#00E506';
// Bns link colors
const darkBnsLinkIdBgColor = '#3A3A4E';
const darkBnsLinkInputBgColor = '#353543';
const darkBnsCameraIconBgColor = '#22222E';

//wallet
const darkWalcontentBg = '#303041';
const darkWalcontentBgHover = '#60607B';
const darkWalInputBg = '#1c1c26';
const darkWalunlockbal = '#444455';
const darkWalTransacBtn = '#444455';
const darkWalQrOutline = '#1c1c26';
const darkWalPopuphover = '#444457';
const darkWalcancelBtn = '#403e4b';
const darkWalAddressBookCopy = '#535364';
const darkWalletSyncBar = '#444455';
const darkDownthickArrow = '#fff';
const darkDisableBtn = '#444455';
const darkDisableTxt = '#8F8FA2';
const darkConfirmAddress = '#A1A1BC';
const darkDownArrowBg = '#525262';
const darkDownArrow = '#CACAD8';
const darkLeaveHover = '#4f4f65';
const darkCopyHover = '#008C04';
const darkAddressBookCopy = '#009D17';
const darkBgModalColor = 'rgba(0, 0, 0, 0.8)';

const darkWalDownThickArrow = `url("../images/wallet/downThickarrow.svg")`;
const darkWalPassword = `url("../images/wallet/Password_image.svg")`;
const darkBnsTransactionColor = '#FFFFFF';

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
  document.documentElement.style.setProperty('--color-foreground-primary', darkForegroundPrimary);
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
  document.documentElement.style.setProperty('--color-overlayBg', darkOverlayBg);
  document.documentElement.style.setProperty('--color-leaveGrpBtn', darkLeaveGrpBtn);
  document.documentElement.style.setProperty('--color-borderBottomColor', darkBorderBottomColor);
  document.documentElement.style.setProperty('--color-inboxBgColor', darkInboxBgColor);
  document.documentElement.style.setProperty('--color-HintMessageText', darkHintMessage);

  document.documentElement.style.setProperty('--color-TextAreaColor', darkTextAreaColor);
  document.documentElement.style.setProperty('--color-leftHeaderBg', darkleftHeaderBg);
  document.documentElement.style.setProperty('--color-composeMsgBg', darkComposeMsgBg);
  document.documentElement.style.setProperty('--color-composeMsgInput', darkComposeMsgInput);

  document.documentElement.style.setProperty('--color-composeMsgIconBG', darkComposeMsgIconBG);
  document.documentElement.style.setProperty('--color-smModal-bg', darkSmModalBg);
  document.documentElement.style.setProperty('--color-MsgReqModal-bg', darkMsgReqModalBg);
  document.documentElement.style.setProperty('--color-cancelBtn-bg', darkCancelBtnBg);
  document.documentElement.style.setProperty('--color-settingIndication', darkSettingIndication);
  document.documentElement.style.setProperty('--color-chatHeader', darkChatHeader);
  document.documentElement.style.setProperty('--color-blockseletedUserBg', darkBlockseletedUserBg);
  document.documentElement.style.setProperty('--color-disableBorder', darkDisableBorder);
  document.documentElement.style.setProperty('--color-downArrowBg', darkDownArrowBg);
  document.documentElement.style.setProperty('--color-downArrow', darkDownArrow);

  document.documentElement.style.setProperty('--color-chatIcons', darkChatIcons);

  document.documentElement.style.setProperty(
    '--color-composeMsgRecordIcon',
    darkcomposeMsgRecordIcon
  );
  document.documentElement.style.setProperty('--color-walletNodeHeader', darkWalletNodeHeader);
  document.documentElement.style.setProperty('--color-walletSelectOption', darkWalletSelectHover);
  document.documentElement.style.setProperty(
    '--color-walletPriorityHover',
    darkWalletPriorityHover
  );
  document.documentElement.style.setProperty('--color-leftpaneSetting', darkLeftpaneSetting);
  document.documentElement.style.setProperty('--color-blockUserBg', darkBlockUserBg);

  document.documentElement.style.setProperty(
    '--color-password-borderBottom',
    darkPasswordBorderBottom
  );
  document.documentElement.style.setProperty('--color-rightpaneSetting', darkRightpaneSetting);
  document.documentElement.style.setProperty('--color-toggleOff', darkToggleOff);
  document.documentElement.style.setProperty('--color-clearBtn', darkClearBtn);
  document.documentElement.style.setProperty('--color-clearBtn', darkClearBtn);
  document.documentElement.style.setProperty('--color-disableText', darkDisableText);
  document.documentElement.style.setProperty('--color-toast-success', darkToastSuccessMessage);
  document.documentElement.style.setProperty('--color-toast-error', darkToastErrorMessage);
  document.documentElement.style.setProperty('--color-caret', lightColorCellBackground);
  document.documentElement.style.setProperty('--color-copy-hover', darkCopyHover);
  document.documentElement.style.setProperty('--color-add-member', darkAddMembers);
  document.documentElement.style.setProperty('--color-profile-close', darkProfileClose);
  document.documentElement.style.setProperty('--color-chat-timestamp', darkChatTimestamp);
  document.documentElement.style.setProperty('--color-addressbook-copy-hover', darkAddressBookCopy);
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
  document.documentElement.style.setProperty('--image-walletSyncing', darkWalletSyncing);
  document.documentElement.style.setProperty('--image-NoMedia', darkNoMedia);
  document.documentElement.style.setProperty('--green-color', greenColor);
  // document.documentElement.style.setProperty('--button-color', buttonColor);
  document.documentElement.style.setProperty('--color-audio-record', darkAudioRecord);
  document.documentElement.style.setProperty('--color-seed', darkSeedColor);
  document.documentElement.style.setProperty(
    '--message-bubbles-received-background-color',
    darkbubbleReceivedBg
  );
  //Bns link chatid
  document.documentElement.style.setProperty('--color-BnsLinkIdBg', darkBnsLinkIdBgColor);
  document.documentElement.style.setProperty('--color-BnsLinkInputBg', darkBnsLinkInputBgColor);
  document.documentElement.style.setProperty('--color-BnsCameraIconBg', darkBnsCameraIconBgColor);
  //wallet
  document.documentElement.style.setProperty('--color-WalcontentBg', darkWalcontentBg);
  document.documentElement.style.setProperty('--color-WalcontentBgHover', darkWalcontentBgHover);
  document.documentElement.style.setProperty('--color-walInputBg', darkWalInputBg);
  document.documentElement.style.setProperty('--color-walunlockbal', darkWalunlockbal);
  document.documentElement.style.setProperty('--color-walTransacBtn', darkWalTransacBtn);
  document.documentElement.style.setProperty('--color-walQrOutline', darkWalQrOutline);
  document.documentElement.style.setProperty('--color-walPopuphover', darkWalPopuphover);
  document.documentElement.style.setProperty('--color-walcancelBtn', darkWalcancelBtn);
  document.documentElement.style.setProperty('--color-walAddressBookCopy', darkWalAddressBookCopy);
  document.documentElement.style.setProperty('--color-walSyncbar', darkWalletSyncBar);
  document.documentElement.style.setProperty('--color-walDownthickArrow', darkDownthickArrow);
  document.documentElement.style.setProperty('--color-disableBtn', darkDisableBtn);
  document.documentElement.style.setProperty('--color-disableTxt', darkDisableTxt);
  document.documentElement.style.setProperty('--color-confirmAddress', darkConfirmAddress);
  document.documentElement.style.setProperty('--color-BgModalColor', darkBgModalColor);
  document.documentElement.style.setProperty('--img-walPassword', darkWalPassword);
  document.documentElement.style.setProperty('--img-walDownThickArrow', darkWalDownThickArrow);
  document.documentElement.style.setProperty('--color-leave-button', darkLeaveHover);
  document.documentElement.style.setProperty('--color-bns-transaction', darkBnsTransactionColor);
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
const lightColorClickableHovered = '#F5F5F5';
// const lightColorBchatBorderColor = borderLightThemeColor;
const lightColorBchatBorder = `2px solid #E3E3E3 `;
const lightColorRecoveryPhraseBannerBg = white;
const lightColorPillDivider = `#E3E3E3`;
const lightColorLastSeenIndicator = black;
const lightColorQuoteBottomBarBg = '#f8f8f8';
const lightColorCellBackground = '#FAFAFA';
const lightColorReceivedMessageBg = '#f5f5f5';
const whiteColorReceivedMessageBgHover = '#FAFAFA';
const lightColorReceivedMessageText = black;

const lightColorPillDividerText = '#555555';

const lightInputBackground = '#efefef';
const lightFilterBchatText = 'brightness(0) saturate(100%)';
const lightUnreadBorder = `4px solid ${accentLightTheme}`;

const lightScrollbarThumb = '#D5D5D8';
const lightScrollbarTrack = '#fcfcfc';
const lightFakeChatBubbleBg = '#f5f5f5';

const lightInboxBackground = '#EDEDED';
const lightLeftPaneOverlayBg = '#EDEDED';
const lightConversationItemSelected = '#fff';
const lightConversationItemHasUnread = '#EDEDED';
const lightConversationList = '#E6E6E6';

const lightTextHighlight = `${black}88`;
const lightForegroundPrimary = white;
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
const lightInboxBgColor = '#FCFCFC';
// const lightHintMessageText="black";
// const lightTextAreaColor="black";
const lightComposeMsgBg = '#f2f2f2';
// const lightComposeMsgIconBG="#2879fb";
const lightSettingIndication = '#F2F2F2';
const lightSinginTextColor = '#128B17';
// const lightHintColor = lightGreyColor;
// const lightCopyIcon = '#0BB70F';
// const lightCopyIconBg = '#EFEFEF';
const lightCopyModalbtn = '#F8F8F8';

const lightOverlayBg = '#EDEDED';
const lightleftHeaderBg = '#F2F2F2';
const lightLeaveGrpBtn = '#F2F2F2';

const lightEmptyChatImg = `url("../images/bchat/emptyMessageWhite.svg")`;
// const lightBgDoodle = `url("../images/bchat/doodle_dark.svg")`;
const lightMsgReqImg = `url("../images/bchat/no_message_request.svg")`;
const lightBlockedContact = `url("../images/bchat/no_blocked_contacts.svg")`;
const lightAddContact = `url("../images/bchat/add_contact_white_theme.svg")`;
const lightEmptyContact = `url("../images/bchat/no_contact_scrt_grp.svg")`;
const lightEmptyAddressBook = `url("../images/bchat/empty_address_book_white.svg")`;
const lightEmptyTransHistory = `url("../images/bchat/no_tx_history_white.svg")`;
const lightIncomingTransHistory = `url("../images/bchat/no_incoming_transaction_white.svg")`;
const whiteOutgoingTransHistory = `url("../images/bchat/no_outgoing_white.svg")`;
const lightPendingTransHistory = `url("../images/bchat/pending_tx_history_white.svg")`;
const lightFailedTransHistory = `url("../images/bchat/failed_tx_history_white.svg")`;
const lightEmptyTransaction = `url("../images/bchat/no_transactions_found_white.svg")`;
const whiteWalletSyncing = `url("../images/bchat/wallet_syncing_white.svg")`;
const lightNoMedia = `url("../images/bchat/no_mediaWhiteTheme.svg")`;
const lightChatHeader = '#EEEEEE';
const lightChatIcons = 'black';
const lightComposeMsgInput = '#EAEAEA';
const lightcomposeMsgRecordIcon = '#85858F';
const lightWalletNodeHeader = '#128B17';
const lightWalletSelectHover = '#D3D3D3';
const lightWalletPriorityHover = '#E3E3E3';
const lightDayNight = `url("../images/bchat/moon.svg")`;
const lightNewChat = `url("../images/bchat/newChat_white.svg")`;
const lightBorderBottomColor = '#E3E3E3';
const lightToggleOff = '#C6C6C6';
const lightClearBtn = '#fff';
const lightLeftpaneSetting = '#f4f4f4';
const lightBlockUserBg = '#F2F2F2';
const lightPasswordBorderBottom = '#D5D5D5';
const lightRightpaneSetting = '#f8f8f8';
const ligntDisableText = '#B9BABF';
const lightProfileBgColor = '#F8F8F8';
const whiteAudioRecord = '#dcdbdb';
const whiteBubbleReceivedBg = '#E2E2E2';
const lightBlockseletedUserBg = '#FFFFFF';
const lightDisableBorder = '#C5C5C5';
const lightDownArrowBg = '#FFFFFF';
const lightDownArrow = '#A8A8C3';
// Toast Colors
const lightToastSuccessMessage = 'linear-gradient(to right, #FFFFFF , #F5F5F5,#F3FFF5)';
const lightToastErrorMessage = 'linear-gradient(to right, #FFFFFF , #F5F5F5,#FFF6F6)';

// Seed color
const whiteSeedColor = '#128B17';
//bns link color
const lightBnsLinkInputBgColor = '#F8F8F8';
const lightBnsLinkIdBgColor = '#F8F8F8';
const lightBnsCameraIconBgColor = '#FFFFFF';

//wallet
const lightWalcontentBg = '#E8E8E8';
const lightWalcontentBgHover = '#DDDDDD';
const lightWalInputBg = '#F8F8F8';
const lightWalunlockbal = '#F8F8F8';
const lightWalTransacBtn = '#DEDEDE';
const lightWalQrOutline = '#DEDEDE';
const lightWalPopuphover = '#DEDEDE';
const lightWalcancelBtn = '#F8F8F8';
const lightWalAddressBookCopy = '#DEDEDE';
const lightWalletSyncBar = '#DEDEDE';
const lightDownthickArrow = '#8F8FA2';
const lightDisableBtn = '#DEDEDE';
const lightDisableTxt = '#B1B1B1';
const lightConfirmAddress = '#747474';
const lightWalPassword = `url("../images/wallet/Password_image_white.svg")`;
const lightWalDownThickArrow = `url("../images/wallet/downThickArrowWhite.svg")`;
const lightLeaveHover = '#D9D9D9';
const lightCopyHover = '#FFFFFF';
const lightWalletCopyHover = '#EBEBEB';
const lightAddressBookCopy = '#FFFFFF';
const lightAddMembers = '#F2F2F2';
const lightProfileClose = '#DDDDDD';
const lightChattimestamp = '#222222';
const lightBgModalColor = 'rgba(0, 0, 0, 0.6)';
const lightBnsTransactionColor = '#222222';

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
  document.documentElement.style.setProperty('--color-overlayBg', lightOverlayBg);
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
  document.documentElement.style.setProperty('--color-foreground-primary', lightForegroundPrimary);
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
  document.documentElement.style.setProperty('--color-rightpaneSetting', lightRightpaneSetting);
  // document.documentElement.style.setProperty(
  //   '--color-unreadBg',
  //   lightunreadBg
  // );
  document.documentElement.style.setProperty('--color-leftHeaderBg', lightleftHeaderBg);
  document.documentElement.style.setProperty('--color-borderBottomColor', lightBorderBottomColor);
  document.documentElement.style.setProperty('--color-inboxBgColor', lightInboxBgColor);
  document.documentElement.style.setProperty('--color-composeMsgIconBG', darkComposeMsgIconBG);
  document.documentElement.style.setProperty('--color-composeMsgBg', lightComposeMsgBg);
  document.documentElement.style.setProperty('--color-composeMsgInput', lightComposeMsgInput);
  document.documentElement.style.setProperty(
    '--color-composeMsgRecordIcon',
    lightcomposeMsgRecordIcon
  );

  document.documentElement.style.setProperty('--color-walletNodeHeader', lightWalletNodeHeader);
  document.documentElement.style.setProperty('--color-walletSelectOption', lightWalletSelectHover);
  document.documentElement.style.setProperty(
    '--color-walletPriorityHover',
    lightWalletPriorityHover
  );
  document.documentElement.style.setProperty('--color-MsgReqModal-bg', lightMsgReqModalBg);
  document.documentElement.style.setProperty('--color-smModal-bg', lightSmModalBg);
  document.documentElement.style.setProperty('--color-cancelBtn-bg', lightCancelBtnBg);
  document.documentElement.style.setProperty('--color-chatHeader', lightChatHeader);
  document.documentElement.style.setProperty('--color-chatIcons', lightChatIcons);
  document.documentElement.style.setProperty('--color-leftpaneSetting', lightLeftpaneSetting);
  document.documentElement.style.setProperty('--color-blockUserBg', lightBlockUserBg);
  document.documentElement.style.setProperty('--color-blockseletedUserBg', lightBlockseletedUserBg);
  document.documentElement.style.setProperty('--color-disableBorder', lightDisableBorder);
  document.documentElement.style.setProperty('--color-downArrowBg', lightDownArrowBg);

  document.documentElement.style.setProperty(
    '--color-password-borderBottom',
    lightPasswordBorderBottom
  );
  document.documentElement.style.setProperty('--color-toggleOff', lightToggleOff);

  document.documentElement.style.setProperty('--color-clearBtn', lightClearBtn);
  document.documentElement.style.setProperty('--color-toast-success', lightToastSuccessMessage);
  document.documentElement.style.setProperty('--color-toast-error', lightToastErrorMessage);
  document.documentElement.style.setProperty('--color-caret', darkColorCellBackground);
  document.documentElement.style.setProperty('--color-copy-hover', lightCopyHover);
  document.documentElement.style.setProperty(
    '--color-addressbook-copy-hover',
    lightAddressBookCopy
  );
  document.documentElement.style.setProperty('--color-add-member', lightAddMembers);
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
  document.documentElement.style.setProperty('--image-walletSyncing', whiteWalletSyncing);
  document.documentElement.style.setProperty('--image-NoMedia', lightNoMedia);
  document.documentElement.style.setProperty('--green-color', greenColor);
  // document.documentElement.style.setProperty('--button-color', buttonColor);
  document.documentElement.style.setProperty('--color-audio-record', whiteAudioRecord);
  document.documentElement.style.setProperty('--color-seed', whiteSeedColor);
  document.documentElement.style.setProperty(
    '--message-bubbles-received-background-color',
    whiteBubbleReceivedBg
  );
  document.documentElement.style.setProperty('--color-leave-button', lightLeaveHover);

  // bns link selectors
  document.documentElement.style.setProperty('--color-BnsLinkIdBg', lightBnsLinkIdBgColor);
  document.documentElement.style.setProperty('--color-BnsLinkInputBg', lightBnsLinkInputBgColor);
  document.documentElement.style.setProperty('--color-BnsCameraIconBg', lightBnsCameraIconBgColor);
  
  //wallet
  document.documentElement.style.setProperty('--color-WalcontentBg', lightWalcontentBg);
  document.documentElement.style.setProperty('--color-WalcontentBgHover', lightWalcontentBgHover);
  document.documentElement.style.setProperty('--color-walInputBg', lightWalInputBg);
  document.documentElement.style.setProperty('--color-walunlockbal', lightWalunlockbal);
  document.documentElement.style.setProperty('--color-walTransacBtn', lightWalTransacBtn);
  document.documentElement.style.setProperty('--color-walQrOutline', lightWalQrOutline);
  document.documentElement.style.setProperty('--color-walPopuphover', lightWalPopuphover);
  document.documentElement.style.setProperty('--color-walcancelBtn', lightWalcancelBtn);
  document.documentElement.style.setProperty('--color-walAddressBookCopy', lightWalAddressBookCopy);
  document.documentElement.style.setProperty('--color-walSyncbar', lightWalletSyncBar);
  document.documentElement.style.setProperty('--color-walDownthickArrow', lightDownthickArrow);
  document.documentElement.style.setProperty('--color-disableBtn', lightDisableBtn);
  document.documentElement.style.setProperty('--color-disableTxt', lightDisableTxt);
  document.documentElement.style.setProperty('--color-confirmAddress', lightConfirmAddress);

  document.documentElement.style.setProperty('--img-walPassword', lightWalPassword);
  document.documentElement.style.setProperty('--img-walDownThickArrow', lightWalDownThickArrow);
  document.documentElement.style.setProperty('--color-bns-transaction', lightBnsTransactionColor);
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
    --color-body-bg:${black};
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
    --color-foreground-primary: ${darkForegroundPrimary};
    --color-background-primary: ${darkBackgroundPrimary};
    --color-button-green: ${darkButtonGreen};
    --color-modal-background: ${darkModalBackground};
    --color-overlayBg:${darkOverlayBg};
    --color-leftHeaderBg:${darkleftHeaderBg};
    --color-leaveGrpBtn:${darkLeaveGrpBtn}

    --color-MsgReqModal-bg:${darkMsgReqModalBg};
    --color-smModal-bg:${darkSmModalBg};
    --color-cancelBtn-bg:${darkCancelBtnBg};
    --color-inboxBgColor:${darkInboxBgColor};
    --color-borderBottomColor:${darkBorderBottomColor};
    --color-HintMessageText:${darkHintMessage};
    --color-TextAreaColor:${darkTextAreaColor};
    --color-composeMsgBg:${darkComposeMsgBg};
    --color-composeMsgInput:${darkComposeMsgInput}
    --color-composeMsgIconBG:${darkComposeMsgIconBG};
    --color-composeMsgRecordIcon:${darkcomposeMsgRecordIcon}
    --color-walletNodeHeader:${darkWalletNodeHeader}
    --color-walletSelectOption:${darkWalletSelectHover};
    --color-walletPriorityHover:${darkWalletPriorityHover};
    --color-settingIndication:${darkSettingIndication};
    --color-copyModalbtn:${darkCopyModalbtn}
    --color-chatHeader:${darkChatHeader};
    --color-chatIcons:${darkChatIcons};
    --color-toggleOff:${darkToggleOff};
    --color-clearBtn:${darkClearBtn};
    --button-color:${buttonColor};
    
    --color-blockUserBg:${darkBlockUserBg};
    --color-downArrowBg:${darkDownArrowBg};
    --color-downArrow:${darkDownArrow}
    --color-leftpaneSetting:${darkLeftpaneSetting};
    --color-rightpaneSetting:${darkRightpaneSetting}
    --color-disableText:${darkDisableText};
    --color-password-borderBottom:${darkPasswordBorderBottom}
    --color-audio-record:${darkAudioRecord};
    --color-seed:${darkSeedColor};
    --color-blockseletedUserBg:${darkBlockseletedUserBg};
    --color-disableBorder:${darkDisableBorder};
    --color-profile: ${darkProfileBgColor};
    --color-BnsLinkIdBg:${darkBnsLinkIdBgColor};
    --color-BnsLinkInputBg:${darkBnsLinkInputBgColor};

    --color-toast-success:${darkToastSuccessMessage};
    --color-toast-error:${darkToastErrorMessage};
    --color-caret:${lightColorCellBackground};
    --color-copy-hover:${darkCopyHover};
    --color-add-member:${lightAddMembers};
    --color-profile-close: ${darkProfileClose};
    --color-chat-timestamp:${darkChatTimestamp};
    --color-addressbook-copy-hover:${darkAddressBookCopy};
    --color-wallet-copy-hover:${darkWalletCopyHover};
    --color-WalcontentBg:${darkWalcontentBg};
    --color-WalcontentBgHover:${darkWalcontentBgHover};
    --color-walInputBg:${darkWalInputBg};
    --color-walunlockbal:${darkWalunlockbal};
    --color-walTransacBtn:${darkWalTransacBtn};
    --color-walQrOutline:${darkWalQrOutline};
    --color-walPopuphover:${darkWalPopuphover};
    --color-walcancelBtn:${darkWalcancelBtn};
    --color-walAddressBookCopy:${darkWalAddressBookCopy};
    --color-walSyncbar:${darkWalletSyncBar};
    --color-walDownthickArrow:${darkDownthickArrow};
    --color-disableBtn :${darkDisableBtn};
    --color-disableTxt:${darkDisableTxt};
    --color-confirmAddress:${darkConfirmAddress};
    --color-leave-button:${darkLeaveHover};
    --color-text:${darkColorText};
    --color-BgModalColor:${darkBgModalColor};
    --color-bns-transaction:${darkBnsTransactionColor};
  
    

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
    --image-walletSyncing:${darkWalletSyncing};
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
