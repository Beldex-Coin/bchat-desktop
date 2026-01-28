/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';

import { missingCaseError } from '../../util';
import { ToastUtils } from '../../bchat/utils';
import { getPasswordHash } from '../../data/data';
// import { SpacerSM } from '../basic/Text';
import autoBind from 'auto-bind';
import { bchatPassword } from '../../state/ducks/modalDialog';
import { LocalizerKeys } from '../../types/LocalizerKeys';
import { BchatButtonColor } from '../basic/BchatButton';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { matchesHash, validatePassword } from '../../util/passwordUtils';
import { BchatInput } from '../basic/BchatInput';
// import { BchatInput } from '../basic/BchatInput';

export type PasswordAction = 'set' | 'change' | 'remove';

interface Props {
  passwordAction: PasswordAction;
  onOk: () => void;
}

interface State {
  error: string | null;
  currentPasswordEntered: string;
  currentPasswordConfirmEntered: string;
  currentPasswordRetypeEntered: string;
}

export class BchatPasswordDialog extends React.Component<Props, State> {
  private passportInput: HTMLInputElement | null = null;

  constructor(props: any) {
    super(props);

    this.state = {
      error: null,
      currentPasswordEntered: '',
      currentPasswordConfirmEntered: '',
      currentPasswordRetypeEntered: '',
    };

    autoBind(this);
  }

  public componentDidMount() {
    setTimeout(() => {
      this.passportInput && this.passportInput.focus();
    }, 1);
  }

  public render() {
    const { passwordAction } = this.props;
    const placeholders =
      passwordAction === 'change'
        ? [
          window.i18n('currentPassword'),
          window.i18n('enterPassword'),
          window.i18n('confirmPassword'),
        ]
        : [window.i18n('removePasswordDisc'), window.i18n('confirmPassword')];

    // const confirmButtonColor = BchatButtonColor.Primary;
    // do this separately so typescript's compiler likes it
    const localizedKeyAction: LocalizerKeys =
      passwordAction === 'change'
        ? 'changePassword'
        : passwordAction === 'remove'
          ? 'removePassword'
          : 'setPassword';
     const btnName=localizedKeyAction==='removePassword'?window.i18n('remove'):window.i18n('save');
     const btnColor=localizedKeyAction==='removePassword'?BchatButtonColor.Danger:BchatButtonColor.Primary ;
    return (
      <BchatWrapperModal
        title={window.i18n(localizedKeyAction)}
        onClose={this.closeDialog}
        okButton={{
          text:btnName ,
          color: btnColor,
          onClickOkHandler: this.setPassword
        }}
        cancelButton={{ status: true, text: window.i18n('cancel'), onClickCancelHandler: this.closeDialog }
        }
      >
        {/* <SpacerSM /> */}
        <div className="bchat-modal-setPassword">

          {/* <div className="bchat-modal__input-group"> */}
          {/* <input
              type="password"
              id="password-modal-input"
              style={{ borderBottom: '2px solid var(--color-password-borderBottom)', borderRadius: 0 }}
              ref={input => {
                this.passportInput = input;
              }}
              placeholder={placeholders[0]}
              onKeyUp={this.onPasswordInput}
              data-testid="password-input"
              maxLength={26}
            /> */}
          <div style={{ marginBottom: '10px' }}>
            <BchatInput
              type="password"
              inputDataTestId="password-input"
              value={this.state.currentPasswordEntered}
              autoFocus={false}
              placeholder={placeholders[0]}
              enableShowHide={true}
              onValueChanged={this.onPasswordInput}
              maxLength={13}
            />
          </div>
          {passwordAction !== 'remove' && (
            // <input
            //   type="password"
            //   id="password-modal-input-confirm"
            //   style={{ borderBottom: '2px solid var(--color-password-borderBottom)', borderRadius: 0 }}
            //   placeholder={placeholders[1]}
            //   onKeyUp={this.onPasswordConfirmInput}
            //   data-testid="password-input-confirm"
            //   maxLength={26}
            // />
            <div style={{ marginBottom: '10px' }}>
              <BchatInput
                type="password"
                inputDataTestId="password-input-confirm"
                value={this.state.currentPasswordConfirmEntered}
                autoFocus={false}
                placeholder={placeholders[1]}
                enableShowHide={true}
                onValueChanged={this.onPasswordConfirmInput}
                maxLength={13}
              />
            </div>
          )}
          {passwordAction === 'change' && (
            // <input
            //   type="password"
            //   id="password-modal-input-reconfirm"
            //   style={{ borderBottom: '2px solid var(--color-password-borderBottom)', borderRadius: 0 }}
            //   placeholder={"confirm the pass"}
            //   onKeyUp={this.onPasswordRetypeInput}
            //   data-testid="password-input-reconfirm"
            //   maxLength={26}
            // />

            <div style={{ marginBottom: '10px' }}>
              <BchatInput
                type="password"
                inputDataTestId="password-input-reconfirm"
                value={this.state.currentPasswordRetypeEntered}
                autoFocus={false}
                placeholder={placeholders[2]}
                enableShowHide={true}
                onValueChanged={this.onPasswordRetypeInput}
                maxLength={13}
              />
            </div>
          )}
          {/* </div> */}
        </div>


        {/* <SpacerSM /> */}

        {/* <div className="bchat-modal__button-group">
          <BchatButton text={window.i18n('cancel')} onClick={this.closeDialog} />
          <BchatButton
            text={window.i18n('ok')}
            buttonColor={confirmButtonColor}
            onClick={this.setPassword}
          />
        </div> */}
      </BchatWrapperModal>
    );
  }

  public async validatePasswordHash(password: string | null) {
    // Check if the password matches the hash we have stored
    const hash = await getPasswordHash();
    if (hash && !matchesHash(password, hash)) {
      return false;
    }

    return true;
  }

  /**
   * Returns false and set the state error field in the input is not a valid password
   * or returns true
   */
  private validatePassword(firstPassword: string) {
    // if user did not fill the first password field, we can't do anything
    const errorFirstInput = validatePassword(firstPassword);
    if (errorFirstInput !== null) {
      ToastUtils.pushToastError('validatePassword', errorFirstInput);
      this.setState({
        error: errorFirstInput,
      });
      return false;
    }
    return true;
  }

  private async handleActionSet(enteredPassword: string, enteredPasswordConfirm: string) {
    // be sure both password are valid
    if (!this.validatePassword(enteredPassword)) {
      return;
    }
    // no need to validate second password. we just need to check that enteredPassword is valid, and that both password matches

    if (enteredPassword !== enteredPasswordConfirm) {
      ToastUtils.pushToastError('setPasswordInvalid', window.i18n('setPasswordInvalid'));
      this.setState({
        error: window.i18n('setPasswordInvalid'),
      });
      return;
    }
    await window.setPassword(enteredPassword, null);
    ToastUtils.pushToastSuccess(
      'setPasswordSuccessToast',
      window.i18n('setPasswordTitle'),
      window.i18n('setPasswordToastDescription'),
      'lock'
    );

    this.props.onOk();
    this.closeDialog();
  }

  private async handleActionChange(
    oldPassword: string,
    newPassword: string,
    newConfirmedPassword: string
  ) {
    // We don't validate oldPassword on change: this is validate on the validatePasswordHash below
    // we only validate the newPassword here
    if (!this.validatePassword(newPassword)) {
      return;
    }

    // Check the retyped password matches the new password

    if ((oldPassword === newPassword) || (oldPassword === newConfirmedPassword)) {
      ToastUtils.pushToastError('oldPasswordAndNewPasswordSame', window.i18n('oldPasswordAndNewPasswordSame'));
      this.setState({
        error: window.i18n('oldPasswordAndNewPasswordSame'),
      });
      return;
    }

    if (newPassword !== newConfirmedPassword) {
      ToastUtils.pushToastError('passwordsDoNotMatch', window.i18n('passwordsDoNotMatch'));
      this.setState({
        error: window.i18n('passwordsDoNotMatch'),
      });
      return;
    }

    const isValidWithStoredInDB = Boolean(await this.validatePasswordHash(oldPassword));
    if (!isValidWithStoredInDB) {
      ToastUtils.pushToastError('changePasswordInvalid', window.i18n('changePasswordInvalid'));
      this.setState({
        error: window.i18n('changePasswordInvalid'),
      });
      return;
    }
    await window.setPassword(newPassword, oldPassword);

    ToastUtils.pushToastSuccess(
      'setPasswordSuccessToast',
      window.i18n('changePasswordTitle'),
      window.i18n('changePasswordToastDescription'),
      'lock'
    );

    this.props.onOk();
    this.closeDialog();
  }

  private async handleActionRemove(oldPassword: string) {
    // We don't validate oldPassword on change: this is validate on the validatePasswordHash below
    const isValidWithStoredInDB = Boolean(await this.validatePasswordHash(oldPassword));
    if (!isValidWithStoredInDB) {
      ToastUtils.pushToastError(
        'removePasswordInvalid',
        window.i18n('removePasswordInvalid'),
      );
      this.setState({
        error: window.i18n('removePasswordInvalid'),
      });
      return;
    }
    await window.setPassword(null, oldPassword);

    ToastUtils.pushToastSuccess(
      'setPasswordSuccessToast',
      window.i18n('removePasswordTitle'),
      window.i18n('removePasswordToastDescription')
    );

    this.props.onOk();
    this.closeDialog();
  }

  private async setPassword() {
    const { passwordAction } = this.props;
    const {
      currentPasswordEntered,
      currentPasswordConfirmEntered,
      currentPasswordRetypeEntered,
    } = this.state;

    // Trim leading / trailing whitespace for UX
    const firstPasswordEntered = (currentPasswordEntered || '').trim();
    const secondPasswordEntered = (currentPasswordConfirmEntered || '').trim();
    const thirdPasswordEntered = (currentPasswordRetypeEntered || '').trim();

    switch (passwordAction) {
      case 'set': {
        await this.handleActionSet(firstPasswordEntered, secondPasswordEntered);
        return;
      }
      case 'change': {
        await this.handleActionChange(
          firstPasswordEntered,
          secondPasswordEntered,
          thirdPasswordEntered
        );
        return;
      }
      case 'remove': {
        await this.handleActionRemove(firstPasswordEntered);
        return;
      }
      default:
        throw missingCaseError(passwordAction);
    }
  }

  private closeDialog() {
    window.inboxStore?.dispatch(bchatPassword(null));
  }

  private async onPasswordInput(currentPasswordEntered: any) {
    // if (event.key === 'Enter') {
    //   return this.setPassword();
    // }
    // const currentPasswordEntered = event.target.value;

    this.setState({ currentPasswordEntered });
  }

  private async onPasswordConfirmInput(currentPasswordConfirmEntered: any) {
    // if (event.key === 'Enter') {
    //   return this.setPassword();
    // }
    // const currentPasswordConfirmEntered = event.target.value;

    this.setState({ currentPasswordConfirmEntered });
  }

  private async onPasswordRetypeInput(currentPasswordRetypeEntered: any) {
    // if (event.key === 'Enter') {
    //   return this.setPassword();
    // }
    // const currentPasswordRetypeEntered = event.target.value;

    this.setState({ currentPasswordRetypeEntered });
  }
}
