import styled from 'styled-components';

export const LeftPaneSectionContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;

  border-right: var(--border-bchat);
  overflow-y: hidden;
  background-color: var(--green-color);
  padding: 6px 0;
  z-index: 2;

  .isSelected-icon-box .btnView,
  .icon-box .btnView {
    // border-radius: 66px;
    border-radius: 12px; 
    width: 48%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;

    .beta{
      background-color: #9494a0;
    height: 9px;
    border-radius: 4px;
    padding: 0 2px;
    font-size: 6px;
    font-family: 'poppin-semibold';
    letter-spacing: 1px;
    margin-top: 2px;
    color: white;
    }
  }
  .icon-box .btnView:hover {
    background-color: #006203;
    color: #ffffff;
  }

  .isSelected-icon-box,
  .icon-box {
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .isSelected-icon-box .btnView {
    background-color: white;
    color: #159b24;
  }

  .unreadCountChatIcon {
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

  // .icon-box .bchat-icon-button:hover
  // {
  //   background-color: white;
  //   color:#159B24;
  //   border-radius: 34px;

  // }

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
