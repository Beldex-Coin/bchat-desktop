

import React, { useEffect, useState } from 'react';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatIcon } from '../icon';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateBchatWalletPasswordModal } from '../../state/ducks/modalDialog';
import { ToastUtils, UserUtils } from '../../bchat/utils';
import { useKey } from 'react-use';
import { updatewalletSyncBarShowInChat } from '../../state/ducks/walletConfig';
import { deamonvalidation } from '../../wallet/BchatWalletHelper';
import { getConversationById } from '../../data/data';
import { wallet } from '../../wallet/wallet-rpc';
import { walletSettingsKey } from '../../data/settings-key';
import { WalletPassword } from '../wallet/BchatWalletPassword';


export const BchatWalletPasswordModal = (props: any) => {
    const dispatch = useDispatch()

    const [password, setPassword] = useState('')
    const UserDetails: any = useSelector((state: any) => state.conversations.conversationLookup);

    const onClickClose = () => {
        dispatch(updateBchatWalletPasswordModal(null))

    };


    useEffect(() => {
        deamonvalidation();

    }, [])
    async function submit() {
        if (!password) {
            return ToastUtils.pushToastError('passwordFieldEmpty', window.i18n('passwordFieldEmpty'));
        }
        let userDetails = await getConversationById(UserUtils.getOurPubKeyStrFromCache());
        let profileName = userDetails?.attributes.walletUserName;
        if (!profileName) {
            profileName = UserDetails?.userId?.profileName;
        }
        //   setLoading(true);
        let openWallet: any = await wallet.openWallet(profileName, password);
        if (openWallet.hasOwnProperty('error')) {
            // setLoading(false);

            ToastUtils.pushToastError('walletInvalidPassword', openWallet.error?.message);
        } else {
            // let emptyAddress: any = '';
            // dispatch(updateSendAddress(emptyAddress));
            // setLoading(false);
            // props.onClick();
            // dispatch(dashboard());
            let data: any = true;
            //   dispatch(updateWalletSyncInitiatedWithChat(data)) ;
            dispatch(updatewalletSyncBarShowInChat(data))
            onClickClose()
            // heartbeat();
            const currentDaemon = window.getSettingValue(walletSettingsKey.settingsCurrentDeamon)
            ToastUtils.pushToastInfo('connectedDaemon', `Connected to ${currentDaemon.host}`);
        }

    }
    useKey((event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            submit();
        }
        return event.key === 'Enter';
    }); 
    return (
        <BchatWrapperModal
            title={''}
            onClose={onClickClose}
            showExitIcon={true}
            showHeader={true}
            headerReverse={true}
        >
            {props.from === 'wallet' ? <WalletPassword /> :

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
                        {/* <SpacerLG /> */}
                        {/* <SpacerLG /> */}
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
            }
        </BchatWrapperModal>
    );
};
