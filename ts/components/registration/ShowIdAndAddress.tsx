import React, { useState } from 'react';
import { pushUserCopySuccess } from '../../bchat/utils/Toast';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { Flex } from '../basic/Flex';
import { GoBackMainMenuButton } from './SignUpTab';


export const DisplayIdAndAddress= (props:any) => (
    <div className='bchat-registration-welcome-screen-container'>
        <div className='bchat-registration-welcome-screen-goback'>
          <GoBackMainMenuButton assent={()=>{props.assentAndGoBack()}} />
        </div>
        <h1 className="bchat-head">{window.i18n('welcome')}</h1>
        <div className='bchat-registration-welcome-screen-back'>
        <h6 className='bchat-registration-welcome-screen-chat'>{window.i18n('chatId')}</h6>
        <div className='bchat-registration-welcome-screen-chat-value'>
              <p style={{color: "#0BB70F"}}>{props.pubKey}</p>
        </div>
        <p className='bchat-registration-welcome-screen-chat-content'>{window.i18n('yourBchatName')}</p>
        <h6 className='bchat-registration-welcome-screen-chat'>{window.i18n('beldexAddress')}</h6>
        <div className='bchat-registration-welcome-screen-chat-value' > 
          <p style={{color:"#1782FF"}}>{props.walletAddress}</p>
        </div>
        <p className='bchat-registration-welcome-screen-chat-content'>{window.i18n('beldexAddressConnection')}</p>
       </div>
       <BchatButton
        onClick={props.nextFunc}
        buttonType={BchatButtonType.Brand}
        buttonColor={BchatButtonColor.Green}
        text={window.i18n('next')}
        />
     </div>

);

export const Icons = (props:any)=>
<div onClick={()=>props.iconfunc()} style={{
    // background:`url(images/bchat/${props.icon}.svg) no-repeat`,
     width: "40px",
    height: "40px",
    backgroundColor:'var(--color-inboxBgColor)',
    backgroundSize:"16px",
    borderRadius:"35px",
    backgroundPosition:"center",
    // top: (props.icon=='paste')?'327px':"365px",  //377
    // right: (props.icon=='paste')?'106px':'135px',
    cursor:'pointer',
    marginTop:'207px',
    marginLeft:'50px',
    color:'var(--color-copyIcon)',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}}>
  <svg xmlns="http://www.w3.org/2000/svg" width="18.151" height="18.151" viewBox="0 0 18.151 18.151">
  <path id="copy_icon" d="M3.815,2A1.815,1.815,0,0,0,2,3.815V16.521H3.815V3.815H16.521V2Zm3.63,3.63A1.815,1.815,0,0,0,5.63,7.445V18.336a1.815,1.815,0,0,0,1.815,1.815H18.336a1.815,1.815,0,0,0,1.815-1.815V7.445A1.815,1.815,0,0,0,18.336,5.63Zm0,1.815H18.336V18.336H7.445Z" transform="translate(-2 -2)" />
</svg>
</div>


export const ShowRecoveryPhase= (props:any) => {
  const [seedCopied,setSeedCopied] = useState(false);
  // return(
  //     <div className='bchat-registration-welcome-screen-container'>
  //      <div className='bchat-registration-welcome-screen-goback'>
  //       <GoBackMainMenuButton assent={()=>{props.assentAndGoBack()}} />
  //      </div>
  //       <h1 className="bchat-head">{window.i18n('recoveryPhrase')}</h1>
  //       <h5 style={{color:"white",fontFamily:"poppin-regular"}}><span style={{color:"#F23333"}}>Note :</span> {window.i18n('saveYourRecoveryPhrase')}
  //       <br/><span style={{fontFamily:"poppin-semibold"}}>{window.i18n('copyToContinueRecovery')}</span></h5>
  //       <div className='bchat-registration-recovery-phrase'>
  //         <textarea className='bchat-registration-recovery-phrase-textarea' rows={4} cols={60} name="text" value={props.mnemonic} placeholder="Enter your recovery seed to restore your account" ></textarea>
  //         {<Icons icon={"copy_icon"} iconfunc={()=>{props.copySeed(props.mnemonic),setSeedCopied(true)}}/> }
  //        </div> 
  //       {/* <div>
  //       </div >             */}
  //      <BchatButton 
  //       onClick={props.nextFunc}
  //       buttonType={BchatButtonType.Brand}
  //       buttonColor={BchatButtonColor.Green}
  //       text={window.i18n('continue')}
  //       disabled={!seedCopied}/>
  //     </div>
  // );
  return(
     <div className='bchat-registration-welcome-screen-container' style={{width:'80%',marginLeft:'85px'}}>
      <Flex  flexDirection="row" container={true} height="100%">
      <Flex 
        alignItems="center"
        flexDirection="row"
        height="100%"
        width='86%'
        justifyContent="center"
        >
        <div className='bchat-registration-welcome-screen-goback'>
         <GoBackMainMenuButton assent={()=>{props.assentAndGoBack()}} />
         </div>
         <h1 className="bchat-head">{window.i18n('recoveryPhrase')}</h1>
         <h5 style={{color:"var(--color-Bchat-hint)",fontFamily:"poppin-regular"}}><span style={{color:"#F23333"}}>Note :</span> {window.i18n('saveYourRecoveryPhrase')}
         <br/><span style={{fontFamily:"poppin-semibold",color:"var(--color-text)"}}>{window.i18n('copyToContinueRecovery')}</span></h5>
         <div className='bchat-registration-recovery-phrase'>
           <textarea className='bchat-registration-recovery-phrase-textarea' rows={4} cols={60} name="text" value={props.mnemonic} placeholder="Enter your recovery seed to restore your account" ></textarea>
          </div> 
        <BchatButton 
         onClick={props.nextFunc}
         buttonType={BchatButtonType.Brand}
         buttonColor={BchatButtonColor.Green}
         text={window.i18n('continue')}
         disabled={!seedCopied}/>
        </Flex>
        <Flex 
            alignItems="center"
            flexDirection="row"
            height="100%"
            width='10%'>
          <Icons icon={"copy_icon"} iconfunc={()=>{props.copySeed(props.mnemonic),setSeedCopied(true),pushUserCopySuccess()}}/>
        </Flex> 
      </Flex>
      </div>


  )
}