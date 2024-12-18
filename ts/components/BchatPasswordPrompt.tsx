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
 
  const imgsrc='images/bchat/Load_animation.gif';
  return loading ? (
    <div className="bchat-loader" data-testid="loading-spinner">
      <div>
      <img src={imgsrc}  style={{width:'150px',height:'150px',display:'flex',}}/>
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
          type={this.state.PasswordVisible ?"password":''}
          defaultValue=""
          placeholder={'Enter password'}
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
                  <h1>{window.i18n('passwordViewTitle')}</h1>
                </div>
                {spinner || featureElement}
                {errorSection}
              </>
            ) : (
              clearDataView
            )}
            <div className="btn-grp-wrapper"> {buttonGroup}</div>
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

const LockImg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="158"
    height="158"
    viewBox="0 0 158 158"
    fill="none"
  >
    <path
      d="M137.799 89.6019C139.593 86.197 140.62 82.326 140.62 78.2101C140.62 67.749 134.048 58.8441 124.818 55.3349C124.818 55.3238 124.82 55.3128 124.82 55.3001C124.82 36.9753 109.965 22.1201 91.6397 22.1201C76.181 22.1201 63.2297 32.7077 59.5452 47.0162C57.2131 46.2499 54.7278 45.8201 52.1397 45.8201C39.9864 45.8201 29.9834 54.9731 28.6135 66.7583C20.3912 68.4979 14.2197 75.7912 14.2197 84.5301C14.2197 94.5647 22.3551 102.7 32.3897 102.7C32.6694 102.7 32.9459 102.681 33.2208 102.665C33.2145 102.942 33.1797 103.212 33.1797 103.49C33.1797 121.379 47.681 135.88 65.5697 135.88C75.7402 135.88 84.8062 131.184 90.7454 123.85C94.1867 127.366 98.9709 129.56 104.28 129.56C111.627 129.56 117.985 125.373 121.132 119.262C122.794 119.791 124.562 120.08 126.4 120.08C135.998 120.08 143.78 112.299 143.78 102.7C143.78 97.4688 141.457 92.7888 137.799 89.6019Z"
      fill="#202329"
    />
    <path
      d="M24.4904 80.5797H8.69039C8.25431 80.5797 7.90039 80.2258 7.90039 79.7897C7.90039 79.3536 8.25431 78.9997 8.69039 78.9997H24.4904C24.9265 78.9997 25.2804 79.3536 25.2804 79.7897C25.2804 80.2258 24.928 80.5797 24.4904 80.5797ZM29.2304 80.5797H27.6504C27.2143 80.5797 26.8604 80.2258 26.8604 79.7897C26.8604 79.3536 27.2143 78.9997 27.6504 78.9997H29.2304C29.6664 78.9997 30.0204 79.3536 30.0204 79.7897C30.0204 80.2258 29.668 80.5797 29.2304 80.5797ZM37.1161 83.7397H22.9104C22.4743 83.7397 22.1204 83.3858 22.1204 82.9497C22.1204 82.5136 22.4743 82.1597 22.9104 82.1597H37.1161C37.5522 82.1597 37.9061 82.5136 37.9061 82.9497C37.9061 83.3858 37.5522 83.7397 37.1161 83.7397ZM19.7504 83.7397H18.1704C17.7343 83.7397 17.3804 83.3858 17.3804 82.9497C17.3804 82.5136 17.7343 82.1597 18.1704 82.1597H19.7504C20.1865 82.1597 20.5404 82.5136 20.5404 82.9497C20.5404 83.3858 20.188 83.7397 19.7504 83.7397ZM15.0104 83.7397H11.8504C11.4143 83.7397 11.0604 83.3858 11.0604 82.9497C11.0604 82.5136 11.4143 82.1597 11.8504 82.1597H15.0104C15.4465 82.1597 15.8004 82.5136 15.8004 82.9497C15.8004 83.3858 15.448 83.7397 15.0104 83.7397ZM24.4904 86.8997H21.3304C20.8943 86.8997 20.5404 86.5458 20.5404 86.1097C20.5404 85.6736 20.8943 85.3197 21.3304 85.3197H24.4904C24.9265 85.3197 25.2804 85.6736 25.2804 86.1097C25.2804 86.5458 24.9265 86.8997 24.4904 86.8997ZM29.2304 72.6797C28.9507 72.6797 27.93 72.6797 27.6504 72.6797C27.2143 72.6797 26.8604 73.0336 26.8604 73.4697C26.8604 73.9058 27.2143 74.2597 27.6504 74.2597C27.93 74.2597 28.9507 74.2597 29.2304 74.2597C29.6664 74.2597 30.0204 73.9058 30.0204 73.4697C30.0204 73.0336 29.6664 72.6797 29.2304 72.6797ZM29.2304 75.8397C28.9507 75.8397 21.61 75.8397 21.3304 75.8397C20.8943 75.8397 20.5404 76.1936 20.5404 76.6297C20.5404 77.0658 20.8943 77.4197 21.3304 77.4197C21.61 77.4197 28.9507 77.4197 29.2304 77.4197C29.6664 77.4197 30.0204 77.0658 30.0204 76.6297C30.0204 76.1936 29.6664 75.8397 29.2304 75.8397ZM37.1304 78.9997C36.8507 78.9997 32.67 78.9997 32.3904 78.9997C31.9543 78.9997 31.6004 79.3536 31.6004 79.7897C31.6004 80.2258 31.9543 80.5797 32.3904 80.5797C32.67 80.5797 36.8507 80.5797 37.1304 80.5797C37.5664 80.5797 37.9204 80.2258 37.9204 79.7897C37.9204 79.3536 37.5664 78.9997 37.1304 78.9997ZM114.55 37.9197H98.7503C98.3142 37.9197 97.9603 37.5658 97.9603 37.1297C97.9603 36.6936 98.3142 36.3397 98.7503 36.3397H114.55C114.986 36.3397 115.34 36.6936 115.34 37.1297C115.34 37.5658 114.986 37.9197 114.55 37.9197ZM120.87 37.9197H117.71C117.274 37.9197 116.92 37.5658 116.92 37.1297C116.92 36.6936 117.274 36.3397 117.71 36.3397H120.87C121.306 36.3397 121.66 36.6936 121.66 37.1297C121.66 37.5658 121.306 37.9197 120.87 37.9197ZM128.77 41.0797H112.97C112.534 41.0797 112.18 40.7258 112.18 40.2897C112.18 39.8536 112.534 39.4997 112.97 39.4997H128.77C129.206 39.4997 129.56 39.8536 129.56 40.2897C129.56 40.7258 129.208 41.0797 128.77 41.0797ZM109.81 41.0797H108.23C107.794 41.0797 107.44 40.7258 107.44 40.2897C107.44 39.8536 107.794 39.4997 108.23 39.4997H109.81C110.246 39.4997 110.6 39.8536 110.6 40.2897C110.6 40.7258 110.246 41.0797 109.81 41.0797ZM105.023 41.0797H101.91C101.474 41.0797 101.12 40.7258 101.12 40.2897C101.12 39.8536 101.474 39.4997 101.91 39.4997H105.023C105.459 39.4997 105.813 39.8536 105.813 40.2897C105.813 40.7258 105.459 41.0797 105.023 41.0797ZM119.29 34.7597H111.39C110.954 34.7597 110.6 34.4058 110.6 33.9697C110.6 33.5336 110.954 33.1797 111.39 33.1797H119.29C119.726 33.1797 120.08 33.5336 120.08 33.9697C120.08 34.4058 119.728 34.7597 119.29 34.7597ZM114.55 44.2397H111.39C110.954 44.2397 110.6 43.8858 110.6 43.4497C110.6 43.0136 110.954 42.6597 111.39 42.6597H114.55C114.986 42.6597 115.34 43.0136 115.34 43.4497C115.34 43.8858 114.986 44.2397 114.55 44.2397Z"
      fill="#F0F0F0"
    />
    <path
      d="M81.038 38.4464L81.038 38.4464C94.3617 37.8185 105.36 48.4346 105.36 61.6201C105.36 63.962 103.462 65.8601 101.12 65.8601C98.778 65.8601 96.8799 63.962 96.8799 61.6201C96.8799 53.1661 89.7537 46.3768 81.1813 46.9312L81.1812 46.9312C73.3372 47.4395 67.44 54.2915 67.44 62.1068V73.7601H58.96V62.29C58.96 49.7766 68.5756 39.0334 81.038 38.4464Z"
      fill="#108D32"
      stroke="#00BD40"
    />
    <path
      d="M82.16 37.9199C81.7792 37.9199 81.3984 37.9294 81.0145 37.9468C68.267 38.5472 58.46 49.5282 58.46 62.2898V74.2599H67.94V62.1066C67.94 54.532 73.6548 47.9197 81.2135 47.4299C81.5311 47.4094 81.8471 47.3999 82.16 47.3999C90.0141 47.3999 96.3799 53.7657 96.3799 61.6199C96.3799 64.238 98.5019 66.3599 101.12 66.3599C103.738 66.3599 105.86 64.238 105.86 61.6199C105.86 48.5312 95.2487 37.9199 82.16 37.9199ZM101.12 64.1479C99.7264 64.1479 98.5919 63.0135 98.5919 61.6199C98.5919 52.5586 91.2212 45.1879 82.16 45.1879C81.7997 45.1879 81.4363 45.199 81.0698 45.2227C72.4667 45.7804 65.7264 53.1954 65.7264 62.1066V72.0479H60.6704V62.2898C60.6704 50.4193 69.6511 40.6976 81.1172 40.1572C81.4679 40.1398 81.8139 40.1319 82.16 40.1319C94.0084 40.1319 103.648 49.7715 103.648 61.6199C103.648 63.0135 102.514 64.1479 101.12 64.1479Z"
      fill="#202329"
    />
    <path
      d="M57.5116 72.3896H106.808C109.94 72.3896 112.47 74.8996 112.47 77.9837V99.3137C112.47 107.447 105.802 114.05 97.5646 114.05H66.7546C58.5172 114.05 51.8496 107.447 51.8496 99.3137V77.9837C51.8496 74.8996 54.3792 72.3896 57.5116 72.3896Z"
      fill="#108D32"
      stroke="#00BD40"
    />
    <path d="M52.1396 79H112.18V89.27H52.1396V79Z" fill="#FDFCEF" />
    <path
      d="M85.32 97.9598C85.32 96.2139 83.9059 94.7998 82.16 94.7998C80.4141 94.7998 79 96.2139 79 97.9598C79 98.9915 79.5024 99.8985 80.2656 100.475L79 107.44H85.32L84.0544 100.475C84.8176 99.8985 85.32 98.9915 85.32 97.9598Z"
      fill="#202329"
    />
    <path
      d="M107.44 71.0996H56.8796C53.3894 71.0996 50.5596 73.9294 50.5596 77.4196V99.5396C50.5596 108.266 57.6332 115.34 66.3596 115.34H97.9596C106.686 115.34 113.76 108.266 113.76 99.5396V77.4196C113.76 73.9294 110.93 71.0996 107.44 71.0996ZM111.548 99.5396C111.548 107.032 105.452 113.128 97.9596 113.128H66.3596C58.8672 113.128 52.7716 107.032 52.7716 99.5396V77.4196C52.7716 75.1539 54.6139 73.3116 56.8796 73.3116H107.44C109.705 73.3116 111.548 75.1539 111.548 77.4196V99.5396Z"
      fill="#202329"
    />
    <path
      d="M112.18 79H106.65C106.214 79 105.86 79.3539 105.86 79.79C105.86 80.2261 106.214 80.58 106.65 80.58H112.18C112.616 80.58 112.97 80.2261 112.97 79.79C112.97 79.3539 112.616 79 112.18 79ZM101.91 80.58H98.7496C98.3135 80.58 97.9596 80.2261 97.9596 79.79C97.9596 79.3539 98.3135 79 98.7496 79H101.91C102.346 79 102.7 79.3539 102.7 79.79C102.7 80.2261 102.346 80.58 101.91 80.58ZM94.0096 80.58H52.1396C51.7035 80.58 51.3496 80.2261 51.3496 79.79C51.3496 79.3539 51.7035 79 52.1396 79H94.0096C94.4457 79 94.7996 79.3539 94.7996 79.79C94.7996 80.2261 94.4457 80.58 94.0096 80.58ZM112.18 90.06H52.1396C51.7035 90.06 51.3496 89.7061 51.3496 89.27C51.3496 88.8339 51.7035 88.48 52.1396 88.48H112.18C112.616 88.48 112.97 88.8339 112.97 89.27C112.97 89.7061 112.616 90.06 112.18 90.06ZM82.1596 95.353C83.5974 95.353 84.7666 96.5222 84.7666 97.96C84.7666 98.7769 84.3858 99.5321 83.7206 100.035C83.5532 100.161 83.4726 100.37 83.5089 100.575L84.656 106.887H79.6616L80.8087 100.575C80.8466 100.37 80.7645 100.161 80.597 100.035C79.9334 99.5321 79.5526 98.7769 79.5526 97.96C79.5526 96.5222 80.7218 95.353 82.1596 95.353ZM82.1596 94.8C80.4137 94.8 78.9996 96.2141 78.9996 97.96C78.9996 98.9917 79.502 99.8987 80.2652 100.475L78.9996 107.44H85.3196L84.054 100.475C84.8172 99.8987 85.3196 98.9917 85.3196 97.96C85.3196 96.2141 83.9055 94.8 82.1596 94.8Z"
      fill="#202329"
    />
    <path
      d="M51.918 89.1094L58.5634 79.6243L59.0176 79.9425L52.3722 89.4276L51.918 89.1094Z"
      fill="#202329"
    />
    <path
      d="M57.9062 89.1094L64.5517 79.6243L65.0059 79.9425L58.3604 89.4276L57.9062 89.1094Z"
      fill="#472B29"
    />
    <path
      d="M63.7676 89.1104L70.4131 79.6253L70.8672 79.9435L64.2218 89.4286L63.7676 89.1104Z"
      fill="#472B29"
    />
    <path
      d="M69.7539 89.1084L76.3994 79.6233L76.8536 79.9415L70.2081 89.4266L69.7539 89.1084Z"
      fill="#472B29"
    />
    <path
      d="M75.6152 89.1084L82.2607 79.6233L82.7149 79.9415L76.0694 89.4266L75.6152 89.1084Z"
      fill="#472B29"
    />
    <path
      d="M81.6045 89.1074L88.25 79.6223L88.7042 79.9406L82.0587 89.4256L81.6045 89.1074Z"
      fill="#472B29"
    />
    <path
      d="M87.4668 89.1074L94.1123 79.6223L94.5665 79.9406L87.921 89.4256L87.4668 89.1074Z"
      fill="#472B29"
    />
    <path
      d="M93.4551 89.1074L100.101 79.6223L100.555 79.9406L93.9093 89.4256L93.4551 89.1074Z"
      fill="#472B29"
    />
    <path
      d="M99.3164 89.1074L105.962 79.6223L106.416 79.9406L99.7706 89.4256L99.3164 89.1074Z"
      fill="#472B29"
    />
    <path
      d="M105.305 89.1074L111.95 79.6224L112.404 79.9406L105.759 89.4256L105.305 89.1074Z"
      fill="#472B29"
    />
  </svg>
);
export const BchatPasswordPrompt = withTheme(BchatPasswordPromptInner);
