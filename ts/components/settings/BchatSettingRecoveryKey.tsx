import {  useState } from 'react';
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
            title:window.i18n('recoveryKeyViewKeyPublic'),
            key:viewKey.result.pubkey
        },
        {
            title:window.i18n('recoveryKeyViewKeyPrivate'),
            key:viewKey.result.key
        },
        {
            title:window.i18n('recoveryKeySpendKeyPublic'),
            key:spendKey.result.pubkey
        },
        {
            title:window.i18n('recoveryKeySpendKeyPrivate'),
            key:spendKey.result.key
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
             <p className="bchat-settings-recovery-seed-bold">{window.i18n('important')}</p>
             <p className="bchat-settings-recovery-seed-red">{window.i18n('neverGiveKeyWarning')}</p>
             <p className="bchat-settings-recovery-seed-para">{window.i18n('neverInputKeyWarning')}</p>
             <p className="bchat-settings-recovery-seed-note">{window.i18n('confirmAccessKeyQuestion')}</p>
             <div className='bchat-settings-recovery-seed-button'>
             <BchatButton
              text={window.i18n('yesIAmSure')}
              onClick={()=>{setVerify(true)}}
              buttonType={BchatButtonType.Brand}
              buttonColor={BchatButtonColor.Green}
            //   disabled={!caption}
            />
             </div>
             
        </div>


    
}
