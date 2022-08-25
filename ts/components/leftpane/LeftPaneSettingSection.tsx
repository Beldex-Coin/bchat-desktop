import React from 'react';
import classNames from 'classnames';


import { LeftPaneSectionHeader } from './LeftPaneSectionHeader';
import { useDispatch, useSelector } from 'react-redux';
import {
  // SectionType,
  // setOverlayMode,
  // showLeftPaneSection,
  showSettingsSection,
} from '../../state/ducks/section';
import { getFocusedSettingsSection } from '../../state/selectors/section';
import {
  //  recoveryPhraseModal,
  updateDeleteAccountModal
} from '../../state/ducks/modalDialog';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatIcon } from '../icon';
import { BchatSettingCategory } from '../settings/BchatSettings';
// import { resetConversationExternal } from '../../state/ducks/conversations';
// import { BchatIconType } from '../icon';

 import { ActionPanelOnionStatusLight } from '../dialog/OnionStatusPathDialog';
//  import {  onionPathModal,} from '../../state/ducks/modalDialog';
//  import {OnionPathModal} from "../../components/dialog/OnionStatusPathDialog";

// const getCategories = () => {
//   return [
//     {
//       id: BchatSettingCategory.Appearance,
//       title: window.i18n('appearanceSettingsTitle'),
//       icon: "appearance.svg",

//     },
//     {
//       id: BchatSettingCategory.Privacy,
//       title: window.i18n('privacySettingsTitle'),
//       icon: "privacy.svg",
//     },
//     {
//       id: BchatSettingCategory.Blocked,
//       title: window.i18n('blockedSettingsTitle'),
//       icon: "blocked_contact.svg"
//     },
//     {
//       id: BchatSettingCategory.RecoverySeed,
//       // title: window.i18n('blockedSettingsTitle'),
//       title: "Recovery Seed",
//       icon: "recovery_seed.svg"
//     },
//     // {
//     //   id: BchatSettingCategory.RecoveryKey,
//     //   // title: window.i18n('notificationsSettingsTitle'),
//     //   title: "Recovery Key",
//     //   icon:"key.svg"

//     // },
//     {
//       id: BchatSettingCategory.MessageRequests,
//       title: "View Message Request",
//       // title: window.i18n('openMessageRequestInbox'),
//       icon: "request.svg"
//     },
//     {
//       id: BchatSettingCategory.Hops,
//       // title: window.i18n('openMessageRequestInbox'),
//       title: "Hops",
//       icon: "Hops"
//     },
//   ];
// };

const LeftPaneSettingsCategoryRow = (
  // props: {
  // item: { id: BchatSettingCategory; title: string; icon:string };
  // }
) => {
  // const { item } = props;
  // const { id, title,icon} = item;
  const dispatch = useDispatch();
  const focusedSettingsSection = useSelector(getFocusedSettingsSection);

  // const isMessageRequestSetting = id === BchatSettingCategory.MessageRequests;

  // const dataTestId = `${title.toLowerCase()}-settings-menu-item`;
  const dataTestId = `settings-menu-item`;

  return (
    <>
      <div
        data-testid={dataTestId}
        // key={id}
        className={classNames(
          'left-pane-setting-category-list-item',
          BchatSettingCategory.Appearance === focusedSettingsSection ? 'active' : ''
        )}
        role="link"
        onClick={() => {
          // if (isMessageRequestSetting) {
          //   dispatch(showLeftPaneSection(SectionType.Message));
          //   dispatch(setOverlayMode('message-requests'));
          //   dispatch(resetConversationExternal());
          // } else {
          dispatch(showSettingsSection(BchatSettingCategory.Appearance));
          // }
        }}
        style={{ marginTop: '15px' }}
      >
        <div style={{ display: "flex", }}>
          {/* {icon==="Hops"? <span style={{padding:"0 10px"}}> <ActionPanelOnionStatusLight
          dataTestId="onion-status-section"
          //  handleClick={()=> dispatch(onionPathModal({}))}
          handleClick={()=>{}}
           isSelected={false}
          
           id={'onion-path-indicator-led-id'}
         /></span>: */}
          <i className="left-pane-setting-category-list-item-icons">
            <svg xmlns="http://www.w3.org/2000/svg" width="18.07" height="18.07" viewBox="0 0 18.07 18.07">
              <path id="appearance" d="M9.228,2A2.708,2.708,0,0,0,6.683,3.807H2.9a.9.9,0,1,0,0,1.807h3.78A2.706,2.706,0,1,0,9.228,2Zm5.421,1.807a.9.9,0,1,0,0,1.807h4.518a.9.9,0,1,0,0-1.807Zm-.9,4.518A2.708,2.708,0,0,0,11.2,10.132H2.9a.9.9,0,1,0,0,1.807h8.3a2.706,2.706,0,1,0,2.545-3.614Zm5.421,1.807a.9.9,0,1,0,.9.9.9.9,0,0,0-.9-.9ZM6.518,14.649a2.708,2.708,0,0,0-2.545,1.807H2.9a.9.9,0,1,0,0,1.807H3.973a2.706,2.706,0,1,0,2.545-3.614Zm5.421,1.807a.9.9,0,1,0,0,1.807h7.228a.9.9,0,1,0,0-1.807Z" transform="translate(-2 -2)" />
            </svg>
          </i>
          {/* } */}

          {/* <i className="left-pane-setting-category-list-item-icons" style={{backgroundImage:`url(images/bchat/${icon})`}}></i> */}

          <span className="left-pane-setting-category-list-item-span">{window.i18n('appearanceSettingsTitle')}</span>
        </div>
        <div>
          {BchatSettingCategory.Appearance === focusedSettingsSection && (
            <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
          )}
        </div>
      </div>

      {/* **********************************************************Privacy******************************************************************* */}

      <div
        data-testid={dataTestId}
        className={classNames(
          'left-pane-setting-category-list-item',
          BchatSettingCategory.Privacy === focusedSettingsSection ? 'active' : ''
        )}
        role="link"
        onClick={() => {
          dispatch(showSettingsSection(BchatSettingCategory.Privacy));
        }}
        style={{ marginTop: '15px' }}
      >
        <div style={{ display: "flex", }}>
          <i className="left-pane-setting-category-list-item-icons">
            <svg xmlns="http://www.w3.org/2000/svg" width="18.192" height="21.53" viewBox="0 0 18.192 21.53">
              <path id="privacy" d="M14.116,2a.717.717,0,0,0-.5.184,13.576,13.576,0,0,1-7.9,3.165A.717.717,0,0,0,5,6.067v5.866c0,3.2,1.478,8.453,8.817,11.542a.717.717,0,0,0,.557,0c7.335-3.089,8.817-8.346,8.817-11.542V6.067a.717.717,0,0,0-.717-.717,13.577,13.577,0,0,1-7.91-3.165A.717.717,0,0,0,14.116,2Zm-.024,6.7a2.391,2.391,0,0,1,1.435,4.3v2.4a1.435,1.435,0,1,1-2.871,0v-2.4a2.391,2.391,0,0,1,1.435-4.3Z" transform="translate(-5 -2)" />
            </svg>
          </i>
          <span className="left-pane-setting-category-list-item-span">{window.i18n('privacySettingsTitle')}</span>
        </div>
        <div>
          {BchatSettingCategory.Privacy === focusedSettingsSection && (
            <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
          )}
        </div>
      </div>

      {/* **********************************************************Blocked******************************************************************* */}

      <div
        data-testid={dataTestId}
        className={classNames(
          'left-pane-setting-category-list-item',
          BchatSettingCategory.Blocked === focusedSettingsSection ? 'active' : ''
        )}
        role="link"
        onClick={() => {
          dispatch(showSettingsSection(BchatSettingCategory.Blocked));
        }}
        style={{ marginTop: '15px' }}
      >
        <div style={{ display: "flex", }}>
          <i className="left-pane-setting-category-list-item-icons">
            <svg xmlns="http://www.w3.org/2000/svg" width="23.338" height="23.281" viewBox="0 0 23.338 23.281">
              <path id="blocked_contact" d="M9.537.156C6.8.156,4.6,2.035,4.6,5.629a9.282,9.282,0,0,0,2.354,6.21c.553,1.471-.443,2.02-.652,2.1C3.44,14.987.094,16.894.094,18.787V19.5c0,2.58,4.913,3.176,9.471,3.176,1,0,2-.043,2.977-.113a7.05,7.05,0,0,1-.454-9.159,2.242,2.242,0,0,1,.057-1.588,9.249,9.249,0,0,0,2.325-6.182C14.471,2.035,12.273.156,9.537.156ZM17.7,11.981a5.728,5.728,0,1,0,5.728,5.728A5.728,5.728,0,0,0,17.7,11.981Zm-3.176,4.906h6.324v1.645H14.528Z" transform="translate(-0.094 -0.156)" />
            </svg>
          </i>


          <span className="left-pane-setting-category-list-item-span">{window.i18n('blockedSettingsTitle')}</span>
        </div>
        <div>
          {BchatSettingCategory.Blocked === focusedSettingsSection && (
            <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
          )}
        </div>
      </div>

      {/* *******************************************************RecoverySeed********************************************************************** */}

      <div
        data-testid={dataTestId}
        className={classNames(
          'left-pane-setting-category-list-item',
          BchatSettingCategory.RecoverySeed === focusedSettingsSection ? 'active' : ''
        )}
        role="link"
        onClick={() => { dispatch(showSettingsSection(BchatSettingCategory.RecoverySeed)); }}
        style={{ marginTop: '15px' }}
      >
        <div style={{ display: "flex", }}>
          <i className="left-pane-setting-category-list-item-icons">
            <svg xmlns="http://www.w3.org/2000/svg" width="19.648" height="21.832" viewBox="0 0 19.648 21.832">
              <path id="recovery_seed" d="M20.465,3.184H15.9a3.255,3.255,0,0,0-6.147,0H5.184A2.182,2.182,0,0,0,3,5.366V20.648a2.182,2.182,0,0,0,2.184,2.184H20.465a2.182,2.182,0,0,0,2.184-2.184V5.366a2.182,2.182,0,0,0-2.184-2.182Zm-7.641,0a1.091,1.091,0,1,1-1.091,1.091A1.091,1.091,0,0,1,12.824,3.184Zm4.366,7.641H13.915v7.641H11.733V10.824H8.458V8.641h8.733Z" transform="translate(-3 -1)" />
            </svg>
          </i>
          <span className="left-pane-setting-category-list-item-span">Recovery Seed</span>
        </div>
        <div>
          {BchatSettingCategory.RecoverySeed === focusedSettingsSection && (
            <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
          )}
        </div>
      </div>

      {/* *******************************************************MessageRequests********************************************************************** */}

      <div
        data-testid={dataTestId}
        className={classNames(
          'left-pane-setting-category-list-item',
          BchatSettingCategory.MessageRequests === focusedSettingsSection ? 'active' : ''
        )}
        role="link"
        onClick={() => {
          dispatch(showSettingsSection(BchatSettingCategory.MessageRequests))
        }}
        style={{ marginTop: '15px' }}
      >
        <div style={{ display: "flex", }}>
          <i className="left-pane-setting-category-list-item-icons">
            <svg xmlns="http://www.w3.org/2000/svg" width="23.205" height="23.25" viewBox="0 0 23.205 23.25">
              <path id="Message_request" d="M8151.968-11515.188a1.833,1.833,0,0,1-1.827-1.827v-10.959a1.833,1.833,0,0,1,1.827-1.827h12.789l3.651-3.653-.009,16.439a1.825,1.825,0,0,1-1.818,1.827Zm6.393-2.739h1.827v-1.827h-1.827Zm1.827-6.283c0,.962-1.827,2.763-1.827,3.651h1.827c0-.9,1.827-2.354,1.827-3.651a2.714,2.714,0,0,0-2.739-2.741,2.755,2.755,0,0,0-2.739,2.741h1.824a.951.951,0,0,1,.915-.915A.9.9,0,0,1,8160.188-11524.211Zm-12.32,4.126a1.663,1.663,0,0,1-1.656-1.665l-.009-14.98,3.33,3.33h11.651a1.67,1.67,0,0,1,1.665,1.665v.109h-12.476a1.832,1.832,0,0,0-1.827,1.827v9.714Z" transform="translate(-8145.703 11537.938)" stroke="rgba(0,0,0,0)" strokeWidth="1" />
            </svg>
          </i>
          <span className="left-pane-setting-category-list-item-span">{window.i18n('openMessageRequestInbox')}</span>
        </div>
        <div>
          {BchatSettingCategory.MessageRequests === focusedSettingsSection && (
            <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
          )}
        </div>
      </div>

      {/* **************************************************Hops*************************************************************************** */}

      <div
        data-testid={dataTestId}
        className={classNames(
          'left-pane-setting-category-list-item',
          BchatSettingCategory.Hops === focusedSettingsSection ? 'active' : ''
        )}
        role="link"
        onClick={() => {
          dispatch(showSettingsSection(BchatSettingCategory.Hops));
        }}
        style={{ marginTop: '15px' }}
      >
        <div style={{ display: "flex", }}>
           <span style={{padding:"0 10px"}}> <ActionPanelOnionStatusLight
          dataTestId="onion-status-section"
          handleClick={()=>{}}
           isSelected={false}
           id={'onion-path-indicator-led-id'}
         /></span>
          <span className="left-pane-setting-category-list-item-span">Hops</span>
        </div>
        <div>
          {BchatSettingCategory.Hops === focusedSettingsSection && (
            <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
          )}
        </div>
      </div>

    </>
  );
};

const LeftPaneSettingsCategories = () => {
  // const categories = getCategories();
  


  return (
    <div className="module-left-pane__list" key={0}>
      <div className="left-pane-setting-category-list">
        {/* {categories.map(item => { */}
        {/* return  */}
        <LeftPaneSettingsCategoryRow />
        {/* })} */}
      </div>
    </div>
  );
};

const LeftPaneBottomButtons = () => {
  const dangerButtonText = window.i18n('clearAllData');
  // const showRecoveryPhrase = window.i18n('showRecoveryPhrase');

  const dispatch = useDispatch();

  return (
    <div className="left-pane-setting-bottom-buttons" key={1}>
      <BchatButton
        text={dangerButtonText}
        buttonType={BchatButtonType.SquareOutline}
        buttonColor={BchatButtonColor.Danger}
        onClick={() => {
          dispatch(updateDeleteAccountModal({}));
        }}
      />

      {/* <BchatButton
        text={showRecoveryPhrase}
        buttonType={BchatButtonType.SquareOutline}
        buttonColor={BchatButtonColor.White}
        onClick={() => {
          dispatch(recoveryPhraseModal({}));
        }}
      /> */}
    </div>
  );
};

export const LeftPaneSettingSection = () => {
  return (
    <div className="left-pane-setting-section">
      <LeftPaneSectionHeader />
      <div className="left-pane-setting-content">
        <LeftPaneSettingsCategories />
        <span className="text-selectable" style={{ color: "#797984", marginLeft: '20px' }}>Bchat v1.0</span>

        <LeftPaneBottomButtons />
      </div>
    </div>
  );
};
