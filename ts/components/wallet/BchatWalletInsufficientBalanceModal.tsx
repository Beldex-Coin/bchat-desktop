// import React from 'react';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { useDispatch, useSelector } from 'react-redux';
import { updateInsufficientBalanceModal } from '../../state/ducks/modalDialog';
import { getTheme } from '../../state/selectors/theme';
import styled from 'styled-components';
import { BchatButtonColor } from '../basic/BchatButton';

export const InsufficientBalanceModal = (props: any) => {
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
                    text: 'OK',
                    color: BchatButtonColor.Primary,
                    onClickOkHandler: () => {
                        dispatch(updateInsufficientBalanceModal(null));
                    },

                    disabled: false,
                }}
            >
                <SpacerLG />
                <div className="bchat-modal__centered">
                    <div style={{ width: "430px",height:'155px' }}>
                        <div style={{marginTop:'10px'}}>
                            <img
                                src={darkMode ? 'images/bchat/insufficientBalance.svg' : 'images/bchat/insufficientBalanceWhite.svg'}
                                style={{ width: '70px', height: '70px' }}
                            />
                        </div>
                        <TxnInit>Insufficient Balance!</TxnInit>
                        <Subtxt>You have insufficient funds to make a transaction</Subtxt>
                    </div>
                </div>
                <SpacerMD />
            </BchatWrapperModal>
        </div>
    );
};

const TxnInit = styled.div`
//   color: #108d32;
  text-align: center;
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  width: 475px;
  margin-top: 15px;

`;

const Subtxt = styled.div`
  color: #A7A7BA;
  margin-top: 5px;
  line-height: 17px;`;