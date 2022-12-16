import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { setting } from "../../state/ducks/walletSection"
import { BchatButton, BchatButtonColor } from "../basic/BchatButton"
import { Flex } from "../basic/Flex"
import { SpacerLG, SpacerMD } from "../basic/Text"
import { BchatIcon } from "../icon/BchatIcon"
import classNames from "classnames"


export const NodeSetting = () => {
    const dispatch = useDispatch()
    const [viewBox1, setViewBox1] = useState(false);
    const [viewBox2, setViewBox2] = useState(false);


    return <div>
        <div onClick={() => dispatch(setting())} style={{ cursor: 'pointer' }}>
            <Flex container={true} alignItems="center" >
                <BchatIcon iconType="walletBackArrow" iconSize={"huge"} />
                <div className="wallet-addressBook-header-txt" >
                    {window.i18n('node')}
                </div>
            </Flex>
        </div>
        <SpacerLG />
        <section className="wallet-settings-nodeSetting-contentBox">
            <Flex container={true} alignItems="center" flexDirection="row" width="40%" justifyContent="space-between">
                <article className="wallet-settings-nodeSetting-FlexBox">
                    <div className="wallet-settings-nodeSetting-FlexBox-outlineCircle">
                        <BchatIcon iconType="circle" iconSize='tiny' iconColor="#20D024" />
                    </div>
                    <div className="marginLeft"> {window.i18n("remoteDaemonOnly")}</div>
                </article>
                {/* <div className="marginLeft marginRight "></div> */}

                <article className="wallet-settings-nodeSetting-FlexBox" >
                    <div className="wallet-settings-nodeSetting-FlexBox-outlineCircle">
                        <BchatIcon iconType="circle" iconSize='tiny' iconColor="#20D024" />
                    </div>
                    <div className="marginLeft"> {window.i18n("localDaemonOnly")}</div>
                </article>

            </Flex>
            <SpacerMD />

            <div className="wallet-settings-nodeSetting-notesTxt">
                {window.i18n('remoteNoteToAllTransactions')}
            </div>

            <SpacerLG />


            <Flex container={true} justifyContent="space-between">
                <div className="wallet-settings-nodeSetting-dropDownHeaderTxt">
                    {window.i18n('addRemoteDaemonNode')}
                </div>
                <div onClick={()=>setViewBox1(!viewBox1)}>               
                    <BchatIcon iconType="circleChevron" iconSize={"medium"} iconRotation={viewBox1?0:178} />
                </div>

            </Flex>
            <SpacerLG />
            <div className={classNames("wallet-settings-nodeSetting-remoteContentBox-content-hidden-Box")} style={viewBox1?{display:'block'}:{}}>
                <Flex container={true} justifyContent="space-between">
                    <article className="wallet-settings-nodeSetting-remoteContentBox">
                        <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                            {window.i18n("remoteNodeHost")}
                        </div>

                        <input value="mainnet.beldex.io" className="wallet-settings-nodeSetting-remoteContentBox-inputBox" />

                    </article>
                    <article className="wallet-settings-nodeSetting-remoteContentBox">
                        <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                            {window.i18n("remoteNodePort")}
                        </div>

                        <input value="26071" className="wallet-settings-nodeSetting-remoteContentBox-inputBox" />

                    </article>
                </Flex>
                <SpacerLG />
                <SpacerLG />

                <div className="wallet-settings-nodeSetting-FlexBox wallet-settings-nodeSetting-remoteContentBox-btnBox">

                    <div>
                        <BchatButton buttonColor={BchatButtonColor.Primary} text={window.i18n("test")} />
                    </div>
                    <div>
                        <BchatButton buttonColor={BchatButtonColor.Green} text={window.i18n("add")} />
                    </div>

                </div>
                <SpacerLG />
                <SpacerLG />
            </div>

            <div className="wallet-settings-nodeSetting-horizontalLine">

            </div>
            <SpacerLG />
            <Flex container={true} justifyContent="space-between">
                <div className="wallet-settings-nodeSetting-dropDownHeaderTxt">
                    {window.i18n('chooseRemoteDaemonNode')}
                </div>
                <div onClick={()=>setViewBox2(!viewBox2)}>
                <BchatIcon iconType="circleChevron" iconSize={"medium"} iconRotation={viewBox2?0:178}/>
                </div>
            </Flex>
            <SpacerLG />
            <div className={classNames("wallet-settings-nodeSetting-remoteContentBox-content-hidden-Box")} style={viewBox2?{display:'block'}:{}}>
                <Flex container={true} justifyContent="space-between">
                    <article className="wallet-settings-nodeSetting-remoteContentBox">
                        <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                            {window.i18n("remoteNodeHost")}
                        </div>
                        <div className="wallet-settings-nodeSetting-remoteContentBox-inputBox">
                            <div className="wallet-settings-nodeSetting-remoteContentBox-inputBox-input" style={{ padding: 0 }}>
                                <input value="mainnet.beldex.io" className="wallet-settings-nodeSetting-remoteContentBox-inputBox-input" style={{ width: "95%", padding: 0 }} />

                                <div style={{ position: 'relative' }}>
                                    <div className="wallet-settings-nodeSetting-dropDownModal">
                                        <div style={{ marginBottom: '5px' }}>
                                            <BchatIcon iconType="circle" iconSize={8} iconColor='#20D024' />
                                            <span style={{ marginLeft: "10px" }}>mainnet.beldex.io:29095</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="wallet-settings-nodeSetting-remoteContentBox-inputBox-dropDownBtn">
                                <BchatIcon iconSize={20} iconType="chevron" />
                            </div>
                        </div>

                    </article>

                    <article className="wallet-settings-nodeSetting-remoteContentBox">
                        <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                            {window.i18n("remoteNodePort")}
                        </div>

                        <input value="26071" className="wallet-settings-nodeSetting-remoteContentBox-inputBox" />

                    </article>
                </Flex>

                <SpacerLG />
                <SpacerLG />
                <div className="wallet-settings-nodeSetting-FlexBox wallet-settings-nodeSetting-remoteContentBox-btnBox">

                    <div>
                        <BchatButton buttonColor={BchatButtonColor.Green} text={window.i18n("save")} />
                    </div>

                </div>
                <SpacerLG />
                <SpacerLG />
                <div className="wallet-settings-nodeSetting-horizontalLine"></div>
            </div>

        </section>

    </div>
}