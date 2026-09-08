// src/styles/bchat/classicDark.ts
// NOIR PROTOCOL — dark theme tokens.
// One ground (#0A0A0A), layered panels, hairline borders, a single live color (network green).
import {
  destructive,
  greenColor,
  netGreen,
  warning,
  white,
} from './BchatThemeConstants';
import { BchatVariableTypes } from './bchatVariableTypes';

// main accent & text
const darkColorAccent = netGreen;
const darkColorAccentButton = netGreen;
const darkColorText = white;
const darkColorTextOpposite = white;

const darkColorTextSubtle = `${white}99`;
const darkColorTextAccent = netGreen;
const darkColorBchatShadow = `0px 3px 5px 0px #00000066`;
const darkColorComposeViewBg = '#141414';
// Sent messages are white blocks — the brand CTA material. Text flips to ink.
const darkColorSentMessageBg = '#F4F4F4';
const darkSettingsleftPaneHover = '#141414';
const darkSettingsHover = '#1F1F1F';
const darkColorSentMessageText = '#0A0A0A';
const darkColorClickableHovered = '#1A1A1A';
const darkColorBchatBorder = `1px solid #1F1F1F`;
const darkColorRecoveryPhraseBannerBg = '#101010';
const darkColorPillDivider = '#2A2A2A';
const darkColorLastSeenIndicator = netGreen;
const darkColorQuoteBottomBarBg = '#141414';
const darkColorCellBackground = '#101010';
const darkColorCaret = netGreen;
const darkColorReceivedMessageBg = '#141414';
const darkColorReceivedMessageBgHover = '#1A1A1A';
const darkColorReceivedMessageText = '#DADADA';

const darkColorPillDividerText = '#8F8F8F';
const darkInputBackground = '#111111';

const darkFilterBchatText = 'none';
const darkUnreadBorder = `2px solid ${netGreen}`;

const darkScrollbarThumb = '#2A2A2A';
const darkScrollbarTrack = '#0A0A0A';
const darkFakeChatBubbleBg = '#141414';

const darkInboxBackground = '#0A0A0A';
const darkLeftPaneOverlayBg = darkInboxBackground;
const darkConversationItemSelected = '#161616';
const darkConversationItemHasUnread = '#121212';
const darkConversationList = darkInboxBackground;

const darkTextHighlight = `${netGreen}55`;
const darkBackgroundPrimary = '#141414';
const darkButtonGreen = netGreen;
const darkModalBackground = '#0D0D0D';

const darkMessageRequestBannerBackground = '#0A0A0A';
const darkMessageRequestBannerIconBackground = netGreen;
const darkMessageRequestBannerUnreadBackground = netGreen;
const darkMessageRequestBannerIcon = '#8F8F8F';
const darkProfileClose = '#2A2A2A';
const darkChatTimestamp = '#8F8F8F';

// for bchat
const darkColorBg = '#0A0A0A';
const darkBorderBottomColor = '#1F1F1F';
const darkHintMessage = '#565656';
const darkSettingIndication = '#141414';
const darkProfileBgColor = '#141414';
const darkSinginTextColor = netGreen;
const darkCopyModalbtn = '#1F1F1F';
const darkChatHeader = '#0A0A0A';
const darkToggleOff = '#2A2A2A';
const darkClearBtn = '#1F1F1F';
const darkLeaveGrpBtn = '#141414';
const darkSmModalBg = '#141414';
const darkMsgReqModalBg = 'rgba(0,0,0,0.6)';

const darkleftHeaderBg = '#000000';
const darkCancelBtnBg = '#1F1F1F';
const darkDisableText = '#565656';
const darkEmptyChatImg = `url("../images/bchat/emptyMessage.svg")`;
const darkEmptyContact = `url("../images/bchat/empty_address_book_dark.svg")`;
const darkEmptyAddressBook = `url("../images/bchat/empty_address_book_dark.svg")`;
const darkEmptyTransHistory = `url("../images/bchat/no_tx_history_dark.svg")`;
const darkPendingTransHistory = `url("../images/bchat/pending_tx_history_dark.svg")`;
const darkOutgoingTransHistory = `url("../images/bchat/no_outgoing_dark.svg")`;
const darkIncomingTransHistory = `url("../images/bchat/no_incoming_transaction_dark.svg")`;
const darkFailedTransHistory = `url("../images/bchat/failed_tx_history_dark.svg")`;
const darkEmptyTransaction = `url("../images/bchat/no_transactions_found_dark.svg")`;
const darkComposeMsgInput = '#111111';
const darkDayNight = `url("../images/bchat/light_theme.svg")`;
const darkNewChat = `url("../images/bchat/newChat_dark.svg")`;
const darkMsgReqImg = `url("../images/bchat/no_message_request_dark_theme.svg")`;
const darkBlockedContact = `url("../images/bchat/no_blocked_contacts_dark_theme.svg")`;
const darkAddContact = `url("../images/bchat/add_contact.svg")`;
const darkNoMedia = `url("../images/bchat/no_mediaDarkTheme.svg")`;

const darkBlockUserBg = '#111111';
const darkBlockseletedUserBg = '#1A1A1A';

const darkPasswordBorderBottom = '#2A2A2A';
const darkbubbleReceivedBg = '#141414';

export const buttonColor = netGreen;

// Seed color
const darkBnsLinkIdBgColor = '#111111';
const darkBnsCameraIconBgColor = '#141414';
const darkDisableBtn = '#1F1F1F';
const darkDisableTxt = '#565656';
const darkDownArrowBg = '#1F1F1F';
const darkDownArrow = '#8F8F8F';
const darkLeaveHover = '#2A2A2A';

const darkBgModalColor = 'rgba(0, 0, 0, 0.8)';
const darkBnsTransactionColor = '#F4F4F4';
const darklogoBg = '#000000';
const darkActionBtnBg = '#101010';
const darkActionBtnicon = '#8F8F8F';
const darkActionBtnTxt = '#8F8F8F';
const darkThemeSelectedBg = '#0F1F10';
const darkLeftPaneBg = '#0D0D0D';
const darkSearchBorder = '#2A2A2A';
const darkLastMsgTxt = '#8F8F8F';
const darkContextMenuBg = '#101010';
const darkProfileIdBg = '#111111';
const darkProfileIDBorder = '#2A2A2A';
const darkSecondaryBtnBg = '#141414';
const darkSecondaryBtnHoverBg = '#1F1F1F';

const darkQrOuterBg = '#141414';
const darkSettingsRightPaneOption = '#111111';
const darksettingHeaderBorder = '#1F1F1F';
const darkToggleBtn = '#8F8F8F';
const darkSettingsRightPaneOptionBorder = '#2A2A2A';
const darkHopBg = '#111111';
const darkHopTxt = '#8F8F8F';
const darkRecoverySeedBg = '#111111';
const darkModalFooter = '#101010';
const darkUntrustMediaBg = '#0A0A0A';
const darkUntrustedVerticalBar = '#2A2A2A';
const darkIconBtnHover = '#1F1F1F';
const darkContextMenuHoverBg = '#1A1A1A';
const darkProfileHeaderBg = '#141414';
const darkChatIdBorder = '#2A2A2A';
const darkProfileInfoBorder = '#1F1F1F';
const darkDisappearTimeHover = '#1A1A1A';
const darkProfileInfoMediaTitle = '#8F8F8F';
const darkModalBg = '#141414';
const darkModalIconBg = '#101010';
const darkChatMultiSelectBg = '#101010';
const darkConfirmModalInnerBg = '#101010';
const darkConfirmModalHoverBg = '#1A1A1A';
const darkEnableBtnBg = '#141414';
const darkModalDisableTxt = '#565656';
const darkNoTxnTxt = '#8F8F8F';
const darkToastBg = '#101010';
const darkCallOptionBtnHover = '#1F1F1F';
const darkSpeedPlayBg = '#1F1F1F';
const darkMoreInfoIncommingChatBg = '#141414';
const darkCameraHoverBg = '#2A2A2A';
const darkPrimaryBtnHoverBg = '#18A31B';
const darkOfflineContentBg = '#0A0A0A';
const darkInputText = '#8F8F8F';
const darkIconColor = white;
const darkInviteCardIconBg = '#141414';
const darkRadioButton = '#F4F4F4';
const darkEmojiPanelBg = '#101010';
const darkEmojiIconHoverBg = '#1A1A1A';
const darkEmojiHeaderIcon = '#F4F4F4';
const darkReplyMsgMediaIcon = '#8F8F8F';
const darkLoaderBg = '#000000b3';
const darkAttachmentBoxShadow = '0 0 41.143px 0 #000';
const darkViewContactBorder = '#2A2A2A';
const darkReactionHoverBg = '#1A1A1A';
const darkReadMoreBtnBg = '#1F1F1F';

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
  '--color-caret': darkColorCaret,
  '--color-profile-close': darkProfileClose,
  '--color-chat-timestamp': darkChatTimestamp,
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
  '--color-noTxn-txt': darkNoTxnTxt,
  '--color-toast-bg': darkToastBg,
  '--color-call-option-btn-hover': darkCallOptionBtnHover,
  '--color-speedPlay-bg': darkSpeedPlayBg,
  '--color-moreInfo-incomming-chat-bg': darkMoreInfoIncommingChatBg,
  '--color-camera-hover-bg': darkCameraHoverBg,
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
  '--color-body-bg': darkColorBg,
  '--color-password-borderBottom': darkPasswordBorderBottom,
  '--color-chatHeader': darkChatHeader,
  '--color-BnsCameraIconBg': darkBnsCameraIconBgColor,
  '--color-reaction-hover-bg': darkReactionHoverBg,
  '--color-read-more-btn-bg': darkReadMoreBtnBg,
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
};
