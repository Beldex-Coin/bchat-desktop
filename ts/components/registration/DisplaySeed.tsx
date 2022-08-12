import React from 'react';
// import { pushUserCopySuccess } from '../../bchat/utils/Toast';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';

export const Icons = (props:any)=>
<div onClick={()=>props.iconfunc()} style={{
    background:`url(images/bchat/${props.icon}.svg) no-repeat`,
     width: "40px",
    height: "40px",
    position:"relative",
    backgroundColor:"var(--color-inboxBgColor)",
    backgroundSize:"16px",
    borderRadius:"35px",
    backgroundPosition:"center",
    left: '485px',
    bottom: '80px',
    cursor:'pointer'  
}}></div>

export const ClearIcon = (props:any)=>(
        <div onClick={()=> props.removeRecoveryPhrase()} 
        style={{
         background:`url(images/bchat/clear.svg) no-repeat`,
          width: "10px",
         height: "10px",
         position: 'relative',
         top:"8px",
         marginLeft: '425px',
         cursor:'pointer',
         backgroundSize:'cover'
         }}
         ></div>
)

const handlePaste = (event:any) => {
    console.log("EVENT_TEXT:",event.clipboardData.getData('text'));
    // pushUserCopySuccess()
  };

export const DisplaySeed = (props: any) => (
    <div className="bchat-restore-seed__address-container" >
        <>
            <div className='bchat-registration-header'>{window.i18n('restoreFromSeed')}</div>
            <div className='bchat-restore-seed-text-box'>
                <ClearIcon removeRecoveryPhrase={()=>props.assignRecoveryPhase("")}></ClearIcon> 
                <textarea className='bchat-restore-seed-text-area' rows={4} cols={33} name="text" onPaste={handlePaste} value={props.recoveryPhrase} placeholder="Enter your recovery seed to restore your account" 
                onChange={(e)=>props.assignRecoveryPhase(e.target.value)}
                 ></textarea>
            </div>
            <div>{<Icons icon={"paste"} iconfunc={props.iconfunc} /> }</div>            
        </>
        

        <BchatButton
            onClick={props.recoveryPhrase? props.onNext:null}
            buttonType={BchatButtonType.Brand}
            buttonColor={BchatButtonColor.Green}
            text={window.i18n('next')}
        // disabled={!enableCompleteSignUp}
        />
    </div>
);