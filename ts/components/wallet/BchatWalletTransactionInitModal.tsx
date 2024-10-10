import React from 'react';
// import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { useDispatch, useSelector } from 'react-redux';
import { updateTransactionInitModal } from '../../state/ducks/modalDialog';
import { getTheme } from '../../state/selectors/theme';
import styled from 'styled-components';
import { BchatButtonColor } from '../basic/BchatButton';

export const TransactionInitModal = (props: any) => {
  const dispatch = useDispatch();
  const darkMode = useSelector(getTheme) === 'dark';
  return (
    <div>
      <BchatWrapperModal
        title={''}
        onClose={props.onClose}
        showExitIcon={false}
        headerReverse={true}
        showHeader={false}
        okButton={{
          text: 'ok',
          color:BchatButtonColor.Primary,
          onClickOkHandler: () => {
            dispatch(updateTransactionInitModal(null));
          },

          disabled: false,
        }}
      >
        <SpacerLG />
        <div className="bchat-modal__centered">
          <div>
            <img
              src={darkMode ? 'images/bchat/linked_bns.gif' : 'images/bchat/linked_bns_white.gif'}
              style={{ width: '120px', height: '120px' }}
            />
          </div>
          <TxnInit>{window.i18n('transactionInitiated')}</TxnInit>
        </div>
        <SpacerMD />
        {/* <div className="bchat-modal__button-group__center">
          <BchatButton
            text={window.i18n('ok')}
            buttonType={BchatButtonType.BrandOutline}
            buttonColor={BchatButtonColor.Green}
            onClick={() => {
              dispatch(updateTransactionInitModal(null));
            }}
          />
        </div> */}
      </BchatWrapperModal>
    </div>
  );
};

const TxnInit = styled.div`
  color: #108d32;
  text-align: center;
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  width: 475px;
`;
