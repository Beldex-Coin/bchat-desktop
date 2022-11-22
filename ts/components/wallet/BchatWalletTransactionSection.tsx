import React from "react"
import { Flex } from "../basic/Flex"
import { SpacerLG } from "../basic/Text"
import { BchatIcon } from "../icon/BchatIcon"

export const TransactionSection = () => {
    return <div className="wallet-Transaction">


        {/* **********************Transaction Header************************* */}

        <Flex container={true} justifyContent="space-between" flexDirection="row">
            <div>
                {window.i18n('transactions')}
            </div>
            <Flex container={true} justifyContent="space-between" flexDirection="row">
                <div >
                    {window.i18n('filter')}
                    <input placeholder={window.i18n('filterPlaceHolder')} className="wallet-Transaction-filterInput" />
                </div>
                <div className="wallet-Transaction-filterWithIcon">
                    <input value={window.i18n('filterAll')} />
                    <BchatIcon iconType="filter" iconSize={"tiny"} />
                </div>
            </Flex>
        </Flex>

        <SpacerLG />

        <div  className="wallet-Transaction-contentBox">
        <Flex container={true} justifyContent="space-between" flexDirection="row">

        <Flex container={true}  height=" 60px">
            <article className="wallet-Transaction-contentBox-sendIndicationBox">
                <BchatIcon iconType="paySend" iconSize={"medium"}  iconColor="#FC2727"/>
                <div>
                    {window.i18n('sent')}
                </div>
            </article>
            <article className="wallet-Transaction-contentBox-verticalline">

            </article>
            <div className="wallet-Transaction-contentBox-balanceBox">
                <div className="wallet-Transaction-contentBox-balanceBox-amount">-2 BDX</div>
                <div> bxcALKJHSakhdsadhaskdhHHHDJADHUAWjhjhsjdhjshaskjhdas9dapsidas…</div>
            </div>
            </Flex>
            <section className="wallet-Transaction-contentBox-dateandheight">
                <div className="wallet-Transaction-contentBox-dateandheight-month">6 months ago</div>
                <div className="wallet-Transaction-contentBox-dateandheight-height">Height : 1150109 (confirmed)</div>
            </section>

        </Flex>

        </div>

    </div>
}