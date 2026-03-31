import React from 'react';
import _, { debounce, isEmpty } from 'lodash';

import * as MIME from '../../../types/MIME';

import { BchatEmojiPanel, StyledEmojiPanel } from '../BchatEmojiPanel';
import { BchatRecording } from '../BchatRecording';

import {
  getPreview,
  LINK_PREVIEW_TIMEOUT,
  BchatStagedLinkPreview,
} from '../BchatStagedLinkPreview';
import { AbortController } from 'abort-controller';
import { BchatQuotedMessageComposition } from '../BchatQuotedMessageComposition';
import autoBind from 'auto-bind';
import { getMediaPermissionsSettings } from '../../settings/BchatSettings';
import { getDraftForConversation, updateDraftForConversation } from '../BchatConversationDrafts';
import {
  AddStagedAttachmentButton,
  SendMessageButton,
  StartRecordingButton,
  ToggleEmojiButton,
} from './CompositionButtons';
import { AttachmentType } from '../../../types/Attachment';
import { connect } from 'react-redux';
import {
  showLinkSharingConfirmationModalDialog,
  unblockConvoById,
} from '../../../interactions/conversationInteractions';
import { getConversationController } from '../../../bchat/conversations';
import { ToastUtils } from '../../../bchat/utils';
import {
  closeRightPanel,
  closeShareContact,
  openShareContact,
  ReduxConversationType,
} from '../../../state/ducks/conversations';
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
  renderUserMentionRow,
} from './UserMentions';
// import { renderEmojiQuickResultRow, searchEmojiForQuery } from './EmojiQuickResult';
import { LinkPreviews } from '../../../util/linkPreviews';
import {
  updateConfirmModal,
  // updateShareContactModal,
} from '../../../state/ducks/modalDialog';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../../basic/BchatButton';
import { BchatIcon } from '../../icon/BchatIcon';
import classNames from 'classnames';
// import MicrophoneIcon from '../../icon/MicrophoneIcon';
import { SpacerLG, SpacerSM } from '../../basic/Text';
import styled from 'styled-components';

// import { BaseEmoji } from 'emoji-mart';
// import { nativeEmojiData } from '../../../util/emoji';
import { FixedBaseEmoji } from '../../../types/Reaction';
import { updateIsCurrentlyRecording } from '../../../state/ducks/userConfig';
import MediaFileIcon from '../../icon/MediaFileIcon';
import ContactsIcon from '../../icon/ContactsIcon';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  TextNode,
  $createTextNode,
  $getRoot,
  LexicalNode,
  $isTextNode,
  $isElementNode,
  $createParagraphNode,
} from 'lexical';
import MentionPlugin from '../MentionPlugin';
import { MentionNode } from '../MentionNode';

export interface ReplyingToMessageProps {
  convoId: string;
  id: string;
  author: string;
  timestamp: number;
  text?: string;
  attachments?: Array<any>;
  direction: 'incoming' | 'outgoing';
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
  payment?: {
    amount: string;
    txnId: string;
  };
  sharedContact?: {
    address: string;
    name: string;
  };
};

interface Props {
  sendMessage: (msg: SendMessageType) => void;
  selectedConversationKey?: string;
  selectedConversation: ReduxConversationType | undefined;
  typingEnabled: boolean;
  isMe: boolean;
  quotedMessageProps?: ReplyingToMessageProps;
  stagedAttachments: Array<StagedAttachmentType>;
  onChoseAttachments: (newAttachments: Array<File>) => void;
}

interface State {
  showRecordingView: boolean;
  draft: string;
  showEmojiPanel: boolean;
  ignoredLink?: string; // set the ignored url when users closed the link preview
  stagedLinkPreview?: StagedLinkPreviewData;
  showCaptionEditor?: AttachmentType;
  selectionMenuIsVisble: boolean;
  items: any;
}



const getDefaultState = (newConvoId?: string) => {
  return {
    draft: getDraftForConversation(newConvoId),
    showRecordingView: false,
    showEmojiPanel: false,
    ignoredLink: undefined,
    stagedLinkPreview: undefined,
    showCaptionEditor: undefined,
    selectionMenuIsVisble: false,
    items: {},
  };
};


const StyledEmojiPanelContainer = styled.div`
  ${StyledEmojiPanel} {
    position: absolute;
    bottom: 68px;
    right: 0px;
  }
`;

class CompositionBoxInner extends React.Component<Props, State> {
  private readonly textarea: React.RefObject<any>;
  private readonly fileInput: React.RefObject<HTMLInputElement>;
  private readonly emojiPanel: React.RefObject<HTMLDivElement>;
  private readonly emojiPanelButton: any;
  private linkPreviewAbortController?: AbortController;
  private container: HTMLDivElement | null;
  // private lastBumpTypingMessageLength: number = 0;
  private editorRef: any = null;
  public containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.state = getDefaultState();

    this.textarea = React.createRef();
    this.fileInput = React.createRef();

    this.container = null;
    // Emojis
    this.emojiPanel = React.createRef();
    this.emojiPanelButton = React.createRef();
    this.containerRef = React.createRef();
    autoBind(this);
    this.toggleEmojiPanel = debounce(this.toggleEmojiPanel.bind(this), 100);
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

 public componentDidUpdate(prevProps: Props) {
  const convoChanged =
    prevProps.selectedConversationKey !== this.props.selectedConversationKey;
  // Conversation switched
  if (convoChanged) {
    const newDraft = getDraftForConversation(this.props.selectedConversationKey);
    this.setState(
      {
        ...getDefaultState(this.props.selectedConversationKey),
        draft: newDraft || '',
      },
      () => {
        this.focusCompositionBox();

        //  IMPORTANT: sync draft to Lexical
        this.updateLexicalFromDraft(this.state.draft);
      }
    );

    return; // stop here
  }

  // attachments change
  if (
    this.props.stagedAttachments?.length !==
    prevProps.stagedAttachments?.length
  ) {
    this.focusCompositionBox();
  }

  // reply change
  if (!_.isEqual(prevProps.quotedMessageProps, this.props.quotedMessageProps)) {
    this.focusCompositionBox();
  }

}
updateLexicalFromDraft = (draft: string) => {
  if (!this.editorRef) return;

  this.editorRef.update(() => {
    const root = $getRoot();
    root.clear();

    const paragraph = $createParagraphNode();
    root.append(paragraph);

    if (!draft) {
      paragraph.selectEnd();
      return;
    }

    // Split text + mentions
    const parts = draft.split(/(@ￒ.*?ￗ.*?ￒ)/g);

    parts.forEach(part => {
      const match = part.match(/@ￒ(.*?)ￗ(.*?)ￒ/);

      if (match) {
        const [, id, display] = match;

        //  Create MentionNode
        const mentionNode = new MentionNode(id, display);
        paragraph.append(mentionNode);
      } else if (part) {
        // Normal text
        paragraph.append($createTextNode(part));
      }
    });

    paragraph.selectEnd();
  });
};

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
    // eslint-disable-next-line no-restricted-syntax
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

  private renderRecordingView() {
    return (
      <BchatRecording
        sendVoiceMessage={this.sendVoiceMessage}
        onLoadVoiceNoteView={() => void this.onLoadVoiceNoteView()}
        onExitVoiceNoteView={this.onExitVoiceNoteView}
      />
    );
  }
  private sendButton() {
    return (
      <>
        <SendMessageButton name="Send" onClick={() => this.onSendMessage()} />
      </>
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
          ToastUtils.pushToastSuccess('', 'Contact has been successfully deleted.');
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
          onClick={() => {
            this.setState(getDefaultState());
            unblockConvoById(convoId);
          }}
        />
      </Flex>
    );
  }
  private renderLeavedGroupBottoms() {
    return (
      <Flex container={true} justifyContent="center" alignItems="center" height="90px">
        <div className="leaved-scrt-grp-message-container">
          You can’t send message to this group because you’re not a member of this group!
        </div>
      </Flex>
    );
  }
  private renderCompositionView() {
    const { showEmojiPanel, selectionMenuIsVisble } = this.state;
    const { typingEnabled, stagedAttachments } = this.props;

    const { selectedConversation } = this.props;
    const { draft } = this.state;

    const leftTheGroup = selectedConversation?.isGroup && selectedConversation?.left;
    return (
      <>
        {leftTheGroup ? (
          this.renderLeavedGroupBottoms()
        ) : selectedConversation?.isBlocked ? (
          this.renderBlockedContactBottoms()
        ) : (
          <>
            {typingEnabled && !this.state.showRecordingView && (
              <div
                className={classNames(`attachment-wrapper ${selectionMenuIsVisble && 'seleted'}`)}
              >
                {selectionMenuIsVisble && (
                  <div
                    className="selection-box"
                    onMouseLeave={() => this.setState({ selectionMenuIsVisble: false })}
                  >
                    <Flex
                      container={true}
                      padding="15px"
                      className="content-Wrapper"
                      alignItems="center"
                      onClick={this.onChooseAttachment}
                    >
                      <MediaFileIcon />
                      <span>Media Files</span>
                    </Flex>
                    <SpacerSM />
                    <Flex
                      container={true}
                      padding="15px"
                      className="content-Wrapper"
                      alignItems="center"
                      onClick={this.onChooseContacts}
                    >
                      <ContactsIcon />
                      <span>Contacts</span>
                    </Flex>
                  </div>
                )}
                <AddStagedAttachmentButton
                  onClick={() => this.setState({ selectionMenuIsVisble: true })}
                />
              </div>
            )}
            <input
              className="hidden"
              placeholder="Attachment"
              multiple={true}
              ref={this.fileInput}
              type="file"
              onChange={() => void this.onChoseAttachment()}
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
                    padding="10px 0"
                  >
                    <div className="send-message-input__emoji-overlay">
                      {typingEnabled && (
                        <StyledEmojiPanelContainer
                          ref={this.emojiPanel}
                          onKeyDown={this.onKeyDown}
                          role="button"
                        >
                          <ToggleEmojiButton
                            ref={this.emojiPanelButton}
                            onClick={this.toggleEmojiPanel}
                          />
                        </StyledEmojiPanelContainer>
                      )}
                    </div>

                    {this.renderTextArea()}
                  </Flex>
                </div>
                {typingEnabled && (draft || stagedAttachments.length !== 0) ? (
                  <div className={classNames('send-message-button')}>{this.sendButton()}</div>
                ) : (
                  <StartRecordingButton onClick={() => void this.onLoadVoiceNoteView()} />
                )}
              </>
            )}
            {typingEnabled && (
              <div ref={this.emojiPanel} onKeyDown={this.onKeyDown} role="button">
                {showEmojiPanel && (
                  <BchatEmojiPanel
                    onEmojiClicked={this.onEmojiClick}
                    show={showEmojiPanel}
                    ref={this.emojiPanel}
                  />
                )}
              </div>
            )}
          </>
        )}
      </>
    );
  }

  private onEmojiClick(emoji: FixedBaseEmoji) {
    const editor = this.editorRef; //  store editor ref from LexicalComposer

    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        emoji.native && selection.insertText(emoji.native); //  inserts at cursor
      }
    });
  }

  private renderTextArea() {
    const { selectedConversation, typingEnabled } = this.props;

    if (!selectedConversation) return null;

    const { isKickedFromGroup, left, isPrivate, isBlocked, } = selectedConversation;

    const getPlaceholder = () => {
      if (isKickedFromGroup) return window.i18n('youGotKickedFromGroup');
      if (left) return window.i18n('youLeftTheGroup');
      if (isBlocked && isPrivate) return window.i18n('unblockToSend');
      if (isBlocked && !isPrivate) return window.i18n('unblockGroupToSend');
      return window.i18n('sendMessage');
    };

    const placeholder = getPlaceholder();

    const editorConfig = {
      namespace: 'ChatEditor',
      theme: {
        text: {
          bold: 'editor-text-bold',
          italic: 'editor-text-italic',
          strikethrough: 'editor-text-strikethrough', // ✅ IMPORTANT
          code: 'editor-text-code',
        },
      },
      nodes: [MentionNode], // ✅ important
      onError(error: any) {
        console.error(error);
      },
    };

    return (
      <LexicalComposer initialConfig={editorConfig}>
        <div className="chat-input-wrapper" ref={this.containerRef}>
          <div className="editor-container">
            <EditorRefPlugin
              onReady={(editor: any) => {
                this.editorRef = editor;
              }}
            />
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input"
                  contentEditable={typingEnabled}
                  // aria-placeholder={placeholder}
                />
              }
              placeholder={<div className="editor-placeholder">{placeholder}</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />

            <HistoryPlugin />
            <TextFormatingPlugin />
            <MentionPlugin
              fetchUsers={this.fetchUsersForGroup}
              renderSuggestion={renderUserMentionRow}
              containerRef={this.containerRef}
              draft={this.state.draft}
            />

            <OnChangePlugin
              onChange={editorState => {
                editorState.read(() => {
                  const text:string = serializeEditor();
                  this.setState({ draft: text });
                   updateDraftForConversation({ conversationKey: selectedConversation.id, draft:text });
                });
              }}
            />
          </div>
        </div>
      </LexicalComposer>
    );
  }

  private fetchUsersForOpenGroup = async (query: string) => {
    const mentionsInput = getMentionsInput(window?.inboxStore?.getState() || []);

    const filtered =
      mentionsInput
        ?.filter(Boolean)
        .filter(d => d.authorProfileName !== 'Anonymous')
        .filter(d => d.authorProfileName?.toLowerCase()?.includes(query.toLowerCase()))
        .map(user => ({
          id: user.id,
          value: user.authorProfileName, // ✅ display → value
        })) || [];

    return filtered;
  };
  private fetchUsersForGroup = async (query: string) => {
    let overridenQuery = query || '';

    if (!this.props.selectedConversation) {
      return [];
    }

    if (this.props.selectedConversation.isPublic) {
      return this.fetchUsersForOpenGroup(overridenQuery);
    }

    if (!this.props.selectedConversation.isPrivate) {
      return this.fetchUsersForClosedGroup(overridenQuery);
    }

    return [];
  };

  private fetchUsersForClosedGroup = async (query: string) => {
    const { selectedConversation } = this.props;
    if (!selectedConversation) return [];

    const allPubKeys = selectedConversation.members;
    if (!allPubKeys || allPubKeys.length === 0) return [];

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

    const members = allMembers
      .filter(Boolean)
      .filter(
        d =>
          d.authorProfileName?.toLowerCase()?.includes(query.toLowerCase()) || !d.authorProfileName
      );

    // ✅ Convert to Lexical format
    return members.map(user => ({
      id: user.id,
      value: user.authorProfileName || window.i18n('anonymous'),
    }));
  };

  private renderStagedLinkPreview(): JSX.Element | null {
    // Don't generate link previews if user has turned them off
    if (!(window.getSettingValue('link-preview-setting') || false)) {
      return null;
    }
    this.fetchUsersForGroup('');

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

    getPreview(firstLink, abortController.signal as any)
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
    this.setState({ selectionMenuIsVisble: false });
    window.inboxStore?.dispatch(closeShareContact());
    this.fileInput.current?.click();
  }

  private onChooseContacts() {
    if (
      !this.props.selectedConversation?.didApproveMe &&
      this.props.selectedConversation?.isPrivate
    ) {
      ToastUtils.pushNoContactUntilApproved();
      return;
    }
    window.inboxStore?.dispatch(closeRightPanel());
    window.inboxStore?.dispatch(openShareContact());
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
      await this.onSendMessage();
    } else if (event.key === 'Escape' && this.state.showEmojiPanel) {
      this.hideEmojiPanel();
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      // swallow pageUp events if they occurs on the composition box (it breaks the app layout)
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // private async onKeyUp() {
  //   if (!this.props.selectedConversationKey) {
  //     throw new Error('selectedConversationKey is needed');
  //   }
  //   const { draft } = this.state;
  //   // Called whenever the user changes the message composition field. But only
  //   //   fires if there's content in the message field after the change.
  //   // Also, check for a message length change before firing it up, to avoid
  //   // catching ESC, tab, or whatever which is not typing
  //   if (draft && draft.length && draft.length !== this.lastBumpTypingMessageLength) {
  //     const conversationModel = getConversationController().get(this.props.selectedConversationKey);
  //     if (!conversationModel) {
  //       return;
  //     }
  //     conversationModel.throttledBumpTyping();
  //     this.lastBumpTypingMessageLength = draft.length;
  //   }
  // }

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
      'attachments',
      'direction'
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
        body: messagePlaintext.trim(),
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
      if (this.editorRef) {
        this.editorRef.update(() => {
          const root = $getRoot();
          root.clear();

          const paragraph = $createParagraphNode();
          root.append(paragraph);
          paragraph.select();
        });
        setTimeout(() => {
          this.editorRef.focus();
        }, 0);
      }
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
    const { quotedMessageProps } = this.props;
    const extractedQuotedMessageProps = _.pick(
      quotedMessageProps,
      'id',
      'author',
      'text',
      'attachments',
      'direction'
    );
    this.props.sendMessage({
      body: '',
      attachments: [audioAttachment],
      preview: undefined,
      quote: extractedQuotedMessageProps,
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
    window.inboxStore?.dispatch(updateIsCurrentlyRecording(true));
  }

  private onExitVoiceNoteView() {
    this.setState({ showRecordingView: false });
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
  };
};

const smart = connect(mapStateToProps);

export const CompositionBox: any = smart(CompositionBoxInner);

// type FormatType = "bold" | "italic" | "strikethrough" | "code";
export default function TextFormatingPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerTextContentListener(() => {
      editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          return;
        }

        const node = selection.anchor.getNode();
        if (!(node instanceof TextNode)) return;

        if (!node.isSimpleText()) return;

        const text = node.getTextContent();

        const patterns = [
          { regex: /\*(.*?)\*/, format: 'bold', symbol: '*' },
          { regex: /_(.*?)_/, format: 'italic', symbol: '_' },
          { regex: /~(.*?)~/, format: 'strikethrough', symbol: '~' },
          { regex: /```(.*?)```/, format: 'code', symbol: '```' },
        ];

        for (const { regex, format, symbol } of patterns) {
          const match = regex.exec(text);

          if (match) {
            const before = text.slice(0, match.index);
            const inside = match[1];
            const after = text.slice(match.index + match[0].length);

            const nodes: TextNode[] = [];

            if (before) nodes.push($createTextNode(before));

            // optional: keep symbols faint
            const open = $createTextNode(symbol);
            open.setStyle('opacity:0.5;');
            nodes.push(open);

            const formatted = $createTextNode(inside);
            formatted.toggleFormat(format as any);
            nodes.push(formatted);

            const close = $createTextNode(symbol);
            close.setStyle('opacity:0.5;');
            nodes.push(close);

            if (after) nodes.push($createTextNode(after));

            node.replace(nodes[0]);

            let current = nodes[0];
            for (let i = 1; i < nodes.length; i++) {
              current.insertAfter(nodes[i]);
              current = nodes[i];
            }

            current.selectEnd();
            break;
          }
        }
      });
    });
  }, [editor]);

  return null;
}

export function EditorRefPlugin({ onReady }: any) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    onReady(editor);
  }, [editor]);

  return null;
}

function $isMentionNode(node: LexicalNode): node is MentionNode {
  return node.getType() === 'mention';
}

const serializeNode = (node: LexicalNode): string => {
  // ✅ Mention
  if ($isMentionNode(node)) {
    return `@ￒ${node.getId()}ￗ${node.getDisplay()}ￒ`;
  }

  // ✅ Text
  if ($isTextNode(node)) {
    return node.getTextContent();
  }

  // ✅ Children (recursive)
  // ✅ Element node (safe access to children)
  if ($isElementNode(node)) {
    return node
      .getChildren()
      .map(serializeNode)
      .join('');
  }

  return '';
};

export const serializeEditor = () => {
  return serializeNode($getRoot());
};
