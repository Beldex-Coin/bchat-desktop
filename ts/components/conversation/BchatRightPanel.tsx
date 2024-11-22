import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BchatIcon, BchatIconButton } from '../icon';
import _ from 'lodash';
// tslint:disable-next-line: no-submodule-imports
import useInterval from 'react-use/lib/useInterval';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMessagesWithFileAttachments,
  getMessagesWithVisualMediaAttachments,
} from '../../data/data';
import {
  deleteAllMessagesByConvoIdWithConfirmation,
  deleteGroupByConvoId,
  setDisappearingMessagesByConvoId,
  showAddModeratorsByConvoId,
  showInviteContactByConvoId,
  showLeaveGroupByConvoId,
  showRemoveModeratorsByConvoId,
  // showUpdateGroupMembersByConvoId,
  // showUpdateGroupNameByConvoId,
} from '../../interactions/conversationInteractions';
import { Constants } from '../../bchat';
import { closeRightPanel } from '../../state/ducks/conversations';
import { getSelectedConversation, isRightPanelShowing } from '../../state/selectors/conversations';
import { getTimerOptions } from '../../state/selectors/timerOptions';
import { AttachmentTypeWithPath } from '../../types/Attachment';
import { Avatar, AvatarSize, BNSWrapper } from '../avatar/Avatar';
// import { BchatDropdown } from '../basic/BchatDropdown';
import { SpacerLG, SpacerMD, SpacerSM, SpacerXS } from '../basic/Text';
import { MediaItemType } from '../lightbox/LightboxGallery';
import { MediaGallery } from './media-gallery/MediaGallery';
import { getAbsoluteAttachmentPath } from '../../types/MessageAttachment';
import {
  useConversationPropsById,
  useConversationUsername,
  useWeAreAdmin,
} from '../../hooks/useParamSelector';
import { Flex } from '../basic/Flex';
// import { CopyIconButton } from '../icon/CopyIconButton';
import { clipboard } from 'electron';
import { pushUserCopySuccess } from '../../bchat/utils/Toast';
import { getConversationController } from '../../bchat/conversations';
import { initiateOpenGroupUpdate } from '../../bchat/group/open-group';
import { initiateClosedGroupUpdate } from '../../bchat/group/closed-group';
import { useSet } from '../../hooks/useSet';
import { ToastUtils, UserUtils } from '../../bchat/utils';
import { MemberListItem } from '../MemberListItem';
import classNames from 'classnames';
import { InviteContact, onClickRef } from './InviteContacts';
import { BchatButton } from '../basic/BchatButton';
import { BchatButtonType } from '../basic/BchatButton';
import { BchatButtonColor } from '../basic/BchatButton';
import { MenuWrapper } from '../menu/Menu';
import { getTheme } from '../../state/selectors/theme';

async function getMediaGalleryProps(
  conversationId: string
): Promise<{
  documents: Array<MediaItemType>;
  media: Array<MediaItemType>;
}> {
  // We fetch more documents than media as they don’t require to be loaded
  // into memory right away. Revisit this once we have infinite scrolling:
  const rawMedia = await getMessagesWithVisualMediaAttachments(
    conversationId,
    Constants.CONVERSATION.DEFAULT_MEDIA_FETCH_COUNT
  );
  const rawDocuments = await getMessagesWithFileAttachments(
    conversationId,
    Constants.CONVERSATION.DEFAULT_DOCUMENTS_FETCH_COUNT
  );

  const media = _.flatten(
    rawMedia.map(attributes => {
      const { attachments, source, id, timestamp, serverTimestamp, received_at } = attributes;

      return (attachments || [])
        .filter(
          (attachment: AttachmentTypeWithPath) =>
            attachment.thumbnail && !attachment.pending && !attachment.error
        )
        .map((attachment: AttachmentTypeWithPath, index: number) => {
          const { thumbnail } = attachment;

          const mediaItem: MediaItemType = {
            objectURL: getAbsoluteAttachmentPath(attachment.path),
            thumbnailObjectUrl: thumbnail ? getAbsoluteAttachmentPath(thumbnail.path) : undefined,
            contentType: attachment.contentType || '',
            index,
            messageTimestamp: timestamp || serverTimestamp || received_at || 0,
            messageSender: source,
            messageId: id,
            attachment,
          };

          return mediaItem;
        });
    })
  );

  // Unlike visual media, only one non-image attachment is supported
  const documents = rawDocuments.map(attributes => {
    // this is to not fail if the attachment is invalid (could be a Long Attachment type which is not supported)
    if (!attributes.attachments?.length) {
      return null;
    }
    const attachment = attributes.attachments[0];
    const { source, id, timestamp, serverTimestamp, received_at } = attributes;

    return {
      contentType: attachment.contentType,
      index: 0,
      attachment,
      messageTimestamp: timestamp || serverTimestamp || received_at || 0,
      messageSender: source,
      messageId: id,
    };
  });

  return {
    media,
    documents: _.compact(documents), // remove null
  };
}

// Adjust the import path as necessary

const MAX_USERNAME_LENGTH = 20;

const ProfileName = (props: { onCloseEdit: () => void; grpName: any }) => {
  const [profileName, setProfileName] = useState(props.grpName);
  const [errorDisplayed, setErrorDisplayed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('placeholder');
  const selectedConversation = useSelector(getSelectedConversation);
  if (!selectedConversation) {
    return null;
  }
  const convo = getConversationController().get(selectedConversation.id);
  // const groupName = convo.getName();

  const oldAvatarPath = convo.getAvatarPath();
  const newAvatarObjecturl = null;
  const onNameEdited = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileName(event.target.value);
  }, []);

  function onClickOK() {
    const trimmedGroupName = profileName?.trim();
    if (!trimmedGroupName) {
      onShowError(window.i18n('emptyGroupNameError'));

      return;
    }

    if (trimmedGroupName !== convo.getName() || newAvatarObjecturl !== oldAvatarPath) {
      if (convo.isPublic()) {
        void initiateOpenGroupUpdate(convo.id, trimmedGroupName, {
          objectUrl: newAvatarObjecturl,
        });
      } else {
        const members = convo.get('members') || [];
        void initiateClosedGroupUpdate(convo.id, trimmedGroupName, members);
        setProfileName('');
      }
    }
    props.onCloseEdit();
  }
  function onShowError(msg: string) {
    if (errorDisplayed) {
      return;
    }

    setErrorDisplayed(true);
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorDisplayed(false);
    }, 3000);
  }
  // const onClickOK = useCallback(() => {
  //   console.log('Save icon clicked', selectedConversation);
  //   // Handle the save action
  // }, [profileName]);

  return (
    <div>
      <div className="profile-name">
        <div className="inputBox">
          <input
            type="text"
            className="profile-name-input"
            value={profileName}
            placeholder={'Enter a group name'}
            onChange={onNameEdited}
            maxLength={MAX_USERNAME_LENGTH - 1}
            tabIndex={0}
            required
            aria-required
            data-testid="profile-name-input"
          />
        </div>

        <div className="saveIcon">
          <BchatIconButton
            iconType="save_tick"
            iconSize={16}
            onClick={() => onClickOK()}
            // dataTestId="modal-close-button"
          />
        </div>
      </div>
      {errorDisplayed ? (
        <>
          <SpacerXS />
          <p style={{ color: 'red' }}>{errorMessage}</p>
        </>
      ) : null}
    </div>
  );
};

const HeaderItem = () => {
  const selectedConversation = useSelector(getSelectedConversation);
  const dispatch = useDispatch();

  if (!selectedConversation) {
    return null;
  }
  const { id, profileName, isBnsHolder, isGroup } = selectedConversation;

  return (
    <div className="group-settings-header">
      <Flex
        container={true}
        justifyContent={'space-between'}
        alignItems="center"
        height="70px"
        padding="25px"
        className="group-settings-header-title-wrapper"
      >
        <span className="group-settings-header-titleTxt">
          {isGroup ? 'Group Info' : 'Profile Info'}
        </span>
        <span
          onClick={() => dispatch(closeRightPanel())}
          className="group-settings-header-closeBox"
        >
          <BchatIconButton iconType={'xWithCircle'} iconSize={26} iconColor="var(--color-text)" />
        </span>
      </Flex>
      <SpacerLG />

      <div className="group-settings-header-avatarBox">
        <BNSWrapper
          //  size={89}
          position={{ left: '75px', top: '72px' }}
          isBnsHolder={isBnsHolder}
          size={{ width: '20', height: '20' }}
        >
          <Avatar size={AvatarSize.XL} pubkey={id} />
        </BNSWrapper>
        <SpacerXS />

        <p>{profileName}</p>
      </div>
      <SpacerLG />
    </div>
  );
};
const ClassicMemberList = (props: {
  convoId: string;
  selectedMembers: Array<string>;
  onSelect: (m: string) => void;
  onUnselect: (m: string) => void;
  removeMem?: boolean;
}) => {
  const { onSelect, convoId, onUnselect, selectedMembers, removeMem } = props;
  const weAreAdmin = useWeAreAdmin(convoId);
  const convoProps = useConversationPropsById(convoId);
  if (!convoProps) {
    throw new Error('MemberList needs convoProps');
  }
  let currentMembers = convoProps.members || [];
  const { groupAdmins } = convoProps;
  currentMembers = [...currentMembers].sort(m => (groupAdmins?.includes(m) ? -1 : 0));

  return (
    <>
      <div className={classNames(removeMem && 'remove-contact-list')}>
        {currentMembers.map(member => {
          const isSelected = (weAreAdmin && selectedMembers.includes(member)) || false;
          const isAdmin = groupAdmins?.includes(member);

          return (
            <MemberListItem
              pubkey={member}
              onlyList={!removeMem}
              isSelected={isSelected}
              onSelect={onSelect}
              onUnselect={onUnselect}
              key={member}
              isAdmin={isAdmin}
            />
          );
        })}
      </div>
    </>
  );
};

// tslint:disable: cyclomatic-complexity
// tslint:disable: max-func-body-length
export const BchatRightPanelWithDetails = () => {
  const [documents, setDocuments] = useState<Array<MediaItemType>>([]);
  const [media, setMedia] = useState<Array<MediaItemType>>([]);
  const [fullView, setFullView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [removeMem, setRemoveMem] = useState(false);
  const [addMem, setAddMem] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const selectedConversation = useSelector(getSelectedConversation);
  const isShowing = useSelector(isRightPanelShowing);
  const convoProps = useConversationPropsById(selectedConversation?.id);
  const existingMembers = convoProps?.members || [];
  const ref = useRef<onClickRef>(null);
  const { addTo, removeFrom, uniqueValues: membersToKeepWithUpdate } = useSet<string>(
    existingMembers
  );
  const darkMode = useSelector(getTheme) === 'dark';
  const { uniqueValues: selectedContacts } = useSet<string>();
  const zoomLevel = window.getSettingValue('zoom-factor-setting');
  useEffect(() => {
    let isRunning = true;

    if (isShowing && selectedConversation) {
      void getMediaGalleryProps(selectedConversation.id).then(results => {
        if (isRunning) {
          if (!_.isEqual(documents, results.documents)) {
            setDocuments(results.documents);
          }

          if (!_.isEqual(media, results.media)) {
            setMedia(results.media);
          }
        }
      });
    }

    return () => {
      isRunning = false;
      return;
    };
  }, [isShowing, selectedConversation?.id]);

  useInterval(async () => {
    if (isShowing && selectedConversation) {
      const results = await getMediaGalleryProps(selectedConversation.id);
      if (results.documents.length !== documents.length || results.media.length !== media.length) {
        setDocuments(results.documents);
        setMedia(results.media);
      }
    }
  }, 10000);

  if (!selectedConversation) {
    return null;
  }

  const {
    id,
    subscriberCount,
    name,
    isKickedFromGroup,
    left,
    isPublic,
    weAreAdmin,
    isBlocked,
    isGroup,
    isPrivate,
  } = selectedConversation;
  const username = String(useConversationUsername(id));
  const showMemberCount = !!(subscriberCount && subscriberCount > 0);
  const commonNoShow = isKickedFromGroup || left || isBlocked;
  const hasDisappearingMessages = !isPublic && !commonNoShow;
  const leaveGroupString = isPublic
    ? window.i18n('deleteMessages')
    : isKickedFromGroup
    ? window.i18n('youGotKickedFromGroup')
    : left
    ? window.i18n('youLeftTheGroup')
    : window.i18n('leaveGroup');

  const timerOptions = useSelector(getTimerOptions).timerOptions;

  const disappearingMessagesOptions = timerOptions.map(option => {
    return {
      content: option.name,
      onClick: () => {
        void setDisappearingMessagesByConvoId(id, option.value);
      },
    };
  });
  // console.log('disappearingMessagesOptions --->', disappearingMessagesOptions);
  const showUpdateGroupNameButton =
    isGroup && (!isPublic || (isPublic && weAreAdmin)) && !commonNoShow;
  const showAddRemoveModeratorsButton = weAreAdmin && !commonNoShow && isPublic;
  const showUpdateGroupMembersButton = !isPublic && isGroup && !commonNoShow;

  const deleteConvoAction = isPublic
    ? () => {
        deleteAllMessagesByConvoIdWithConfirmation(id);
      }
    : left
    ? () => {
        deleteGroupByConvoId(id, username);
      }
    : () => {
        showLeaveGroupByConvoId(
          id,
          username,
          <BchatIcon iconType="leaveGroup" iconColor="#FF3E3E" iconSize={30} />
        );
      };

  const handleCopy = () => {
    clipboard.writeText(id, 'clipboard');
    pushUserCopySuccess();
  };
  const dispalyMedia = (value: boolean) => {
    setFullView(value);
  };
  const onAdd = (member: string) => {
    if (!weAreAdmin) {
      ToastUtils.pushOnlyAdminCanRemove();
      return;
    }

    addTo(member);
  };
  const onRemove = (member: string) => {
    if (!weAreAdmin) {
      window?.log?.warn('Only group admin can remove members!');

      ToastUtils.pushOnlyAdminCanRemove();
      return;
    }
    if (convoProps?.groupAdmins?.includes(member)) {
      ToastUtils.pushCannotRemoveCreatorFromGroup();
      window?.log?.warn(
        `User ${member} cannot be removed as they are the creator of the closed group.`
      );
      return;
    }

    removeFrom(member);
  };

  async function onSubmit(convoId: string, membersAfterUpdate: Array<string>) {
    // not ideal to get the props here, but this is not run often
    const convoProps = getConversationController()
      .get(convoId)
      .getConversationModelProps();
    if (!convoProps || !convoProps.isGroup || convoProps.isPublic) {
      throw new Error('Invalid convo for updateGroupMembersDialog');
    }
    if (!convoProps.weAreAdmin) {
      window.log.warn('Skipping update of members, we are not the admin');
      return;
    }
    const ourPK = UserUtils.getOurPubKeyStrFromCache();

    const allMembersAfterUpdate = _.uniq(_.concat(membersAfterUpdate, [ourPK]));

    // membersAfterUpdate won't include the zombies. We are the admin and we want to remove them not matter what

    // We need to NOT trigger an group update if the list of member is the same.
    // We need to merge all members, including zombies for this call.
    // We consider that the admin ALWAYS wants to remove zombies (actually they should be removed
    // automatically by him when the LEFT message is received)

    const existingMembers = convoProps.members || [];
    const existingZombies = convoProps.zombies || [];

    const allExistingMembersWithZombies = _.uniq(existingMembers.concat(existingZombies));

    const notPresentInOld = allMembersAfterUpdate.filter(
      m => !allExistingMembersWithZombies.includes(m)
    );

    // be sure to include zombies in here
    const membersToRemove = allExistingMembersWithZombies.filter(
      m => !allMembersAfterUpdate.includes(m)
    );

    // do the xor between the two. if the length is 0, it means the before and the after is the same.
    const xor = _.xor(membersToRemove, notPresentInOld);
    if (xor.length === 0) {
      window.log.info('skipping group update: no detected changes in group member list');

      return;
    }

    // If any extra devices of removed exist in newMembers, ensure that you filter them
    // Note: I think this is useless
    const filteredMembers = allMembersAfterUpdate.filter(
      memberAfterUpdate => !_.includes(membersToRemove, memberAfterUpdate)
    );

    void initiateClosedGroupUpdate(convoId, convoProps.name || 'Unknown', filteredMembers);
  }
  const onClickOK = async () => {
    // const members = getWouldBeMembers(this.state.contactList).map(d => d.id);
    // do not include zombies here, they are removed by force
    if (removeMem) {
      await onSubmit(id, membersToKeepWithUpdate);
      setRemoveMem(false);
    }
    if (addMem) {
      console.log('selectedContacts ...', selectedContacts);
      //  await submitForClosedGroup(id, selectedContacts);
      await ref.current?.onclick();
      setAddMem(false);
    }
  };
  return (
    <div
      className="group-settings"
      style={{
        position: zoomLevel > 100 ? 'absolute' : 'unset',
        overflowY: zoomLevel > 100 ? 'auto' : 'unset',
        right:0,
        zIndex:2
      }}
    >
      {!fullView ? (
        <>
          <HeaderItem />
          {isPrivate && (
            <div className="group-settings-header-chatIdBox">
              <p>BChat ID</p>
              <SpacerXS />
              <div className="id-wrapper">
                <Flex container={true} flexDirection="row" alignItems="flex-start">
                  <span className="txt">{id}</span>
                  <BchatIconButton
                    iconType={'copy'}
                    iconSize={0}
                    fillRule="evenodd"
                    clipRule="evenodd"
                    onClick={handleCopy}
                  />
                  {/* <CopyIconButton iconSize={20} content={id} /> */}
                </Flex>
              </div>
            </div>
          )}
          {!edit ? (
            <div className="group-settings-nameEditBox">
              <h2 data-testid="right-panel-group-name">{name}</h2>
              {showUpdateGroupNameButton && (
                <div>
                  <BchatIconButton
                    iconType="pencil"
                    iconSize="medium"
                    iconColor="#128b17"
                    onClick={() => {
                      // await showUpdateGroupNameByConvoId(id);
                      setEdit(true);
                    }}
                    dataTestId="edit-profile-icon"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              {/* <SpacerMD /> */}
              <ProfileName onCloseEdit={() => setEdit(false)} grpName={name} />
            </>
          )}
          {hasDisappearingMessages && (
            <div style={{ width: '100%' }}>
              <div
                className="disppear-wrapper"
                role="button"
                onClick={() => setExpanded(!expanded)}
              >
                <Flex container={true} flexDirection="row" alignItems="center">
                  <BchatIcon
                    iconType={'chatTimer'}
                    iconSize={17}
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                  <MenuWrapper style={{ fontSize: '16px', fontWeight: 300 }}>
                    {window.i18n('disappearingMessages')}
                  </MenuWrapper>
                </Flex>
                <BchatIcon iconType="chevron" iconSize="small" iconRotation={expanded ? 0 : 268} />
                {/* <BchatDropdown
                labelIcon={'chatTimer'}
                label={window.i18n('disappearingMessages')}
                options={disappearingMessagesOptions}
              /> */}
              </div>
              {expanded && (
                <div className="disappear-option">
                  {disappearingMessagesOptions.map((item, key) => {
                    return (
                      <span
                        key={key}
                        onClick={() => {
                          setExpanded(false);
                          item.onClick();
                        }}
                      >
                        {item.content}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {showMemberCount && (
            <>
              <SpacerLG />
              <div role="button" className="subtle" style={{ textAlign: 'center' }}>
                {window.i18n('members', [`${subscriberCount}`])}
              </div>
              <SpacerLG />
            </>
          )}
          {showAddRemoveModeratorsButton && (
            <>
              <div
                className={classNames('group-settings-item')}
                role="button"
                onClick={() => {
                  showAddModeratorsByConvoId(id);
                }}
              >
                {window.i18n('addModerators')}
              </div>
              <div
                className="group-settings-item"
                role="button"
                onClick={() => {
                  showRemoveModeratorsByConvoId(id);
                }}
              >
                {window.i18n('removeModerators')}
              </div>
            </>
          )}
          {showUpdateGroupMembersButton && (
            <div className="grp_btn_wrapper">
              <Flex container={true} justifyContent="space-between" alignItems="center">
                <div
                  className="group-settings-item"
                  // role="button"
                  // onClick={async () => {
                  //   await showUpdateGroupMembersByConvoId(id);
                  // }}
                >
                  <div className="invite-friends-container" style={{ marginRight: '10px' }}></div>
                  {window.i18n('groupMembers')}
                </div>
                <Flex container={true} flexDirection="row">
                  {removeMem || addMem ? (
                    <>
                      <BchatIconButton
                        iconType="xWithCircle"
                        iconSize={20}
                        onClick={() => {
                          setRemoveMem(false);
                          setAddMem(false);
                        }}
                      />

                      <BchatIconButton
                        iconType="circleFillTick"
                        iconSize={20}
                        iconColor="#108D32"
                        onClick={() => onClickOK()}
                      />
                    </>
                  ) : (
                    <>
                      {weAreAdmin && (
                        <BchatIconButton
                          iconType="avatarX"
                          iconSize={24}
                          clipRule="evenodd"
                          fillRule="evenodd"
                          onClick={() => setRemoveMem(true)}
                        />
                      )}
                      <div
                        className="add-btn"
                        role="button"
                        style={{ marginLeft: '5px' }}
                        onClick={() => {
                          setAddMem(true);
                          // if (selectedConversation) {
                          //   showInviteContactByConvoId(selectedConversation.id);
                          // }
                        }}
                      >
                        <div
                          className="invite-friends-container"
                          style={{ marginRight: '10px' }}
                          onClick={() => {
                            if (selectedConversation) {
                              showInviteContactByConvoId(selectedConversation.id);
                            }
                          }}
                        ></div>
                        {/* {window.i18n('addingContacts')} */}
                        Add +
                      </div>
                    </>
                  )}
                </Flex>
              </Flex>

              <div className="list-wrapper">
                {addMem ? (
                  <InviteContact conversationId={selectedConversation.id} ref={ref} />
                ) : (
                  <ClassicMemberList
                    removeMem={removeMem}
                    convoId={selectedConversation.id}
                    onSelect={onAdd}
                    onUnselect={onRemove}
                    selectedMembers={membersToKeepWithUpdate}
                  />
                )}
              </div>
            </div>
          )}

          {isGroup && (
            // tslint:disable-next-line: use-simple-attributes
            <div style={{ width: '90%', borderRadius: '12px' }} onClick={deleteConvoAction}>
              <BchatButton
                text={leaveGroupString}
                iconType={isPublic ? 'delete' : 'leaveGroup'}
                iconSize={20}
                buttonType={BchatButtonType.Medium}
                buttonColor={BchatButtonColor.Danger}
              />

              {/* <div className="group-settings__leaveBtn">
                <BchatIcon
                  iconType={isPublic ? 'delete' : 'leaveGroup'}
                  iconSize="tiny"
                  iconColor="#fc222f"
                  iconRotation={isPublic ? 0 : 180}
                />
                <div style={{ marginLeft: '5px' }}>{leaveGroupString}</div> */}
              {/* </div> */}
            </div>
          )}
          <SpacerMD />
          <div className="hr-line" />
          <Flex container={true} justifyContent="space-between" width="100%">
            <span className="group-settings-media-txt">Media, docs</span>
            <BchatIconButton
              iconType={'chevron'}
              iconSize={14}
              iconRotation={268}
              iconColor="#A7A7BA"
              onClick={() => dispalyMedia(true)}
            />
          </Flex>
          <SpacerSM />

          <div
            className={classNames('img-wrapper', existingMembers.length >= 3 && 'grp_more_member')}
          >
            <MediaGallery documents={documents} media={media} fullView={fullView} />
          </div>
          <SpacerMD />
        </>
      ) : (
        <>
          <Flex
            container={true}
            alignItems="center"
            height="70px"
            width="100%"
            style={{ borderRadius: '16px', background: 'var(--color-profile-header-bg)' }}
          >
            <span
              onClick={() => dispalyMedia(false)}
              className="group-settings-header-closeBox"
              style={{ marginRight: '10px' }}
            >
              <BchatIconButton
                iconType={'KeyboardBackspaceArrow'}
                iconSize={28}
                iconColor={darkMode ? '#A9AEBA' : '#3E4A53'}
              />
            </span>
            <span className="group-settings-header-titleTxt">Media & Documents</span>
          </Flex>
          <SpacerSM />
          <MediaGallery documents={documents} media={media} fullView={true} />
        </>
      )}
    </div>
  );
};
