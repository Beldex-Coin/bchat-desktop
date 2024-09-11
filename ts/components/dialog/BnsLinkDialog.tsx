import React, { useState } from 'react';
// tslint:disable no-submodule-imports

import { BchatWrapperModal } from '../BchatWrapperModal';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatIcon } from '../icon/BchatIcon';
import { bnsLinkModal, editProfileModal } from '../../state/ducks/modalDialog';
import { UserUtils } from '../../bchat/utils';
import { isLinkedBchatIDWithBnsForDeamon, linkBns } from '../conversation/BnsVerification';
import { SpacerLG, SpacerMD, SpacerSM } from '../basic/Text';
import { useSelector } from 'react-redux';
import { getTheme } from '../../state/selectors/theme';

export const BnsLinkDialog = () => {
  
  const [success, setSuccess] = useState(false);
  const [bnsName, setBnsName] = useState('');
  const [isVerify, setIsVerify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ourNumber = UserUtils.getOurPubKeyStrFromCache(); // get our bchat id
  const darkMode = useSelector(getTheme) === 'dark';
  const regexForBnsName = /^(?!-)[A-Za-z0-9-]+(?<!-)\.bdx$/;
  const i18n = window.i18n;
  function closeDialog() {
    window.inboxStore?.dispatch(bnsLinkModal(null));
    setSuccess(false);
    window.inboxStore?.dispatch(editProfileModal({}));
  }
  async function verifyBns() {
    setIsLoading(true);
    const isverified: boolean = await isLinkedBchatIDWithBnsForDeamon(bnsName);
    setIsVerify(isverified);
    setIsLoading(false);
  }
  const callLinkBns = async () => {
    //call to update conversational state value
    await linkBns(bnsName);
    setSuccess(true);
  };
  const BnsLinkedSuccessModal = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        <div>
          <img src={darkMode?'images/bchat/linked_bns.gif':'images/bchat/linked_bns_white.gif'} style={{ width: '120px', height: '120px' }} />
        </div>
        <div className="linked_bns">{i18n('bnsLinkedSuccessfully')}</div>
        {/* <BchatButton
          style={{
            height: '60px',
            borderRadius: '10px',
            margin: '15px 122px 40px',
            fontSize: '16px',
          }}
          text={i18n('ok')}
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Primary}
          onClick={() => {
            closeDialog();
          }}
        /> */}
      </div>
    );
  };
  return (
    <BchatWrapperModal
      showHeader={false}
      onClose={closeDialog}
      showExitIcon={false}
      isloading={isLoading}
      okButton={{
        text: success ? i18n('ok') : i18n('cancel'),
        onClickOkHandler: closeDialog,
        color: success ? BchatButtonColor.Primary : BchatButtonColor.Secondary,
      }}
      // buttons={<div className='buttons'>
      //   <BchatButton
      //     style={{ borderRadius: '10px', fontSize: '18px' }}
      //     text={success ? i18n('ok') : i18n('cancel')}
      //     buttonType={BchatButtonType.Brand}
      //     buttonColor={success ? BchatButtonColor.Primary : BchatButtonColor.Secondary}
      //     onClick={() => closeDialog()}
      //   />
      // </div>}
    >
      <div className="bns_link_modal">
        {!success ? (
          <>
            <header>{i18n('linkBNS')}</header>
            {/* <div className="label_id"> {i18n('yourBchatID')}</div> */}
            <div className="id_wrapper">
              <SpacerMD />
              <div className="id-label">{window.i18n('yourBchatID')}</div>
              <SpacerSM />
              {/* <span className="id_content">{ourNumber}</span> */}
              <p className="id_content">{ourNumber}</p>
              <SpacerMD />
            </div>
            <SpacerMD />
            {/* <div className="hr_line"></div> */}
            <div className="label_input">{i18n('bnsName')}</div>
            <SpacerSM />
            <div className="inputBox-wrapper">
              <input
                style={{ color: '#0BB70F' }}
                type="text"
                className="inputBox"
                disabled={isVerify}
                value={bnsName}
                placeholder={i18n('enterBnsName')}
                onChange={event => {
                  setBnsName(event.target.value);
                }}
                maxLength={33}
                data-testid="profile-name-input"
              />
            </div>
            <SpacerLG />

            <div className="divided-btn-wrapper">
              {!isVerify ? (
                // <div className='button'>
                <BchatButton
                  style={{
                    width: '245px',
                   
                  }}
                  text={i18n('verify')}
                  disabled={!regexForBnsName.test(bnsName)}
                  buttonType={BchatButtonType.Brand}
                  buttonColor={BchatButtonColor.Primary}
                  onClick={() => verifyBns()}
                />
              ) : (
                // </div>
                <div className="bchat-btn-struct">
                  <span style={{ marginRight: '4px' }}>{i18n('verified')}</span>
                  <span style={{ display: 'flex' }}>
                    <BchatIcon iconType="circleWithTick" iconSize={16} iconColor="#0B9E3C" />
                  </span>
                </div>
              )}
              {/* <div className='button'> */}
              <BchatButton
                style={{
                  width: '245px',
                 marginLeft:'10px'
                }}
                text={i18n('linkBNS')}
                disabled={!isVerify}
                buttonType={BchatButtonType.Brand}
                buttonColor={BchatButtonColor.Primary}
                onClick={() => callLinkBns()}
                // setSuccess(true)
              />
            </div>
            {/* </div> */}
          </>
        ) : (
          <BnsLinkedSuccessModal />
        )}
      </div>
    </BchatWrapperModal>
  );
};
