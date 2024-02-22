export type LocalizerKeys =
  | 'amount'
  | 'address'
  | 'priority'
  | 'contact'
  | 'notes'
  | 'optional'
  | 'transactions'
  | 'filter'
  | 'filterPlaceHolder'
  | 'filterAll'
  | 'addressBook'
  | 'wallet'
  | 'receiveBDX'
  | 'hintReceiveBDX'
  | 'removePassword'
  | 'copyAddress'
  | 'pending'
  | 'bns'
  | 'failed'
  | 'pool'
  | 'miner'
  | 'mnode'
  | 'gov'
  | 'stake'
  | 'node'
  | 'walletNode'
  | 'personal'
  | 'almostThere'
  | 'walletSyncingNow'
  | 'blocksRemaining'
  | 'recipientAddress'
  | 'transactionFee'
  | 'dateTime'
  | 'remoteDaemonOnly'
  | 'localDaemonOnly'
  | 'nCurrentRPCTxt'
  | 'enterSeed'
  | 'enterWalletPassword'
  | 'usdCurrency'
  | 'audCurrency'
  | 'bgnCurrency'
  | 'remoteNodeHost'
  | 'remoteNodePort'
  | 'localNodeHost'
  | 'localNodePort'
  | 'localDeamonheadetcntent'
  | 'chooseRemoteDaemonNode'
  | 'flash'
  | 'slow'
  | 'decimals'
  | 'test'
  | 'transactionInitiated'
  | 'filterIncoming'
  | 'filterOutgoing'
  | 'filterPending'
  | 'displayCurrency'
  | 'enterAmount'
  | 'forgotPassword'
  | 'enterwalletPassword'
  | 'invalidRestoreDate'
  | 'changewalletPassword'
  | 'reEnterPassword'
  | 'saveRecipientAddress'
  | 'remoteNoteToAllTransactions'
  | 'addRemoteDaemonNode'
  | 'newSecretGroup'
  | 'userUnbanFailed'
  | 'changePassword'
  | 'resetDatabase'
  | 'saved'
  | 'disclaimerForgotPassword'
  | 'startedACall'
  | 'mainMenuWindow'
  | 'unblocked'
  | 'keepDisabled'
  | 'userAddedToModerators'
  | 'to'
  | 'send'
  | 'sent'
  | 'requestsPlaceholder'
  | 'secretGroupInviteFailMessage'
  | 'noContactsForGroup'
  | 'linkVisitWarningMessage'
  | 'messageRequestAcceptedOurs'
  | 'anonymous'
  | 'youHaveANewFriendRequest'
  | 'viewMenuZoomOut'
  | 'dialogClearAllDataDeletionFailedDesc'
  | 'timerOption_10_seconds_abbreviated'
  | 'enterDisplayName'
  | 'connectToServerFail'
  | 'disableNotifications'
  | 'publicChatExists'
  | 'noMediaUntilApproved'
  | 'passwordViewTitle'
  | 'joinSocialGroupAfterInvitationConfirmationTitle'
  | 'notificationMostRecentFrom'
  | 'messageRequestAccepted'
  | 'timerOption_5_minutes'
  | 'linkPreviewsConfirmMessage'
  | 'notificationMostRecent'
  | 'video'
  | 'readReceiptSettingDescription'
  | 'userBanFailed'
  | 'autoUpdateLaterButtonLabel'
  | 'maximumAttachments'
  | 'deviceOnly'
  | 'beginYourBchat'
  | 'typingIndicatorsSettingDescription'
  | 'changePasswordToastDescription'
  | 'addingContacts'
  | 'passwordLengthError'
  | 'typingIndicatorsSettingTitle'
  | 'maxPasswordAttempts'
  | 'viewMenuToggleDevTools'
  | 'fileSizeWarning'
  | 'openSocialURL'
  | 'hideMenuBarDescription'
  | 'pickSecretGroupMember'
  | 'ByUsingThisMaster...'
  | 'startConversation'
  | 'shareBchatIdDiscription'
  | 'unableToCallTitle'
  | 'yourUniqueBchatID'
  | 'typingAlt'
  | 'orJoinOneOfThese'
  | 'members'
  | 'noMessageRequestsPending'
  | 'sendRecoveryPhraseMessage'
  | 'timerOption_1_hour'
  | 'youGotKickedFromGroup'
  | 'cannotRemoveCreatorFromGroupDesc'
  | 'incomingError'
  | 'notificationsSettingsTitle'
  | 'ringing'
  | 'tookAScreenshot'
  | 'from'
  | 'thisMonth'
  | 'next'
  | 'addModerators'
  | 'bchatMessenger'
  | 'today'
  | 'mustBeApproved'
  | 'appMenuHideOthers'
  | 'sendFailed'
  | 'openMessageRequestInbox'
  | 'enterPassword'
  | 'enterBchatIDOfRecipient'
  | 'dialogClearAllDataDeletionFailedMultiple'
  | 'pinConversationLimitToastDescription'
  | 'appMenuQuit'
  | 'windowMenuZoom'
  | 'allUsersAreRandomly...'
  | 'cameraPermissionNeeded'
  | 'requestsSubtitle'
  | 'secretGroupInviteSuccessTitle'
  | 'accept'
  | 'hideBanner'
  | 'setPasswordTitle'
  | 'editMenuUndo'
  | 'pinConversation'
  | 'lightboxImageAlt'
  | 'linkDevice'
  | 'callMissedNotApproved'
  | 'goToOurSurvey'
  | 'invalidPubkeyFormat'
  | 'disappearingMessagesDisabled'
  | 'spellCheckDescription'
  | 'autoUpdateNewVersionInstructions'
  | 'appMenuUnhide'
  | 'timerOption_30_minutes_abbreviated'
  | 'transactionDetails'
  | 'pruneSettingDescription'
  | 'voiceMessage'
  | 'changePasswordTitle'
  | 'copyMessage'
  | 'messageDeletionForbidden'
  | 'deleteJustForMe'
  | 'changeAccountPasswordTitle'
  | 'onionPathIndicatorDescription'
  | 'pruningSocialgroupDialogSubMessage'
  | 'mediaPermissionsTitle'
  | 'replyingToMessage'
  | 'welcomeToYourBchat'
  | 'editMenuCopy'
  | 'leftTheGroup'
  | 'timerOption_30_minutes'
  | 'nameOnly'
  | 'typeInOldPassword'
  | 'imageAttachmentAlt'
  | 'displayNameEmpty'
  | 'inviteContacts'
  | 'callMediaPermissionsTitle'
  | 'blocked'
  | 'hideRequestBannerDescription'
  | 'noBlockedContacts'
  | 'leaveGroupConfirmation'
  | 'banUserAndDeleteAll'
  | 'joinSocialGroupAfterInvitationConfirmationDesc'
  | 'invalidNumberError'
  | 'newBchat'
  | 'contextMenuNoSuggestions'
  | 'recoveryPhraseRevealButtonText'
  | 'banUser'
  | 'answeredACall'
  | 'sendMessage'
  | 'recoveryPhraseRevealMessage'
  | 'showRecoveryPhrase'
  | 'autoUpdateSettingDescription'
  | 'unlock'
  | 'remove'
  | 'restoreUsingRecoveryPhrase'
  | 'cannotUpdateDetail'
  | 'showRecoveryPhrasePasswordRequest'
  | 'spellCheckDirty'
  | 'debugLogExplanation'
  | 'secretGroupInviteFailTitle'
  | 'setAccountPasswordDescription'
  | 'removeAccountPasswordDescription'
  | 'establishingConnection'
  | 'noModeratorsToRemove'
  | 'moreInformation'
  | 'offline'
  | 'appearanceSettingsTitle'
  | 'mainMenuView'
  | 'mainMenuEdit'
  | 'notificationForConvo_disabled'
  | 'leaveGroupConfirmationAdmin'
  | 'notificationForConvo_all'
  | 'emptyGroupNameError'
  | 'copySocialGroupURL'
  | 'setPasswordInvalid'
  | 'timerOption_30_seconds_abbreviated'
  | 'removeResidueMembers'
  | 'areYouSureDeleteEntireAccount'
  | 'currentPassword'
  | 'secretGroupInviteOkText'
  | 'readReceiptSettingTitle'
  | 'copyBchatID'
  | 'timerOption_0_seconds'
  | 'themeTitle'
  | 'zoomFactorSettingTitle'
  | 'unableToCall'
  | 'chatFontSize'
  | 'chatWithWallet'
  | 'payYouChat'
  | 'EnablepaySettingsChat'
  | 'warningWalletPassword'
  | 'callMissedTitle'
  | 'done'
  | 'videoAttachmentAlt'
  | 'message'
  | 'mainMenuHelp'
  | 'open'
  | 'nameAndMessage'
  | 'autoUpdateDownloadedMessage'
  | 'onionPathIndicatorTitle'
  | 'unknown'
  | 'mediaMessage'
  | 'addAsModerator'
  | 'secretGroupInviteFailTitlePlural'
  | 'enterBchatID'
  | 'editGroup'
  | 'incomingCallFrom'
  | 'timerSetOnSync'
  | 'deleteMessages'
  | 'spellCheckTitle'
  | 'translation'
  | 'editMenuSelectAll'
  | 'messageBodyMissing'
  | 'timerOption_12_hours_abbreviated'
  | 'onlyAdminCanRemoveMembersDesc'
  | 'kickedFromTheGroup'
  | 'windowMenuMinimize'
  | 'debugLog'
  | 'timerOption_0_seconds_abbreviated'
  | 'timerOption_5_minutes_abbreviated'
  | 'goToReleaseNotes'
  | 'unpinConversation'
  | 'viewMenuResetZoom'
  | 'startInTrayDescription'
  | 'groupNamePlaceholder'
  | 'messageRequestPending'
  | 'stagedPreviewThumbnail'
  | 'helpUsTranslateBchat'
  | 'editMenuDeleteGroup'
  | 'unreadMessages'
  | 'documents'
  | 'audioPermissionNeededTitle'
  | 'deleteMessagesQuestion'
  | 'clickToTrustContact'
  | 'secretGroupInviteFailMessagePlural'
  | 'noAudioInputFound'
  | 'timerOption_10_seconds'
  | 'openMessageRequestInboxDescription'
  | 'noteToSelf'
  | 'failedToAddAsModerator'
  | 'disabledDisappearingMessages'
  | 'cannotUpdate'
  | 'device'
  | 'replyToMessage'
  | 'messageDeletedPlaceholder'
  | 'notificationFrom'
  | 'displayName'
  | 'invalidBchatId'
  | 'audioPermissionNeeded'
  | 'add'
  | 'messageRequests'
  | 'show'
  | 'cannotMixImageAndNonImageAttachments'
  | 'viewMenuToggleFullScreen'
  | 'goToSupportPage'
  | 'oldPasswordAndNewPasswordSame'
  | 'passwordsDoNotMatch'
  | 'createSecretGroupNamePrompt'
  | 'pruningSocialgroupDialogMessage'
  | 'audioMessageAutoplayDescription'
  | 'leaveAndRemoveForEveryone'
  | 'previewThumbnail'
  | 'photo'
  | 'setPassword'
  | 'editMenuDeleteContact'
  | 'hideMenuBarTitle'
  | 'imageCaptionIconAlt'
  | 'sendRecoveryPhraseTitle'
  | 'multipleJoinedTheGroup'
  | 'messageRequestAcceptedOursNoName'
  | 'databaseError'
  | 'resend'
  | 'copiedToClipboard'
  | 'secretGroupInviteSuccessTitlePlural'
  | 'groupMembers'
  | 'dialogClearAllDataDeletionQuestion'
  | 'unableToLoadAttachment'
  | 'cameraPermissionNeededTitle'
  | 'editMenuRedo'
  | 'hideRequestBanner'
  | 'changeNicknameMessage'
  | 'close'
  | 'deleteMessageQuestion'
  | 'newMessage'
  | 'windowMenuClose'
  | 'mainMenuFile'
  | 'callMissed'
  | 'getStarted'
  | 'unblockUser'
  | 'unblockUserSelect'
  | 'blockUser'
  | 'clearAllConfirmationTitle'
  | 'trustThisContactDialogTitle'
  | 'received'
  | 'trimDatabaseConfirmationBody'
  | 'setPasswordFail'
  | 'clearNickname'
  | 'connectToServerSuccess'
  | 'viewMenuZoomIn'
  | 'invalidSocialGroupUrl'
  | 'entireAccount'
  | 'noContactsToAdd'
  | 'cancel'
  | 'decline'
  | 'originalMessageNotFound'
  | 'autoUpdateRestartButtonLabel'
  | 'deleteConversationConfirmation'
  | 'timerOption_6_hours_abbreviated'
  | 'timerOption_1_week_abbreviated'
  | 'timerSetTo'
  | 'enable'
  | 'notificationSubtitle'
  | 'youChangedTheTimer'
  | 'updatedTheGroup'
  | 'leaveGroup'
  | 'continueYourBchat'
  | 'invalidGroupNameTooShort'
  | 'notificationForConvo'
  | 'noNameOrMessage'
  | 'pinConversationLimitTitle'
  | 'noSearchResults'
  | 'changeNickname'
  | 'userUnbanned'
  | 'respondingToRequestWarning'
  | 'error'
  | 'clearAllData'
  | 'pruningSocialgroupDialogTitle'
  | 'contactAvatarAlt'
  | 'disappearingMessages'
  | 'autoUpdateNewVersionTitle'
  | 'linkPreviewDescription'
  | 'timerOption_1_day'
  | 'contactsHeader'
  | 'socialGroupInvitation'
  | 'callMissedCausePermission'
  | 'mediaPermissionsDescription'
  | 'media'
  | 'noMembersInThisGroup'
  | 'saveLogToDesktop'
  | 'copyErrorAndQuit'
  | 'onlyAdminCanRemoveMembers'
  | 'passwordTypeError'
  | 'createSecretGroupPlaceholder'
  | 'editProfileModalTitle'
  | 'noCameraFound'
  | 'setAccountPasswordTitle'
  | 'callMediaPermissionsDescription'
  | 'recoveryPhraseSecureTitle'
  | 'yesterday'
  | 'secretGroupInviteSuccessMessage'
  | 'youDisabledDisappearingMessages'
  | 'updateGroupDialogTitle'
  | 'surveyTitle'
  | 'userRemovedFromModerators'
  | 'timerOption_5_seconds'
  | 'failedToRemoveFromModerator'
  | 'conversationsHeader'
  | 'setPasswordToastDescription'
  | 'audio'
  | 'startInTrayTitle'
  | 'cannotRemoveCreatorFromGroup'
  | 'editMenuCut'
  | 'markAllAsRead'
  | 'failedResolveOns'
  | 'showDebugLog'
  | 'declineRequestMessage'
  | 'autoUpdateDownloadButtonLabel'
  | 'dialogClearAllDataDeletionFailedTitleQuestion'
  | 'autoUpdateDownloadInstructions'
  | 'dialogClearAllDataDeletionFailedTitle'
  | 'loading'
  | 'blockedSettingsTitle'
  | 'appMenuHide'
  | 'removeAccountPasswordTitle'
  | 'recoveryPhraseEmpty'
  | 'noAudioOutputFound'
  | 'save'
  | 'connectWallet'
  | 'typing'
  | 'privacySettingsTitle'
  | 'changeAccountPasswordDescription'
  | 'notificationSettingsDialog'
  | 'notificationPreview'
  | 'notificationSound'
  | 'invalidOldPassword'
  | 'messageBody'
  | 'audioMessageAutoplayTitle'
  | 'removePasswordInvalid'
  | 'password'
  | 'usersCanShareTheir...'
  | 'nicknamePlaceholder'
  | 'linkPreviewsTitle'
  | 'continue'
  | 'learnMore'
  | 'passwordCharacterError'
  | 'autoUpdateSettingTitle'
  | 'documentsEmptyState'
  | 'deleteForEveryone'
  | 'createBchatID'
  | 'multipleLeftTheGroup'
  | 'enterBchatIDOrBNSName'
  | 'quoteThumbnailAlt'
  | 'timerOption_1_week'
  | 'deleteContactConfirmation'
  | 'timerOption_30_seconds'
  | 'createAccount'
  | 'timerOption_1_minute_abbreviated'
  | 'timerOption_1_hour_abbreviated'
  | 'timerOption_12_hours'
  | 'unblockToSend'
  | 'timerOption_1_minute'
  | 'yourBchatID'
  | 'deleteAccountWarning'
  | 'deleted'
  | 'secretGroupMaxSize'
  | 'messagesHeader'
  | 'joinSocialGroup'
  | 'callMediaPermissionsDialogContent'
  | 'timerOption_1_day_abbreviated'
  | 'about'
  | 'clearAllConfirmationBody'
  | 'ok'
  | 'multipleKickedFromTheGroup'
  | 'trimDatabase'
  | 'clearAll'
  | 'recoveryPhraseSavePromptMain'
  | 'editMenuPaste'
  | 'areYouSureDeleteDeviceOnly'
  | 'or'
  | 'removeModerators'
  | 'destination'
  | 'invalidGroupNameTooLong'
  | 'youLeftTheGroup'
  | 'theyChangedTheTimer'
  | 'userBanned'
  | 'addACaption'
  | 'timerOption_5_seconds_abbreviated'
  | 'removeFromModerators'
  | 'enterRecoveryPhrase'
  | 'stagedImageAttachment'
  | 'thisWeek'
  | 'savedTheFile'
  | 'mediaEmptyState'
  | 'linkVisitWarningTitle'
  | 'invalidPassword'
  | 'endCall'
  | 'connectingToServer'
  | 'settingsHeader'
  | 'autoUpdateNewVersionMessage'
  | 'oneNonImageAtATimeToast'
  | 'removePasswordTitle'
  | 'iAmSure'
  | 'selectMessage'
  | 'enterAnSocialGroupURL'
  | 'delete'
  | 'changePasswordInvalid'
  | 'unblockGroupToSend'
  | 'timerOption_6_hours'
  | 'confirmPassword'
  | 'downloadAttachment'
  | 'trimDatabaseDescription'
  | 'showUserDetails'
  | 'titleIsNow'
  | 'emptyPassword'
  | 'removePasswordToastDescription'
  | 'recoveryPhrase'
  | 'recoveryKey'
  | 'hops'
  | 'newMessages'
  | 'you'
  | 'pruneSettingTitle'
  | 'unbanUser'
  | 'notificationForConvo_mentions_only'
  | 'trustThisContactDialogDescription'
  | 'unknownCountry'
  | 'searchFor...'
  | 'joinedTheGroup'
  | 'editGroupName'
  | 'reportIssue'
  | 'copyToContinueRecovery'
  | 'saveYourRecoveryPhrase'
  | 'chatId'
  | 'welcome'
  | 'yourBchatName'
  | 'beldexAddress'
  | 'beldexAddressConnection'
  | 'signIn'
  | 'restore'
  | 'restoreFromSeed'
  | 'hops'
  | 'BchatID'
  | 'profileBeldexAddres'
  | 'scanQr'
  | 'emptyChatScreen'
  | 'noContactsYet'
  | 'BChat'
  | 'WalletSettingsTitle'
  | 'rescanWallet'
  | 'rescanWalletDiscription'
  | 'Rescan'
  | 'removePasswordDisc'
  | 'walletPasswordLengthError'
  | 'passwordFieldEmpty'
  | 'notEnoughBalance'
  | 'emptyAddressBook'
  | 'emptyContact'
  | 'emptyTransaction'
  | 'emptyTransactionDiscription'
  | 'noPendingTransaction'
  | 'noFailedTransaction'
  | 'noOutgoingTransaction'
  | 'noIncomingTransaction'
  | 'walletSyncingDiscription'
  | 'seedFieldEmpty'
  | 'searchEmptyTransaction'
  | 'NodeTestResult'
  | 'Chat'
  | 'chatWithWalletDisc';
