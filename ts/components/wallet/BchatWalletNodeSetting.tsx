import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { setting } from "../../state/ducks/walletSection"
import { BchatButton, BchatButtonColor } from "../basic/BchatButton"
import { Flex } from "../basic/Flex"
import { SpacerLG, SpacerMD } from "../basic/Text"
import { BchatIcon } from "../icon/BchatIcon"
import classNames from "classnames"
import { walletSettingsKey } from "../../data/settings-key"


export const NodeSetting = () => {
    const dispatch = useDispatch()
    console.log("current deamon ::",window.getSettingValue(walletSettingsKey.settingsCurrentDeamon));

    const currentDeamon=window.getSettingValue(walletSettingsKey.settingsCurrentDeamon)?window.getSettingValue(walletSettingsKey.settingsCurrentDeamon) :window.currentDaemon;
    const [viewBox1, setViewBox1] = useState(false);
    const [viewBox2, setViewBox2] = useState(false);
    const [ipAddress,setIpAddress]=useState('');
    const [port,setPort]=useState("")
    const [dropdown,setDropdown]=useState(false);
    const [chooseDeamon,setChooseDeamon]=useState(currentDeamon.host)
    const [chooseDeamonPort,setChooseDeamonPort]=useState(currentDeamon.port)
    // const [option,setOption]=useState([])
    const option=window.getSettingValue(walletSettingsKey.settingsDeamonList);

    console.log("current deamon ::",window.getSettingValue(walletSettingsKey.settingsCurrentDeamon));
    

function addDeamonNet()
{
    let data=[{host:ipAddress,port:port,active:0}]
    let deamon_list=window.getSettingValue(walletSettingsKey.settingsDeamonList);
    if(deamon_list)
    {
        data.push(deamon_list);
    // window.setSettingValue(walletSettingsKey.settingsDeamonList,data);  
    }
    window.setSettingValue(walletSettingsKey.settingsDeamonList,data);  

    console.log("datadata ::",data);
    

}
function currentDeamonNet()
{
    let data={host:chooseDeamon,port:chooseDeamonPort,active:1}
    window.setSettingValue(walletSettingsKey.settingsCurrentDeamon,data);  

}
function showDropDown()
{
    // let data=window.getSettingValue(walletSettingsKey.settingsDeamonList);
    // setOption(data)
    setDropdown(!dropdown)
    console.log("option ::",option);
    
}
function AssignCurrentDeamon(item:any)
{
    setChooseDeamon(item.host)
    setDropdown(false)
    setChooseDeamonPort(item.port)
    currentDeamonNet();
}
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

                        <input value={ipAddress} placeholder="Enter your MainNet IP Address" className="wallet-settings-nodeSetting-remoteContentBox-inputBox" onChange={(e:any)=>setIpAddress(e.target.value)} />

                    </article>
                    <article className="wallet-settings-nodeSetting-remoteContentBox">
                        <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                            {window.i18n("remoteNodePort")}
                        </div>

                        <input value={port} className="wallet-settings-nodeSetting-remoteContentBox-inputBox" onChange={(e:any)=>!isNaN(e.target.value)&&setPort(e.target.value)} placeholder='please enter your port '/>

                    </article>
                </Flex>
                <SpacerLG />
                <SpacerLG />

                <div className="wallet-settings-nodeSetting-FlexBox wallet-settings-nodeSetting-remoteContentBox-btnBox">

                    <div>
                        <BchatButton buttonColor={BchatButtonColor.Primary} text={window.i18n("test")} />
                    </div>
                    <div>
                        <BchatButton buttonColor={BchatButtonColor.Green} text={window.i18n("add")} onClick={()=>addDeamonNet()}/>
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
                                <input value={chooseDeamon} className="wallet-settings-nodeSetting-remoteContentBox-inputBox-input" style={{ width: "95%", padding: 0 }} />
                                 {dropdown &&  <div style={{ position: 'relative' }}>
                                    <div className="wallet-settings-nodeSetting-dropDownModal">
                                        {option && option.map((item:any,i:number)=>
                                            <div key={i} style={{ marginBottom: '5px' }} onClick={()=>AssignCurrentDeamon(item)}>
                                            <BchatIcon iconType="circle" iconSize={8} iconColor='#20D024' />
                                            <span style={{ marginLeft: "10px" }}>{item.host}:{item.port}</span>
                                        </div>
                                        )}
                                        {/* <div style={{ marginBottom: '5px' }} onClick={()=>{setChooseDeamon('mainnet.beldex.io'),setDropdown(false),setChooseDeamonPort(29095)}}>
                                            <BchatIcon iconType="circle" iconSize={8} iconColor='#20D024' />
                                            <span style={{ marginLeft: "10px" }}>mainnet.beldex.io:29095</span>
                                        </div> */}
                                    </div>
                                </div>}
                               
                            </div>

                            <div className="wallet-settings-nodeSetting-remoteContentBox-inputBox-dropDownBtn" onClick={()=>showDropDown()}>
                                <BchatIcon iconSize={20} iconType="chevron" />
                            </div>
                        </div>

                    </article>

                    <article className="wallet-settings-nodeSetting-remoteContentBox">
                        <div className="wallet-settings-nodeSetting-remoteContentBox-labelTxt">
                            {window.i18n("remoteNodePort")}
                        </div>

                        <input value={chooseDeamonPort} className="wallet-settings-nodeSetting-remoteContentBox-inputBox" disabled={true} />

                    </article>
                </Flex>

                <SpacerLG />
                <SpacerLG />
                <div className="wallet-settings-nodeSetting-FlexBox wallet-settings-nodeSetting-remoteContentBox-btnBox">

                    <div >
                        <BchatButton buttonColor={BchatButtonColor.Green} text={window.i18n("save")} onClick={()=>currentDeamonNet()}/>
                    </div>

                </div>
                <SpacerLG />
                <SpacerLG />
                <div className="wallet-settings-nodeSetting-horizontalLine"></div>
            </div>

        </section>

    </div>
}