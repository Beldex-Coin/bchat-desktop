import React,{ ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { updateReactClearAllModal } from '../../state/ducks/modalDialog';
import { StateType } from '../../state/reducer';
import { getMessageReactsProps } from '../../state/selectors/conversations';
import { getTheme } from '../../state/selectors/theme';
import { Flex } from '../basic/Flex';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatWrapperModal } from '../BchatWrapperModal';

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

  if (!msgProps) {
    return <></>;
  }

  const dispatch = useDispatch();
  const darkMode = useSelector(getTheme) === 'dark';
  const confirmButtonColor = darkMode ? BchatButtonColor.Green : BchatButtonColor.Secondary;

  const handleClose = () => {
    dispatch(updateReactClearAllModal(null));
  };

  const handleClearAll = () => {
    // TODO Handle Batch Clearing of Reactions
  };

  return (
    <BchatWrapperModal
      additionalClassName={'reaction-list-modal'}
      showHeader={false}
      onClose={handleClose}
    >
      <StyledReactClearAllContainer container={true} flexDirection={'column'} darkMode={darkMode}>
        <p>
          Are you sure you want to clear all  <p>{window.i18n('clearAllReactions', [reaction])}</p>
        </p>
        <hr />
        <div className="Bchat-modal__button-group">
          <BchatButton
            text={'Clear'}
            buttonColor={confirmButtonColor}
            buttonType={BchatButtonType.BrandOutline}
            onClick={handleClearAll}
          />
          <BchatButton
            text={'Cancel'}
            buttonColor={BchatButtonColor.Danger}
            buttonType={BchatButtonType.BrandOutline}
            onClick={handleClose}
          />
        </div>
      </StyledReactClearAllContainer>
    </BchatWrapperModal>
  );
};