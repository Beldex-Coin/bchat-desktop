// src/styles/bchat/classicLight.ts
// GHOST — the light inverse of Noir. Same geometry, flipped materials:
// light ground, ink-black sent blocks, hairline borders, deep network green.
import { accentLightTheme, destructive, greenColor, warning } from './BchatThemeConstants';
import { buttonColor } from './classicDark';
import { BchatVariableTypes } from './bchatVariableTypes';

const lightColorAccent = accentLightTheme;
const lightColorAccentButton = accentLightTheme;
const lightColorText = '#0A0A0A';
const lightColorTextOpposite = '#FFFFFF';
const lightColorTextSubtle = '#0A0A0A99';
const lightColorTextAccent = lightColorAccent;
const lightColorBchatShadow = '0 0 4px 0 #00000029';
const lightColorComposeViewBg = '#EAEAEA';
// Sent messages are ink blocks on the light ground — the inverse of Noir's white blocks.
const lightColorSentMessageBg = '#111111';
const lightSentMessageText = '#F4F4F4';
const lightSettingsleftpaneHover = '#E8E8E8';
const lightSettingsHover = '#E0E0E0';
const lightColorClickableHovered = '#EAEAEA';
const lightColorBchatBorder = '1px solid #D8D8D8';
const lightColorRecoveryPhraseBannerBg = '#FFFFFF';
const lightColorPillDivider = '#D8D8D8';
const lightColorLastSeenIndicator = accentLightTheme;
const lightColorQuoteBottomBarBg = '#EAEAEA';
const lightColorCellBackground = '#FAFAFA';
const lightColorCaret = accentLightTheme;
const lightColorReceivedMessageBg = '#FFFFFF';
const whiteColorReceivedMessageBgHover = '#F4F4F4';
const lightColorReceivedMessageText = '#1A1A1A';
const lightColorPillDividerText = '#6B6B6B';
const lightInputBackground = '#FFFFFF';
const lightFilterBchatText = 'brightness(0) saturate(100%)';
const lightUnreadBorder = `2px solid ${accentLightTheme}`;
const lightScrollbarThumb = '#C4C4C4';
const lightScrollbarTrack = '#F2F2F2';
const lightFakeChatBubbleBg = '#FFFFFF';
const lightInboxBackground = '#F2F2F2';
const lightLeftPaneOverlayBg = '#F2F2F2';
const lightConversationItemSelected = '#E8E8E8';
const lightConversationItemHasUnread = '#ECECEC';
const lightConversationList = '#F2F2F2';
const lightTextHighlight = `${accentLightTheme}44`;

const lightModalBackground = '#FCFCFC';
const lightMessageRequestBannerBackground = lightColorQuoteBottomBarBg;
const lightMessageRequestBannerIconBackground = accentLightTheme;
const lightMessageRequestBannerUnreadBackground = greenColor;
const lightMessageRequestBannerIcon = '#6B6B6B';

const lightMsgReqModalBg = 'rgba(230,230,230,0.4)';
const lightSmModalBg = '#FFFFFF';
const lightCancelBtnBg = '#E4E4E4';
const lightHintMessageText = '#6B6B6B';
const lightSettingIndication = '#FFFFFF';
const lightSinginTextColor = accentLightTheme;
const lightCopyModalbtn = '#EAEAEA';
const lightleftHeaderBg = '#FFFFFF';
const lightLeaveGrpBtn = '#EAEAEA';

const lightEmptyChatImg = 'url("../images/bchat/emptyMessageWhite.svg")';
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

const lightChatHeader = '#F2F2F2';
const lightComposeMsgInput = '#FFFFFF';
const lightDayNight = 'url("../images/bchat/moon.svg")';
const lightNewChat = 'url("../images/bchat/newChatwhite.svg")';
const lightBorderBottomColor = '#D8D8D8';
const lightToggleOff = '#D8D8D8';
const lightClearBtn = '#FFFFFF';
const lightBlockUserBg = '#FFFFFF';
const lightPasswordBorderBottom = '#C4C4C4';
const ligntDisableText = '#B0B0B0';
const lightProfileBgColor = '#FFFFFF';
const whiteBubbleReceivedBg = '#FFFFFF';
const lightBlockseletedUserBg = '#EAEAEA';
const lightDownArrowBg = '#FFFFFF';
const lightDownArrow = '#6B6B6B';

const lightBnsLinkIdBgColor = '#FFFFFF';
const lightBnsCameraIconBgColor = '#FFFFFF';
const lightDisableBtn = '#DEDEDE';
const lightDisableTxt = '#B0B0B0';
const lightLeaveHover = '#D8D8D8';
const lightProfileClose = '#D8D8D8';
const lightChattimestamp = '#6B6B6B';
const lightBgModalColor = 'rgba(0, 0, 0, 0.6)';
const lightBnsTransactionColor = '#1A1A1A';

const lightLogoBg = '#FFFFFF';
const lightActionBtnBg = '#FFFFFF';
const lightActionBtnicon = '#8F8F8F';
const lightActionBtnTxt = '#3A3A3A';
const lightThemeSelectedBg = '#DFEEDF';
const lightLeftPaneBg = '#ECECEC';
const lightSearchBorder = '#C4C4C4';
const lightLastMsgTxt = '#6B6B6B';
const lightContextMenuBg = '#FFFFFF';
const lightProfileIdBg = '#F4F4F4';
const lightProfileIDBorder = '#C4C4C4';
const lightSecondaryBtnBg = '#EAEAEA';
const lightQrOuterBg = '#FFFFFF';
const lightSettingsRightPaneOption = '#FFFFFF';
const lightSettingHeaderBorder = '#D8D8D8';
const lightToggleBtn = '#8F8F8F';
const ligthSettingsRightPaneOptionBorder = '#C4C4C4';
const lightHopBg = '#FFFFFF';
const lightHoptxt = '#3A3A3A';
const lightRecoverySeedBg = '#FFFFFF';
const lightModalFooter = '#F4F4F4';
const lightUntrustMediaBg = '#EAEAEA';
const lightUntrustedVerticalBar = '#C4C4C4';
const lightIconBtnHover = '#E0E0E0';
const lightContextMenuHoverBg = '#EAEAEA';
const lightProfileHeaderBg = '#EAEAEA';
const lightChatIdBorder = '#C4C4C4';
const lightProfileInfoBorder = '#D8D8D8';
const lightDisappearTimeHover = '#EAEAEA';
const lightProfileInfoMediaTitle = '#3A3A3A';
const lightModalBg = '#FFFFFF';
const lightModalIconBg = '#F4F4F4';
const lightChatMultiSelectBg = '#E0E0E0';
const lightConfirmModalInnerBg = '#F4F4F4';
const lightConfirmModalHoverBg = '#EAEAEA';
const lightEnableBtnBg = '#F4F4F4';
const lightModalDisableTxt = '#B0B0B0';
const lightNoTxnTxt = '#8F8F8F';
const lightToastBg = '#FFFFFF';
const lightCallOptionBtnHover = '#EAEAEA';
const lightSpeedPlayBg = '#D8D8D8';
const lightMoreInfoIncommingChatBg = '#F2F2F2';
const lightCameraHoverBg = '#D8D8D8';
const lightSecondaryBtnHoverBg = '#E0E0E0';
const lightPrimaryBtnHoverBg = '#0C820E';
const lightOfflineContentBg = '#F2F2F2';
const lightInputText = '#8F8F8F';
const lightIconColor = '#2A2A2A';
const lightInviteCardIconBg = '#F4F4F4';
const lightRadioButton = '#8F8F8F';
const lightEmojiPanelBg = '#FFFFFF';
const lightEmojiIconHoverBg = '#EAEAEA';
const lightEmojiHeaderIcon = '#3A3A3A';
const lightReplyMsgMediaIcon = '#0A0A0A';
const lightLoaderBg = '#ffffff9e';
const lightAttachmentBoxShadow = '0 0 41.143px 0 rgba(0, 0, 0, 0.10)';
const lightViewContactBorder = '#C4C4C4';

const lightBackgroundPrimary = '#E8E8E8';
const lightButtonGreen = accentLightTheme;
const lightReactionHoverBg = '#EAEAEA';
const lightReadMoreBtnBg = '#EAEAEA';

// Light theme body background
const bodyBgLight = '#F2F2F2';

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
  '--color-sent-message-text': lightSentMessageText,
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
  '--color-read-more-btn-bg': lightReadMoreBtnBg,


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
