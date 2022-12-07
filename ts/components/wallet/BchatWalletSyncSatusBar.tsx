import React from "react"
import { useSelector } from "react-redux";
import styled from "styled-components"
import { Flex } from "../basic/Flex"



export const SyncStatusBar = () => {
    let height = useSelector((state: any) => state.wallet.height);
    let daemonHeight = useSelector((state: any) => state.daemon.height);
    let pct: any = (height == 0 || daemonHeight == 0) ? 0 : ((100 * height) / daemonHeight).toFixed(1);
    let percentage = (pct == 100.0 && height < daemonHeight) ? 99.9 : pct;
    return <div className="wallet-syncStatus">
        <div className="wallet-syncStatus-absolute">
            <Indicator style={{ width: `${percentage == 0 ? '10' : percentage}%`, backgroundColor: (height == daemonHeight) ? '#1DBF25' : '#FDB12A' }} />
            <Flex container={true} justifyContent="space-between" padding="5px 0">
                <Flex container={true} >
                    <div className="wallet-syncStatus-statusTxt">
                        Status : <span className="wallet-syncStatus-statusTxt-greenTxt" style={{ color: (height == daemonHeight) ? '#1DBF25' : '#FDB12A' }}>{(pct !== 0 && height == daemonHeight) ? 'Synchronized' : 'Starting Sync'}</span>
                    </div>
                </Flex>
                <Flex container={true} >
                    <div style={{ marginRight: "10px" }} className="wallet-syncStatus-statusvalue">
                        Remote : {daemonHeight}
                    </div>
                    <div className="wallet-syncStatus-statusvalue">
                        Wallet : {height} / {daemonHeight} ({percentage}%)
                    </div>
                </Flex>
            </Flex>
        </div>
    </div>
}

const Indicator = styled.div`
width:10%;
height:2px;
background-color:#FDB12A;
`