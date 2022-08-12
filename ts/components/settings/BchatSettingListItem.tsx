import React from 'react';
import classNames from 'classnames';
import { BchatButton, BchatButtonColor } from '../basic/BchatButton';
import { BchatToggle } from '../basic/BchatToggle';
import { BchatConfirmDialogProps } from '../dialog/BchatConfirm';
import { Avatar, AvatarSize } from '../avatar/Avatar';


type ButtonSettingsProps = {
  title?: string;
  description?: string;
  buttonColor: BchatButtonColor;
  buttonText: string;
  dataTestId?: string;
  bchatId?: string;
  onClick: () => void;
};

const SettingsTitleAndDescription = (props: { title?: string; description?: string,bchatId?: string}) => {
  return (
    <div className="bchat-settings-item__info">
       { props.bchatId ?
       <div className='bchat-settings-item__dFlex'>
       <Avatar 
        size={AvatarSize.M}
        // onAvatarClick={()=>dispatch(editProfileModal({}))}
        pubkey={props.bchatId}
        dataTestId="leftpane-primary-avatar"
      />
      <div className="bchat-settings-item__title" style={{marginLeft:"10px"}}>{props.title}</div>

      </div>:<div className="bchat-settings-item__title" >{props.title}</div>
      }
      {/* <div className="bchat-settings-item__title">{props.title}</div> */}
      {props.description && (
        <div className="bchat-settings-item__description">{props.description}</div>
      )}
    </div>
  );
};

const BchatSettingsContent = (props: { children: React.ReactNode }) => {
  return <div className="bchat-settings-item__content">{props.children}</div>;
};

export const BchatSettingsItemWrapper = (props: {
  inline: boolean;
  title?: string;
  description?: string;
  bchatId?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={classNames('bchat-settings-item', props.inline && 'inline')}>
      
      <SettingsTitleAndDescription title={props.title} description={props.description}  bchatId={props.bchatId}/>
      <BchatSettingsContent>{props.children}</BchatSettingsContent>
    </div>
  );
};

export const BchatToggleWithDescription = (props: {
  title?: string;
  description?: string;
  active: boolean;
  onClickToggle: () => void;
  confirmationDialogParams?: BchatConfirmDialogProps;
}) => {
  const { title, description, active, onClickToggle, confirmationDialogParams } = props;

  return (
    <BchatSettingsItemWrapper title={title} description={description} inline={true}>
      <BchatToggle
        active={active}
        onClick={onClickToggle}
        confirmationDialogParams={confirmationDialogParams}
      />
    </BchatSettingsItemWrapper>
  );
};

export const BchatSettingButtonItem = (props: ButtonSettingsProps) => {
  const { title, description, buttonColor, buttonText, dataTestId,bchatId, onClick } = props;

  return (
    <BchatSettingsItemWrapper title={title} description={description} inline={true} bchatId={bchatId}>
      <BchatButton
        dataTestId={dataTestId}
        text={buttonText}
        buttonColor={buttonColor}
        onClick={onClick}
      />
    </BchatSettingsItemWrapper>
  );
};
