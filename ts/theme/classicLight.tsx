// src/styles/bchat/classicLight.ts
import { baseWhite, destructive, greenColor, warning } from './BchatThemeConstants';
import { buttonColor } from './classicDark';
import { BchatVariableTypes } from './bchatVariableTypes';

const lightColorAccent = '#128b17'; // const lightColorAccent 128b17
const lightColorAccentButton = '#000000'; // const lightColorAccentButton black
const lightColorText = '#000000'; // black
const lightColorTextOpposite = '#ffffff'; // white
const lightColorTextSubtle = '#00000099'; // black99
const lightColorTextAccent = lightColorAccent; // accentLightTheme
const lightColorBchatShadow = '0 0 4px 0 #00000029';
const lightColorComposeViewBg = '#efefef';
const lightColorSentMessageBg = '#2879FB';
const lightSettingsleftpaneHover = '#E3E3E3';
const lightSettingsHover = '#E3E3E3';
const lightColorClickableHovered = '#F8F8F8';
//  const lightColorBchatBorderColor = '#f1f1f1';
const lightColorBchatBorder = '2px solid #E3E3E3';
const lightColorRecoveryPhraseBannerBg = '#ffffff';
const lightColorPillDivider = '#E3E3E3';
const lightColorLastSeenIndicator = '#000000';
const lightColorQuoteBottomBarBg = '#f8f8f8';
const lightColorCellBackground = '#FAFAFA';
const lightColorCaret='#181821'
const lightColorReceivedMessageBg = '#F8F8F8';
const whiteColorReceivedMessageBgHover = '#FAFAFA';
const lightColorReceivedMessageText = '#000000';
const lightColorPillDividerText = '#555555';
const lightInputBackground = '#EBEBEB';
const lightFilterBchatText = 'brightness(0) saturate(100%)';
const lightUnreadBorder = `4px solid ${lightColorAccent}`;
const lightScrollbarThumb = '#ACACAC';
const lightScrollbarTrack = '#F8F8F8';
const lightFakeChatBubbleBg = '#f5f5f5';
const lightInboxBackground = '#F0F0F0';
const lightLeftPaneOverlayBg = '#EDEDED';
const lightConversationItemSelected = '#F8F8F8';
const lightConversationItemHasUnread = '#F8F8F8';
const lightConversationList = '#E6E6E6';
const lightTextHighlight = '#00000088';

const lightModalBackground = '#fcfcfc';
const lightMessageRequestBannerBackground = lightColorQuoteBottomBarBg;
const lightMessageRequestBannerIconBackground = '#2879FB';
const lightMessageRequestBannerUnreadBackground = greenColor;
const lightMessageRequestBannerIcon = '#F0F0F0';

//  const lightColorBg = '#ffffff';
//  const lightunreadBg = '#EDEDED';
const lightMsgReqModalBg = 'rgba(230,230,230,0.4)';
const lightSmModalBg = '#F4F4F4';
const lightCancelBtnBg = '#E8E8E8';
const lightHintMessageText = '#000000';
//  const lightTextAreaColor = '#000000';
//  const lightComposeMsgIconBG = '#2879fb';
const lightSettingIndication = '#F8F8F8';
const lightSinginTextColor = '#128B17';
//  const lightHintColor = lightGreyColor;
//  const lightCopyIcon = '#0BB70F';
//  const lightCopyIconBg = '#EFEFEF';
const lightCopyModalbtn = '#F8F8F8';
const lightleftHeaderBg = '#F2F2F2';
const lightLeaveGrpBtn = '#F2F2F2';

const lightEmptyChatImg = 'url("../images/bchat/emptyMessageWhite.svg")';
//  const lightBgDoodle = 'url("../images/bchat/doodledark.svg")';
const lightMsgReqImg = 'url("../images/bchat/no_message_request.svg")';
const lightBlockedContact = 'url("../images/bchat/no_blocked_contacts.svg")';
const lightAddContact = 'url("../images/bchat/add_contact_white_theme.svg")';
const lightEmptyContact = 'url("../images/bchat/empty_address_book_White.svg")';
const lightEmptyAddressBook = lightEmptyContact;
const lightEmptyTransHistory = 'url("../images/bchat/notxhistorywhite.svg")';
const lightIncomingTransHistory = 'url("../images/bchat/noincomingtransactionwhite.svg")';
const whiteOutgoingTransHistory = 'url("../images/bchat/nooutgoingwhite.svg")';
const lightPendingTransHistory = 'url("../images/bchat/pendingtxhistorywhite.svg")';
const lightFailedTransHistory = 'url("../images/bchat/failedtxhistorywhite.svg")';
const lightEmptyTransaction = 'url("../images/bchat/notransactionsfoundwhite.svg")';
const lightNoMedia = 'url("../images/bchat/no_mediaWhiteTheme.svg")';

const lightChatHeader = '#F0F0F0';
const lightComposeMsgInput = '#F8F8F8';
const lightDayNight = 'url("../images/bchat/moon.svg")';
const lightNewChat = 'url("../images/bchat/newChatwhite.svg")';
const lightBorderBottomColor = '#E3E3E3';
const lightToggleOff = '#F8F8F8';
const lightClearBtn = '#ffffff';
const lightBlockUserBg = '#EBEBEB';
const lightPasswordBorderBottom = '#D5D5D5';
const ligntDisableText = '#B9BABF';
const lightProfileBgColor = baseWhite;
const whiteBubbleReceivedBg = '#F8F8F8';
const lightBlockseletedUserBg = '#FFFFFF';
const lightDownArrowBg = '#FFFFFF';
const lightDownArrow = '#A8A8C3';

const lightBnsLinkIdBgColor = '#EBEBEB';
const lightBnsCameraIconBgColor = '#FFFFFF';
const lightDisableBtn = '#DEDEDE';
const lightDisableTxt = '#B1B1B1';
const lightLeaveHover = '#D9D9D9';
const lightProfileClose = '#DDDDDD';
const lightChattimestamp = '#333333';
const lightBgModalColor = 'rgba(0, 0, 0, 0.6)';
const lightBnsTransactionColor = '#222222';

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
const lightHoptxt = '#333333';
const lightRecoverySeedBg = '#F0F0F0';
const lightModalFooter = '#EBEBEB';
const lightUntrustMediaBg = '#EBEBEB';
const lightUntrustedVerticalBar = '#ACACAC';
const lightIconBtnHover = '#E2E2E2';
const lightContextMenuHoverBg = '#EBEBEB';
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
const lightNoTxnTxt = '#ACACAC';
const lightToastBg = '#F8F8F8';
const lightCallOptionBtnHover = '#FFFFFF';
const lightSpeedPlayBg = '#ACACAC';
const lightMoreInfoIncommingChatBg = '#F0F0F0';
const lightCameraHoverBg = '#DADADA';
const lightSecondaryBtnHoverBg = '#FFFFFF';
const lightPrimaryBtnHoverBg = '#1A973C';
const lightOfflineContentBg = '#F0F0F0';
const lightInputText = '#ACACAC';
const lightIconColor = '#3E4A53';
const lightInviteCardIconBg = '#F8F8F8';
const lightRadioButton = '#ACACAC';
const lightEmojiPanelBg = '#F8F8F8';
const lightEmojiIconHoverBg = '#EBEBEB';
const lightEmojiHeaderIcon = '#333333';
const lightReplyMsgMediaIcon = '#000000';
const lightLoaderBg = '#ffffff9e';
const lightAttachmentBoxShadow = '0 0 41.143px 0 rgba(0, 0, 0, 0.10)';
const lightViewContactBorder = '#ACACAC';

const lightBackgroundPrimary = '#E8E8E8';
const lightButtonGreen = '#FFFFFF';
const lightReactionHoverBg = '#EBEBEB';

// Light theme body background
const bodyBgLight = '#FFFFFF';
// adjust this path to where your light constants live

export const BCHAT_CLASSIC_LIGHT_COLORS: BchatVariableTypes = {
  '--margins-xs': '5px',
  '--margins-sm': '10px',
  '--margins-md': '15px',
  '--margins-lg': '20px',
  '--filter-bchat-text': lightFilterBchatText,
  '--green-color': greenColor,
  '--border-unread': lightUnreadBorder,
  /* Layout / base */
  '--color-body-bg': bodyBgLight,

  '--color-warning': warning,
  '--color-destructive': destructive,
  '--color-accent': lightColorAccent,
  '--color-accent-button': lightColorAccentButton,
  '--color-text': lightColorText,
  '--color-text-subtle': lightColorTextSubtle,
  '--color-text-accent': lightColorTextAccent,
  '--color-text-opposite': lightColorTextOpposite,
  '--color-text-signIn': lightSinginTextColor,
  '--color-settings-leftpane-options-hover': lightSettingsleftpaneHover,
  '--color-settings-options-hover': lightSettingsHover,

  '--color-bchat-shadow': lightColorBchatShadow,
  '--color-bchat-border': lightColorBchatBorder,
  '--color-recovery-phrase-banner-background': lightColorRecoveryPhraseBannerBg,
  '--color-pill-divider': lightColorPillDivider,
  '--color-pill-divider-text': lightColorPillDividerText,
  '--color-last-seen-indicator': lightColorLastSeenIndicator,
  '--color-quote-bottom-bar-background': lightColorQuoteBottomBarBg,

  '--color-compose-view-button-background': lightColorComposeViewBg,
  '--color-sent-message-background': lightColorSentMessageBg,
  '--color-sent-message-text': lightColorText, // or a dedicated lightSentMessageText if you have it
  '--color-clickable-hovered': lightColorClickableHovered,
  '--color-cell-background': lightColorCellBackground,
  '--color-input-background': lightInputBackground,
  '--color-scroll-bar-thumb': lightScrollbarThumb,
  '--color-scroll-bar-track': lightScrollbarTrack,
  '--color-fake-chat-bubble-background': lightFakeChatBubbleBg,
  '--color-inbox-background': lightInboxBackground,
  '--color-left-pane-overlay-background': lightLeftPaneOverlayBg,
  '--color-conversation-item-selected': lightConversationItemSelected,
  '--color-conversation-item-has-unread': lightConversationItemHasUnread,
  '--color-conversation-list': lightConversationList,
  '--color-text-highlight': lightTextHighlight,
  '--color-modal-background': lightModalBackground,

  '--color-leftHeaderBg': lightleftHeaderBg,
  '--color-leaveGrpBtn': lightLeaveGrpBtn,
  '--color-MsgReqModal-bg': lightMsgReqModalBg,
  '--color-smModal-bg': lightSmModalBg,
  '--color-cancelBtn-bg': lightCancelBtnBg,
  '--color-borderBottomColor': lightBorderBottomColor,
  '--color-HintMessageText': lightHintMessageText,
  '--color-composeMsgInput': lightComposeMsgInput,
  '--color-settingIndication': lightSettingIndication,
  '--color-copyModalbtn': lightCopyModalbtn,

  /* Toggles / buttons */
  '--color-toggleOff': lightToggleOff,
  '--color-clearBtn': lightClearBtn,
  '--button-color': buttonColor,
  '--color-blockUserBg': lightBlockUserBg,
  '--color-downArrowBg': lightDownArrowBg,
  '--color-downArrow': lightDownArrow,
  '--color-disableText': lightDisableTxt || ligntDisableText,
  '--color-blockseletedUserBg': lightBlockseletedUserBg,

  /* Profile / BNS  */
  '--color-profile': lightProfileBgColor,
  '--color-BnsLinkIdBg': lightBnsLinkIdBgColor,
  '--color-caret': lightColorCaret,
  '--color-profile-close': lightProfileClose,
  '--color-chat-timestamp': lightChattimestamp,
  '--color-disableBtn': lightDisableBtn,
  '--color-disableTxt': lightDisableTxt,
  '--color-leave-button': lightLeaveHover,
  '--color-BgModalColor': lightBgModalColor,
  '--color-bns-transaction': lightBnsTransactionColor,

  /* Revamped UI sections */
  '--color-logo-bg': lightLogoBg,
  '--color-action-btn-bg': lightActionBtnBg,
  '--color-action-btn-icon': lightActionBtnicon,
  '--color-action-btn-txt': lightActionBtnTxt,
  '--color-theme-selected-bg': lightThemeSelectedBg,
  '--color-left-pane-bg': lightLeftPaneBg,
  '--color-search-border': lightSearchBorder,
  '--color-last-msg-txt': lightLastMsgTxt,
  '--color-context-menu-bg': lightContextMenuBg,
  '--color-profile-id-bg': lightProfileIdBg,
  '--color-profile-id-border': lightProfileIDBorder,
  '--color-secondary-btn-bg': lightSecondaryBtnBg,
  '--color-secondary-btn-hover-bg': lightSecondaryBtnHoverBg,
  '--color-primary-btn-hover-bg': lightPrimaryBtnHoverBg,
  '--color-qr-outer-bg': lightQrOuterBg,
  '--color-settings-right-pane-option': lightSettingsRightPaneOption,
  '--color-setting-header-border': lightSettingHeaderBorder,
  '--color-toggle-btn': lightToggleBtn,
  '--color-settings-right-pane-option-border': ligthSettingsRightPaneOptionBorder,
  '--color-hop-bg': lightHopBg,
  '--color-hop-txt': lightHoptxt,
  '--color-recovery-seed-bg': lightRecoverySeedBg,
  '--color-modal-footer': lightModalFooter,
  '--color-untrust-media-bg': lightUntrustMediaBg,
  '--color-untrusted-vertical-bar': lightUntrustedVerticalBar,
  '--color-icon-btn-hover': lightIconBtnHover,
  '--color-context-menu-hover-bg': lightContextMenuHoverBg,
  '--color-profile-header-bg': lightProfileHeaderBg,
  '--color-chatId-border': lightChatIdBorder,
  '--color-profile-info-border': lightProfileInfoBorder,
  '--color-disappear-time-hover': lightDisappearTimeHover,
  '--color-profile-info-media-title': lightProfileInfoMediaTitle,
  '--color-modal-bg': lightModalBg,
  '--color-modal-icon-bg': lightModalIconBg,
  '--color-chat-multi-select-bg': lightChatMultiSelectBg,
  '--color-confirm-modal-inner-bg': lightConfirmModalInnerBg,
  '--color-confirm-modal-hover-bg': lightConfirmModalHoverBg,
  '--color-enable-btn-bg': lightEnableBtnBg,
  '--color-modal-disable-txt': lightModalDisableTxt,

  '--color-noTxn-txt': lightNoTxnTxt,
  '--color-toast-bg': lightToastBg,
  '--color-call-option-btn-hover': lightCallOptionBtnHover,
  '--color-speedPlay-bg': lightSpeedPlayBg,
  '--color-moreInfo-incomming-chat-bg': lightMoreInfoIncommingChatBg,
  '--color-camera-hover-bg': lightCameraHoverBg,
  '--color-offline-content-bg': lightOfflineContentBg,
  '--color-input-text': lightInputText,
  '--color-icon': lightIconColor,
  '--color-invite-card-icon-bg': lightInviteCardIconBg,
  '--color-radio-icon': lightRadioButton,
  '--color-emoji-panel-bg': lightEmojiPanelBg,
  '--color-emoji-icon-hover-bg': lightEmojiIconHoverBg,
  '--color-emoji-header-icon': lightEmojiHeaderIcon,
  '--color-reply-msg-media-icon': lightReplyMsgMediaIcon,
  '--color-loader-bg': lightLoaderBg,
  '--color-attachment-box-shadow': lightAttachmentBoxShadow,
  '--color-view-contact-border': lightViewContactBorder,
  '--color-received-message-background': lightColorReceivedMessageBg,
  '--color-received-message-text': lightColorReceivedMessageText,
  '--color-received-message-background-hover': whiteColorReceivedMessageBgHover,
  '--color-background-primary': lightBackgroundPrimary,
  '--color-button-green': lightButtonGreen,
  '--color-request-banner-background': lightMessageRequestBannerBackground,
  '--color-request-banner-icon-background': lightMessageRequestBannerIconBackground,
  '--color-request-banner-unread-background': lightMessageRequestBannerUnreadBackground,
  '--color-request-banner-icon': lightMessageRequestBannerIcon,
  '--color-chatHeader': lightChatHeader,
  '--color-BnsCameraIconBg': lightBnsCameraIconBgColor,
  '--color-password-borderBottom': lightPasswordBorderBottom,
   '--color-reaction-hover-bg': lightReactionHoverBg,
  '--image-EmptyChatImg': lightEmptyChatImg,
  '--image-DayNight': lightDayNight,
  '--image-addContact': lightNewChat,
  '--image-MsgReq': lightMsgReqImg,
  '--image-BlockedContact': lightBlockedContact,
  '--image-AddContact': lightAddContact,
  '--image-EmptyContact': lightEmptyContact,
  '--image-EmptyAddressBook': lightEmptyAddressBook,
  '--image-emptyTransHistory': lightEmptyTransHistory,
  '--image-outgoingTransHistory': whiteOutgoingTransHistory,
  '--image-incomingTransHistory': lightIncomingTransHistory,
  '--image-pendingTransHistory': lightPendingTransHistory,
  '--image-failedTransHistory': lightFailedTransHistory,
  '--image-emptySearch': lightEmptyTransaction,
  '--image-NoMedia': lightNoMedia,
  '--message-bubbles-received-background-color': whiteBubbleReceivedBg,
};
