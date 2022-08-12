import React, { ChangeEvent } from 'react';
// import classNames from 'classnames';
import { QRCode } from 'react-qr-svg';

import { Avatar, AvatarSize } from '../avatar/Avatar';

import { PillDivider } from '../basic/PillDivider';
import { SyncUtils, ToastUtils, UserUtils } from '../../bchat/utils';

import { ConversationModel, ConversationTypeEnum } from '../../models/conversation';

import { getConversationController } from '../../bchat/conversations';
import { SpacerLG } from '../basic/Text';
import autoBind from 'auto-bind';
import { editProfileModal } from '../../state/ducks/modalDialog';
import { uploadOurAvatar } from '../../interactions/conversationInteractions';
// import { BchatButton
//   , BchatButtonColor, 
//   BchatButtonType 
// } from '../basic/BchatButton';
// import { BchatSpinner } from '../basic/BchatSpinner';
import { BchatIconButton } from '../icon';
import { MAX_USERNAME_LENGTH } from '../registration/RegistrationStages';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { pickFileForAvatar } from '../../types/attachments/VisualAttachment';
import { sanitizeBchatUsername } from '../../bchat/utils/String';
import { setLastProfileUpdateTimestamp } from '../../util/storage';
// import { Icons } from '../registration/DisplaySeed';

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
    console.log("viewDefault:",viewDefault,viewEdit,viewQR)
    const bchatID = UserUtils.getOurPubKeyStrFromCache();
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
      <div className="edit-profile-dialog" data-testid="edit-profile-dialog">
        <BchatWrapperModal
          title={i18n('editProfileModalTitle')}
          onClose={this.closeDialog}
          showHeader={false}
          headerIconButtons={backButton}
          showExitIcon={true}
        >
        <div style={{position: 'relative',marginLeft: '350px',marginTop:'12px'}}>
        <BchatIconButton 
          iconType="exit"
          iconSize="tiny"
          onClick={this.closeDialog}
          dataTestId="modal-close-button"
        />
        </div>

          {/* <SpacerMD /> */}

          {/* {viewQR && <QRView bchatID={bchatID} />} */}
          {( viewDefault || viewQR ) && this.renderDefaultView()}
          {viewEdit && this.renderEditView()}
          {/* { this.renderAddressView({bchatID})} */}

           <div className="bchat-id-section">
            <PillDivider />
              { !viewQR ? (this.renderAddressView({bchatID})) : (this.renderQrView({bchatID})) }

            <SpacerLG />
            {/* <BchatSpinner loading={this.state.loading} /> */}

            {/* {viewDefault || viewQR ? (
              <BchatButton
                text={window.i18n('editMenuCopy')}
                buttonType={BchatButtonType.BrandOutline}
                buttonColor={BchatButtonColor.Green}
                onClick={() => {
                  copyBchatID(bchatID);
                }}
                dataTestId="copy-button-profile-update"
              />
            ) : (
              !this.state.loading && (
                <BchatButton
                  text={window.i18n('save')}
                  buttonType={BchatButtonType.BrandOutline}
                  buttonColor={BchatButtonColor.Green}
                  onClick={this.onClickOK}
                  disabled={this.state.loading}
                  dataTestId="save-button-profile-update"
                />
              )
            )} */}
            {/* {viewEdit && (
              !this.state.loading && (
                <BchatButton
                  text={window.i18n('save')}
                  buttonType={BchatButtonType.BrandOutline}
                  buttonColor={BchatButtonColor.Green}
                  onClick={this.onClickOK}
                  disabled={this.state.loading}
                  dataTestId="save-button-profile-update"
                />
              ))} */}

             <SpacerLG />
            </div>
          
        </BchatWrapperModal>
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
              // onClick={this.fireInputEvent}
              data-testid="image-upload-section"
            />
            <div style={{
              background:`url(images/bchat/camera.svg) no-repeat`,
               width: "30px",
               height: "30px",
              //  left:'103px',
               position:'relative',
               justifyContent:'center',
               backgroundSize:'32px',
               top:'56px',
               right:'34px',
               alignItems:'center',
              //  backgroundColor:"#353543",
              //  borderRadius:"30px",
              //  backgroundPosition:"center",
               cursor:'pointer'}}
              // className="qr-view-button"
              // onClick={() => {
                // this.setState(state => ({ ...state, mode: 'qr' }));
                // this.fireInputEvent
              // }}
              onClick={this.fireInputEvent}
              role="button"
              data-testid="image-upload-section"
            >
              {/* <BchatIconButton iconType="profileCamera" iconSize="medium" */}
              {/* //  iconColor={'black'}  */}
               {/* /> */}
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
      });
    }
  }

  private renderDefaultView() {
    const name = this.state.setProfileName || this.state.profileName;
    const mode = this.state.mode == 'qr' ? 'default' : 'qr';
    const SwicthContact = mode=='qr'?'qr_code':'profile_share';
    return (
      <>
        {this.renderProfileHeader()}
        <div className="profile-name-uneditable">
          <p data-testid="your-profile-name">{name}</p>
          <BchatIconButton
            iconType="pencil"
            iconSize="medium"
            iconColor='#128b17'
            onClick={() => {
              this.setState({ mode: 'edit' });
            }}
            dataTestId="edit-profile-icon"
          />
          <div
              // className="qr-view-button"
              style={{
               background:`url(images/bchat/${SwicthContact}.svg) no-repeat`,
               width: "30px",
               height: "30px",
               left:'103px',
               position:'relative',
              //  backgroundColor:"#353543",
              //  borderRadius:"30px",
              //  backgroundPosition:"center",
               cursor:'pointer'
               }}
              onClick={() => {
                console.log('mode:',this.state.mode)
                console.log("modem:",mode)
                this.setState(state => ({ ...state, mode: mode }));
              }}
              role="button"
            >
              {/* <BchatIconButton iconType="qr" iconSize="small" iconColor={'white'} /> */}
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
          <input
            type="text"
            className="profile-name-input"
            value={this.state.profileName}
            placeholder={placeholderText}
            onChange={this.onNameEdited}
            maxLength={MAX_USERNAME_LENGTH}
            tabIndex={0}
            required={true}
            aria-required={true}
            data-testid="profile-name-input"
          />
        </div>
      </>
    );
  }

  private renderAddressView (props:any) {

    return(
      <div>
        <p style={{fontFamily:'poppin-semibold',fontSize:'12px'}}>BChat ID</p>
            <div className='bchat-id-section-display'>
              <div style={{width:'80%',fontFamily:'poppin-medium',fontSize:'12px'}}>{props.bchatID}</div>
              <div  onClick={()=>copyBchatID(props.bchatID)} 
              style={{
               background:`url(images/bchat/copy_icon.svg) no-repeat`,
               width: "40px",
               height: "40px",
               position: 'relative',
               backgroundColor:"#353543",
               borderRadius:"30px",
               backgroundSize:'13px',
               backgroundPosition:"center",
               cursor:'pointer'
               }}
               ></div>
            </div>

            <p style={{fontFamily:'poppin-semibold',fontSize:'12px'}}>Beldex Address</p>
            <div className='bchat-id-section-display'>
              <div style={{width:'80%',fontFamily:'poppin-medium',fontSize:'12px'}}>{'bxdis3VF318i2QDjvqwoG9GyfP4sVjTvwZyf1JGLNFyTJ8fbtBgzW6ieyKnpbMw5bU9dggbAiznaPGay96WAmx1Z2B32B86PE'}</div>
              <div  onClick={()=>copyBchatID('bxdis3VF318i2QDjvqwoG9GyfP4sVjTvwZyf1JGLNFyTJ8fbtBgzW6ieyKnpbMw5bU9dggbAiznaPGay96WAmx1Z2B32B86PE')} 
              style={{
               background:`url(images/bchat/copy_icon.svg) no-repeat`,
               width: "40px",
               height: "40px",
               backgroundColor:"#353543",
               backgroundSize:'13px',
               borderRadius:"30px",
               backgroundPosition:"center",
               cursor:'pointer'
               }}
               ></div>
            </div>
      </div>
    )
  }
 
  private renderQrView(props:any){
    return(
      <div style={{width:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      <QRView bchatID={props.bchatID} />
      <p>Scan QR Code</p>
    </div>
    )
    
  }

  private renderAvatar() {
    const { oldAvatarPath, newAvatarObjectUrl, profileName } = this.state;
    const userName = profileName || this.convo.id;

    return (
      <Avatar
        forcedAvatarPath={newAvatarObjectUrl || oldAvatarPath}
        forcedName={userName}
        size={AvatarSize.XL}
        pubkey={this.convo.id}
      />
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
    const { newAvatarObjectUrl, profileName } = this.state;
    const newName = profileName ? profileName.trim() : '';

    if (newName.length === 0 || newName.length > MAX_USERNAME_LENGTH) {
      return;
    }

    this.setState(
      {
        loading: true,
      },
      async () => {
        await commitProfileEdits(newName, newAvatarObjectUrl);
        this.setState({
          loading: false,

          mode: 'default',
          setProfileName: this.state.profileName,
        });
      }
    );
  }

  private closeDialog() {
    window.removeEventListener('keyup', this.onKeyUp);
    window.inboxStore?.dispatch(editProfileModal(null));
  }
}

async function commitProfileEdits(newName: string, scaledAvatarUrl: string | null) {
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
    return;
  }
  // do not update the avatar if it did not change
  await conversation.setLokiProfile({
    displayName: newName,
  });
  // might be good to not trigger a sync if the name did not change
  await conversation.commit();
  await setLastProfileUpdateTimestamp(Date.now());
  await SyncUtils.forceSyncConfigurationNowIfNeeded(true);
}



function copyBchatID(bchatID: string) {
  window.clipboard.writeText(bchatID);
  ToastUtils.pushCopiedToClipBoard();
}
