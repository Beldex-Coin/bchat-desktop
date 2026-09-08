import React from 'react';
import classNames from 'classnames';

import { BchatIcon, BchatIconButton } from './icon';
import { withTheme } from 'styled-components';
import autoBind from 'auto-bind';
import { BchatButton, BchatButtonColor, BchatButtonType } from './basic/BchatButton';
// import { Constants } from '../bchat';
import { Flex } from './basic/Flex';
// import { ToastUtils } from '../bchat/utils';

interface State {
  error: string;
  errorCount: number;
  clearDataView: boolean;
  loading: boolean;
  PasswordVisible: boolean;
}

export const MAX_LOGIN_TRIES = 3;
type Props = {
  loading: boolean;
};
const BchatSpinner = (props: Props) => {
  const { loading } = props;
 
  const isLight = (window as any).theme === 'light';
  const imgsrc = isLight
    ? 'images/bchat/BChat_animi_logo.gif'
    : 'images/bchat/BChat_animi_black_logo.gif';
  return loading ? (
    <div className="bchat-loader" data-testid="loading-spinner">
      <div>
      <img src={imgsrc} className={isLight ? 'noir-loader-mark light' : 'noir-loader-mark'} style={{width:'110px',height:'110px',display:'flex',}}/>
      </div>
    </div>

  ) : null;
};
class BchatPasswordPromptInner extends React.PureComponent<{}, State> {
  private inputRef?: any;

  constructor(props: any) {
    super(props);

    this.state = {
      error: '',
      errorCount: 0,
      clearDataView: false,
      loading: false,
      PasswordVisible: true,
    };

    autoBind(this);
  }

  public componentDidMount() {
    setTimeout(() => {
      this.inputRef?.focus();
    }, 100);
  }

  public render() {
    const showResetElements = this.state.errorCount >= MAX_LOGIN_TRIES;
    let checkError: any = this.state.error;
    if (checkError) {
      // console.log("checkErrorr:try:",checkError)
    }
    // const wrapperClass = this.state.clearDataView
    //   ? 'clear-data-wrapper'
    //   : 'password-prompt-wrapper';
    // const containerClass = this.state.clearDataView
    //   ? 'clear-data-container'
    //   : 'password-prompt-container';
    const infoAreaClass = this.state.clearDataView ? 'warning-info-area' : 'password-info-area';
    // const infoTitle = this.state.clearDataView
    //   ? window.i18n('clearAllData')
    //   : window.i18n('passwordViewTitle');
    const buttonGroup = this.state.clearDataView
      ? this.renderClearDataViewButtons()
      : this.renderPasswordViewButtons();
    const featureElement = this.state.clearDataView ? (
      <p className="text-center">{window.i18n('deleteAccountWarning')}</p>
    ) : (
      <div className="input-wrapper">
        <input
          id="password-prompt-input"
          type={this.state.PasswordVisible ? 'password' : 'text'}
          defaultValue=""
          placeholder={'ENTER PASSWORD'}
          minLength={4}
          maxLength={26}
          onKeyUp={this.onKeyUp}
          ref={input => {
            this.inputRef = input;
          }}
        />
        <BchatIconButton
          iconType={!this.state.PasswordVisible ? 'eye_closed' : 'eye'}
          iconSize={'medium'}
          fillRule="evenodd"
          clipRule="evenodd"
          onClick={() => this.setState({ PasswordVisible: !this.state.PasswordVisible })}
        />
      </div>
    );
    // const infoIcon = this.state.clearDataView ? (
    //   <BchatIcon iconType="warning" iconSize={35} iconColor="#ce0000" />
    // ) : (
    //   <></>
    // );
    const errorSection = !this.state.clearDataView && this.state.error && (
      <>
        <div className="password-prompt-error-section">
          {showResetElements ? (
            <div className="bchat-label warningBg">{window.i18n('maxPasswordAttempts')}</div>
          ) : (
            <div className="bchat-label primary">{this.state.error}</div>
          )}
        </div>
      </>
    );
    const clearDataView = this.state.clearDataView && (
      <div>
        <Flex container={true} alignItems='baseline' padding={'20px 30px'}>
          <div className="clearData-icon-wrapper">
            <BchatIcon iconType={'warning'} iconSize={25} iconColor="#FF3E3E" />
          </div>

          <div>
            <p className="clearData-title">{window.i18n('clearAllData')}</p>
            <p className="clearData-content">{window.i18n('deleteAccountWarning')}</p>
          </div>
        </Flex>
      </div>
    );
    const spinner = this.state.loading ? <BchatSpinner loading={true} /> : null;

    return (
      <div className="password">
        <div className={'password-prompt-wrapper'}>
          <div className={'password-prompt-container'}>
            {!this.state.clearDataView ? (
              <>
                <div>
                  <LockImg />
                </div>

                <div className={infoAreaClass}>
                  <h1>ENTER PASSWORD</h1>
                </div>
                <div className="noir-pass-sub">THIS DEVICE IS ENCRYPTED AT REST</div>
                {spinner || featureElement}
                {errorSection}
              </>
            ) : (
              clearDataView
            )}
            <div className="btn-grp-wrapper"> {buttonGroup}</div>
            {!this.state.clearDataView && (
              <div
                className="noir-pass-hint"
                role="button"
                onClick={this.initClearDataView}
              >
                FORGOT? RESTORE WITH YOUR RECOVERY SEED →
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  public onKeyUp(event: any) {
    switch (event.key) {
      case 'Enter':
        this.initLogin();
        break;
      default:
    }
    event.preventDefault();
  }

  public async onLogin(passPhrase: string) {
    const passPhraseTrimmed = passPhrase.trim();

    try {
      await window.onLogin(passPhraseTrimmed);
    } catch (error) {
      // Increment the error counter and show the button if necessary
      this.setState({
        errorCount: this.state.errorCount + 1,
      });
   
      this.setState({ error });
       setTimeout(()=>{
        this.setState({ error:'' });
       },1000)

      global.setTimeout(() => {
        document.getElementById('password-prompt-input')?.focus();
      }, 50);
    }
    this.setState({
      loading: false,
    });
  }

  private initLogin() {
    const passPhrase = String((this.inputRef as HTMLInputElement)?.value);

    // if (passPhrase.trim()) {
    //   ToastUtils.pushToastError('validatePassword', window.i18n('emptyPassword'));
    //   return;
    // }
    this.setState({
      loading: true,
    });

    global.setTimeout(() => this.onLogin(passPhrase), 100);
  }

  private initClearDataView() {
    this.setState({
      error: '',
      errorCount: 0,
      clearDataView: true,
    });
  }

  private renderPasswordViewButtons(): JSX.Element {
    const showResetElements = this.state.errorCount >= MAX_LOGIN_TRIES;

    return (
      <div className={classNames(showResetElements && 'button-group')}>
        {showResetElements && (
          <>
            <BchatButton
              text={window.i18n('resetDatabase')}
              buttonType={BchatButtonType.Brand}
              buttonColor={BchatButtonColor.Danger}
              onClick={this.initClearDataView}
            />
          </>
        )}
        <div className="unlock-button">
          <BchatButton
            text={window.i18n('unlock')}
            buttonType={BchatButtonType.Brand}
            buttonColor={BchatButtonColor.Primary}
            onClick={this.initLogin}
          />
        </div>
      </div>
    );
  }

  private renderClearDataViewButtons(): JSX.Element {
    return (
      <div className="button-group">
        <BchatButton
          text={window.i18n('cancel')}
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Secondary}
          onClick={() => {
            this.setState({ clearDataView: false });
          }}
        />

        <BchatButton
          text={window.i18n('clearAllData')}
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Danger}
          onClick={window.clearLocalData}
        />
      </div>
    );
  }
}

// NOIR: airlock glyph — one green lock on the field.
const LockImg = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.4">
    <rect x="5" y="11" width="14" height="9" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    <circle cx="12" cy="15.5" r="1.1" fill="var(--color-accent)" stroke="none" />
  </svg>
);


export const BchatPasswordPrompt = ((withTheme as any)(BchatPasswordPromptInner) as any);
