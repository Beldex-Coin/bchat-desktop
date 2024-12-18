import React from 'react';
import _, { debounce, isEmpty } from 'lodash';

import * as MIME from '../../../types/MIME';

import { BchatEmojiPanel } from '../BchatEmojiPanel';
import { BchatRecording } from '../BchatRecording';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

import {
  getPreview,
  LINK_PREVIEW_TIMEOUT,
  BchatStagedLinkPreview,
} from '../BchatStagedLinkPreview';
import { AbortController } from 'abort-controller';
import { BchatQuotedMessageComposition } from '../BchatQuotedMessageComposition';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import autoBind from 'auto-bind';
import { getMediaPermissionsSettings } from '../../settings/BchatSettings';
import { getDraftForConversation, updateDraftForConversation } from '../BchatConversationDrafts';
import {
  AddStagedAttachmentButton,
  // SendFundButton,
  SendFundDisableButton,
  SendMessageButton,
  StartRecordingButton,
} from './CompositionButtons';
import { AttachmentType } from '../../../types/Attachment';
import { connect } from 'react-redux';
import {
  showLinkSharingConfirmationModalDialog,
  unblockConvoById,
} from '../../../interactions/conversationInteractions';
import { getConversationController } from '../../../bchat/conversations';
import { ToastUtils } from '../../../bchat/utils';
import { ReduxConversationType } from '../../../state/ducks/conversations';
import { removeAllStagedAttachmentsInConversation } from '../../../state/ducks/stagedAttachments';
import { StateType } from '../../../state/reducer';
import {
  getIsSelectedNoteToSelf,
  getIsTypingEnabled,
  getMentionsInput,
  getQuotedMessage,
  getSelectedConversation,
  getSelectedConversationKey,
} from '../../../state/selectors/conversations';
import { AttachmentUtil } from '../../../util';
import { Flex } from '../../basic/Flex';
import { CaptionEditor } from '../../CaptionEditor';
import { StagedAttachmentList } from '../StagedAttachmentList';
import { processNewAttachment } from '../../../types/MessageAttachment';
import {
  StagedAttachmentImportedType,
  StagedPreviewImportedType,
} from '../../../util/attachmentsUtil';
import {
  cleanMentions,
  mentionsRegex,
  renderUserMentionRow,
  styleForCompositionBoxSuggestions,
} from './UserMentions';
import { renderEmojiQuickResultRow, searchEmojiForQuery } from './EmojiQuickResult';
import { LinkPreviews } from '../../../util/linkPreviews';
import { SettingsKey, walletSettingsKey } from '../../../data/settings-key';
import {
  updateBchatAlertConfirmModal,
  updateConfirmModal,
  updateInsufficientBalanceModal,
  // updateBchatWalletPasswordModal,
  updateSendConfirmModal,
  updateTransactionInitModal,
} from '../../../state/ducks/modalDialog';
import { SectionType, setOverlayMode, showLeftPaneSection } from '../../../state/ducks/section';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';
import {
  getHeight,
  getRescaning,
  getWalletSyncBarShowInChat,
} from '../../../state/selectors/walletConfig';
import { wallet } from '../../../wallet/wallet-rpc';
import { saveRecipientAddress } from '../../../data/data';
import { ConversationTypeEnum } from '../../../models/conversation';
import { pushToastError } from '../../../bchat/utils/Toast';
import { updateWalletPaymentDetailsSend } from '../../../state/ducks/walletConfig';
import { getBchatAlertConfirmModal } from '../../../state/selectors/modal';
import { BchatIcon } from '../../icon/BchatIcon';
import { getdaemonHeight } from '../../../state/selectors/daemon';
import ChangingProgressProvider from '../../basic/ChangingProgressProvider';
import classNames from 'classnames';
// import MicrophoneIcon from '../../icon/MicrophoneIcon';
import { SpacerLG } from '../../basic/Text';
import BeldexCoinLogo from '../../icon/BeldexCoinLogo';

export interface ReplyingToMessageProps {
  convoId: string;
  id: string;
  author: string;
  timestamp: number;
  text?: string;
  attachments?: Array<any>;
}

export type StagedLinkPreviewImage = {
  data: ArrayBuffer;
  size: number;
  width: number;
  height: number;
  contentType: string;
};

export interface StagedLinkPreviewData {
  isLoaded: boolean;
  title: string | null;
  url: string | null;
  domain: string | null;
  image?: StagedLinkPreviewImage;
}

export interface StagedAttachmentType extends AttachmentType {
  file: File;
  path?: string; // a bit hacky, but this is the only way to make our sending audio message be playable, this must be used only for those message
}

export type SendMessageType = {
  body: string;
  attachments: Array<StagedAttachmentImportedType> | undefined;
  quote: any | undefined;
  preview: any | undefined;
  groupInvitation: { url: string | undefined; name: string } | undefined;
  txnDetails?: {
    amount: any;
    txnId: any;
  };
};

interface Props {
  sendMessage: (msg: SendMessageType) => void;
  selectedConversationKey?: string;
  selectedConversation: ReduxConversationType | undefined;
  typingEnabled: boolean;
  WalletSyncBarShowInChat: boolean;
  walletSyncStatus: boolean;
  isMe: boolean;
  quotedMessageProps?: ReplyingToMessageProps;
  stagedAttachments: Array<StagedAttachmentType>;
  onChoseAttachments: (newAttachments: Array<File>) => void;
  walletDetails: any;
  BchatAlertConfirmModal: any;
  walletHeight: any;
  deamonHeight: any;
}

interface State {
  showRecordingView: boolean;
  draft: string;
  showEmojiPanel: boolean;
  ignoredLink?: string; // set the ignored url when users closed the link preview
  stagedLinkPreview?: StagedLinkPreviewData;
  showCaptionEditor?: AttachmentType;
}

const sendMessageStyle = {
  control: {},
  input: {
    overflow: 'auto',
    maxHeight: '80px',
    wordBreak: 'break-word',
    padding: '0px',
    margin: '0px',
  },
  highlighter: {
    boxSizing: 'border-box',
    overflow: 'hidden',
    maxHeight: '80px',
  },
  flexGrow: 1,

  maxHeight: '80px',
  width: '100%',
  ...styleForCompositionBoxSuggestions,
};

const getDefaultState = (newConvoId?: string) => {
  return {
    draft: getDraftForConversation(newConvoId),
    showRecordingView: false,
    showEmojiPanel: false,
    ignoredLink: undefined,
    stagedLinkPreview: undefined,
    showCaptionEditor: undefined,
  };
};

const getSelectionBasedOnMentions = (draft: string, index: number) => {
  // we have to get the real selectionStart/end of an index in the mentions box.
  // this is kind of a pain as the mentions box has two inputs, one with the real text, and one with the extracted mentions

  // the index shown to the user is actually just the visible part of the mentions (so the part between ￗ...ￒ
  const matches = draft.match(mentionsRegex);

  let lastMatchStartIndex = 0;
  let lastMatchEndIndex = 0;
  let lastRealMatchEndIndex = 0;

  if (!matches) {
    return index;
  }
  const mapStartToLengthOfMatches = matches.map(match => {
    const displayNameStart = match.indexOf('\uFFD7') + 1;
    const displayNameEnd = match.lastIndexOf('\uFFD2');
    const displayName = match.substring(displayNameStart, displayNameEnd);

    const currentMatchStartIndex = draft.indexOf(match) + lastMatchStartIndex;
    lastMatchStartIndex = currentMatchStartIndex;
    lastMatchEndIndex = currentMatchStartIndex + match.length;

    const realLength = displayName.length + 1;
    lastRealMatchEndIndex = lastRealMatchEndIndex + realLength;

    // the +1 is for the @
    return {
      length: displayName.length + 1,
      lastRealMatchEndIndex,
      start: lastMatchStartIndex,
      end: lastMatchEndIndex,
    };
  });

  const beforeFirstMatch = index < mapStartToLengthOfMatches[0].start;
  if (beforeFirstMatch) {
    // those first char are always just char, so the mentions logic does not come into account
    return index;
  }
  const lastMatchMap = _.last(mapStartToLengthOfMatches);

  if (!lastMatchMap) {
    return Number.MAX_SAFE_INTEGER;
  }

  const indexIsAfterEndOfLastMatch = lastMatchMap.lastRealMatchEndIndex <= index;
  if (indexIsAfterEndOfLastMatch) {
    const lastEnd = lastMatchMap.end;
    const diffBetweenEndAndLastRealEnd = index - lastMatchMap.lastRealMatchEndIndex;
    return lastEnd + diffBetweenEndAndLastRealEnd - 1;
  }
  // now this is the hard part, the cursor is currently between the end of the first match and the start of the last match
  // for now, just append it to the end
  return Number.MAX_SAFE_INTEGER;
};

class CompositionBoxInner extends React.Component<Props, State> {
  private readonly textarea: React.RefObject<any>;
  private readonly fileInput: React.RefObject<HTMLInputElement>;
  private readonly emojiPanel: React.RefObject<HTMLDivElement>;
  private readonly emojiPanelButton: any;
  private linkPreviewAbortController?: AbortController;
  private container: HTMLDivElement | null;
  private lastBumpTypingMessageLength: number = 0;
  private readonly chatwithWallet: boolean;

  constructor(props: Props) {
    super(props);
    this.state = getDefaultState();

    this.textarea = React.createRef();
    this.fileInput = React.createRef();

    this.container = null;
    // Emojis
    this.emojiPanel = React.createRef();
    this.emojiPanelButton = React.createRef();
    autoBind(this);
    this.toggleEmojiPanel = debounce(this.toggleEmojiPanel.bind(this), 100);
    this.chatwithWallet = window.getSettingValue(SettingsKey.settingsChatWithWallet) || false;
  }

  public componentDidMount() {
    setTimeout(this.focusCompositionBox, 500);

    const div = this.container;
    div?.addEventListener('paste', this.handlePaste);
  }

  public componentWillUnmount() {
    this.linkPreviewAbortController?.abort();
    this.linkPreviewAbortController = undefined;

    const div = this.container;
    div?.removeEventListener('paste', this.handlePaste);
  }

  sendAmountValidation() {
    const { selectedConversation, WalletSyncBarShowInChat, isMe } = this.props;
    const { draft } = this.state;
    const getSyncStatus = window.getSettingValue('syncStatus');
    // const re = /^\d+\.?\d*$/;
    const re = /^\d+(\.\d{1,5})?$/;
    const results =
      selectedConversation?.type === 'private' &&
      re.test(draft) &&
      Number(draft) >= 0.1 &&
      // && (draft.length-1 - draft.indexOf(".")) < 4
      selectedConversation?.isApproved &&
      selectedConversation?.didApproveMe &&
      !selectedConversation?.isBlocked &&
      this.chatwithWallet &&
      WalletSyncBarShowInChat &&
      !isMe &&
      getSyncStatus &&
      draft.length <= 16;

    return results;
  }
  chatWithWalletInstruction() {
    const { WalletSyncBarShowInChat } = this.props;
    // if (this.chatwithWallet && !WalletSyncBarShowInChat) {
    //   window.inboxStore?.dispatch(updateBchatWalletPasswordModal({}));
    //   return;
    // }
    if (!this.chatwithWallet && !WalletSyncBarShowInChat) {
      window.inboxStore?.dispatch(
        updateBchatAlertConfirmModal({
          onClickOk: async () => {
            window.inboxStore?.dispatch(updateBchatAlertConfirmModal(null));
            window.inboxStore?.dispatch(showLeftPaneSection(SectionType.Settings));

            // dispatch(setOverlayMode());
            window.inboxStore?.dispatch(setOverlayMode(undefined));
            // window.inboxStore?.dispatch(updateBchatAlertConfirmModal(null));
            // window.inboxStore?.dispatch(showLeftPaneSection(3));
            // window.setSettingValue(SettingsKey.settingChatwithWalletInstruction,false);
            // forceUpdate();
          },
          onClickCancel: () => window.inboxStore?.dispatch(updateBchatAlertConfirmModal(null)),
        })
      );
    }
  }

  sendConfirmModal() {
    const messagePlaintext = cleanMentions(this.state.draft);
    const priority = window.getSettingValue(walletSettingsKey.settingsPriority) || 'Flash';

    if (!this.props.selectedConversation?.walletAddress) {
      return pushToastError(
        '',
        'To send & receive BDX in-chat, start a conversation with your friend first.'
      );
    }
    window.inboxStore?.dispatch(
      updateSendConfirmModal({
        okTheme: BchatButtonColor.Green,
        address: this.props.selectedConversation?.walletAddress,
        amount: messagePlaintext,
        fee: priority === 'Flash' ? 0.0291 : 0.0096,
        Priority: priority,
        onClickOk: async () => {
          await this.sendFund();
          // window.inboxStore?.dispatch(updateTransactionInitModal({}));
        },
        onClickClose: () => {
          window.inboxStore?.dispatch(updateSendConfirmModal(null));
        },
      })
    );
  }

  sendFund = async () => {
    const draft: any = this.state.draft;
    const priority = window.getSettingValue(walletSettingsKey.settingsPriority) || 'Flash';

    if (draft == 0) {
      window.inboxStore?.dispatch(updateSendConfirmModal(null));
      window.inboxStore?.dispatch(updateTransactionInitModal(null));
      return ToastUtils.pushToastError('zeroAmount', 'Amount must be greater than zero');
    }
    if (draft > this.props.walletDetails.unlocked_balance / 1e9) {
      window.inboxStore?.dispatch(updateSendConfirmModal(null));
      window.inboxStore?.dispatch(updateTransactionInitModal(null));
      // return ToastUtils.pushToastError('notEnoughBalance', 'Not enough unlocked balance..');
      return window.inboxStore?.dispatch(updateInsufficientBalanceModal(true));
    }
    let decimalValue: any =
      window.getSettingValue(walletSettingsKey.settingsDecimal) || '2 - Two (0.00)';
    const isSweepAll =
      draft === (this.props.walletDetails.unlocked_balance / 1e9).toFixed(decimalValue.charAt(0));
    window.inboxStore?.dispatch(updateSendConfirmModal(null));
    window.inboxStore?.dispatch(updateTransactionInitModal({}));

    let transactionInitiatDetails: any = {
      message: {
        messageType: 'payment',
        props: {
          id: this.props.selectedConversation?.id,
          acceptUrl: '',
          amount: this.state.draft,
          direction: 'outgoing',
          isUnread: false,
          messageId: '1234-567-7890',
          receivedAt: 1678799702674,
          txnId: '',
        },

        showDateBreak: 1678799702809,
        showUnreadIndicator: false,
      },
    };
    window.inboxStore?.dispatch(updateWalletPaymentDetailsSend(transactionInitiatDetails));
    let data: any = await wallet.transfer(
      this.props.selectedConversation?.walletAddress,
      draft * 1e9,
      priority === 'Flash' ? 0 : 1,
      isSweepAll
    );
    if (data.result) {
      const TransactionHistory = {
        tx_hash: data.result.tx_hash_list[0],
        address: this.props.selectedConversation?.walletAddress,
      };
      let getSettingvalue = window.getSettingValue(walletSettingsKey.settingSaveRecipient);
      if (getSettingvalue) {
        await saveRecipientAddress(TransactionHistory);
      }
      // let sendViaMsg = `Amount:${draft},Transaction_hash:${`https://explorer.beldex.io/tx/`}${TransactionHistory.tx_hash
      //   }`;
      // this.setState({ draft: sendViaMsg });

      window.inboxStore?.dispatch(updateSendConfirmModal(null));
      window.inboxStore?.dispatch(updateTransactionInitModal(null));
      ToastUtils.pushToastSuccess('successfully-sended', `Your transaction was successful.`);
      let selectedConversationKey: any = this.props.selectedConversationKey;

      const privateConvo = await getConversationController().getOrCreateAndWait(
        selectedConversationKey,
        ConversationTypeEnum.PRIVATE
      );

      window.inboxStore?.dispatch(updateWalletPaymentDetailsSend(null));

      if (privateConvo) {
        void privateConvo.sendMessage({
          body: '',
          attachments: undefined,
          groupInvitation: undefined,
          preview: undefined,
          quote: undefined,
          txnDetails: {
            amount: (data?.result?.amount_list[0] / 1e9).toString(),
            txnId: TransactionHistory.tx_hash,
          },
        });

        // Empty composition box and stagedAttachments
        this.setState({
          showEmojiPanel: false,
          stagedLinkPreview: undefined,
          ignoredLink: undefined,
          draft: '',
        });
        updateDraftForConversation({
          conversationKey: selectedConversationKey,
          draft: '',
        });
      }
      // dispatch(walletTransactionPage());
    } else {
      // clearStateValue();
      window.inboxStore?.dispatch(updateSendConfirmModal(null));
      window.inboxStore?.dispatch(updateTransactionInitModal(null));

      return data;
    }
  };

  public componentDidUpdate(prevProps: Props, _prevState: State) {
    // reset the state on new conversation key
    if (prevProps.selectedConversationKey !== this.props.selectedConversationKey) {
      this.setState(getDefaultState(this.props.selectedConversationKey), this.focusCompositionBox);
      this.lastBumpTypingMessageLength = 0;
    } else if (this.props.stagedAttachments?.length !== prevProps.stagedAttachments?.length) {
      // if number of staged attachment changed, focus the composition box for a more natural UI
      this.focusCompositionBox();
    }

    // focus the composition box when user clicks start to reply to a message
    if (!_.isEqual(prevProps.quotedMessageProps, this.props.quotedMessageProps)) {
      this.focusCompositionBox();
    }
  }

  public render() {
    return (
      <Flex flexDirection="column">
        {/* {this.renderStagedLinkPreview()} */}
        {/* {this.renderAttachmentsStaged()} */}
        <div className="composition-container">{this.renderCompositionView()}</div>
      </Flex>
    );
  }

  private handleClick(e: any) {
    if (
      (this.emojiPanel?.current && this.emojiPanel.current.contains(e.target)) ||
      (this.emojiPanelButton?.current && this.emojiPanelButton.current.contains(e.target))
    ) {
      return;
    }

    this.hideEmojiPanel();
  }

  private handlePaste(e: ClipboardEvent) {
    if (!e.clipboardData) {
      return;
    }
    const { items } = e.clipboardData;
    let imgBlob = null;
    for (const item of items as any) {
      const pasteType = item.type.split('/')[0];
      if (pasteType === 'image') {
        imgBlob = item.getAsFile();
      }

      switch (pasteType) {
        case 'image':
          imgBlob = item.getAsFile();
          break;
        case 'text':
          void showLinkSharingConfirmationModalDialog(e);
          break;
        default:
      }
    }
    if (imgBlob !== null) {
      const file = imgBlob;
      window?.log?.info('Adding attachment from clipboard', file);
      this.props.onChoseAttachments([file]);

      e.preventDefault();
      e.stopPropagation();
    }
  }

  private showEmojiPanel() {
    document.addEventListener('mousedown', this.handleClick, false);

    this.setState({
      showEmojiPanel: true,
    });
  }

  private hideEmojiPanel() {
    document.removeEventListener('mousedown', this.handleClick, false);

    this.setState({
      showEmojiPanel: false,
    });
  }

  private toggleEmojiPanel() {
    if (this.state.showEmojiPanel) {
      this.hideEmojiPanel();
    } else {
      this.showEmojiPanel();
    }
  }

  private percentageCalc() {
    const { walletHeight, deamonHeight } = this.props;
    let currentHeight = 0;
    let valdatedDaemonHeight = 0;
    const currentDaemon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon);
    if (currentDaemon?.type === 'Local') {
      currentHeight = Number(deamonHeight);
      valdatedDaemonHeight = Number(walletHeight);
    } else {
      currentHeight = walletHeight;
      valdatedDaemonHeight = deamonHeight;
    }
    let pct: any =
      currentHeight == 0 || valdatedDaemonHeight == 0
        ? 0
        : ((100 * currentHeight) / valdatedDaemonHeight).toFixed(1);

    const percentage = pct == 100.0 && currentHeight < valdatedDaemonHeight ? 99.9 : pct;
    window.setSettingValue('syncStatus', percentage >= 99);

    return percentage;
  }

  private renderRecordingView() {
    return (
      <BchatRecording
        sendVoiceMessage={this.sendVoiceMessage}
        onLoadVoiceNoteView={this.onLoadVoiceNoteView}
        onExitVoiceNoteView={this.onExitVoiceNoteView}
      />
    );
  }

  private bchatWalletView() {
    const { selectedConversation, WalletSyncBarShowInChat } = this.props;
    // const { draft } = this.state;
    // const re = /^\d+\.?\d*$/;
    return (
      <>
        {selectedConversation?.type === 'private' &&
        selectedConversation?.isApproved &&
        selectedConversation?.didApproveMe &&
        !selectedConversation?.isBlocked &&
        // re.test(draft) &&
        this.chatwithWallet &&
        WalletSyncBarShowInChat ? (
          <>{this.renderCurcularBar()}</>
        ) : (
          <SendFundDisableButton onClick={() => this.chatWithWalletInstruction()} />
        )}
      </>
    );
  }

  // private sendMessageValidation() {
  //   const { draft } = this.state;
  //   const re = /^\d+\.?\d*$/;
  //   const { selectedConversation, isMe, WalletSyncBarShowInChat ,walletSyncStatus} = this.props;
  // const getSyncStatus = window.getSettingValue('syncStatus');

  //   if (
  //     selectedConversation?.type === 'private' &&
  //     re.test(draft) &&
  //     this.chatwithWallet &&
  //     WalletSyncBarShowInChat
  //   ) {
  //     this.sendConfirmModal();
  //   } else {
  //     this.onSendMessage();
  //   }
  // }
  private sendButton() {
    // const { selectedConversation, WalletSyncBarShowInChat, isMe } = this.props;
    // const { draft } = this.state;
    // const getSyncStatus = window.getSettingValue('syncStatus');
    // const re = /^\d+\.?\d*$/;
    return (
      <>
        {/* {selectedConversation?.type === 'private' &&
        re.test(draft) &&
        // && (draft.length-1 - draft.indexOf(".")) < 4
        selectedConversation?.isApproved &&
        selectedConversation?.didApproveMe &&
        !selectedConversation?.isBlocked &&
        this.chatwithWallet &&
        WalletSyncBarShowInChat &&
        !isMe &&
        getSyncStatus ? ( */}
        {/* {this.sendAmountValidation() ? (
          <SendMessageButton name="Pay" onClick={() => this.sendConfirmModal()} />
        ) :  */}

        <SendMessageButton name="Send" onClick={() => this.onSendMessage()} />
        {/* } */}
      </>
    );
  }

  private renderCurcularBar(ispopover?: boolean) {
    const pathColor = this.percentageCalc() !== 0 ? '#108D32' : '#FDB12A';
    return (
      <ChangingProgressProvider values={[0, 20, 40, 60, 80, 100]}>
        {() => (
          <CircularProgressbarWithChildren
            value={this.percentageCalc()}
            styles={{
              // Customize the root svg element
              root: {
                width: ispopover ? '47px' : '40px',
              },
              // Customize the path, i.e. the "completed progress"
              path: {
                // Path color
                stroke: `${pathColor}`,
                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: 'butt',
                // Customize transition animation
                transition: 'stroke-dashoffset 0.5s ease 0s',
                // Rotate the path
                // transform: 'rotate(0.25turn)',
                transformOrigin: 'center center',
              },
              // Customize the circle behind the path, i.e. the "total progress"
              trail: {
                // Trail color
                // stroke: '#108D32',
                stroke: '#888A8D',

                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: 'butt',
                // Rotate the trail
                transform: 'rotate(0.25turn)',
                transformOrigin: 'center center',
              },
            }}
          >
            {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}

            {ispopover ? (
              <span className="inner-perc-txt">{Math.floor(this.percentageCalc())}%</span>
            ) : (
              <BchatIcon iconType={'beldexCoinLogo'} iconSize={20} iconColor=" #888A8D" />
            )}
          </CircularProgressbarWithChildren>
        )}
      </ChangingProgressProvider>
    );
  }
  deleteContact() {
    const convoId: any = this.props.selectedConversationKey;
    window?.inboxStore?.dispatch(
      updateConfirmModal({
        title: window.i18n('editMenuDeleteContact'),
        message: 'Permanently delete the Contact?',
        onClickClose: () => window?.inboxStore?.dispatch(updateConfirmModal(null)),
        onClickOk: async () => {
          await getConversationController().deleteContact(convoId);
        },
        okText: 'Delete',
        okTheme: BchatButtonColor.Danger,
      })
    );
  }

  private renderBlockedContactBottoms() {
    const convoId: any = this.props.selectedConversationKey;
    return (
      <Flex container={true} justifyContent="center" alignItems="center" height="90px">
        <BchatButton
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Danger}
          text={'Delete this contact'}
          onClick={() => this.deleteContact()}
        />
        <SpacerLG />
        <BchatButton
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Primary}
          text={'Unblock contact'}
          onClick={() => unblockConvoById(convoId)}
        />
      </Flex>
    );
  }
  private renderCompositionView() {
    const { showEmojiPanel } = this.state;
    const { typingEnabled, stagedAttachments } = this.props;

    const { selectedConversation, isMe, WalletSyncBarShowInChat } = this.props;
    const { draft } = this.state;
    const syncStatus =
      this.percentageCalc() === 0
        ? 'Scanning..'
        : this.percentageCalc() > 0 && this.percentageCalc() < 98
        ? 'Syncronizing..'
        : 'Synchronized';

    // const {WalletSyncBarShowInChat}=this.props
    return (
      <>
        {selectedConversation?.isBlocked ? (
          this.renderBlockedContactBottoms()
        ) : (
          <>
            {typingEnabled && <AddStagedAttachmentButton onClick={this.onChooseAttachment} />}

            <input
              className="hidden"
              placeholder="Attachment"
              multiple={true}
              ref={this.fileInput}
              type="file"
              onChange={this.onChoseAttachment}
            />

            {this.state.showRecordingView && typingEnabled ? (
              this.renderRecordingView()
            ) : (
              <>
                <div
                  className="send-message-input"
                  role="main"
                  onClick={this.focusCompositionBox} // used to focus on the textarea when clicking in its container
                  ref={el => {
                    this.container = el;
                  }}
                  data-testid="message-input"
                >
                  <BchatQuotedMessageComposition />

                  {this.renderStagedLinkPreview()}
                  {this.renderAttachmentsStaged()}

                  <Flex
                    container={true}
                    flexDirection="row"
                    width="100%"
                    alignItems="center"
                    style={{ minHeight: '60px' }}
                  >
                    {this.renderTextArea()}

                    <div
                      className={classNames(
                        WalletSyncBarShowInChat &&
                          !this.sendAmountValidation() &&
                          'circular-bar-wrapper'
                      )}
                    >
                      {selectedConversation?.isPrivate && typingEnabled && !isMe
                        ? this.bchatWalletView()
                        : ''}
                    </div>
                    <div className="wallet-sync-box">
                      <div className="sync-txt">
                        Wallet <span> {syncStatus}</span>
                      </div>
                      <div>{this.renderCurcularBar(true)}</div>
                    </div>
                    {this.sendAmountValidation() && (
                      <div className="amount-tap-box" onClick={() => this.sendConfirmModal()}>
                        <div className="sync-txt" style={{ marginRight: 'unset' }}>
                          Tap to send <BeldexCoinLogo iconSize={22} /> <span> {draft} </span>BDX{' '}
                          <BchatIcon iconType="send" iconSize={20} iconColor="#0B9E3C" />
                        </div>
                      </div>
                    )}
                  </Flex>
                </div>
                {typingEnabled && (draft || stagedAttachments.length !== 0) ? (
                  <div className={classNames('send-message-button')}>{this.sendButton()}</div>
                ) : (
                  <StartRecordingButton onClick={this.onLoadVoiceNoteView} />
                )}
              </>
            )}
            {typingEnabled && (
              <div ref={this.emojiPanel} onKeyDown={this.onKeyDown} role="button">
                {showEmojiPanel && (
                  <BchatEmojiPanel onEmojiClicked={this.onEmojiClick} show={showEmojiPanel} />
                )}
              </div>
            )}
          </>
        )}
      </>
    );
  }

  private renderTextArea() {
    const { i18n } = window;
    const { draft } = this.state;

    if (!this.props.selectedConversation) {
      return null;
    }

    const makeMessagePlaceHolderText = () => {
      if (isKickedFromGroup) {
        return i18n('youGotKickedFromGroup');
      }
      if (left) {
        return i18n('youLeftTheGroup');
      }
      if (isBlocked && isPrivate) {
        return i18n('unblockToSend');
      }
      if (isBlocked && !isPrivate) {
        return i18n('unblockGroupToSend');
      }
      return i18n('sendMessage');
    };

    const { isKickedFromGroup, left, isPrivate, isBlocked } = this.props.selectedConversation;
    const messagePlaceHolder = makeMessagePlaceHolderText();
    const { typingEnabled } = this.props;
    const neverMatchingRegex = /($a)/;

    return (
      <MentionsInput
        value={draft}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        placeholder={messagePlaceHolder}
        spellCheck={true}
        inputRef={this.textarea}
        disabled={!typingEnabled}
        rows={1}
        data-testid="message-input-text-area"
        style={sendMessageStyle}
        suggestionsPortalHost={this.container as any}
        forceSuggestionsAboveCursor={true} // force mentions to be rendered on top of the cursor, this is working with a fork of react-mentions for now
      >
        <Mention
          appendSpaceOnAdd={true}
          // this will be cleaned on cleanMentions()
          markup="@ￒ__id__ￗ__display__ￒ" // ￒ = \uFFD2 is one of the forbidden char for a display name (check displayNameRegex)
          trigger="@"
          // this is only for the composition box visible content. The real stuff on the backend box is the @markup
          displayTransform={(_id, display) => `@${display}`}
          data={this.fetchUsersForGroup}
          renderSuggestion={renderUserMentionRow}
        />
        <Mention
          trigger=":"
          markup="__id__"
          appendSpaceOnAdd={true}
          regex={neverMatchingRegex}
          data={searchEmojiForQuery}
          renderSuggestion={renderEmojiQuickResultRow}
        />
      </MentionsInput>
    );
  }

  private fetchUsersForOpenGroup(
    query: string,
    callback: (data: Array<SuggestionDataItem>) => void
  ) {
    const mentionsInput = getMentionsInput(window?.inboxStore?.getState() || []);
    const filtered =
      mentionsInput
        .filter(d => !!d)
        .filter(d => d.authorProfileName !== 'Anonymous')
        .filter(d => d.authorProfileName?.toLowerCase()?.includes(query.toLowerCase()))
        // Transform the users to what react-mentions expects
        .map(user => {
          return {
            display: user.authorProfileName,
            id: user.id,
          };
        }) || [];

    callback(filtered);
  }

  private fetchUsersForGroup(query: string, callback: (data: Array<SuggestionDataItem>) => void) {
    let overridenQuery = query;
    if (!query) {
      overridenQuery = '';
    }
    if (!this.props.selectedConversation) {
      return;
    }

    if (this.props.selectedConversation.isPublic) {
      this.fetchUsersForOpenGroup(overridenQuery, callback);
      return;
    }
    if (!this.props.selectedConversation.isPrivate) {
      this.fetchUsersForClosedGroup(overridenQuery, callback);
      return;
    }
  }

  private fetchUsersForClosedGroup(query: any, callback: any) {
    const { selectedConversation } = this.props;
    if (!selectedConversation) {
      return;
    }
    const allPubKeys = selectedConversation.members;
    if (!allPubKeys || allPubKeys.length === 0) {
      return;
    }

    const allMembers = allPubKeys.map(pubKey => {
      const conv = getConversationController().get(pubKey);
      let profileName = 'Anonymous';
      if (conv) {
        profileName = conv.getProfileName() || 'Anonymous';
      }
      return {
        id: pubKey,
        authorProfileName: profileName,
      };
    });
    // keep anonymous members so we can still quote them with their id
    const members = allMembers
      .filter(d => !!d)
      .filter(
        d =>
          d.authorProfileName?.toLowerCase()?.includes(query.toLowerCase()) || !d.authorProfileName
      );

    // Transform the users to what react-mentions expects
    const mentionsData = members.map(user => ({
      display: user.authorProfileName || window.i18n('anonymous'),
      id: user.id,
    }));
    callback(mentionsData);
  }

  private renderStagedLinkPreview(): JSX.Element | null {
    // Don't generate link previews if user has turned them off
    if (!(window.getSettingValue('link-preview-setting') || false)) {
      return null;
    }

    const { stagedAttachments, quotedMessageProps } = this.props;
    const { ignoredLink } = this.state;

    // Don't render link previews if quoted message or attachments are already added
    if (stagedAttachments.length !== 0 || quotedMessageProps?.id) {
      return null;
    }
    // we try to match the first link found in the current message
    const links = LinkPreviews.findLinks(this.state.draft, undefined);
    if (!links || links.length === 0 || ignoredLink === links[0]) {
      if (this.state.stagedLinkPreview) {
        this.setState({
          stagedLinkPreview: undefined,
        });
      }
      return null;
    }
    const firstLink = links[0];
    // if the first link changed, reset the ignored link so that the preview is generated
    if (ignoredLink && ignoredLink !== firstLink) {
      this.setState({ ignoredLink: undefined });
    }
    if (firstLink !== this.state.stagedLinkPreview?.url) {
      // trigger fetching of link preview data and image
      this.fetchLinkPreview(firstLink);
    }

    // if the fetch did not start yet, just don't show anything
    if (!this.state.stagedLinkPreview) {
      return null;
    }

    const { isLoaded, title, domain, image } = this.state.stagedLinkPreview;

    return (
      <BchatStagedLinkPreview
        isLoaded={isLoaded}
        title={title}
        domain={domain}
        image={image}
        url={firstLink}
        onClose={url => {
          this.setState({ ignoredLink: url });
        }}
      />
    );
  }

  private fetchLinkPreview(firstLink: string) {
    // mark the link preview as loading, no data are set yet
    this.setState({
      stagedLinkPreview: {
        isLoaded: false,
        url: firstLink,
        domain: null,
        image: undefined,
        title: null,
      },
    });
    const abortController = new AbortController();
    this.linkPreviewAbortController?.abort();
    this.linkPreviewAbortController = abortController;
    setTimeout(() => {
      abortController.abort();
    }, LINK_PREVIEW_TIMEOUT);

    getPreview(firstLink, abortController.signal)
      .then(ret => {
        // we finished loading the preview, and checking the abortConrtoller, we are still not aborted.
        // => update the staged preview
        if (this.linkPreviewAbortController && !this.linkPreviewAbortController.signal.aborted) {
          this.setState({
            stagedLinkPreview: {
              isLoaded: true,
              title: ret?.title || null,
              url: ret?.url || null,
              domain: (ret?.url && LinkPreviews.getDomain(ret.url)) || '',
              image: ret?.image,
            },
          });
        } else if (this.linkPreviewAbortController) {
          this.setState({
            stagedLinkPreview: {
              isLoaded: false,
              title: null,
              url: null,
              domain: null,
              image: undefined,
            },
          });
          this.linkPreviewAbortController = undefined;
        }
      })
      .catch(err => {
        window?.log?.warn('fetch link preview: ', err);
        const aborted = this.linkPreviewAbortController?.signal.aborted;
        this.linkPreviewAbortController = undefined;
        // if we were aborted, it either means the UI was unmount, or more probably,
        // than the message was sent without the link preview.
        // So be sure to reset the staged link preview so it is not sent with the next message.

        // if we were not aborted, it's probably just an error on the fetch. Nothing to do excpet mark the fetch as done (with errors)

        if (aborted) {
          this.setState({
            stagedLinkPreview: undefined,
          });
        } else {
          this.setState({
            stagedLinkPreview: {
              isLoaded: true,
              title: null,
              url: firstLink,
              domain: null,
              image: undefined,
            },
          });
        }
      });
  }

  private onClickAttachment(attachment: AttachmentType) {
    this.setState({ showCaptionEditor: attachment });
  }

  private renderCaptionEditor(attachment?: AttachmentType) {
    if (attachment) {
      const onSave = (caption: string) => {
        // eslint-disable-next-line no-param-reassign
        attachment.caption = caption;
        ToastUtils.pushToastInfo('saved', window.i18n('saved'));
        // close the lightbox on save
        this.setState({
          showCaptionEditor: undefined,
        });
      };

      const url = attachment.videoUrl || attachment.url;
      return (
        <CaptionEditor
          attachment={attachment}
          url={url}
          onSave={onSave}
          caption={attachment.caption}
          onClose={() => {
            this.setState({
              showCaptionEditor: undefined,
            });
          }}
        />
      );
    }
    return null;
  }

  private renderAttachmentsStaged() {
    const { stagedAttachments } = this.props;
    const { showCaptionEditor } = this.state;

    if (stagedAttachments && stagedAttachments.length) {
      return (
        <>
          <StagedAttachmentList
            attachments={stagedAttachments}
            onClickAttachment={this.onClickAttachment}
            onAddAttachment={this.onChooseAttachment}
          />
          {this.renderCaptionEditor(showCaptionEditor)}
        </>
      );
    }
    return null;
  }

  private onChooseAttachment() {
    if (
      !this.props.selectedConversation?.didApproveMe &&
      this.props.selectedConversation?.isPrivate
    ) {
      ToastUtils.pushNoMediaUntilApproved();
      return;
    }
    this.fileInput.current?.click();
  }

  private async onChoseAttachment() {
    // Build attachments list
    let attachmentsFileList = null;

    // this is terrible, but we have to reset the input value manually.
    // otherwise, the user won't be able to select two times the same file for example.
    if (this.fileInput.current?.files) {
      attachmentsFileList = Array.from(this.fileInput.current.files);
      this.fileInput.current.files = null;
      this.fileInput.current.value = '';
    }
    if (!attachmentsFileList || attachmentsFileList.length === 0) {
      return;
    }
    this.props.onChoseAttachments(attachmentsFileList);
  }

  private async onKeyDown(event: any) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      // If shift, newline. If in IME composing mode, leave it to IME. Else send message.
      event.preventDefault();
      // await this.onSendMessage();
      const {
        selectedConversation,
        WalletSyncBarShowInChat,
        isMe,
        BchatAlertConfirmModal,
      } = this.props;
      const getSyncStatus = window.getSettingValue('syncStatus');
      const { draft } = this.state;
      const re = /^\d+\.?\d*$/;
      // const { WalletSyncBarShowInChat } = this.props;
      if (
        selectedConversation?.type === 'private' &&
        re.test(draft) &&
        this.chatwithWallet &&
        selectedConversation?.isApproved &&
        selectedConversation?.didApproveMe &&
        WalletSyncBarShowInChat &&
        !isMe &&
        getSyncStatus
      ) {
        await this.sendConfirmModal();
      } else {
        if (!BchatAlertConfirmModal) {
          await this.onSendMessage();
        }
      }
    } else if (event.key === 'Escape' && this.state.showEmojiPanel) {
      this.hideEmojiPanel();
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      // swallow pageUp events if they occurs on the composition box (it breaks the app layout)
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private async onKeyUp() {
    if (!this.props.selectedConversationKey) {
      throw new Error('selectedConversationKey is needed');
    }
    const { draft } = this.state;
    // Called whenever the user changes the message composition field. But only
    //   fires if there's content in the message field after the change.
    // Also, check for a message length change before firing it up, to avoid
    // catching ESC, tab, or whatever which is not typing
    if (draft && draft.length && draft.length !== this.lastBumpTypingMessageLength) {
      const conversationModel = getConversationController().get(this.props.selectedConversationKey);
      if (!conversationModel) {
        return;
      }
      conversationModel.throttledBumpTyping();
      this.lastBumpTypingMessageLength = draft.length;
    }
  }

  // tslint:disable-next-line: cyclomatic-complexitysend
  private async onSendMessage() {
    if (!this.props.selectedConversationKey) {
      throw new Error('selectedConversationKey is needed');
    }
    this.linkPreviewAbortController?.abort();

    const messagePlaintext = cleanMentions(this.state.draft);

    const { selectedConversation } = this.props;

    if (!selectedConversation) {
      return;
    }

    if (selectedConversation.isBlocked && selectedConversation.isPrivate) {
      ToastUtils.pushUnblockToSend();
      return;
    }
    if (selectedConversation.isBlocked && !selectedConversation.isPrivate) {
      ToastUtils.pushUnblockToSendGroup();
      return;
    }
    // Verify message length
    const msgLen = messagePlaintext.trim().length || 0;

    if (msgLen === 0 && this.props.stagedAttachments?.length === 0) {
      ToastUtils.pushMessageBodyMissing();
      return;
    }

    if (!selectedConversation.isPrivate && selectedConversation.left) {
      ToastUtils.pushYouLeftTheGroup();
      return;
    }
    if (!selectedConversation.isPrivate && selectedConversation.isKickedFromGroup) {
      ToastUtils.pushYouLeftTheGroup();
      return;
    }

    const { quotedMessageProps } = this.props;

    const { stagedLinkPreview } = this.state;

    // Send message
    const extractedQuotedMessageProps = _.pick(
      quotedMessageProps,
      'id',
      'author',
      'text',
      'attachments'
    );

    // we consider that a link preview without a title at least is not a preview
    const linkPreview =
      stagedLinkPreview?.isLoaded && stagedLinkPreview.title?.length
        ? _.pick(stagedLinkPreview, 'url', 'image', 'title')
        : undefined;

    try {
      // this does not call call removeAllStagedAttachmentsInConvers
      const { attachments, previews } = await this.getFiles(linkPreview);
      this.props.sendMessage({
        body: messagePlaintext,
        attachments: attachments || [],
        quote: extractedQuotedMessageProps,
        preview: previews,
        groupInvitation: undefined,
      });

      window.inboxStore?.dispatch(
        removeAllStagedAttachmentsInConversation({
          conversationKey: this.props.selectedConversationKey,
        })
      );
      // Empty composition box and stagedAttachments
      this.setState({
        showEmojiPanel: false,
        stagedLinkPreview: undefined,
        ignoredLink: undefined,
        draft: '',
      });
      updateDraftForConversation({
        conversationKey: this.props.selectedConversationKey,
        draft: '',
      });
    } catch (e) {
      // Message sending failed
      window?.log?.error(e);
    }
  }

  // this function is called right before sending a message, to gather really the files behind attachments.
  private async getFiles(
    linkPreview?: Pick<StagedLinkPreviewData, 'url' | 'title' | 'image'>
  ): Promise<{
    attachments: Array<StagedAttachmentImportedType>;
    previews: Array<StagedPreviewImportedType>;
  }> {
    const { stagedAttachments } = this.props;

    let attachments: Array<StagedAttachmentImportedType> = [];
    let previews: Array<StagedPreviewImportedType> = [];

    if (_.isEmpty(stagedAttachments)) {
      attachments = [];
    } else {
      // scale them down
      const files = await Promise.all(stagedAttachments.map(AttachmentUtil.getFileAndStoreLocally));
      attachments = _.compact(files);
    }

    if (!linkPreview || _.isEmpty(linkPreview) || !linkPreview.url || !linkPreview.title) {
      previews = [];
    } else {
      const sharedDetails = { url: linkPreview.url, title: linkPreview.title };
      // store the first image preview locally and get the path and details back to include them in the message
      const firstLinkPreviewImage = linkPreview.image;
      if (firstLinkPreviewImage && !isEmpty(firstLinkPreviewImage)) {
        const storedLinkPreviewAttachment = await AttachmentUtil.getFileAndStoreLocallyImageBuffer(
          firstLinkPreviewImage.data
        );
        if (storedLinkPreviewAttachment) {
          previews = [{ ...sharedDetails, image: storedLinkPreviewAttachment }];
        } else {
          // we couldn't save the image or whatever error happened, just return the url + title
          previews = [sharedDetails];
        }
      } else {
        // we did not fetch an image from the server
        previews = [sharedDetails];
      }
    }

    return { attachments, previews };
  }

  private async sendVoiceMessage(audioBlob: Blob) {
    if (!this.state.showRecordingView) {
      return;
    }
    const { selectedConversation } = this.props;
    if (selectedConversation?.isBlocked && selectedConversation?.isPrivate) {
      ToastUtils.pushUnblockToSend();
      return;
    }
    if (selectedConversation?.isBlocked && !selectedConversation?.isPrivate) {
      ToastUtils.pushUnblockToSendGroup();
      return;
    }
    const savedAudioFile = await processNewAttachment({
      data: await audioBlob.arrayBuffer(),
      isRaw: true,
      contentType: MIME.AUDIO_MP3,
    });
    // { ...savedAudioFile, path: savedAudioFile.path },
    const audioAttachment: StagedAttachmentType = {
      file: new File([], 'bchat-audio-message'), // this is just to emulate a file for the staged attachment type of that audio file
      contentType: MIME.AUDIO_MP3,
      size: savedAudioFile.size,
      fileSize: null,
      screenshot: null,
      fileName: 'bchat-audio-message',
      thumbnail: null,
      url: '',
      isVoiceMessage: true,
      path: savedAudioFile.path,
    };

    this.props.sendMessage({
      body: '',
      attachments: [audioAttachment],
      preview: undefined,
      quote: undefined,
      groupInvitation: undefined,
    });

    this.onExitVoiceNoteView();
  }

  private async onLoadVoiceNoteView() {
    if (!getMediaPermissionsSettings()) {
      window.inboxStore?.dispatch(
        updateConfirmModal({
          title: window.i18n('audioPermissionNeededTitle'),
          message: window.i18n('audioPermissionNeeded'),
          okText: window.i18n('allow'),
          cancelText: window.i18n('deny'),
          okTheme: BchatButtonColor.Primary,
          onClickOk: async () => {
            await window.toggleMediaPermissions();
            // this.forceUpdate();
            window.inboxStore?.dispatch(updateConfirmModal(null));
          },
          closeAfterInput: false,
          iconShow: true,
          customIcon: (
            <BchatIcon
              iconType={'microphone'}
              iconSize={30}
              iconColor="var(--color-icon)"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          ),
        })
      );
      return;
    }
    this.setState({
      showRecordingView: true,
      showEmojiPanel: false,
    });
  }

  private onExitVoiceNoteView() {
    this.setState({ showRecordingView: false });
  }

  private onChange(event: any) {
    if (!this.props.selectedConversationKey) {
      throw new Error('selectedConversationKey is needed');
    }
    const draft = event.target.value ?? '';
    this.setState({ draft });
    updateDraftForConversation({ conversationKey: this.props.selectedConversationKey, draft });
  }

  private onEmojiClick({ native }: any) {
    if (!this.props.selectedConversationKey) {
      throw new Error('selectedConversationKey is needed');
    }
    const messageBox = this.textarea.current;
    if (!messageBox) {
      return;
    }

    const { draft } = this.state;

    const currentSelectionStart = Number(messageBox.selectionStart);

    const realSelectionStart = getSelectionBasedOnMentions(draft, currentSelectionStart);

    const before = draft.slice(0, realSelectionStart);
    const end = draft.slice(realSelectionStart);

    const newMessage = `${before}${native}${end}`;
    this.setState({ draft: newMessage });
    updateDraftForConversation({
      conversationKey: this.props.selectedConversationKey,
      draft: newMessage,
    });

    // update our selection because updating text programmatically
    // will put the selection at the end of the textarea
    // const selectionStart = currentSelectionStart + Number(1);
    // messageBox.selectionStart = selectionStart;
    // messageBox.selectionEnd = selectionStart;

    // // Sometimes, we have to repeat the set of the selection position with a timeout to be effective
    // setTimeout(() => {
    //   messageBox.selectionStart = selectionStart;
    //   messageBox.selectionEnd = selectionStart;
    // }, 20);
  }

  private focusCompositionBox() {
    // Focus the textarea when user clicks anywhere in the composition box
    this.textarea.current?.focus();
  }
}

const mapStateToProps = (state: StateType) => {
  return {
    quotedMessageProps: getQuotedMessage(state),
    selectedConversation: getSelectedConversation(state),
    selectedConversationKey: getSelectedConversationKey(state),
    typingEnabled: getIsTypingEnabled(state),
    isMe: getIsSelectedNoteToSelf(state),
    WalletSyncBarShowInChat: getWalletSyncBarShowInChat(state),
    walletSyncStatus: getRescaning(state),
    walletDetails: state.wallet,
    BchatAlertConfirmModal: getBchatAlertConfirmModal(state),
    deamonHeight: getdaemonHeight(state),
    walletHeight: getHeight(state),
  };
};

const smart = connect(mapStateToProps);

export const CompositionBox = smart(CompositionBoxInner);
