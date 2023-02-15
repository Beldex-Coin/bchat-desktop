

import React from 'react';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatIcon } from '../icon';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';


export const BchatWalletPasswordModal = () => {

    const onClickClose = () => {

    };
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
                            <input type="password" value={""} onChange={e => console.log(e.target.value)} />
                        </div>
                        <SpacerMD />
                        <div className="bchat-modal-walletPassword-contentBox-forgotTxt">
                            <span style={{ cursor: 'pointer' }}>
                                {window.i18n('forgotPassword')}
                            </span>
                        </div>
                        <SpacerMD />
                        <div>
                            <BchatButton
                                text={window.i18n('continue')}
                                buttonType={BchatButtonType.BrandOutline}
                                buttonColor={BchatButtonColor.Green}
                                onClick={() => null}
                            />
                        </div>
                        <SpacerLG />
                    </div>
                </div>
            
        </BchatWrapperModal>
    );
};
