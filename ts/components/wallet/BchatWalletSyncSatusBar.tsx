import React from "react"
import styled from "styled-components"
import { Flex } from "../basic/Flex"



export const SyncStatusBar=()=>{
   return <div className="wallet-syncStatus">
     <Indicator />
    <Flex container={true} justifyContent="space-between" padding="5px 0">
    <Flex container={true} >
        <div className="wallet-syncStatus-statusTxt">
        Status : <span className="wallet-syncStatus-statusTxt-greenTxt">Synchronized</span>
        </div>
        </Flex>
        <Flex container={true} >
            <div style={{marginRight:"10px"}} className="wallet-syncStatus-statusvalue">
            Remote : 1709092 
            </div>
            <div className="wallet-syncStatus-statusvalue">
            Wallet : 1709092 / 1709092 (100.0%)
            </div>
        </Flex>
    </Flex>
    </div>
}

const Indicator=styled.div`
width:100%;
height:2px;
background-color:green;
`