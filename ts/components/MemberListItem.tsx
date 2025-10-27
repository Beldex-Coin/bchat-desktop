import React from 'react';
import classNames from 'classnames';
import { Avatar, AvatarSize } from './avatar/Avatar';
// import { Constants } from '../bchat';
import {
  useConversationBnsHolder,
  useConversationUsernameOrShorten,
} from '../hooks/useParamSelector';
import CheckBoxTickIcon from './icon/CheckBoxTickIcon';
import { BchatIcon } from './icon';


export const MemberListItem = (props: {
  pubkey: string;
  isSelected: boolean;
  removeMem?:boolean;
  onlyList?: boolean;
  // this bool is used to make a zombie appear with less opacity than a normal member
  isZombie?: boolean;
  disableBg?: boolean;
  isAdmin?: boolean; // if true,  we add a small crown on top of their avatar
  onSelect?: (pubkey: string) => void;
  onUnselect?: (pubkey: string) => void;
  dataTestId?: string;
}) => {
  const {
    isSelected,
    pubkey,
    isZombie,
    isAdmin,
    onSelect,
    onUnselect,
    disableBg,
    dataTestId,
    onlyList,
    removeMem
  } = props;

  const memberName:any = useConversationUsernameOrShorten(pubkey);
  const isBnsHolder = useConversationBnsHolder(pubkey);

  const validateMemberName = (memberName: string) => {
    if (memberName?.length == 66) {
      let staringTwoString = memberName.substring(0, 2);
      let lastString = memberName.substring(58, 66)
      return `(${staringTwoString}...${lastString})`;
    }
    return memberName;
  }

  const selectionValidation=removeMem? !onlyList && !isSelected :!onlyList  &&isSelected
  return (
    // tslint:disable-next-line: use-simple-attributes
    <div
      className={classNames(
        'bchat-member-item',
        selectionValidation && 'selected',
        isZombie && 'zombie',
        disableBg && 'compact'
      )}
      onClick={() => {
        !onlyList && (isSelected ? onUnselect?.(pubkey) : onSelect?.(pubkey));
      }}
      style={!disableBg ? {} : {}}
      role="button"
      data-testid={dataTestId}
    >
      <div className="bchat-member-item__info" style={{ width: '100%' }}>
        <span className="bchat-member-item__avatar">
        <Avatar size={AvatarSize.M} pubkey={pubkey} isBnsHolder={isBnsHolder}/>

        </span>
        <span className="bchat-member-item__name" style={{ marginInlineEnd: '5px', marginBottom: '15px' }}>
          {validateMemberName(memberName)}
        </span>
        {/* <span style={{ marginRight: '60px' }}>{isAdmin && <CrownIcon />}</span> */}
      </div>
      {!onlyList && !isAdmin && (
        <span className={classNames('bchat-member-item__checkmark', selectionValidation && 'selected')}>
          {selectionValidation ? (
            <CheckBoxTickIcon iconSize={26} />
          ) : (
            <BchatIcon iconType={'checkBox'} clipRule="evenodd" fillRule="evenodd" iconSize={26} />
          )}
        </span>
      )}
      {isAdmin && <span className="bchat-member-item_admin-txt">Admin</span>}
    </div>
  );
};
