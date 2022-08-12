import React from 'react';
import classNames from 'classnames';
import { BchatIcon, BchatIconType } from '../icon';

export enum BchatDropDownItemType {
  Default = 'default',
  Danger = 'danger',
}

type Props = {
  content: string;
  type: BchatDropDownItemType;
  icon: BchatIconType | null;
  active: boolean;
  onClick: any;
};

export const BchatDropdownItem = (props: Props) => {
  const clickHandler = (e: any) => {
    if (props.onClick) {
      e.stopPropagation();
      props.onClick();
    }
  };

  const { content, type, icon, active } = props;

  return (
    <div
      className={classNames(
        'bchat-dropdown__item',
        active ? 'active' : '',
        type || BchatDropDownItemType.Default
      )}
      role="button"
      onClick={clickHandler}
    >
      {icon ? <BchatIcon iconType={icon} iconSize="small" /> : ''}
      <div className="item-content">{content}</div>
    </div>
  );
};
