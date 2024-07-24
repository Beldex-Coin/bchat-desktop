import React, { useState } from 'react';
// tslint:disable no-submodule-imports

import { BchatWrapperModal } from '../BchatWrapperModal';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatIcon } from '../icon/BchatIcon';
import { bnsLinkModal, editProfileModal } from '../../state/ducks/modalDialog';
import { UserUtils } from '../../bchat/utils';
import { isLinkedBchatIDWithBnsForDeamon, linkBns } from '../conversation/BnsVerification';

export const BnsLinkDialog = () => {
  const [success, setSuccess] = useState(false);
  const [bnsName, setBnsName] = useState('');
  const [isVerify, setIsVerify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ourNumber = UserUtils.getOurPubKeyStrFromCache(); // get our bchat id
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
      <>
        <header>{i18n('bnsLinkedSuccessfully')}</header>
        <div>
          <svg
            width="68"
            height="68"
            viewBox="0 0 68 68"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="icons8-ok">
              <path
                id="Path 4809"
                d="M67.9998 33.9266C67.9998 40.5885 66.0243 47.1008 62.3232 52.6399C58.622 58.179 53.3615 62.4963 47.2067 65.0457C41.0519 67.595 34.2794 68.2621 27.7456 66.9624C21.2117 65.6627 15.21 62.4547 10.4993 57.7441C5.78867 53.0334 2.58068 47.0317 1.28101 40.4979C-0.0186521 33.964 0.648383 27.1915 3.19777 21.0367C5.74715 14.882 10.0644 9.62139 15.6035 5.92026C21.1427 2.21912 27.6549 0.243652 34.3168 0.243652C43.2501 0.243652 51.8175 3.79239 58.1343 10.1092C64.451 16.426 67.9998 24.9934 67.9998 33.9266Z"
                fill="#1BB51E"
              />
              <path
                id="Path 4810"
                d="M48.7264 21.4414L28.254 41.9378L21.2011 34.9043C20.5697 34.2734 19.7136 33.919 18.821 33.919C17.9284 33.919 17.0724 34.2734 16.441 34.9043C16.1278 35.2173 15.8794 35.5888 15.7099 35.9978C15.5404 36.4068 15.4531 36.8451 15.4531 37.2878C15.4531 37.7306 15.5404 38.1689 15.7099 38.5779C15.8794 38.9869 16.1278 39.3584 16.441 39.6713L25.8745 49.082C26.5061 49.713 27.3623 50.0675 28.2551 50.0675C29.1479 50.0675 30.0042 49.713 30.6358 49.082L53.4922 26.2027C54.1233 25.5709 54.4778 24.7145 54.4778 23.8215C54.4778 22.9285 54.1233 22.0721 53.4922 21.4403C53.1793 21.1272 52.8078 20.8789 52.3989 20.7095C51.99 20.5401 51.5517 20.453 51.1091 20.4531C50.6665 20.4532 50.2282 20.5406 49.8194 20.7101C49.4105 20.8797 49.0391 21.1282 48.7264 21.4414Z"
                fill="white"
              />
            </g>
          </svg>
        </div>
        <BchatButton
          style={{
            height: '45px',
            borderRadius: '10px',
            margin: '15px 122px 40px',
            fontSize: '16px',
          }}
          text={i18n('ok')}
          buttonType={BchatButtonType.Default}
          buttonColor={BchatButtonColor.Green}
          onClick={() => {
            closeDialog();
          }}
        />
      </>
    );
  };
  return (
    <BchatWrapperModal
      showHeader={false}
      onClose={closeDialog}
      showExitIcon={false}
      isloading={isLoading}
      buttons={<div style={{
        width: '40%',
        margin: 'auto 0',
        backgroundColor: '#2E333D',
        fontWeight: 600,
        border: 'none',
        borderRadius: '12px',
        fontSize: "12px",
        height: '55px',
        fontFamily: "Poppins",
      }}>
        <BchatButton
          style={{ borderRadius: '10px', fontSize: '18px' }}
          text={i18n('cancel')}
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Secondary}
          onClick={() => closeDialog()}
        />
      </div>}
    >
      <div style={{ width: '410px', paddingTop: '20px' }} className="bns_link_modal">
        {!success ? (
          <>
            <header>{i18n('linkBNS')}</header>
            {/* <div className="label_id"> {i18n('yourBchatID')}</div> */}
            <div className="id_wrapper">
              <div style={{
                marginTop: '15px',
                color: '#F0F0F0',
                fontWeight: '400',
                fontFamily: 'Poppins'
              }}>{window.i18n('yourBchatID')}</div>
              {/* <span className="id_content">{ourNumber}</span> */}
              <p className="id_content">{ourNumber}</p>
            </div>
            {/* <div className="hr_line"></div> */}
            <div className="label_input">{i18n('bnsName')}</div>
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
            <div className="divided-btn-wrapper">
              {!isVerify ? (
                // <div className='button'>
                <BchatButton
                  style={{
                    width: '200px',
                    height: '55px'
                  }}
                  text={i18n('verify')}
                  disabled={!regexForBnsName.test(bnsName)}
                  buttonType={BchatButtonType.Brand}
                  buttonColor={!regexForBnsName.test(bnsName) ? BchatButtonColor.Disable : BchatButtonColor.Enable}
                  onClick={() => verifyBns()}
                />
                // </div>
              ) : (
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
                  width: '200px',
                  height: '55px'
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
