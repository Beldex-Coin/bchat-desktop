import React, { useState } from 'react';

import { BchatSeedModal } from '../dialog/BchatSeedModal';
import { useSelector } from 'react-redux';
import {
  getRecoveryPhraseDialog,
} from '../../state/selectors/modal';

import { BchatButton,BchatButtonColor, BchatButtonType } from '../basic/BchatButton';

export const BchatRecoverySeed = () =>
{
    const[verify,setVerify]=useState(false)
    const recoveryPhraseModalState = useSelector(getRecoveryPhraseDialog);
   
    if(verify)
    {
        return <BchatSeedModal {...recoveryPhraseModalState} />
    }

    
    return <div className='bchat-settings-recovery-seed'>
             <img  src="images/bchat/warning.svg"   className="bchat-settings-recovery-seed-danger "/>
             <p className="bchat-settings-recovery-seed-bold">IMPORTANT</p>
             <p className="bchat-settings-recovery-seed-red">Never Give your Seed to Anyone!</p>
             <p className="bchat-settings-recovery-seed-para">Never input your Seeds into any software or website other than the official beldex wallet or bchat directly from the play store, the beldex website or the beldex GitHub.</p>
             <p className="bchat-settings-recovery-seed-note">Are you sure you want to access your seed?</p>
             <div className='bchat-settings-recovery-seed-button'>
             <BchatButton
              text={"Yes, I am Sure!"}
              onClick={()=>setVerify(true)}
              buttonType={BchatButtonType.Brand}
              buttonColor={BchatButtonColor.Green}
            //   disabled={!caption}
            />
             </div>
             
        </div>


    
}
