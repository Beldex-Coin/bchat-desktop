// src/styles/bchat/classicDark.ts
import {
  //   black,
  forestGreenColor,
  greenColor,
  //   lightGreyColor,
  warning,
} from './BchatThemeConstants';
import { BchatVariableTypes } from './bchatVariableTypes';


// ---- Dark palette (Figma > Foundations) ----
// Six colours plus the in-between neutrals the screens use. Only the dark theme uses these;
// light theme (classicLight.tsx) and the shared BchatThemeConstants are untouched.
const DARK_INK = '#0A0A0A'; // app background
const DARK_PANEL = '#141414'; // panels, cards, bubbles
const DARK_FIELD = '#111111'; // input fields
const DARK_RAISED = '#1A1A1A'; // hover / pressed surfaces
const DARK_HAIR = '#1F1F1F'; // hairline borders between regions
const DARK_LINE = '#2A2A2A'; // borders, dividers, selected surfaces
const DARK_WHITE = '#F4F4F4'; // primary text
const DARK_MUTED = '#8F8F8F'; // secondary text
const DARK_PLACEHOLDER = '#757575'; // placeholder / hint text
const DARK_DIM = '#565656'; // disabled / tertiary text
const DARK_GREEN = '#1BB51E'; // "net green" accent
const DARK_GREEN_HOVER = '#179A19';
const DARK_SENT_BG = '#0F150F'; // sent bubbles: near-black with a green tint (outline/bar come later)
const DARK_DANGER = '#FF3E3E';

// Import all the dark theme constants from your Bchat theme file
// main accent & text
// DARK COLORS
const darkColorAccent = DARK_GREEN;
const darkColorAccentButton = DARK_GREEN;
const darkColorText = DARK_WHITE;
const darkColorTextOpposite = DARK_WHITE;
const darkColorTextSubtle = DARK_MUTED;
const darkColorTextAccent = DARK_GREEN;
const darkColorBchatShadow = 'none';
const darkColorComposeViewBg = DARK_PANEL;
const darkColorSentMessageBg = DARK_SENT_BG;
const darkSettingsleftPaneHover = DARK_RAISED;
const darkSettingsHover = DARK_LINE;
const darkColorSentMessageText = DARK_WHITE;
const darkColorClickableHovered = DARK_RAISED;
const darkColorBchatBorder = `1px solid ${DARK_LINE}`;
// const darkColorBchatBorderColor = borderDarkThemeColor;
const darkColorRecoveryPhraseBannerBg = DARK_PANEL;
const darkColorPillDivider = DARK_LINE;
const darkColorLastSeenIndicator = DARK_GREEN;
const darkColorQuoteBottomBarBg = DARK_LINE;
const darkColorCellBackground = DARK_PANEL;
const darkColorCaret = DARK_GREEN;
const darkColorReceivedMessageBg = DARK_PANEL;
const darkColorReceivedMessageBgHover = DARK_RAISED;
const darkColorReceivedMessageText = DARK_WHITE;
const darkColorPillDividerText = DARK_MUTED;
// const darkInputBackground = darkColorCellBackground;
const darkInputBackground = DARK_FIELD;
const darkFilterBchatText = 'none';
const darkUnreadBorder = `4px solid ${DARK_GREEN}`;
const darkScrollbarThumb = DARK_LINE;
const darkScrollbarTrack = DARK_INK;
const darkFakeChatBubbleBg = DARK_PANEL;
const darkInboxBackground = DARK_INK;
const darkLeftPaneOverlayBg = darkInboxBackground;
const darkConversationItemSelected = DARK_PANEL;
const darkConversationItemHasUnread = DARK_PANEL;
const darkConversationList = darkScrollbarTrack;

const darkTextHighlight = `${DARK_GREEN}55`;
const darkBackgroundPrimary = DARK_PANEL;
const darkButtonGreen = DARK_GREEN;
const darkModalBackground = DARK_INK;
const grey67 = DARK_GREEN;
const darkMessageRequestBannerBackground = DARK_INK;
const darkMessageRequestBannerIconBackground = DARK_GREEN;
const darkMessageRequestBannerUnreadBackground = grey67;
const darkMessageRequestBannerIcon = DARK_MUTED;
const darkProfileClose = DARK_LINE;
const darkChatTimestamp = DARK_DIM;
// for bchat
const darkColorBg = DARK_INK;
// const darkunreadBg="#39394A";
const darkBorderBottomColor = DARK_HAIR;
const darkHintMessage = DARK_PLACEHOLDER;
const darkSettingIndication = DARK_LINE;
const darkProfileBgColor = DARK_PANEL;
const darkSinginTextColor = DARK_GREEN;
// const darkHintColor = lightGreyColor;
// const darkCopyIcon = '#fff';
// const darkCopyIconBg = '#353543';
const darkCopyModalbtn = DARK_LINE;
const darkChatHeader = DARK_INK;
const darkToggleOff = DARK_DIM;
const darkClearBtn = DARK_LINE;
const darkLeaveGrpBtn = DARK_PANEL;
const darkSmModalBg = DARK_PANEL;
const darkMsgReqModalBg = 'rgba(0,0,0,0.4)';

const darkleftHeaderBg = DARK_INK;
const darkCancelBtnBg = DARK_PANEL;
const darkDisableText = DARK_DIM;
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
const darkComposeMsgInput = DARK_FIELD;
const darkDayNight = `url("../images/bchat/light_theme.svg")`;
const darkNewChat = `url("../images/bchat/newChat_dark.svg")`;
const darkMsgReqImg = `url("../images/bchat/no_message_request_dark_theme.svg")`;
const darkBlockedContact = `url("../images/bchat/no_blocked_contacts_dark_theme.svg")`;
const darkAddContact = `url("../images/bchat/add_contact.svg")`;
const darkNoMedia = `url("../images/bchat/no_mediaDarkTheme.svg")`;

const darkBlockUserBg = DARK_PANEL;
const darkBlockseletedUserBg = DARK_LINE;
const darkPasswordBorderBottom = DARK_LINE;
const darkbubbleReceivedBg = DARK_PANEL;
export const buttonColor = forestGreenColor;
// const buttonColor = "linear-gradient(to bottom , #13B71A, #006004)";

// Seed color
const darkBnsLinkIdBgColor = DARK_FIELD;
const darkBnsCameraIconBgColor = DARK_PANEL;
const darkDisableBtn = DARK_LINE;
const darkDisableTxt = DARK_DIM;
const darkDownArrowBg = DARK_LINE;
const darkDownArrow = DARK_WHITE;
const darkLeaveHover = DARK_RAISED;
const darkBgModalColor = 'rgba(0, 0, 0, 0.8)';
const darkBnsTransactionColor = DARK_WHITE;
const darklogoBg = DARK_INK;
const darkActionBtnBg = DARK_PANEL;
const darkActionBtnicon = DARK_MUTED;
const darkActionBtnTxt = DARK_MUTED;
const darkThemeSelectedBg = DARK_LINE;
const darkLeftPaneBg = DARK_INK;
const darkSearchBorder = DARK_LINE;
const darkLastMsgTxt = DARK_MUTED;
const darkContextMenuBg = DARK_PANEL;
const darkProfileIdBg = DARK_FIELD;
const darkProfileIDBorder = DARK_LINE;
const darkSecondaryBtnBg = DARK_PANEL;
const darkSecondaryBtnHoverBg = DARK_RAISED;
const darkQrOuterBg = DARK_PANEL;
const darkSettingsRightPaneOption = DARK_PANEL;
const darksettingHeaderBorder = DARK_HAIR;
const darkToggleBtn = DARK_DIM;
const darkSettingsRightPaneOptionBorder = DARK_LINE;
const darkHopBg = DARK_PANEL;
const darkHopTxt = DARK_MUTED;
const darkRecoverySeedBg = DARK_PANEL;
const darkModalFooter = DARK_PANEL;
const darkUntrustMediaBg = DARK_INK;
const darkUntrustedVerticalBar = DARK_DIM;
const darkIconBtnHover = DARK_RAISED;
const darkContextMenuHoverBg = DARK_RAISED;
const darkProfileHeaderBg = DARK_PANEL;
const darkChatIdBorder = DARK_LINE;
const darkProfileInfoBorder = DARK_LINE;
const darkDisappearTimeHover = DARK_RAISED;
const darkProfileInfoMediaTitle = DARK_MUTED;
const darkModalBg = DARK_PANEL;
const darkModalIconBg = DARK_FIELD;
const darkChatMultiSelectBg = DARK_PANEL;
const darkConfirmModalInnerBg = DARK_INK;
const darkConfirmModalHoverBg = DARK_RAISED;
const darkEnableBtnBg = DARK_PANEL;
const darkModalDisableTxt = DARK_DIM;
const darkNoTxnTxt = DARK_MUTED;
const darkToastBg = DARK_PANEL;
// const bodyBg = '#131313'
const darkCallOptionBtnHover = DARK_RAISED;
const darkSpeedPlayBg = DARK_PANEL;
const darkMoreInfoIncommingChatBg = DARK_PANEL;
const darkCameraHoverBg = DARK_LINE;
const darkPrimaryBtnHoverBg = DARK_GREEN_HOVER;
const darkOfflineContentBg = DARK_INK;
const darkInputText = DARK_PLACEHOLDER;
const darkIconColor = DARK_WHITE;
const darkInviteCardIconBg = DARK_FIELD;
const darkRadioButton = DARK_WHITE;
const darkEmojiPanelBg = DARK_PANEL;
const darkEmojiIconHoverBg = DARK_RAISED;
const darkEmojiHeaderIcon = 'white';
const darkReplyMsgMediaIcon = DARK_MUTED;
const darkLoaderBg = '#0000009e';
const darkAttachmentBoxShadow = 'none';
const darkViewContactBorder = DARK_LINE;
const darkReactionHoverBg = DARK_RAISED;
const darkReadMoreBtnBg = DARK_LINE;
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
  '--color-destructive': DARK_DANGER,
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
