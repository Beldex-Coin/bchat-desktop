import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { showSettingsSection } from '../../state/ducks/section';
import { getFocusedSettingsSection } from '../../state/selectors/section';
import { updateDeleteAccountModal } from '../../state/ducks/modalDialog';
// import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatIcon, BchatIconType } from '../icon';
import { BchatSettingCategory } from '../settings/BchatSettings';
// import { ActionPanelOnionStatusLight } from '../dialog/OnionStatusPathDialog';
import { hideMultipleSelection } from '../../state/ducks/userConfig';
import { SpacerLG } from '../basic/Text';
import { getTheme } from '../../state/selectors/theme';
//  import {  onionPathModal,} from '../../state/ducks/modalDialog';
//  import {OnionPathModal} from "../../components/dialog/OnionStatusPathDialog";

export interface getCategories {
  id: any;
  title: string;
  icon: BchatIconType;
  extraId?: string;
}

const getCategories: Array<getCategories> = [
  {
    id: BchatSettingCategory.Chat,
    title: window.i18n('Chat'),
    icon: 'chat',
  },
  {
    id: BchatSettingCategory.WalletSettings,
    title: window.i18n('WalletSettingsTitle'),
    icon: 'wallet',
    extraId: 'BETA',
  },
  {
    id: BchatSettingCategory.Privacy,
    title: window.i18n('privacySettingsTitle'),
    icon: 'privacy',
  },
  {
    id: BchatSettingCategory.Appearance,
    title: window.i18n('appearanceSettingsTitle'),
    icon: 'appeareance',
  },
  {
    id: BchatSettingCategory.Notifications,
    title: window.i18n('notificationsSettingsTitle'),
    icon: 'notification',
  },
  {
    id: BchatSettingCategory.Blocked,
    title: window.i18n('blockedSettingsTitle'),
    icon: 'blockedContact',
  },
  {
    id: BchatSettingCategory.RecoverySeed,
    title: window.i18n('showRecoveryPhrase'),
    icon: 'recoverykey',
  },

  {
    id: BchatSettingCategory.MessageRequests,
    title: window.i18n('openMessageRequestInbox'),
    icon: 'messageRequest',
  },
  {
    id: BchatSettingCategory.Hops,
    title: 'Hops',
    icon: 'hops',
  },
  {
    id: BchatSettingCategory.ClearData,
    title: 'Clear Data',
    icon: 'clearData',
  },
];

const LeftPaneSettingsCategoryRow = () =>
  // props: {
  // item: { id: BchatSettingCategory; title: string; icon:string };
  // }
  {
    // const { item } = props;
    // const { id, title,icon} = item;
    const dispatch = useDispatch();
    const focusedSettingsSection = useSelector(getFocusedSettingsSection);
    const darkMode = useSelector(getTheme) === 'dark';

    // const isMessageRequestSetting = id === BchatSettingCategory.MessageRequests;

    // const dataTestId = `${title.toLowerCase()}-settings-menu-item`;
    const dataTestId = `settings-menu-item`;
    const iconColor=darkMode?'#E0E0E0':'#3E4A53';

    return (
      <>
        {getCategories.map((item) => (
          <div
          key={item.id}
            data-testid={dataTestId}
            className={classNames(
              'left-pane-setting-category-list-item',
              item.id === focusedSettingsSection ? 'active' : ''
            )}
            role="link"
            onClick={() => {
              if(item.id!==BchatSettingCategory.ClearData)
              {
                dispatch(showSettingsSection(item.id));
                item.id === BchatSettingCategory.Blocked && dispatch(hideMultipleSelection());
              }
              else{
                dispatch(updateDeleteAccountModal({}))
              }
             
            }}
          >
            <i className="left-pane-setting-category-list-item-icons">
              <BchatIcon
                iconSize={20}
                iconType={item.icon}
                iconColor={item.id === BchatSettingCategory.ClearData ? '#FF3E3E' :iconColor}
              />
            </i>
            <span
              className={'left-pane-setting-category-list-item-span'}
              style={{ color: item.id === BchatSettingCategory.ClearData ?'#FF3E3E':iconColor}}
            >
              {item.title}
            </span>
            {item.extraId && <span className="beta">BETA</span>}
          </div>
        ))}

        {/* <div
          data-testid={dataTestId}
          className={classNames(
            'left-pane-setting-category-list-item',
            BchatSettingCategory.Chat === focusedSettingsSection ? 'active' : ''
          )}
          role="link"
          onClick={() => {
            dispatch(showSettingsSection(BchatSettingCategory.Chat));
          }}
        >
          <div style={{ display: 'flex' }}>
          <i className="left-pane-setting-category-list-item-icons">
            <BchatIcon iconSize="medium" iconType="chat" />
          </i>

          <span className="left-pane-setting-category-list-item-span">{window.i18n('Chat')}</span>
          </div>
          <div>
            {BchatSettingCategory.Chat === focusedSettingsSection && (
              <BchatIcon iconSize="medium" iconType="chevron" iconRotation={270} />
            )}
          </div>
        </div> */}
      </>
    );
  };

const LeftPaneSettingsCategories = () => {
  // const categories = getCategories();

  if (0) {
    LeftPaneSettingsCategoryRow;
  }

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

// const LeftPaneBottomButtons = () => {
//   const dangerButtonText = window.i18n('clearAllData');
//   // const showRecoveryPhrase = window.i18n('showRecoveryPhrase');

//   const dispatch = useDispatch();

//   return (
//     <div className="left-pane-setting-bottom-buttons" key={1}>
//       <BchatButton
//         text={dangerButtonText}
//         buttonType={BchatButtonType.SquareOutline}
//         buttonColor={BchatButtonColor.Danger}
//         onClick={() => {
//           dispatch(updateDeleteAccountModal({}));
//         }}
//       />

//       {/* <BchatButton
//         text={showRecoveryPhrase}
//         buttonType={BchatButtonType.SquareOutline}
//         buttonColor={BchatButtonColor.White}
//         onClick={() => {
//           dispatch(recoveryPhraseModal({}));
//         }}
//       /> */}
//     </div>
//   );
// };

export const LeftPaneSettingSection = () => {
  return (
    <div className="left-pane-setting-section">
      <SpacerLG />
      <h6>{window.i18n('settingsHeader')}</h6>
      <SpacerLG />
      {/* <div className="left-pane-setting-content"> */}
      <div>
        <LeftPaneSettingsCategories />
      </div>
      {/* <span
        className="text-selectable"
        style={{ color: '#797984', marginLeft: '20px', marginTop: '27px' }}
      >
        {window.i18n('BChat')} v{window.getVersion()}
      </span> */}
    </div>
  );
};
