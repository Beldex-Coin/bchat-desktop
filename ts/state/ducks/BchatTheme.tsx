import React from 'react';

import { createGlobalStyle } from 'styled-components';

const white = '#F2F2F2';
const black = '#22232E';
const warning = '#e7b100';
const destructive = '#ff453a';
const accentLightTheme = '#159B24';
const accentDarkTheme = '#2879FB';
// const borderLightThemeColor = '#f1f1f1';
// const borderDarkThemeColor = '#ffffff0F';
const baseColor = "#00A803";
const greyColor = "#2D2D3B";
const lightGreyColor = "#646474";
const greenColor = "#16A51C";



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
const darkColorSentMessageText = white;
const darkColorClickableHovered = '#242431';
const darkColorBchatBorder = `2px solid #1A1A24`;
// const darkColorBchatBorderColor = borderDarkThemeColor;
const darkColorRecoveryPhraseBannerBg = '#1f1f1f';
const darkColorPillDivider = '#353535';
const darkColorLastSeenIndicator = accentDarkTheme;
const darkColorQuoteBottomBarBg = '#34323F';
const darkColorCellBackground = '#252531';
const darkColorReceivedMessageBg = '#34323F';
const darkColorReceivedMessageText = white;

const darkColorPillDividerText = '#a0a0a0';
const darkInputBackground = darkColorCellBackground;
const darkFilterBchatText = 'none';
const darkUnreadBorder = `4px solid ${accentDarkTheme}`;

const darkScrollbarThumb = '#504D5D';
const darkScrollbarTrack = '#1C1C26';
const darkFakeChatBubbleBg = '#212121';

const darkInboxBackground = darkScrollbarTrack;
const darkLeftPaneOverlayBg = darkInboxBackground;
const darkConversationItemSelected = '#303041';
const darkConversationItemHasUnread = '#39394A';
const darkConversationList = darkScrollbarTrack;

const darkTextHighlight = `${white}88`;
const darkForegroundPrimary = white;
const darkBackgroundPrimary = '#3A3A4E';
const darkButtonGreen = baseColor;
const darkModalBackground = '#101011';

const grey67 = '#1BB51E';
const darkMessageRequestBannerBackground = darkConversationItemHasUnread;
const darkMessageRequestBannerIconBackground = '#2879FB';
const darkMessageRequestBannerUnreadBackground = grey67;
const darkMessageRequestBannerIcon = '#adadad';
const darkcomposeMsgRecordIcon = "#85858F";

// for bchat
const darkColorBg = black;
// const darkunreadBg="#39394A";
const darkBorderBottomColor = "#1A1A24"
const darkInboxBgColor = "#353543";
const darkHintMessage = "#7B7B86";
const darkTextAreaColor = "#0BB70F";
const darkComposeMsgBg = "#2B2B38";
const darkComposeMsgIconBG = "#2879FB"
const darkSettingIndication = greyColor
const darkProfileBgColor = "#2A2A3B";
const darkSinginTextColor = '#128B17';
const darkHintColor = lightGreyColor;
const darkCopyIcon = "#fff";
const darkCopyIconBg="#353543";
const darkCopyModalbtn='#444455';
const darkChatHeader = "#1c1c26";
const darkToggleOff = '#000';
const darkClearBtn = "#3D3D4D";
const darkLeaveGrpBtn="#20202F";
const darkSmModalBg = "#2A2A3B";
const darkMsgReqModalBg="rgba(0,0,0,0.4)";
const darkOverlayBg="#1C1C26";
const darkleftHeaderBg="#1C1C26";
const darkCancelBtnBg = "#3D3D4E";
const darkDisableText="#545469";
const darkEmptyChatImg = `url("../images/bchat/emptyMessage.svg")`;
const darkBgDoodle = `url("../images/bchat/doodle_white.svg")`;
const darkEmptyContact=`url("../images/bchat/no_con_scrt_grp_dark_theme.svg")`;
const darkChatIcons = "white";
const darkComposeMsgInput = "#3F3C4B";
const darkDayNight = `url("../images/bchat/light_theme .svg")`;
const darkMsgReqImg =`url("../images/bchat/no_message_request_dark_theme.svg")`;
const darkBlockedContact=`url("../images/bchat/no_blocked_contacts_dark_theme.svg")`;
const darkAddContact=`url("../images/bchat/add_contact.svg")`;
const darkNoMedia=`url("../images/bchat/no_mediaDarkTheme.svg")`;

const darkToastSuccessMessage = "linear-gradient(to right,rgba(12, 43, 18, 0.8),rgba(4,35,38,0.8),rgba(28,28,38,0.8))";
const darkToastErrorMessage = "linear-gradient(to right,rgba(56,13,13,0.8),rgba(38,4,4,0.8),rgba(28,28,38,0.8))";
const darkLeftpaneSetting = darkScrollbarTrack;
const darkPasswordBorderBottom="#444455";
const darkRightpaneSetting='#16161D'
// const buttonColor = "red";
const buttonColor = "linear-gradient(to bottom , #13B71A, #006004)";
const darkAudioRecord = "#3F3C4B";

// Seed color
const darkSeedColor = "#00E506";

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
  document.documentElement.style.setProperty('--color-Bchat-hint', darkHintColor);
  document.documentElement.style.setProperty('--color-copyIcon', darkCopyIcon);
  document.documentElement.style.setProperty('--color-copyIconBg', darkCopyIconBg);
  document.documentElement.style.setProperty('--color-copyModalbtn', darkCopyModalbtn);
  document.documentElement.style.setProperty('--color-compose-view-button-background',darkColorComposeViewBg);
  document.documentElement.style.setProperty('--color-sent-message-background',darkColorSentMessageBg);
  document.documentElement.style.setProperty('--color-sent-message-text', darkColorSentMessageText);
  document.documentElement.style.setProperty('--color-clickable-hovered',darkColorClickableHovered);
  document.documentElement.style.setProperty('--color-bchat-border', darkColorBchatBorder);
  // document.documentElement.style.setProperty('--color-bchat-border', darkColorBchatBorderColor);
  document.documentElement.style.setProperty('--color-recovery-phrase-banner-background',darkColorRecoveryPhraseBannerBg);
  document.documentElement.style.setProperty('--color-pill-divider', darkColorPillDivider);
  document.documentElement.style.setProperty('--color-last-seen-indicator',darkColorLastSeenIndicator);
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
  document.documentElement.style.setProperty(
    '--color-overlayBg',
    darkOverlayBg
  );
  document.documentElement.style.setProperty(
    '--color-leaveGrpBtn',
    darkLeaveGrpBtn
  );
  document.documentElement.style.setProperty(
    '--color-borderBottomColor',
    darkBorderBottomColor
  );
  document.documentElement.style.setProperty(
    '--color-inboxBgColor',
    darkInboxBgColor
  );
  document.documentElement.style.setProperty(
    '--color-HintMessageText',
    darkHintMessage
  );

  document.documentElement.style.setProperty(
    '--color-TextAreaColor',
    darkTextAreaColor
  );
  document.documentElement.style.setProperty(
    '--color-leftHeaderBg',
    darkleftHeaderBg
  );
  document.documentElement.style.setProperty(
    '--color-composeMsgBg',
    darkComposeMsgBg
  );
  document.documentElement.style.setProperty(
    '--color-composeMsgInput',
    darkComposeMsgInput
  );

  document.documentElement.style.setProperty(
    '--color-composeMsgIconBG',
    darkComposeMsgIconBG
  );
  document.documentElement.style.setProperty(
    '--color-smModal-bg',
    darkSmModalBg
  );
  document.documentElement.style.setProperty(
    '--color-MsgReqModal-bg',
    darkMsgReqModalBg
  );
  document.documentElement.style.setProperty(
    '--color-cancelBtn-bg',
    darkCancelBtnBg
  );
  document.documentElement.style.setProperty(
    '--color-settingIndication',
    darkSettingIndication
  );
  document.documentElement.style.setProperty(
    '--color-chatHeader',
    darkChatHeader
  );
  document.documentElement.style.setProperty(
    '--color-chatIcons',
    darkChatIcons
  );
  document.documentElement.style.setProperty(
    '--color-composeMsgRecordIcon',
    darkcomposeMsgRecordIcon
  );
  document.documentElement.style.setProperty(
    '--color-leftpaneSetting',
    darkLeftpaneSetting
  );
  document.documentElement.style.setProperty(
    '--color-password-borderBottom',
    darkPasswordBorderBottom
  );
  document.documentElement.style.setProperty(
    '--color-rightpaneSetting',
    darkRightpaneSetting
  );
  document.documentElement.style.setProperty(
    '--color-toggleOff',
    darkToggleOff
  );
  document.documentElement.style.setProperty(
    '--color-clearBtn',
    darkClearBtn
  );
  document.documentElement.style.setProperty(
    '--color-clearBtn',
    darkClearBtn
  );
  document.documentElement.style.setProperty(
    '--color-disableText',
    darkDisableText
  );
  document.documentElement.style.setProperty('--color-toast-success', darkToastSuccessMessage);
  document.documentElement.style.setProperty('--color-toast-error', darkToastErrorMessage);
  document.documentElement.style.setProperty('--color-caret', lightColorCellBackground);

  document.documentElement.style.setProperty(
    '--image-DayNight',
    darkDayNight
  );
  document.documentElement.style.setProperty(
    '--image-EmptyChatImg',
    darkEmptyChatImg
  );
  document.documentElement.style.setProperty(
    '--image-BgDoodle',
    darkBgDoodle
  );
  document.documentElement.style.setProperty(
    '--image-MsgReq',
    darkMsgReqImg
  );
  document.documentElement.style.setProperty(
    '--image-BlockedContact',
    darkBlockedContact
  );
  document.documentElement.style.setProperty(
    '--image-AddContact',
    darkAddContact
  );
  document.documentElement.style.setProperty(
    '--image-EmptyContact',
    darkEmptyContact
  );
  document.documentElement.style.setProperty(
    '--image-NoMedia',
    darkNoMedia
  );
  document.documentElement.style.setProperty(
    '--green-color',
    greenColor
  );
  document.documentElement.style.setProperty(
    '--button-color',
    buttonColor
  );
  document.documentElement.style.setProperty(
    '--color-audio-record',
    darkAudioRecord
  );
  document.documentElement.style.setProperty(
    '--color-seed',
    darkSeedColor
  );
};

// LIGHT COLORS
const lightColorAccent = "#128b17";
const lightColorAccentButton = black;
const lightColorText = '#181818';
const lightColorTextOpposite = white;
const lightColorTextSubtle = `${black}99`;
const lightColorTextAccent = accentLightTheme;
const lightColorBchatShadow = `0 0 4px 0 #00000029`;
const lightColorComposeViewBg = '#efefef';
const lightColorSentMessageBg = "#2879FB";
const lightColorClickableHovered = '#eaeaea';
// const lightColorBchatBorderColor = borderLightThemeColor;
const lightColorBchatBorder = `2px solid #E3E3E3 `;
const lightColorRecoveryPhraseBannerBg = white;
const lightColorPillDivider = `${black}1A`;
const lightColorLastSeenIndicator = black;
const lightColorQuoteBottomBarBg = '#f8f8f8';
const lightColorCellBackground = '#EEEEEE';
const lightColorReceivedMessageBg = '#f5f5f5';
const lightColorReceivedMessageText = black;

const lightColorPillDividerText = '#555555';

const lightInputBackground = '#efefef';
const lightFilterBchatText = 'brightness(0) saturate(100%)';
const lightUnreadBorder = `4px solid ${accentLightTheme}`;

const lightScrollbarThumb = '#D5D5D8';
const lightScrollbarTrack = '#fcfcfc';
const lightFakeChatBubbleBg = '#f5f5f5';

const lightInboxBackground = '#F8F8F8';
const lightLeftPaneOverlayBg = '#EDEDED';
const lightConversationItemSelected = '#fff';
const lightConversationItemHasUnread = '#EDEDED';
const lightConversationList = '#f9f9f9';

const lightTextHighlight = `${black}88`;
const lightForegroundPrimary = white;
// const lightBackgroundPrimary = '#272726';
const lightBackgroundPrimary='#F8F8F8';
const lightButtonGreen = '#FFFFFF';
const lightModalBackground = '#fcfcfc';

const lightMessageRequestBannerBackground = lightColorQuoteBottomBarBg;
const lightMessageRequestBannerIconBackground = '#2879FB';
const lightMessageRequestBannerUnreadBackground = greenColor;
const lightMessageRequestBannerIcon = white;

// for bchat
const lightColorBg = white;
// const lightunreadBg="#EDEDED";
const lightMsgReqModalBg="rgba(230,230,230,0.4)"
const lightSmModalBg = "#F4F4F4";
const lightCancelBtnBg = "#E8E8E8";
const lightInboxBgColor = "#FCFCFC";
// const lightHintMessageText="black";
// const lightTextAreaColor="black";
const lightComposeMsgBg = "#f2f2f2";
// const lightComposeMsgIconBG="#2879fb";
const lightSettingIndication = "#F2F2F2";
const lightSinginTextColor = '#128B17';
const lightHintColor = lightGreyColor;
const lightCopyIcon = '#0BB70F';
const lightCopyIconBg="#EFEFEF";
const lightCopyModalbtn="#F8F8F8";

const lightOverlayBg="#EDEDED";
const lightleftHeaderBg="#F2F2F2";
const lightLeaveGrpBtn="#F2F2F2";


const lightEmptyChatImg = `url("../images/bchat/emptyMessageWhite.svg")`;
const lightBgDoodle = `url("../images/bchat/doodle_dark.svg")`;
const lightMsgReqImg=`url("../images/bchat/no_message_request.svg")`;
const lightBlockedContact=`url("../images/bchat/no_blocked_contacts.svg")`;
const lightAddContact=`url("../images/bchat/add_contact_white_theme.svg")`;
const lightEmptyContact=`url("../images/bchat/no_contact_scrt_grp.svg")`;
const lightNoMedia=`url("../images/bchat/no_mediaWhiteTheme.svg")`
const lightChatHeader = '#EEEEEE';
const lightChatIcons = "black";
const lightComposeMsgInput = "#EAEAEA";
const lightcomposeMsgRecordIcon = "#85858F";
const lightDayNight = `url("../images/bchat/moon.svg")`;
const lightBorderBottomColor = '#E3E3E3';
const lightToggleOff = "#C6C6C6"
const lightClearBtn = '#fff'
const lightLeftpaneSetting = '#f4f4f4';
const lightPasswordBorderBottom="#D5D5D5";
const lightRightpaneSetting="#f8f8f8"
const  ligntDisableText='#B9BABF';
const lightProfileBgColor = "#F8F8F8";
const whiteAudioRecord = "#dcdbdb";


// Toast Colors 
const lightToastSuccessMessage = "linear-gradient(to right, #FFFFFF , #F5F5F5,#F3FFF5)";
const lightToastErrorMessage = "linear-gradient(to right, #FFFFFF , #F5F5F5,#FFF6F6)";

// Seed color
const whiteSeedColor = "#128B17";

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
  document.documentElement.style.setProperty('--color-Bchat-hint', lightHintColor);
  document.documentElement.style.setProperty('--color-bchat-shadow', lightColorBchatShadow);
  document.documentElement.style.setProperty('--color-copyIcon', lightCopyIcon);
  document.documentElement.style.setProperty('--color-copyIconBg', lightCopyIconBg);
  document.documentElement.style.setProperty('--color-copyModalbtn', lightCopyModalbtn);
  document.documentElement.style.setProperty(
    '--color-disableText',
    ligntDisableText
  );
  document.documentElement.style.setProperty(
    '--color-compose-view-button-background',
    lightColorComposeViewBg
  );
  document.documentElement.style.setProperty(
    '--color-leaveGrpBtn',
    lightLeaveGrpBtn
  );
  document.documentElement.style.setProperty(
    '--color-sent-message-background',
    lightColorSentMessageBg
  );
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
    '--color-overlayBg',
    lightOverlayBg
  );
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

  document.documentElement.style.setProperty(
    '--color-settingIndication',
    lightSettingIndication
  );
  document.documentElement.style.setProperty(
    '--color-rightpaneSetting',
    lightRightpaneSetting
  );
  // document.documentElement.style.setProperty(
  //   '--color-unreadBg',
  //   lightunreadBg
  // );
  document.documentElement.style.setProperty(
    '--color-leftHeaderBg',
    lightleftHeaderBg
  );
  document.documentElement.style.setProperty(
    '--color-borderBottomColor',
    lightBorderBottomColor
  );
  document.documentElement.style.setProperty(
    '--color-inboxBgColor',
    lightInboxBgColor
  );
  document.documentElement.style.setProperty(
    '--color-composeMsgIconBG',
    darkComposeMsgIconBG
  );
  document.documentElement.style.setProperty(
    '--color-composeMsgBg',
    lightComposeMsgBg
  );
  document.documentElement.style.setProperty(
    '--color-composeMsgInput',
    lightComposeMsgInput
  );
  document.documentElement.style.setProperty(
    '--color-composeMsgRecordIcon',
    lightcomposeMsgRecordIcon
  );
  document.documentElement.style.setProperty(
    '--color-MsgReqModal-bg',
    lightMsgReqModalBg
  );
  document.documentElement.style.setProperty(
    '--color-smModal-bg',
    lightSmModalBg
  );
  document.documentElement.style.setProperty(
    '--color-cancelBtn-bg',
    lightCancelBtnBg
  );
  document.documentElement.style.setProperty(
    '--color-chatHeader',
    lightChatHeader
  );
  document.documentElement.style.setProperty(
    '--color-chatIcons',
    lightChatIcons
  );
  document.documentElement.style.setProperty(
    '--color-leftpaneSetting',
    lightLeftpaneSetting
  );
  document.documentElement.style.setProperty(
    '--color-password-borderBottom',
    lightPasswordBorderBottom
  );
  document.documentElement.style.setProperty(
    '--color-toggleOff',
    lightToggleOff
  );
  
  document.documentElement.style.setProperty(
    '--color-clearBtn',
    lightClearBtn
  );
  document.documentElement.style.setProperty('--color-toast-success', lightToastSuccessMessage);
  document.documentElement.style.setProperty('--color-toast-error', lightToastErrorMessage);
  document.documentElement.style.setProperty('--color-caret', darkColorCellBackground);


  document.documentElement.style.setProperty(
    '--image-DayNight',
    lightDayNight
  );
  document.documentElement.style.setProperty(
    '--image-EmptyChatImg',
    lightEmptyChatImg
  );
  document.documentElement.style.setProperty(
    '--image-BgDoodle',
    lightBgDoodle
  );
  document.documentElement.style.setProperty(
    '--image-MsgReq',
    lightMsgReqImg
  );
  document.documentElement.style.setProperty(
    '--image-BlockedContact',
    lightBlockedContact
  );
  document.documentElement.style.setProperty(
    '--image-AddContact',
    lightAddContact
  );
  document.documentElement.style.setProperty(
    '--image-EmptyContact',
    lightEmptyContact
  );
  document.documentElement.style.setProperty(
    '--image-NoMedia',
    lightNoMedia
  );
  document.documentElement.style.setProperty(
    '--green-color',
    greenColor
  );
  document.documentElement.style.setProperty(
    '--button-color',
    buttonColor
  );
  document.documentElement.style.setProperty(
    '--color-audio-record',
    whiteAudioRecord
  );
  document.documentElement.style.setProperty(
    '--color-seed',
    whiteSeedColor
  );
};

// default to light theme
export const BchatGlobalStyles = createGlobalStyle`
  html {
    /* FONTS */
    --font-default:  'poppin-medium';
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
    --color-Bchat-hint: ${darkHintColor};
    --color-bchat-shadow: ${darkColorBchatShadow};
    --color-compose-view-button-background: ${darkColorComposeViewBg};
    --color-sent-message-background:  ${darkColorSentMessageBg};
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
    --color-settingIndication:${darkSettingIndication};
    --color-copyIcon:${darkCopyIcon};
    --color-copyIconBg:${darkCopyIconBg};
    --color-copyModalbtn:${darkCopyModalbtn}
    --color-chatHeader:${darkChatHeader};
    --color-chatIcons:${darkChatIcons};
    --color-toggleOff:${darkToggleOff};
    --color-clearBtn:${darkClearBtn};
    --button-color:${buttonColor};
    
    --color-leftpaneSetting:${darkLeftpaneSetting};
    --color-rightpaneSetting:${darkRightpaneSetting}
    --color-disableText:${darkDisableText};
    --color-password-borderBottom:${darkPasswordBorderBottom}
    --color-audio-record:${darkAudioRecord};
    --color-seed:${darkSeedColor};
   
    --color-profile: ${darkProfileBgColor};

    --color-toast-success:${darkToastSuccessMessage};
    --color-toast-error:${darkToastErrorMessage};
    --color-caret:${white};
   

    
    --image-EmptyChatImg:${darkEmptyChatImg};
    --image-BgDoodle:${darkBgDoodle};
    --image-DayNight:${darkDayNight};
    --image-MsgReq:${darkMsgReqImg};
    --image-BlockedContact:${darkBlockedContact};
    --image-AddContact:${darkAddContact};
    --image-EmptyContact:${darkEmptyContact};
    --image-NoMedia:${darkNoMedia};
   

  };
`;

export const BchatTheme = ({ children }: { children: any }) => (
  <>
    <BchatGlobalStyles />
    {children}
  </>
);
