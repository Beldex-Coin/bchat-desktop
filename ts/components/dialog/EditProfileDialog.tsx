import React, { ChangeEvent } from 'react';
import { QRCode } from 'react-qr-svg';

import { Avatar, AvatarSize, BNSWrapper } from '../avatar/Avatar';

import { PillDivider } from '../basic/PillDivider';
import { SyncUtils, ToastUtils, UserUtils } from '../../bchat/utils';

import { ConversationModel, ConversationTypeEnum } from '../../models/conversation';

import { getConversationController } from '../../bchat/conversations';
import autoBind from 'auto-bind';
import { bnsLinkModal, editProfileModal } from '../../state/ducks/modalDialog';
import { uploadOurAvatar } from '../../interactions/conversationInteractions';
import { BchatIcon, BchatIconButton } from '../icon';
import { MAX_USERNAME_LENGTH } from '../registration/RegistrationStages';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { pickFileForAvatar } from '../../types/attachments/VisualAttachment';
import { sanitizeBchatUsername } from '../../bchat/utils/String';
import { setLastProfileUpdateTimestamp } from '../../util/storage';
import { BchatToolTip } from '../leftpane/ActionsPanel';

interface State {
  profileName: string;
  setProfileName: string;
  oldAvatarPath: string;
  newAvatarObjectUrl: string | null;
  mode: 'default' | 'edit' | 'qr';
  loading: boolean;
}

const QRView = ({ bchatID }: { bchatID: string }) => {
  return (
    <div className="qr-image">
      <QRCode value={bchatID} bgColor="#FFFFFF" fgColor="#1B1B1B" level="L" />
    </div>
  );
};

export class EditProfileDialog extends React.Component<{}, State> {
  private readonly convo: ConversationModel;

  constructor(props: any) {
    super(props);

    autoBind(this);

    this.convo = getConversationController().get(UserUtils.getOurPubKeyStrFromCache());

    this.state = {
      profileName: this.convo.getProfileName() || '',
      setProfileName: this.convo.getProfileName() || '',
      oldAvatarPath: this.convo.getAvatarPath() || '',
      newAvatarObjectUrl: null,
      mode: 'default',
      loading: false,
    };
  }

  public componentDidMount() {
    window.addEventListener('keyup', this.onKeyUp);
  }

  public componentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyUp);
  }

  public render() {
    const i18n = window.i18n;

    const viewDefault = this.state.mode === 'default';
    const viewEdit = this.state.mode === 'edit';
    const viewQR = this.state.mode === 'qr';
    const bchatID = UserUtils.getOurPubKeyStrFromCache();
    const isBnsHolder = this.convo?.attributes?.isBnsHolder;
    const backButton =
      viewEdit || viewQR
        ? [
            {
              iconType: 'chevron',
              iconRotation: 90,
              onClick: () => {
                this.setState({ mode: 'default' });
              },
            },
          ]
        : undefined;

    return (
      <div>
        <div
          className={isBnsHolder ? 'edit-profile-dialog bns_enable_modal ' : 'edit-profile-dialog'}
          data-testid="edit-profile-dialog"
        >
          <BchatWrapperModal
            title={i18n('editProfileModalTitle')}
            onClose={this.closeDialog}
            showHeader={false}
            headerIconButtons={backButton}
            showExitIcon={true}
            isloading={this.state.loading}
          >
            <div className="profileClose">
              <BchatIconButton
                iconType="exit"
                iconSize="tiny"
                onClick={this.closeDialog}
                dataTestId="modal-close-button"
              />
            </div>

            {(viewDefault || viewQR) && this.renderDefaultView()}
            {viewEdit && this.renderEditView()}
            {this.renderBnsVerified(isBnsHolder)}
            <div className="bchat-id-section">
              <PillDivider />
              {!viewQR ? this.renderAddressView({ bchatID }) : this.renderQrView({ bchatID })}
            </div>
          </BchatWrapperModal>
        </div>
      </div>
    );
  }

  private renderProfileHeader() {
    return (
      <>
        <div className="avatar-center">
          <div className="avatar-center-inner">
            {this.renderAvatar()}
            <div
              className="image-upload-section"
              role="button"
              data-testid="image-upload-section"
            />
            <div
              data-tip="Edit"
              data-place="right"
              data-offset="{'top':15,'left':10}"
              style={{
                // background: `url(images/bchat/camera.svg) no-repeat`,
                width: '30px',
                height: '30px',
                position: 'relative',
                justifyContent: 'center',
                backgroundSize: '32px',
                top: '29px',
                left: '10px',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={this.fireInputEvent}
              role="button"
              data-testid="image-upload-section"
            >
              <BchatIcon
                iconType="camera"
                backgroundColor="var(--color-BnsCameraIconBg)"
                borderRadius="20px"
                iconSize={30}
                iconPadding="7px"
              />
              <BchatToolTip place="top" effect="solid" />
            </div>
          </div>
        </div>
      </>
    );
  }

  private async fireInputEvent() {
    const scaledAvatarUrl = await pickFileForAvatar();

    if (scaledAvatarUrl) {
      this.setState({
        newAvatarObjectUrl: scaledAvatarUrl,
        mode: 'edit',
        loading: false,
      });
      this.onClickOK();
    }
  }

  private renderDefaultView() {
    const name = this.state.setProfileName || this.state.profileName;
    const mode = this.state.mode == 'qr' ? 'default' : 'qr';
    const SwicthContact = mode == 'qr' ? 'qr_code' : 'profile_share';
    return (
      <>
        {this.renderProfileHeader()}
        <div className="profile-name-uneditable">
          <div
            style={{
              display: 'flex',
              width: '86%',
              justifyContent: 'center',
            }}
          >
            <p data-testid="your-profile-name">{name}</p>
            <BchatIconButton
              iconType="pencil"
              iconSize="medium"
              iconColor="#128b17"
              onClick={() => {
                this.setState({ mode: 'edit' });
              }}
              dataTestId="edit-profile-icon"
            />
          </div>

          <div
            className="qr-icon-btn"
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              this.setState(state => ({ ...state, mode: mode }));
            }}
            role="button"
          >
            {SwicthContact === 'qr_code' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="29.313"
                height="29.313"
                viewBox="0 0 29.313 29.313"
              >
                <path
                  id="icons8-qr_code"
                  d="M4.141,1A3.152,3.152,0,0,0,1,4.141V8.328a3.152,3.152,0,0,0,3.141,3.141H5.187v2.094H7.281V11.469H8.328a3.152,3.152,0,0,0,3.141-3.141V4.141A3.152,3.152,0,0,0,8.328,1ZM7.281,13.563v2.094H9.375V13.563Zm0,2.094H5.187V17.75H7.281Zm-2.094,0V13.563H3.094v2.094ZM22.984,1a3.152,3.152,0,0,0-3.141,3.141V8.328a3.152,3.152,0,0,0,3.141,3.141h1.047v2.094h2.094V11.469h1.047a3.152,3.152,0,0,0,3.141-3.141V4.141A3.152,3.152,0,0,0,27.172,1Zm3.141,12.563v2.094h2.094V13.563Zm0,2.094H24.031V17.75h2.094Zm0,2.094v2.094h2.094V17.75Zm0,2.094H24.031v2.094h2.094Zm-2.094,0V17.75H21.938v2.094ZM4.141,3.094H8.328A1.033,1.033,0,0,1,9.375,4.141V8.328A1.033,1.033,0,0,1,8.328,9.375H4.141A1.033,1.033,0,0,1,3.094,8.328V4.141A1.033,1.033,0,0,1,4.141,3.094Zm11.516,0V5.187H13.563V7.281h2.094V9.375H17.75V3.094Zm7.328,0h4.188a1.033,1.033,0,0,1,1.047,1.047V8.328a1.033,1.033,0,0,1-1.047,1.047H22.984a1.033,1.033,0,0,1-1.047-1.047V4.141A1.033,1.033,0,0,1,22.984,3.094ZM5.187,5.187V7.281H7.281V5.187Zm18.844,0V7.281h2.094V5.187ZM11.469,11.469v2.094H17.75v2.094h2.094V11.469Zm2.094,4.187V17.75H11.469v2.094h8.375V17.75H15.656V15.656ZM4.141,19.844A3.152,3.152,0,0,0,1,22.984v4.188a3.152,3.152,0,0,0,3.141,3.141H8.328a3.152,3.152,0,0,0,3.141-3.141V22.984a3.152,3.152,0,0,0-3.141-3.141Zm0,2.094H8.328a1.033,1.033,0,0,1,1.047,1.047v4.188a1.033,1.033,0,0,1-1.047,1.047H4.141a1.033,1.033,0,0,1-1.047-1.047V22.984A1.033,1.033,0,0,1,4.141,21.938Zm9.422,0v6.281h2.094V21.938ZM5.187,24.031v2.094H7.281V24.031Zm14.656,0v2.094h2.094V24.031Zm2.094,2.094v2.094h2.094V26.125Zm2.094,0h2.094V24.031H24.031Zm2.094,0v2.094h2.094V26.125Z"
                  transform="translate(-1 -1)"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="29"
                height="30"
                viewBox="0 0 22.646 22.646"
              >
                <path
                  id="icons8-copybook"
                  d="M10.065,5A3.291,3.291,0,0,0,6.788,8.278v.894H5.894a.894.894,0,1,0,0,1.788H9.469a.894.894,0,1,0,0-1.788H8.576V8.278a1.477,1.477,0,0,1,1.49-1.49H23.176a1.477,1.477,0,0,1,1.49,1.49v.449a.894.894,0,0,0,0,.29V12.3a.894.894,0,0,0,0,.29v2.094a.894.894,0,0,0,0,.29v3.286a.894.894,0,0,0,0,.29v2.094a.894.894,0,0,0,0,.29v3.286a.894.894,0,0,0-.008.229,1.472,1.472,0,0,1-1.482,1.407H10.065a1.477,1.477,0,0,1-1.49-1.49v-.894h.894a.894.894,0,1,0,0-1.788H8.576V20.494H6.788v1.192H5.894a.894.894,0,1,0,0,1.788h.894v.894a3.291,3.291,0,0,0,3.278,3.278H23.176a3.293,3.293,0,0,0,3.154-2.4,1.5,1.5,0,0,0,1.315-1.472V21.388a1.508,1.508,0,0,0-1.192-1.46v-.656a1.508,1.508,0,0,0,1.192-1.46V15.429a1.508,1.508,0,0,0-1.192-1.46v-.656a1.508,1.508,0,0,0,1.192-1.46V9.47A1.506,1.506,0,0,0,26.44,8.009,3.291,3.291,0,0,0,23.176,5Zm2.98,4.172a.894.894,0,0,0-.894.894v4.172a.894.894,0,0,0,.894.894h7.747a.894.894,0,0,0,.894-.894V10.065a.894.894,0,0,0-.894-.894Zm.894,1.788H19.9v2.384H13.939ZM6.788,12.151v1.192H5.894a.894.894,0,1,0,0,1.788H9.469a.894.894,0,1,0,0-1.788H8.576V12.151Zm0,4.172v1.192H5.894a.894.894,0,1,0,0,1.788H9.469a.894.894,0,1,0,0-1.788H8.576V16.323Z"
                  transform="translate(-5 -5)"
                />
              </svg>
            )}
          </div>
        </div>
      </>
    );
  }

  private renderEditView() {
    const placeholderText = window.i18n('displayName');

    return (
      <>
        {this.renderProfileHeader()}
        <div className="profile-name">
          <div className="inputBox">
            <input
              type="text"
              className="profile-name-input"
              value={this.state.profileName}
              placeholder={placeholderText}
              onChange={this.onNameEdited}
              maxLength={MAX_USERNAME_LENGTH - 1}
              tabIndex={0}
              required={true}
              aria-required={true}
              data-testid="profile-name-input"
            />
          </div>

          <div className="saveIcon" onClick={() => this.onClickOK()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M17.707,9.707l-7,7 C10.512,16.902,10.256,17,10,17s-0.512-0.098-0.707-0.293l-3-3c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0L10,14.586 l6.293-6.293c0.391-0.391,1.023-0.391,1.414,0S18.098,9.316,17.707,9.707z" />
            </svg>
          </div>
        </div>
      </>
    );
  }
  private renderBnsVerified(isBnsHolder: any) {
    const i18n = window.i18n;
    return (
      <div className="link_bns_wrapper">
        {!isBnsHolder ? (
          <>
            <button
              className="link_bns_Btn"
              onClick={() => {
                window.inboxStore?.dispatch(editProfileModal(null));
                window.inboxStore?.dispatch(bnsLinkModal({}));
              }}
            >
              <span>
                <BchatIcon iconType={'bnslogo'} iconSize={26} />
              </span>
              {i18n('linkYourBns')}
            </button>
            <div className="hintTxt">
              <span> {i18n('readMoreAboutBNS')} </span>
              <BchatIcon iconType="infoCircle" iconSize={12} iconColor="#A7A7BA" />
            </div>
          </>
        ) : (
          <div className="bnsVerfiedTxt">
            <span> {i18n('bnsVerified')}</span>
            <BchatIcon iconType="circleWithTick" iconSize={14} iconColor="#0BB70F" />
          </div>
        )}
      </div>
    );
  }
  private renderAddressView(props: any) {
    let walletAddress = localStorage.getItem('userAddress');
    return (
      <div>
        <p className="profile-header">{window.i18n('BchatID')}</p>
        <div className="bchat-id-section-display">
          <div className="profile-value">{props.bchatID}</div>
          <div
            onClick={() => copyBchatID(props.bchatID)}
            className="bchat-id-section-display-icon"
            data-tip="Copy"
            data-place="right"
            data-offset="{'top':17}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 18.151 18.151"
            >
              <path
                id="copy_icon"
                d="M3.815,2A1.815,1.815,0,0,0,2,3.815V16.521H3.815V3.815H16.521V2Zm3.63,3.63A1.815,1.815,0,0,0,5.63,7.445V18.336a1.815,1.815,0,0,0,1.815,1.815H18.336a1.815,1.815,0,0,0,1.815-1.815V7.445A1.815,1.815,0,0,0,18.336,5.63Zm0,1.815H18.336V18.336H7.445Z"
                transform="translate(-2 -2)"
              />
            </svg>
          </div>
        </div>

        <p className="profile-header">{window.i18n('profileBeldexAddres')}</p>
        <div className="bchat-id-section-display" style={{ marginBottom: '37px' }}>
          <div className="profile-value" style={{ color: '#1782FF' }}>
            {walletAddress}
          </div>
          <div
            onClick={() => copyBchatID(walletAddress)}
            data-tip="Copy"
            data-place="right"
            data-offset="{'top':17}"
            className="bchat-id-section-display-icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 18.151 18.151"
            >
              <path
                id="copy_icon"
                d="M3.815,2A1.815,1.815,0,0,0,2,3.815V16.521H3.815V3.815H16.521V2Zm3.63,3.63A1.815,1.815,0,0,0,5.63,7.445V18.336a1.815,1.815,0,0,0,1.815,1.815H18.336a1.815,1.815,0,0,0,1.815-1.815V7.445A1.815,1.815,0,0,0,18.336,5.63Zm0,1.815H18.336V18.336H7.445Z"
                transform="translate(-2 -2)"
              />
            </svg>
          </div>
        </div>
        <BchatToolTip effect="solid" />
      </div>
    );
  }

  private renderQrView(props: any) {
    return (
      <div className="qr-box-view">
        <img src="images/bchat/Bchat_logo_QR.svg" className="qr-center-icon"></img>
        <QRView bchatID={props.bchatID} />
        <p>{window.i18n('scanQr')}</p>
      </div>
    );
  }

  private renderAvatar() {
    const { oldAvatarPath, newAvatarObjectUrl, profileName } = this.state;
    // const userName = profileName || this.convo.id;

    return (
      <BNSWrapper
        // size={89}
        position={{ left: '72px', top: '72px' }}
        isBnsHolder={this.convo?.attributes?.isBnsHolder}
      >
        <Avatar
          forcedAvatarPath={newAvatarObjectUrl || oldAvatarPath}
          forcedName={profileName}
          size={AvatarSize.XL}
          pubkey={this.convo.id}
        />
      </BNSWrapper>
    );
  }

  private onNameEdited(event: ChangeEvent<HTMLInputElement>) {
    const newName = sanitizeBchatUsername(event.target.value);
    this.setState({
      profileName: newName,
    });
  }

  private onKeyUp(event: any) {
    switch (event.key) {
      case 'Enter':
        if (this.state.mode === 'edit') {
          this.onClickOK();
        }
        break;
      case 'Esc':
      case 'Escape':
        this.closeDialog();
        break;
      default:
    }
  }

  /**
   * Tidy the profile name input text and save the new profile name and avatar
   */
  private onClickOK() {
    const { newAvatarObjectUrl, profileName, setProfileName } = this.state;
    const newName = profileName ? profileName.trim() : setProfileName;
    // if (newName.length === 0 || newName.length > MAX_USERNAME_LENGTH) {
    //   ToastUtils.pushToastError('invalid name', 'invalid name');
    //   return;
    // }
    this.setState(
      {
        loading: true,
      },
      async () => {
        await commitProfileEdits(setProfileName, newName, newAvatarObjectUrl);
        this.setState({
          loading: false,
          mode: 'default',
          setProfileName: newName,
          profileName: newName,
        });
      }
    );
  }

  private closeDialog() {
    window.removeEventListener('keyup', this.onKeyUp);
    window.inboxStore?.dispatch(editProfileModal(null));
  }
}

async function commitProfileEdits(
  oldName: string,
  newName: string,
  scaledAvatarUrl: string | null
) {
  const ourNumber = UserUtils.getOurPubKeyStrFromCache();
  const conversation = await getConversationController().getOrCreateAndWait(
    ourNumber,
    ConversationTypeEnum.PRIVATE
  );

  if (scaledAvatarUrl?.length) {
    try {
      const blobContent = await (await fetch(scaledAvatarUrl)).blob();
      if (!blobContent || !blobContent.size) {
        throw new Error('Failed to fetch blob content from scaled avatar');
      }
      await uploadOurAvatar(await blobContent.arrayBuffer());
    } catch (error) {
      if (error.message && error.message.length) {
        ToastUtils.pushToastError('edit-profile', error.message);
      }
      window.log.error(
        'showEditProfileDialog Error ensuring that image is properly sized:',
        error && error.stack ? error.stack : error
      );
    }
    // return;
  }
  if (oldName === newName) {
    console.log('same profile name');
    return;
  }
  // do not update the avatar if it did not change
  await conversation.setBchatProfile({
    displayName: newName,
  });
  // might be good to not trigger a sync if the name did not change
  await conversation.commit();
  await setLastProfileUpdateTimestamp(Date.now());
  await SyncUtils.forceSyncConfigurationNowIfNeeded(true);
}

export function copyBchatID(bchatID: any) {
  window.clipboard.writeText(bchatID);
  ToastUtils.pushCopiedToClipBoard();
}
