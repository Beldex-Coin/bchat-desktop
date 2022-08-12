import React from 'react';

import { SettingsHeader } from './BchatSettingsHeader';
// import { shell } from 'electron';
// import { BchatIconButton } from '../icon';
import autoBind from 'auto-bind';
import { BchatNotificationGroupSettings } from './BeldexNotificationGroupSettings';
// tslint:disable-next-line: no-submodule-imports
import { BlockedUserSettings } from './BlockedUserSettings';
import { SettingsCategoryPrivacy } from './section/CategoryPrivacy';
import { SettingsCategoryAppearance } from './section/CategoryAppearance';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { getPasswordHash } from '../../data/data';
import { LocalizerKeys } from '../../types/LocalizerKeys';
import { matchesHash } from '../../util/passwordUtils';

//bchat

import { BchatRecoverySeed } from "./BchatRecoverySeed"
// import {BchatSettingRecoveryKey} from "./BchatSettingRecoveryKey"
import {OverlayMessageRequest} from "../leftpane/overlay/OverlayMessageRequest"
import {BchatOnionPathScreen} from "./BchatOnionPathScreen"

export function getMediaPermissionsSettings() {
  return window.getSettingValue('media-permissions');
}

export function getCallMediaPermissionsSettings() {
  return window.getSettingValue('call-media-permissions');
}

export enum BchatSettingCategory {
  Appearance = 'appearance',
  Privacy = 'privacy',
  Notifications = 'notifications',
  MessageRequests = 'messageRequests',
  Blocked = 'blocked',
  RecoverySeed="recoverySeed",
  RecoveryKey="recoveryKey",
  // ViewMessageRequest="viewMessageRequest",
  Hops="hops"

}

export interface SettingsViewProps {
  category: BchatSettingCategory;
}

interface State {
  hasPassword: boolean | null;
  pwdLockError: string | null;
  mediaSetting: boolean | null;
  callMediaSetting: boolean | null;
  shouldLockSettings: boolean | null;
}

// const BchatInfo = () => {
//   const openBeldexWebsite = () => {
//     void shell.openExternal('https://www.beldex.io/');
//   };
//   return (
//     <div className="bchat-settings__version-info">
//       <span className="text-selectable">v{window.versionInfo.version}</span>
//       <span>
//         {/* <BchatIconButton iconSize="medium" iconType="oxen" onClick={openOxenWebsite} /> */}
//         <div role="button" onClick={openBeldexWebsite}>Bchat</div>
//       </span>
//       <span className="text-selectable">{window.versionInfo.commitHash}</span>
//     </div>
//   );
// };

export const PasswordLock = ({
  pwdLockError,
  validatePasswordLock,
}: {
  pwdLockError: string | null;
  validatePasswordLock: () => Promise<boolean>;
}) => {
  return (
    <div className="bchat-settings__password-lock">
      <div className="bchat-settings__password-lock-box">
        <h3>{window.i18n('password')}</h3>
        <input
          type="password"
          id="password-lock-input"
          defaultValue=""
          placeholder="Password"
          data-testid="password-lock-input"
        />

        {pwdLockError && <div className="bchat-label warning">{pwdLockError}</div>}

        <BchatButton
          buttonType={BchatButtonType.BrandOutline}
          buttonColor={BchatButtonColor.Green}
          text={window.i18n('ok')}
          onClick={validatePasswordLock}
        />
      </div>
    </div>
  );
};

 export class BchatSettingsView extends React.Component<SettingsViewProps, State> {
  
  public settingsViewRef: React.RefObject<HTMLDivElement>;


  public constructor(props: any) {
    super(props);

    this.state = {
      hasPassword: null,
      pwdLockError: null,
      mediaSetting: null,
      callMediaSetting: null,
      shouldLockSettings: true,
    };

    this.settingsViewRef = React.createRef();
    autoBind(this);

    void this.hasPassword();
  }

  public componentDidMount() {
    window.addEventListener('keyup', this.onKeyUp);

    const mediaSetting = getMediaPermissionsSettings();
    const callMediaSetting = getCallMediaPermissionsSettings();
    this.setState({ mediaSetting, callMediaSetting });

    setTimeout(() => document.getElementById('password-lock-input')?.focus(), 100);
  }

  public componentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyUp);
  }

  /* tslint:disable-next-line:max-func-body-length */
  public renderSettingInCategory() {
    const { category } = this.props;

    if (this.state.hasPassword === null) {
      return null;
    }
    if (category === BchatSettingCategory.Blocked) {
      // special case for blocked user
      return <BlockedUserSettings />;
    }

    

    if (category === BchatSettingCategory.Appearance) {
      return <SettingsCategoryAppearance hasPassword={this.state.hasPassword} />;
    }
    if (category === BchatSettingCategory.RecoverySeed) {
      return <BchatRecoverySeed  />;
    }

    // if (category === BchatSettingCategory.RecoveryKey) {
    //   return <BchatSettingRecoveryKey  />;
    // }

    if (category === BchatSettingCategory.MessageRequests) {
      return <OverlayMessageRequest settings={"true"} />;
    }

    if (category === BchatSettingCategory.Hops) {
      return <BchatOnionPathScreen/>;
    }    
    if (category === BchatSettingCategory.Notifications) {
      return <BchatNotificationGroupSettings hasPassword={this.state.hasPassword} />;
    }

    if (category === BchatSettingCategory.Privacy) {
      return (
        <SettingsCategoryPrivacy
          onPasswordUpdated={this.onPasswordUpdated}
          hasPassword={this.state.hasPassword}
        />
      );
    }
    return null;
  }

  public async validatePasswordLock() {
    const enteredPassword = String(
      (document.getElementById('password-lock-input') as HTMLInputElement)?.value
    );

    if (!enteredPassword) {
      this.setState({
        pwdLockError: window.i18n('noGivenPassword'),
      });

      return false;
    }

    // Check if the password matches the hash we have stored
    const hash = await getPasswordHash();
    if (hash && !matchesHash(enteredPassword, hash)) {
      this.setState({
        pwdLockError: window.i18n('invalidPassword'),
      });

      return false;
    }

    // Unlocked settings
    this.setState({
      shouldLockSettings: false,
      pwdLockError: null,
    });

    return true;
  }

  public render() {
    const { category } = this.props;
    const shouldRenderPasswordLock = this.state.shouldLockSettings && this.state.hasPassword;
    const categoryLocalized: LocalizerKeys =
      category === BchatSettingCategory.Appearance
        ? 'appearanceSettingsTitle'
        : category === BchatSettingCategory.Blocked
        ? 'blockedSettingsTitle'
        : category === BchatSettingCategory.RecoverySeed
        ? 'recoveryPhrase'
        : category ===  BchatSettingCategory.MessageRequests
        ? 'messageRequests'
        : category === BchatSettingCategory.Hops
        ? 'hops'
        : category === BchatSettingCategory.Notifications
        ? 'notificationsSettingsTitle'
        : 'privacySettingsTitle'
        


    return (
      <div className="bchat-settings">
        <SettingsHeader category={category} categoryTitle={window.i18n(categoryLocalized)} />

        <div className="bchat-settings-view">
          {shouldRenderPasswordLock ? (
            <PasswordLock
              pwdLockError={this.state.pwdLockError}
              validatePasswordLock={this.validatePasswordLock}
            />
          ) : (
            <div ref={this.settingsViewRef} className="bchat-settings-list">
              {this.renderSettingInCategory()}
            </div>
          )}
          {/* <BchatInfo /> */}
        </div>
      </div>
    );
  }

  public async hasPassword() {
    const hash = await getPasswordHash();

    this.setState({
      hasPassword: !!hash,
    });
  }

  public onPasswordUpdated(action: string) {
    if (action === 'set' || action === 'change') {
      this.setState({
        hasPassword: true,
        shouldLockSettings: true,
        pwdLockError: null,
      });
    }

    if (action === 'remove') {
      this.setState({
        hasPassword: false,
      });
    }
  }

  private async onKeyUp(event: any) {
    const lockPasswordVisible = Boolean(document.getElementById('password-lock-input'));

    if (event.key === 'Enter' && lockPasswordVisible) {
      await this.validatePasswordLock();
    }

    event.preventDefault();
  }
}
