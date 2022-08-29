import styled from 'styled-components';

export const LeftPaneSectionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction:row;
  align-items: center;
  border-right: var(--border-bchat);
  overflow-y: hidden;
  background-color:#128B17;
  padding:6px 0; 

  .icon-box .bchat-icon-button
  {
    padding: 10px;
    margin: 3px 24px;
    border-radius: 20px;
    color:#fff;
  }
  .icon-box svg:hover
  {
    color:#159B24;
  }
  .isSelected-icon-box {
    padding: 10px;
    margin: 3px 24px;
    border-radius: 34px;
    background-color: white;
    
  }
  .unreadCountChatIcon
  {
    position: absolute;
    width: 20px;
    height: 20px;
    font-size: 10px;
    bottom: 33px;
    left: 51px;
    padding: 7px;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-default);
    border-radius: 50%;
    font-weight: 700;
    background: var(--color-destructive);
    transition: var(--default-duration);
    opacity: 1;
    text-align: center;
    color: white;
  }

  .icon-box .bchat-icon-button:hover 
  {
    background-color: white;
    color:#159B24;
    border-radius: 34px;

  }

  .module-avatar {
    height: 80px;
    display: flex;
    align-items: center;
  }

  // this is not ideal but it seems that nth-0last-child does not work
  #onion-path-indicator-led-id {
    margin: auto auto 0px auto;
    opacity: 1;
  }
`;
