import React from 'react';
// import { contextMenu } from 'react-contexify';


import styled from 'styled-components';
import {  BchatIcon } from '../icon';
import { getArchivedConversations } from '../../state/selectors/conversations';
import { useSelector } from 'react-redux';


const StyledArchiveBanner = styled.div`
  height: 74px;
  margin-bottom: 1px;
  width: 100%;
  // max-width: 300px;
  display: flex;
  flex-direction: row;
  padding: 8px 22px; // adjusting for unread border always being active
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  background: var(--color-request-banner-background);

  transition: var(--bchat-transition-duration);
  margin-top:10px;
  border-radius:22px;

  &:hover {
    background: var(--color-clickable-hovered);
  }
`;

const StyledArchiveBannerHeader = styled.span`
font-size: 16px;
font-weight: 400;
`;

const StyledUnreadCounter = styled.div`
  color:#fff;
  font-weight: bold;
  border-radius: var(--margins-md);
  font-size: var(--font-size-xs);
  background-color: var(--color-request-banner-unread-background);
  margin-left: 40px;
  min-width: 23px;
  height: 23px;
  line-height: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: var(--margins-xs);
`;

export const ArchivedBanner = (props: { handleOnClick: () => any }) => {
  const { handleOnClick } = props; 
   const archivedConversations = useSelector(getArchivedConversations).length;
   if (!archivedConversations) {
    return null;
   }

//   const triggerId = 'msg-req-banner';
//   const handleOnContextMenu = (e: any) => {
//     contextMenu.show({
//       id: triggerId,
//       event: e,
//     });
//   };

  const openRequests = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      handleOnClick();
    }
  };

  return (
    <>
      <StyledArchiveBanner
        // onContextMenu={handleOnContextMenu}
        onClick={openRequests}
        onMouseUp={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
        data-testid="ArchivedBanner"
      >
        <BchatIcon  iconSize="medium" iconType="messageRequest" />
        <StyledArchiveBannerHeader>
          {window.i18n('archived')}
        </StyledArchiveBannerHeader>
        <StyledUnreadCounter>
          <div>{archivedConversations||0}</div>
        </StyledUnreadCounter>
      </StyledArchiveBanner>
     
    </>
  );
};



