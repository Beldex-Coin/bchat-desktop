import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { ChangePasswordModal, walletSettingMiniModal } from "../../state/ducks/modalDialog"
import { updateExeCurrency } from "../../state/ducks/walletConfig"
import { dashboard, nodeSetting } from "../../state/ducks/walletSection"
import { getwalletExeCurrency } from "../../state/selectors/walletConfig"

import { Flex } from "../basic/Flex"
import { SpacerLG, SpacerXS } from "../basic/Text"
import { ModalContainer } from "../dialog/ModalContainer"
import { BchatIcon } from "../icon/BchatIcon"
// import { ChangePassword } from "./BchatWalletChangePassword"
// import { WalletModal } from "./BchatWalletModal"


export const WalletSettings = () => {
    const dispatch = useDispatch();
    const exeCurrency=useSelector(getwalletExeCurrency);

    const currenyExt = ["AUD","BGN","BRL","CAD","CHF","CNY","CZK","EUR","DKK","GBP","HKD","HRK","HUF","IDR","ILS","INR","ISK","JPY","KRW","MXN","MYR","NOK","NZD","PHP","PLN","RON","RUB","SEK","SGD","USD","VEF","ZAR"]
    // let content=[window.i18n("usdCurrency"),window.i18n("audCurrency"),window.i18n("bgnCurrency")]
    return <div className="">
        {/* <WalletModal headerName={window.i18n('displayCurrency')} content={content} /> */}
        {/* <WalletModal headerName={window.i18n('displayCurrency')} content={content} /> */}

        <ModalContainer />
        <div onClick={() => dispatch(dashboard())} style={{ cursor: 'pointer' }}>
            <Flex container={true} alignItems="center" >
                <BchatIcon iconType="walletBackArrow" iconSize={"huge"} />
                <div className="wallet-addressBook-header-txt" >
                    {window.i18n('settingsHeader')}
                </div>
            </Flex>
        </div>
        <SpacerLG />
        <div className="wallet-settings-tabBox-subtle">
            {window.i18n('node')}
        </div>
        <SpacerXS />
        <div className="wallet-settings-tabBox" >
            <Flex container={true} justifyContent='space-between' padding="10px 0" >
                <div className="wallet-settings-tabBox-subtle">
                    {window.i18n("nCurrentRPCTxt")}
                </div>
                <div onClick={() => dispatch(nodeSetting())} style={{ cursor: 'pointer' }}>
                    <span className="wallet-settings-tabBox-disableText">mainnet.beldex.io:29095</span>
                    <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
                </div>
            </Flex>
        </div>
        <SpacerLG />
        <div className="wallet-settings-tabBox-subtle">
            {window.i18n("WalletSettingsTitle")}
        </div>
        <SpacerXS />
        <div className="wallet-settings-tabBox" >
            <Flex container={true} justifyContent='space-between' padding="10px 0" >
                <div className="wallet-settings-tabBox-subtle">
                    {window.i18n("decimals")}
                </div>
                <div>
                    <span className="wallet-settings-tabBox-disableText">Two</span>
                    <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
                </div>
            </Flex>

            {/* <SpacerMD /> */}
            <Flex container={true} justifyContent='space-between' padding="10px 0">
                <div className="wallet-settings-tabBox-subtle">
                    {window.i18n("displayCurrency")}
                </div>
                <div onClick={() => dispatch(walletSettingMiniModal({
                    headerName: "Currency", content: currenyExt,
                    currency:exeCurrency,
                    onClose: () => dispatch(walletSettingMiniModal(null)),
                    onClick: (e:any) => dispatch(updateExeCurrency(e))

                }))}>
                    <span className="wallet-settings-tabBox-disableText">USD</span>
                    <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
                </div>
            </Flex>
            {/* <SpacerMD /> */}
            <Flex container={true} justifyContent='space-between' padding="10px 0" >
                <div className="wallet-settings-tabBox-subtle">
                    {window.i18n("saveRecipientAddress")}
                </div>
                <div>
                    <span className="wallet-settings-tabBox-checkBox"></span>
                    {/* <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} /> */}
                </div>
            </Flex>
        </div>

        <SpacerLG />

        <div className="wallet-settings-tabBox-subtle">
            {window.i18n('personal')}
        </div>
        <SpacerXS />
        <div className="wallet-settings-tabBox" >
            <Flex container={true} justifyContent='space-between' padding="10px 0" >
                <div className="wallet-settings-tabBox-subtle">
                    {window.i18n("changePassword")}
                </div>
                <div onClick={() => dispatch(ChangePasswordModal({}))} style={{ cursor: "pointer" }}>
                    {/* <span className="wallet-settings-tabBox-disableText">mainnet.beldex.io:29095</span>  */}
                    <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
                </div>
            </Flex>
        </div>
    </div>
}