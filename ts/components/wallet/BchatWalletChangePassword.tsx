
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { ChangePasswordModal } from "../../state/ducks/modalDialog"
import { BchatButton, BchatButtonColor, BchatButtonType } from "../basic/BchatButton"
import { Flex } from "../basic/Flex"
import { SpacerMD, SpacerSM } from "../basic/Text"
import { BchatWrapperModal } from "../BchatWrapperModal"
import { BchatIcon } from "../icon"


export const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const dispatch=useDispatch();
    function onClickCancelHandler()
    {
        console.log("onClickCancelHandler");
        
    dispatch(ChangePasswordModal(null))
    // dispatch(updateDeleteAccountModal());
    }
    // const [confirm,setConfirm]=useState("");
    return <div>
        <BchatWrapperModal
            title={window.i18n('changePassword')}
               onClose={()=>onClickCancelHandler()}
            showExitIcon={false}
            headerReverse={true}
           
        >
            <div className="bchat-modal__centered" style={{width:"350px",alignItems: 'start'}}>
                <SpacerMD />
                <input value={oldPassword} onChange={(e) => { setOldPassword(e.target.value) }} placeholder={window.i18n('noGivenPassword')} className="wallet-settings-nodeSetting-oldpassInput" />
                <SpacerMD />
                <div>
                    {window.i18n('changewalletPassword')}
                </div>
                <SpacerSM />
                <Flex container={true} flexDirection={"row"} alignItems="center" width="100%" >
                <input value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} placeholder={window.i18n('enterwalletPassword')} className="wallet-settings-nodeSetting-newPassInput" />
                <BchatIcon iconType="eye" iconSize={"medium"} />
                </Flex>
                <SpacerSM />
                <Flex container={true} flexDirection={"row"} alignItems="center" width="100%" >
                <input value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} placeholder={window.i18n('reEnterPassword')} className="wallet-settings-nodeSetting-newPassInput" />
                <BchatIcon iconType="eye" iconSize={"medium"} />
                </Flex>
            </div>
            <SpacerMD />
            <SpacerMD />
            <div className="wallet-settings-modalBtnGrp">
                <div className="bchat-modal__button-group__center">
                    <BchatButton
                        text={window.i18n('cancel')}
                        buttonType={BchatButtonType.BrandOutline}
                        buttonColor={BchatButtonColor.Primary}
                    //   onClick={this.initClearDataView}
                    />
                    <BchatButton
                        text={window.i18n('save')}
                        buttonType={BchatButtonType.BrandOutline}
                        buttonColor={BchatButtonColor.Green}
                    //   onClick={this.initClearDataView}
                    />

                </div>
            </div>


            {/* <BchatSpinner loading={isLoading} /> */}

        </BchatWrapperModal >
    </div >
}