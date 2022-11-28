import React from "react"
import { useSelector } from "react-redux";
import styled from "styled-components"
import { Flex } from "../basic/Flex"



export const SyncStatusBar=()=>{
    let height = useSelector((state:any)=>state.wallet.height);
    let daemonHeight = useSelector((state:any)=>state.daemon.height);
    let percentage =height? `${((height/daemonHeight)*100).toFixed(2)}%`: '10%';
    console.log("percentaeg:",(height/daemonHeight)*100,percentage)
   return <div className="wallet-syncStatus">
    <div  className="wallet-syncStatus-absolute">
     <Indicator style={{width:`${percentage}`, backgroundColor:(height==daemonHeight)?'green':'yellow'}}/>
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
            Wallet : {height} / {daemonHeight} ({percentage}%)
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