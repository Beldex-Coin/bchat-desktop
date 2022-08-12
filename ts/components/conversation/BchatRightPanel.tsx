import React, { useEffect, useState } from 'react';
import { BchatIconButton } from '../icon';
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
  setDisappearingMessagesByConvoId,
  showAddModeratorsByConvoId,
  showInviteContactByConvoId,
  showLeaveGroupByConvoId,
  showRemoveModeratorsByConvoId,
  showUpdateGroupMembersByConvoId,
  showUpdateGroupNameByConvoId,
} from '../../interactions/conversationInteractions';
import { Constants } from '../../bchat';
import { closeRightPanel } from '../../state/ducks/conversations';
import { getSelectedConversation, isRightPanelShowing } from '../../state/selectors/conversations';
import { getTimerOptions } from '../../state/selectors/timerOptions';
import { AttachmentTypeWithPath } from '../../types/Attachment';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatDropdown } from '../basic/BchatDropdown';
import { SpacerLG } from '../basic/Text';
import { MediaItemType } from '../lightbox/LightboxGallery';
import { MediaGallery } from './media-gallery/MediaGallery';
import { getAbsoluteAttachmentPath } from '../../types/MessageAttachment';

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
      // window?.log?.info(
      //   'Got a message with an empty list of attachment. Skipping...'
      // );
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

const HeaderItem = () => {
  const selectedConversation = useSelector(getSelectedConversation);
  const dispatch = useDispatch();

  if (!selectedConversation) {
    return null;
  }
  console.log('selectedConversation :: ', selectedConversation);

  const { id,
    //  isGroup, isKickedFromGroup, isBlocked, left,
    profileName } = selectedConversation;

  // const showInviteContacts = isGroup && !isKickedFromGroup && !isBlocked && !left;

  return (
    <div className="group-settings-header">

      {/* <BchatIconButton
        iconType="chevron"
        iconSize="medium"
        // iconRotation={270}
        iconColor={'#fff'}
        onClick={() => {
          dispatch(closeRightPanel());
        }}
        dataTestId="back-button-conversation-options"
      /> */}
      <div className='group-settings-header-avatarBox'>
        <Avatar size={AvatarSize.XL} pubkey={id} />
        <p>{profileName}</p>
      </div>


      <div onClick={() => dispatch(closeRightPanel())} className="group-settings-header-closeBox">
        <svg xmlns="http://www.w3.org/2000/svg" width="17.833" height="17.822" viewBox="0 0 17.833 17.822">
          <path id="close" d="M5.1,3.99A1.113,1.113,0,0,0,4.327,5.9l7.005,7.005L4.327,19.912A1.113,1.113,0,1,0,5.9,21.486l7.005-7.005,7.005,7.005a1.113,1.113,0,1,0,1.574-1.574l-7.005-7.005L21.486,5.9a1.113,1.113,0,1,0-1.574-1.574l-7.005,7.005L5.9,4.327A1.113,1.113,0,0,0,5.1,3.99Z" transform="translate(-3.99 -3.99)" fill="#fff" />
        </svg>

      </div>

    </div>
  );
};

// tslint:disable: cyclomatic-complexity
// tslint:disable: max-func-body-length
export const BchatRightPanelWithDetails = () => {
  const [documents, setDocuments] = useState<Array<MediaItemType>>([]);
  const [media, setMedia] = useState<Array<MediaItemType>>([]);

  const selectedConversation = useSelector(getSelectedConversation);
  const isShowing = useSelector(isRightPanelShowing);

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
  } = selectedConversation;
  const showMemberCount = !!(subscriberCount && subscriberCount > 0);
  const commonNoShow = isKickedFromGroup || left || isBlocked;
  const hasDisappearingMessages = !isPublic && !commonNoShow;
  const leaveGroupString = isPublic
    ? window.i18n('leaveGroup')
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

  const showUpdateGroupNameButton =
    isGroup && (!isPublic || (isPublic && weAreAdmin)) && !commonNoShow;
  const showAddRemoveModeratorsButton = weAreAdmin && !commonNoShow && isPublic;
  const showUpdateGroupMembersButton = !isPublic && isGroup && !commonNoShow;

  const deleteConvoAction = isPublic
    ? () => {
      deleteAllMessagesByConvoIdWithConfirmation(id);
    }
    : () => {
      showLeaveGroupByConvoId(id);
    };
  return (
    <div className="group-settings">
      <HeaderItem />
      {!showUpdateGroupNameButton && <div className='group-settings-header-chatIdBox'>
        <p>Bchat ID:</p>
        <div>{id}</div>
      </div>}
      <div style={{ display: "flex" }}>
        <h2 data-testid="right-panel-group-name">{name}</h2>
        {showUpdateGroupNameButton && <BchatIconButton
          iconType="pencil"
          iconSize="medium"
          iconColor='#128b17'
          onClick={async () => {
            await showUpdateGroupNameByConvoId(id);
          }}
          dataTestId="edit-profile-icon"
        />}
      </div>

      {showMemberCount && (
        <>
          <SpacerLG />
          <div role="button" className="subtle">
            {window.i18n('members', [`${subscriberCount}`])}
          </div>
          <SpacerLG />
        </>
      )}
      {/* {showUpdateGroupNameButton && (
        <div
          className="group-settings-item"
          role="button"
          onClick={async () => {
            await showUpdateGroupNameByConvoId(id);
          }}
        >
          {isPublic ? window.i18n('editGroup') : window.i18n('editGroupName')}
        </div>
      )} */}
      {showAddRemoveModeratorsButton && (
        <>
          <div
            className="group-settings-item"
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
        <div
          className="group-settings-item"
          role="button"
          onClick={() => {
            if (selectedConversation) {
              showInviteContactByConvoId(selectedConversation.id);
            }
          }}
        >
          <div className="invite-friends-container" style={{ marginRight: "10px" }} onClick={() => {
            if (selectedConversation) {
              showInviteContactByConvoId(selectedConversation.id);
            }
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="21.266" height="21.266" viewBox="0 0 21.266 21.266">
              <path id="add_member" data-name="add member" d="M9.595,2a5.318,5.318,0,0,0-2.967,9.731A7.617,7.617,0,0,0,2,18.709H3.519a6.065,6.065,0,0,1,6.076-6.076,6,6,0,0,1,2.872.736,6.169,6.169,0,1,0,1.163-1.092,7.7,7.7,0,0,0-1.068-.546A5.318,5.318,0,0,0,9.595,2Zm0,1.519a3.8,3.8,0,1,1-3.8,3.8A3.786,3.786,0,0,1,9.595,3.519Zm7.595,9.114a4.557,4.557,0,1,1-4.557,4.557A4.547,4.547,0,0,1,17.19,12.633Zm-.759,1.519V16.43H14.152v1.519H16.43v2.278h1.519V17.949h2.278V16.43H17.949V14.152Z" transform="translate(-2 -2)" fill="#128b17" />
            </svg>
          </div>
          {/* {window.i18n('groupMembers')} */}
          Add Member
        </div>
      )}

      {showUpdateGroupMembersButton && (
        <div
          className="group-settings-item"
          role="button"
          onClick={async () => {
            await showUpdateGroupMembersByConvoId(id);
          }}
        >
          <div className="invite-friends-container" style={{ marginRight: "10px" }}>

            <svg xmlns="http://www.w3.org/2000/svg" width="26.154" height="15.455" viewBox="0 0 26.154 15.455">
              <path id="group_members" d="M12.133,15a4.722,4.722,0,0,0-3.564,1.514,5.006,5.006,0,0,0,0,6.483,4.434,4.434,0,0,0,1.135.817A7.1,7.1,0,0,0,5,30.455H7.378a4.755,4.755,0,1,1,9.511,0h2.378a4.755,4.755,0,1,1,9.511,0h2.378a7.1,7.1,0,0,0-4.7-6.641A4.434,4.434,0,0,0,27.585,23a5.006,5.006,0,0,0,0-6.483,4.953,4.953,0,0,0-7.128,0,5.006,5.006,0,0,0,0,6.483,4.434,4.434,0,0,0,1.135.817,7.04,7.04,0,0,0-3.515,2.942,7.04,7.04,0,0,0-3.515-2.942A4.434,4.434,0,0,0,15.7,23a5.006,5.006,0,0,0,0-6.483A4.722,4.722,0,0,0,12.133,15Zm0,2.378a2.189,2.189,0,0,1,1.786.715,2.63,2.63,0,0,1,0,3.325,2.189,2.189,0,0,1-1.786.715,2.189,2.189,0,0,1-1.786-.715,2.63,2.63,0,0,1,0-3.325A2.189,2.189,0,0,1,12.133,17.378Zm11.888,0a2.189,2.189,0,0,1,1.786.715,2.63,2.63,0,0,1,0,3.325,2.189,2.189,0,0,1-1.786.715,2.189,2.189,0,0,1-1.786-.715,2.63,2.63,0,0,1,0-3.325A2.189,2.189,0,0,1,24.021,17.378Z" transform="translate(-5 -15)" fill="#128b17" />
            </svg>
            
          </div>
          {window.i18n('groupMembers')}
        </div>
      )}

      {hasDisappearingMessages && (
        <div style={{borderBottom:"2px solid #262631",width:'100%'}}>
        <BchatDropdown
          label={window.i18n('disappearingMessages')}
          options={disappearingMessagesOptions}
        />
        </div>
      )}

      <MediaGallery documents={documents} media={media} />
      {isGroup && (
        // tslint:disable-next-line: use-simple-attributes
        <BchatButton
          text={leaveGroupString}
          buttonColor={BchatButtonColor.Danger}
          disabled={isKickedFromGroup || left}
          buttonType={BchatButtonType.SquareOutline}
          onClick={deleteConvoAction}
        />
      )}
    </div>
  );
};
