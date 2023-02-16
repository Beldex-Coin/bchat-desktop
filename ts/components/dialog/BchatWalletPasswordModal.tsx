

import React, { useState } from 'react';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatIcon } from '../icon';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { useDispatch } from 'react-redux';
import { updateBchatWalletPasswordModal } from '../../state/ducks/modalDialog';
import { ToastUtils } from '../../bchat/utils';
import { useKey } from 'react-use';


export const BchatWalletPasswordModal = () => {
    const dispatch=useDispatch()

    const [password,setPassword]=useState('')
    const onClickClose = () => {
        dispatch( updateBchatWalletPasswordModal(null))

    };
    function submit()    
    {
        if (!password) {
            return ToastUtils.pushToastError('passwordFieldEmpty', window.i18n('passwordFieldEmpty'));
          }
      onClickClose()
    }
    useKey((event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          submit();
        }
        return event.key === 'Enter';
      });
    return (
        <BchatWrapperModal
            title={window.i18n('changeNickname')}
            onClose={onClickClose}
            showExitIcon={false}
            showHeader={false}
        >        
                <div className="bchat-modal-walletPassword">
                    <div className="bchat-modal-walletPassword-contentBox">
                        {/* {loading && (
          <Loader>
            <div className="bchat-modal-walletPassword-contentBox-loader">
              <img
                src={'images/bchat/Load_animation.gif'}
                style={{ width: '150px', height: '150px' }}
              />
            </div>
          </Loader>
        )} */}
                        <SpacerLG />
                        <SpacerLG />
                        <div className="bchat-modal-walletPassword-contentBox-walletImg"></div>
                        <SpacerMD />
                        <div className="bchat-modal-walletPassword-contentBox-headerBox">
                            <BchatIcon iconType="lock" iconSize={'small'} />
                            <span>{window.i18n('enterWalletPassword')}</span>
                        </div>
                        <SpacerMD />
                        <div className="bchat-modal-walletPassword-contentBox-inputBox">
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <SpacerMD />
                        <div className="bchat-modal-walletPassword-contentBox-forgotTxt">
                            {/* <span style={{ cursor: 'pointer' }}>
                                {window.i18n('forgotPassword')}
                            </span> */}
                        </div>
                        <SpacerMD />
                        <div>
                            <BchatButton
                                text={window.i18n('continue')}
                                buttonType={BchatButtonType.BrandOutline}
                                buttonColor={BchatButtonColor.Green}
                                onClick={() => submit()}
                            />
                        </div>
                        <SpacerLG />
                    </div>
                </div>
            
        </BchatWrapperModal>
    );
};
