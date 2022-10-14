import React from 'react';
import { contextMenu } from 'react-contexify';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getUnreadConversationRequests } from '../../state/selectors/conversations';
import { getHideMessageRequestBanner } from '../../state/selectors/userConfig';
import {  BchatIconSize, BchatIconType } from '../icon';
import { MemoMessageRequestBannerContextMenu } from '../menu/MessageRequestBannerContextMenu';

const StyledMessageRequestBanner = styled.div`
  height: 74px;
  width: 100%;
  // max-width: 300px;
  display: flex;
  flex-direction: row;
  padding: 8px 12px; // adjusting for unread border always being active
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  background: var(--color-request-banner-background);

  transition: var(--bchat-transition-duration);

  &:hover {
    background: var(--color-clickable-hovered);
  }
`;

const StyledMessageRequestBannerHeader = styled.span`
  font-weight: bold;
  font-size: 15px;
  color: var(--color-text-subtle);
  margin-inline-start: 12px;
  line-height: 18px;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StyledCircleIcon = styled.div`
  padding-left: var(--margins-xs);
`;

const StyledUnreadCounter = styled.div`
  color:#fff;
  font-weight: bold;
  border-radius: var(--margins-sm);
  font-size: var(--font-size-xs);
  background-color: var(--color-request-banner-unread-background);
  margin-left: 40px;
  min-width: 22px;
  height: 20px;
  line-height: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: var(--margins-xs);
`;

const StyledGridContainer = styled.div`
  display: flex;
  width: 42px;
  height: 42px;
  align-items: center;
  border-radius: 50%;
  justify-content: center;
  background-color: var(--color-request-banner-icon-background);
`;

export const CirclularIcon = (props: { iconType: BchatIconType; iconSize: BchatIconSize }) => {
  const { iconSize, iconType } = props;
  console.log(iconSize,iconType)

  return (
    <StyledCircleIcon>
      <StyledGridContainer>
        
        {/* <BchatIcon
          iconType={iconType}
          iconSize={iconSize}
          iconColor="var(--color-request-banner-icon)"
        /> */}
        <div style={{background: `url(images/bchat/message_request.svg) no-repeat`,
              width: "30px",
              height: "34px",
              //  left:'103px',
              position: 'relative',
              // justifyContent: 'center',
              // backgroundSize: '32px',
              top: '8px',
              left: '6px',
              // alignItems: 'center',
              //  backgroundColor:"#353543",
              //  borderRadius:"30px",
              //  backgroundPosition:"center",
              // cursor: 'pointer'
              }}></div>
      </StyledGridContainer>
    </StyledCircleIcon>
  );
};

export const MessageRequestsBanner = (props: { handleOnClick: () => any }) => {
  const { handleOnClick } = props;
  const conversationRequestsUnread = useSelector(getUnreadConversationRequests).length;
  const hideRequestBanner = useSelector(getHideMessageRequestBanner);

  if (!conversationRequestsUnread || hideRequestBanner) {
    return null;
  }

  const triggerId = 'msg-req-banner';

  const handleOnContextMenu = (e: any) => {
    contextMenu.show({
      id: triggerId,
      event: e,
    });
  };

  const openRequests = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      handleOnClick();
    }
  };

  return (
    <>
      <StyledMessageRequestBanner
        onContextMenu={handleOnContextMenu}
        onClick={openRequests}
        onMouseUp={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
        data-testid="message-request-banner"
      >
        <CirclularIcon iconType="messageRequest" iconSize="medium" />
        <StyledMessageRequestBannerHeader>
          {window.i18n('messageRequests')}
        </StyledMessageRequestBannerHeader>
        <StyledUnreadCounter>
          <div>{conversationRequestsUnread || 0}</div>
        </StyledUnreadCounter>
      </StyledMessageRequestBanner>
      <Portal>
        <MemoMessageRequestBannerContextMenu triggerId={triggerId} />
      </Portal>
    </>
  );
};

const Portal = ({ children }: { children: any }) => {
  return createPortal(children, document.querySelector('.inbox.index') as Element);
};
