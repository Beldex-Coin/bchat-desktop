import React, { ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { updateReactClearAllModal } from '../../state/ducks/modalDialog';
import { StateType } from '../../state/reducer';
import { getMessageReactsProps } from '../../state/selectors/conversations';
import { getTheme } from '../../state/selectors/theme';
import { Flex } from '../basic/Flex';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { getConversationController } from '../../bchat/conversations';
import { BchatSpinner } from '../basic/BchatSpinner';

type Props = {
  reaction: string;
  messageId: string;
};

const StyledReactClearAllContainer = styled(Flex)<{ darkMode: boolean }>`
  margin: var(--margins-lg);

  p {
    font-size: 18px;
    font-weight: bold;

    span {
      margin-left: 4px;
    }
  }

  .Bchat-button {
    font-size: 16px;
    height: 36px;
    padding-top: 3px;
  }
`;

// tslint:disable-next-line: max-func-body-length
export const ReactClearAllModal = (props: Props): ReactElement => {
  const { reaction, messageId } = props;
  const msgProps = useSelector((state: StateType) => getMessageReactsProps(state, messageId));
  const dispatch = useDispatch();
  const darkMode = useSelector(getTheme) === 'dark';
  const [deletionInProgress, setDeletionInProgress] = useState(false);

  if (!msgProps) {
    return <></>;
  }

  const { convoId, serverId } = msgProps;
  const roomInfos = getConversationController()
    .get(convoId)
    .toOpenGroupV2();

  const handleClearAll = async () => {
    if (roomInfos && serverId) {
      setDeletionInProgress(true);
      // await deleteSogsReactionByServerId(reaction, serverId, roomInfos);
      setDeletionInProgress(false);
      handleClose();
    } else {
      window.log.warn('Error for batch removal of', reaction, 'on message', messageId);
    }
  };

  const confirmButtonColor = darkMode ? BchatButtonColor.Green : BchatButtonColor.Secondary;

  const handleClose = () => {
    dispatch(updateReactClearAllModal(null));
  };

  return (
    <BchatWrapperModal
      additionalClassName={'reaction-list-modal'}
      showHeader={false}
      onClose={handleClose}
    >
      <StyledReactClearAllContainer container={true} flexDirection={'column'} darkMode={darkMode} alignItems="center">
        <p>
          Are you sure you want to clear all <p>{window.i18n('clearAllReactions', [reaction])}</p>
        </p>
        <hr />
        <div className="Bchat-modal__button-group">
          <BchatButton
            text={'Clear'}
            buttonColor={confirmButtonColor}
            buttonType={BchatButtonType.BrandOutline}
            onClick={handleClearAll}
            disabled={deletionInProgress}
          />
          <BchatButton
            text={'Cancel'}
            buttonColor={BchatButtonColor.Danger}
            buttonType={BchatButtonType.BrandOutline}
            onClick={handleClose}
            disabled={deletionInProgress}
          />
        </div>
        <BchatSpinner loading={deletionInProgress} />
      </StyledReactClearAllContainer>
    </BchatWrapperModal>
  );
};
