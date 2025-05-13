import React from 'react';
import classNames from 'classnames';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatToggle } from '../basic/BchatToggle';
import { BchatConfirmDialogProps } from '../dialog/BchatConfirm';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { BchatIcon, BchatIconType } from '../icon';
import { Flex } from '../basic/Flex';
import RemovePasswordIcon from '../icon/RemovePasswordIcon';

type ButtonSettingsProps = {
  title?: string;
  description?: string;
  buttonColor: BchatButtonColor;
  buttonText: string;
  dataTestId?: string;
  bchatId?: string;
  iconType?: BchatIconType;
  onClick: () => void;
};

const SettingsTitleAndDescription = (props: {
  title?: string;
  description?: string;
  bchatId?: string;
}) => {
  return (
    <div className="bchat-settings-item__info">
      {props.bchatId ? (
        <div className="bchat-settings-item__dFlex">
          <Avatar
            size={AvatarSize.M}
            // onAvatarClick={()=>dispatch(editProfileModal({}))}
            pubkey={props.bchatId}
            dataTestId="leftpane-primary-avatar"
          />
          <div className="bchat-settings-item__title" style={{ marginLeft: '10px' }}>
            {props.title}
          </div>
        </div>
      ) : (
        <div className="bchat-settings-item__title"> {props.title}</div>
      )}
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
  iconType?: BchatIconType;
  children: React.ReactNode;
}) => {
  return (
    <div className={classNames('bchat-settings-item', props.inline && 'inline')}>
      <Flex container={true} justifyContent="center" alignItems="center" flexDirection="row">
        <span style={{ marginRight: '15px' }}>
          {props.title === window.i18n('removeAccountPasswordTitle') ? (
            <RemovePasswordIcon />
          ) : (
            <BchatIcon
              iconType={props.iconType || 'beldexCoinLogo'}
              iconSize={24}
              fillRule="evenodd"
              clipRule="evenodd"
            />
          )}
        </span>
        <SettingsTitleAndDescription
          title={props.title}
          description={props.description}
          bchatId={props.bchatId}
        />
      </Flex>
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
  iconType?: BchatIconType;
}) => {
  const { title, description, active, onClickToggle, confirmationDialogParams, iconType } = props;

  return (
    <BchatSettingsItemWrapper
      title={title}
      description={description}
      inline={true}
      iconType={iconType}
    >
      <BchatToggle
        active={active}
        onClick={onClickToggle}
        confirmationDialogParams={confirmationDialogParams}
      />
    </BchatSettingsItemWrapper>
  );
};

export const BchatSettingButtonItem = (props: ButtonSettingsProps) => {
  const {
    title,
    description,
    buttonColor,
    buttonText,
    dataTestId,
    bchatId,
    iconType,
    onClick,
  } = props;

  return (
    <BchatSettingsItemWrapper
      title={title}
      description={description}
      inline={true}
      bchatId={bchatId}
      iconType={iconType}
    >
      <BchatButton
        dataTestId={dataTestId}
        text={buttonText}
        buttonColor={buttonColor}
        onClick={onClick}
        buttonType={BchatButtonType.Brand}
      />
    </BchatSettingsItemWrapper>
  );
};
