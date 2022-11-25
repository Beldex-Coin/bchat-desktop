import React from "react"
import { useSelector } from "react-redux";
import styled from "styled-components"
import { Flex } from "../basic/Flex"



export const SyncStatusBar=()=>{
    let height = useSelector((state:any)=>state.wallet.height);
    let daemonHeight = useSelector((state:any)=>state.daemon.height);
   return <div className="wallet-syncStatus">
    <div  className="wallet-syncStatus-absolute">
     <Indicator />
    <Flex container={true} justifyContent="space-between" padding="5px 0">
    <Flex container={true} >
        <div className="wallet-syncStatus-statusTxt">
        Status : <span className="wallet-syncStatus-statusTxt-greenTxt">Synchronized</span>
        </div>
        </Flex>
        <Flex container={true} >
            <div style={{marginRight:"10px"}} className="wallet-syncStatus-statusvalue">
            Remote : {daemonHeight} 
            </div>
            <div className="wallet-syncStatus-statusvalue">
            Wallet : {height} / {daemonHeight} (100.0%)
            </div>
        </Flex>
    </Flex>
    </div>
    </div>
}

const Indicator=styled.div`
width:100%;
height:2px;
background-color:green;
`