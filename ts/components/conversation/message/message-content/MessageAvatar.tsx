import  { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageRenderingProps } from '../../../../models/messageType';
import { updateUserDetailsModal } from '../../../../state/ducks/modalDialog';
import { getMessageAvatarProps } from '../../../../state/selectors/conversations';
import { Avatar, AvatarSize, CrownIcon } from '../../../avatar/Avatar';
import styled from 'styled-components';
import { useMessageReactsPropsById } from '../../../../hooks/useParamSelector';
import { isEmpty } from 'lodash';
// tslint:disable: use-simple-attributes

export type MessageAvatarSelectorProps = Pick<
  MessageRenderingProps,
  | 'authorAvatarPath'
  | 'authorName'
  | 'sender'
  | 'authorProfileName'
  | 'isSenderAdmin'
  | 'conversationType'
  | 'direction'
  | 'isPublic'
  | 'lastMessageOfSeries'
>;

type Props = { messageId: string };

const StyledAvatarWrapper = styled.div <{enableReactions:boolean}>`
  display: flex;
  align-self: flex-end;
  margin-bottom:${(props)=>props.enableReactions?'52px':'16px'};
`;

export const MessageAvatar = (props: Props) => {
  const { messageId } = props;

  const dispatch = useDispatch();
  const avatarProps = useSelector(state => getMessageAvatarProps(state as any, messageId));
  const msgProps = useMessageReactsPropsById(messageId);
  const reacts=!isEmpty( msgProps?.reacts);
  

  if (!avatarProps) {
    return null;
  }
  const {
    authorAvatarPath,
    authorName,
    sender,
    authorProfileName,
    conversationType,
    direction,
    isPublic,
    isSenderAdmin,
    lastMessageOfSeries,
  } = avatarProps;

  if (conversationType !== 'group' || direction === 'outgoing') {
    return null;
  }
  const userName = authorName || authorProfileName || sender;

  const onMessageAvatarClick = useCallback(() => {
    dispatch(
      updateUserDetailsModal({
        conversationId: sender,
        userName,
        authorAvatarPath,
      })
    );
  }, [userName, sender, authorAvatarPath]);

  if (!lastMessageOfSeries) {
    return <div style={{ marginInlineEnd: '63px' }} key={`msg-avatar-${sender}`} />;
  }

  return (
    <StyledAvatarWrapper enableReactions={reacts}>
      <div className="module-message__author-avatar" key={`msg-avatar-${sender}`}>
        <Avatar
          size={AvatarSize.M}
          onAvatarClick={(!isPublic && onMessageAvatarClick) || undefined}
          pubkey={sender}
        />
        {isSenderAdmin && <CrownIcon />}
      </div>
    </StyledAvatarWrapper>
  );
};
