import React, {  useState } from 'react';
import { BchatButton,BchatButtonColor, BchatButtonType } from '../basic/BchatButton';

export const BchatSettingRecoveryKey=()=>
{
    
    const[verify,setVerify] = useState(false);

   let spendKey:any = localStorage.getItem("spend_key");
   let viewKey :any= localStorage.getItem("view_key");
    spendKey=JSON.parse(spendKey);
    viewKey=JSON.parse(viewKey);
    let data=[
        {
            title:"View Key (public):",
            key:viewKey.pubkey
        },
        {
            title:"View Key (private):",
            key:viewKey.key
        },
        {
            title:"Spend Key (public):",
            key:spendKey.pubkey
        },
        {
            title:"Spend Key (private):",
            key:spendKey.key
        }]

    
    if(verify)
    {
       return <>
       { data.map((item:any,key:any)=> (<div key={key} className='bchat-modal-recovery-key'>
        <div className='bchat-modal-recovery-key-title'>{item.title}</div>
        <div className='bchat-modal-recovery-key-describtion'>{item.key}</div>
       </div>)
       
       )}
       </>
    }

    
    return <div className='bchat-settings-recovery-seed'>
             <img  src="images/bchat/warning.svg"   className="bchat-settings-recovery-seed-danger "/>
             <p className="bchat-settings-recovery-seed-bold">IMPORTANT</p>
             <p className="bchat-settings-recovery-seed-red">Never Give your Key to Anyone!</p>
             <p className="bchat-settings-recovery-seed-para">Never input your Key into any software or website other than the official beldex wallet or bchat directly from the play store, the beldex website or the beldex GitHub.</p>
             <p className="bchat-settings-recovery-seed-note">Are you sure you want to access your Key?</p>
             <div className='bchat-settings-recovery-seed-button'>
             <BchatButton
              text={"Yes, I am Sure!"}
              onClick={()=>{setVerify(true)}}
              buttonType={BchatButtonType.Brand}
              buttonColor={BchatButtonColor.Green}
            //   disabled={!caption}
            />
             </div>
             
        </div>


    
}
