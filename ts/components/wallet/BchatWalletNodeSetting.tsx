import React from "react"
import { Flex } from "../basic/Flex"
import { SpacerLG } from "../basic/Text"
import { BchatIcon } from "../icon/BchatIcon"


export const NodeSetting = () => {
    return <div>
        <Flex container={true} alignItems="center" >
            <BchatIcon iconType="walletBackArrow" iconSize={"huge"} />
            <div className="wallet-addressBook-header-txt" >
                {window.i18n('node')}
            </div>
        </Flex>
        <SpacerLG />
        <section>
            <Flex container={true} alignItems="center" flexDirection="row" >
                <article className="wallet-settings-nodeSetting-FlexBox">
                    <div className="wallet-settings-nodeSetting-FlexBox-outlineCircle">
                       <BchatIcon  iconType="circle" iconSize='tiny'/>
                    </div>
                    <div className="marginLeft"> {window.i18n("remoteDaemonOnly")}</div>
                </article>
                <article></article>

            </Flex>
        </section>

    </div>
}