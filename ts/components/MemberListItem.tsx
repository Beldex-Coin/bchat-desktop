import React from 'react';
import classNames from 'classnames';
import { Avatar, AvatarSize, BNSWrapper, CrownIcon } from './avatar/Avatar';
import { Constants } from '../bchat';
import { BchatIcon } from './icon';
import { useConversationBnsHolder, useConversationUsernameOrShorten } from '../hooks/useParamSelector';
import styled from 'styled-components';

const AvatarContainer = styled.div`
  position: relative;
`;

const AvatarItem = (props: { memberPubkey: string; isAdmin: boolean;isBnsHolder:any }) => {
  const { memberPubkey ,isBnsHolder} = props;
  return (
    <AvatarContainer>
       <BNSWrapper
                size={52}
                position={{ left: '34px', top: '34px' }}
                isBnsHolder={isBnsHolder}
              >
      <Avatar size={AvatarSize.M} pubkey={memberPubkey} />
      
      </BNSWrapper>
    </AvatarContainer>
  );
};

export const MemberListItem = (props: {
  pubkey: string;
  isSelected: boolean;
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
  } = props;

  const memberName = useConversationUsernameOrShorten(pubkey);
  const isBnsHolder=useConversationBnsHolder(pubkey)

  return (
    // tslint:disable-next-line: use-simple-attributes
    <div
      className={classNames(
        'bchat-member-item',
        isSelected && 'selected',
        isZombie && 'zombie',
        disableBg && 'compact'
      )}
      onClick={() => {
        isSelected ? onUnselect?.(pubkey) : onSelect?.(pubkey);
      }}
      style={
        !disableBg
          ? {
            }
          : {}
      }
      role="button"
      data-testid={dataTestId}
    >
      <div className="bchat-member-item__info" style={{width:"100%"}}>
        <span className="bchat-member-item__avatar" >
          <AvatarItem memberPubkey={pubkey} isAdmin={isAdmin || false}  isBnsHolder={isBnsHolder} />
        </span>
        <span className="bchat-member-item__name" style={{ marginInlineEnd: "5px"}}>{memberName}</span>
        <span style={{marginRight:'60px'}}>{isAdmin && <CrownIcon />}</span>
      </div>
      <span className={classNames('bchat-member-item__checkmark', isSelected && 'selected')}> 
        {isSelected&&<BchatIcon iconType="circle" iconSize="medium" iconColor={Constants.UI.COLORS.GREEN} /> }
      </span>
    </div>
  );
};
