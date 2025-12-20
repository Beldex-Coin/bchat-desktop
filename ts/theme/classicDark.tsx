// src/styles/bchat/classicDark.ts
import {
  accentDarkTheme,
  baseColor,
  //   black,
  darkGrey,
  destructive,
  forestGreenColor,
  greenColor,
  //   lightGreyColor,
  warning,
  white,
} from './BchatThemeConstants';
import { BchatVariableTypes } from './bchatVariableTypes';

// Import all the dark theme constants from your Bchat theme file
// main accent & text
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
const darkColorBg = '#131313';
// const darkunreadBg="#39394A";
const darkBorderBottomColor = '#1A1A24';
const darkHintMessage = '#7B7B86';
const darkSettingIndication = '#2E333D';
const darkProfileBgColor = '#2A2A3B';
const darkSinginTextColor = '#128B17';
// const darkHintColor = lightGreyColor;
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

export const buttonColor = forestGreenColor;
// const buttonColor = "linear-gradient(to bottom , #13B71A, #006004)";

// Seed color
const darkBnsLinkIdBgColor = '#202329';
const darkBnsCameraIconBgColor = '#22222E';
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
const darkSecondaryBtnHoverBg = '#383D47';

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
const darkIconBtnHover = '#3D424C';
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
// const bodyBg = '#131313'
const darkCallOptionBtnHover = '#424751';
const darkSpeedPlayBg = '#202329';
const darkMoreInfoIncommingChatBg = '#202329';
const darkCameraHoverBg = '#46465D';
const darkSettingWalletBetaBg = '#131313';
const darkPrimaryBtnHoverBg = '#1A973C';
const darkOfflineContentBg = '#131313';
const darkInputText = '#858598';
const darkIconColor = white;
const darkInviteCardIconBg = '#202329';
const darkRadioButton = '#F0F0F0';
const darkEmojiPanelBg = '#202329';
const darkEmojiIconHoverBg = '#2C303D';
const darkEmojiHeaderIcon = 'white';
const darkReplyMsgMediaIcon = '#A7A7BA';
const darkLoaderBg = '#0000009e';
const darkAttachmentBoxShadow = '0 0 41.143px 0 #000';
const darkViewContactBorder = '#46465D';

// adjust this path/import to your actual file

export const BCHAT_CLASSIC_DARK_COLORS: BchatVariableTypes = {
  '--margins-xs': '5px',
  '--margins-sm': '10px',
  '--margins-md': '15px',
  '--margins-lg': '20px',
  '--filter-bchat-text': darkFilterBchatText,
  '--green-color': greenColor,
  '--border-unread': darkUnreadBorder,
  /* Layout / base */

  '--color-warning': warning,
  '--color-destructive': destructive,
  '--color-accent': darkColorAccent,
  '--color-accent-button': darkColorAccentButton,
  '--color-text': darkColorText,
  '--color-text-subtle': darkColorTextSubtle,
  '--color-text-accent': darkColorTextAccent,
  '--color-text-opposite': darkColorTextOpposite,
  '--color-text-signIn': darkSinginTextColor,
  '--color-settings-leftpane-options-hover': darkSettingsleftPaneHover,
  '--color-settings-options-hover': darkSettingsHover,

  '--color-bchat-shadow': darkColorBchatShadow,
  '--color-bchat-border': darkColorBchatBorder,
  '--color-recovery-phrase-banner-background': darkColorRecoveryPhraseBannerBg,
  '--color-pill-divider': darkColorPillDivider,
  '--color-pill-divider-text': darkColorPillDividerText,
  '--color-last-seen-indicator': darkColorLastSeenIndicator,
  '--color-quote-bottom-bar-background': darkColorQuoteBottomBarBg,

  '--color-compose-view-button-background': darkColorComposeViewBg,
  '--color-sent-message-background': darkColorSentMessageBg,
  '--color-sent-message-text': darkColorSentMessageText,
  '--color-clickable-hovered': darkColorClickableHovered,
  '--color-cell-background': darkColorCellBackground,
  '--color-input-background': darkInputBackground,
  '--color-scroll-bar-thumb': darkScrollbarThumb,
  '--color-scroll-bar-track': darkScrollbarTrack,
  '--color-fake-chat-bubble-background': darkFakeChatBubbleBg,
  '--color-inbox-background': darkInboxBackground,
  '--color-left-pane-overlay-background': darkLeftPaneOverlayBg,
  '--color-conversation-item-selected': darkConversationItemSelected,
  '--color-conversation-item-has-unread': darkConversationItemHasUnread,
  '--color-conversation-list': darkConversationList,
  '--color-text-highlight': darkTextHighlight,
  '--color-modal-background': darkModalBackground,
  '--color-background-primary': darkBackgroundPrimary,

  '--color-leftHeaderBg': darkleftHeaderBg,
  '--color-leaveGrpBtn': darkLeaveGrpBtn,
  '--color-MsgReqModal-bg': darkMsgReqModalBg,
  '--color-smModal-bg': darkSmModalBg,
  '--color-cancelBtn-bg': darkCancelBtnBg,
  '--color-borderBottomColor': darkBorderBottomColor,
  '--color-HintMessageText': darkHintMessage,
  '--color-composeMsgInput': darkComposeMsgInput,
  '--color-walletNodeHeader': darkWalletNodeHeader,
  '--color-walletSelectOption': darkWalletSelectHover,
  '--color-settingIndication': darkSettingIndication,
  '--color-copyModalbtn': darkCopyModalbtn,

  '--color-toggleOff': darkToggleOff,
  '--color-clearBtn': darkClearBtn,
  '--button-color': buttonColor,
  '--color-blockUserBg': darkBlockUserBg,
  '--color-downArrowBg': darkDownArrowBg,
  '--color-downArrow': darkDownArrow,
  '--color-disableText': darkDisableText,
  '--color-blockseletedUserBg': darkBlockseletedUserBg,

  '--color-profile': darkProfileBgColor,
  '--color-BnsLinkIdBg': darkBnsLinkIdBgColor,
  '--color-caret': darkColorCellBackground,
  '--color-profile-close': darkProfileClose,
  '--color-chat-timestamp': darkChatTimestamp,
  '--color-WalcontentBg': darkWalcontentBg,
  '--color-walInputBg': darkWalInputBg,
  '--color-walTransacBtn': darkWalTransacBtn,
  '--color-walcancelBtn': darkWalcancelBtn,
  '--color-walSyncbar': darkWalletSyncBar,
  '--color-walDownthickArrow': darkDownthickArrow,
  '--color-disableBtn': darkDisableBtn,
  '--color-disableTxt': darkDisableTxt,
  '--color-leave-button': darkLeaveHover,
  '--color-BgModalColor': darkBgModalColor,
  '--color-bns-transaction': darkBnsTransactionColor,

  '--color-logo-bg': darklogoBg,
  '--color-action-btn-bg': darkActionBtnBg,
  '--color-action-btn-icon': darkActionBtnicon,
  '--color-action-btn-txt': darkActionBtnTxt,
  '--color-theme-selected-bg': darkThemeSelectedBg,
  '--color-left-pane-bg': darkLeftPaneBg,
  '--color-search-border': darkSearchBorder,
  '--color-last-msg-txt': darkLastMsgTxt,
  '--color-context-menu-bg': darkContextMenuBg,
  '--color-profile-id-bg': darkProfileIdBg,
  '--color-profile-id-border': darkProfileIDBorder,
  '--color-secondary-btn-bg': darkSecondaryBtnBg,
  '--color-secondary-btn-hover-bg': darkSecondaryBtnHoverBg,
  '--color-primary-btn-hover-bg': darkPrimaryBtnHoverBg,
  '--color-qr-outer-bg': darkQrOuterBg,
  '--color-settings-right-pane-option': darkSettingsRightPaneOption,
  '--color-setting-header-border': darksettingHeaderBorder,
  '--color-toggle-btn': darkToggleBtn,
  '--color-settings-right-pane-option-border': darkSettingsRightPaneOptionBorder,
  '--color-hop-bg': darkHopBg,
  '--color-hop-txt': darkHopTxt,
  '--color-recovery-seed-bg': darkRecoverySeedBg,
  '--color-modal-footer': darkModalFooter,
  '--color-untrust-media-bg': darkUntrustMediaBg,
  '--color-untrusted-vertical-bar': darkUntrustedVerticalBar,
  '--color-icon-btn-hover': darkIconBtnHover,
  '--color-context-menu-hover-bg': darkContextMenuHoverBg,
  '--color-wallet-Sync-box-bg': darkWalletSyncBoxBg,
  '--color-profile-header-bg': darkProfileHeaderBg,
  '--color-chatId-border': darkChatIdBorder,
  '--color-profile-info-border': darkProfileInfoBorder,
  '--color-disappear-time-hover': darkDisappearTimeHover,
  '--color-profile-info-media-title': darkProfileInfoMediaTitle,
  '--color-modal-bg': darkModalBg,
  '--color-modal-icon-bg': darkModalIconBg,
  '--color-chat-multi-select-bg': darkChatMultiSelectBg,
  '--color-confirm-modal-inner-bg': darkConfirmModalInnerBg,
  '--color-confirm-modal-hover-bg': darkConfirmModalHoverBg,
  '--color-enable-btn-bg': darkEnableBtnBg,
  '--color-modal-disable-txt': darkModalDisableTxt,
  '--color-wallet-status-txt-Bg': darkWalletStatusTxtBg,
  '--color-wallet-unbalance-label': darkWalletUnBalanceLabel,
  '--color-wallet-inner-bg': darkWalletInnerBg,
  '--color-noTxn-txt': darkNoTxnTxt,
  '--color-toast-bg': darkToastBg,
  '--color-call-option-btn-hover': darkCallOptionBtnHover,
  '--color-speedPlay-bg': darkSpeedPlayBg,
  '--color-moreInfo-incomming-chat-bg': darkMoreInfoIncommingChatBg,
  '--color-camera-hover-bg': darkCameraHoverBg,
  '--color-setting-wallet-beta-bg': darkSettingWalletBetaBg,
  '--color-offline-content-bg': darkOfflineContentBg,
  '--color-input-text': darkInputText,
  '--color-icon': darkIconColor,
  '--color-invite-card-icon-bg': darkInviteCardIconBg,
  '--color-radio-icon': darkRadioButton,
  '--color-emoji-panel-bg': darkEmojiPanelBg,
  '--color-emoji-icon-hover-bg': darkEmojiIconHoverBg,
  '--color-emoji-header-icon': darkEmojiHeaderIcon,
  '--color-reply-msg-media-icon': darkReplyMsgMediaIcon,
  '--color-loader-bg': darkLoaderBg,
  '--color-attachment-box-shadow': darkAttachmentBoxShadow,
  '--color-view-contact-border': darkViewContactBorder,

  '--color-received-message-background': darkColorReceivedMessageBg,
  '--color-received-message-text': darkColorReceivedMessageText,
  '--color-received-message-background-hover': darkColorReceivedMessageBgHover,
  '--color-button-green': darkButtonGreen,
  '--color-request-banner-background': darkMessageRequestBannerBackground,
  '--color-request-banner-icon-background': darkMessageRequestBannerIconBackground,
  '--color-request-banner-unread-background': darkMessageRequestBannerUnreadBackground,
  '--color-request-banner-icon': darkMessageRequestBannerIcon,
  '--color-wallet-copy-hover': darkWalletCopyHover,
  '--color-body-bg': darkColorBg,
  '--color-password-borderBottom': darkPasswordBorderBottom,
  '--color-chatHeader': darkChatHeader,
  '--color-BnsCameraIconBg': darkBnsCameraIconBgColor,
  /* Images / icons */
  '--image-EmptyChatImg': darkEmptyChatImg,
  '--image-DayNight': darkDayNight,
  '--image-addContact': darkNewChat,
  '--image-MsgReq': darkMsgReqImg,
  '--image-BlockedContact': darkBlockedContact,
  '--image-AddContact': darkAddContact,
  '--image-EmptyContact': darkEmptyContact,
  '--image-EmptyAddressBook': darkEmptyAddressBook,
  '--image-emptyTransHistory': darkEmptyTransHistory,
  '--image-outgoingTransHistory': darkOutgoingTransHistory,
  '--image-incomingTransHistory': darkIncomingTransHistory,
  '--image-pendingTransHistory': darkPendingTransHistory,
  '--image-failedTransHistory': darkFailedTransHistory,
  '--image-emptySearch': darkEmptyTransaction,
  '--image-NoMedia': darkNoMedia,
  '--message-bubbles-received-background-color': darkbubbleReceivedBg,
  '--img-walPassword': darkWalPassword,
  '--img-walDownThickArrow': darkWalDownThickArrow,
};
