import styled from 'styled-components';

export const LeftPaneSectionContainer = styled.div`
  /* position: absolute; */
  /* bottom: 0; */
  // width: 42%;
  width: 140px;
  /* height: 60px; */
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* border-right: var(--border-bchat); */
  overflow-y: hidden;
  // background-color: var(--green-color);
  padding: 6px 0;
  align-items: center;
  .profile-box {
    height: 90px;
    display: flex;
    align-items: center;
    .logo-wrapper {
      border-radius: 16px;
      background:var(--color-logo-bg);
      padding: 14px;
      position: relative;
    }
  }
  .isSelected-icon-box .btnView,
  .icon-box .btnView {
    // border-radius: 66px;
    border-radius: 12px;
    width: 90%;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color:var(--color-action-btn-icon);
    cursor: pointer;
    :hover {
      border-radius: 16px;
      // background: #202329;
      background-color: var(--color-action-btn-bg);
      // color: #ffffff;
    }

    // .beta {
    //   background-color: #9494a0;
    //   height: 9px;
    //   border-radius: 4px;
    //   padding: 0 2px;
    //   font-size: 6px;
    //   font-family: 'poppin-semibold';
    //   letter-spacing: 1px;
    //   margin-top: 2px;
    //   color: white;
    // }
  }
  .menu-txt {
    color: var(--color-action-btn-txt);
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    margin-top: 5px;
  }
  // .icon-box .btnView:hover {
  //   border-radius: 16px;
  //   background: #202329;
  //   // background-color: #006203;
  //   // color: #ffffff;
  // }

  .isSelected-icon-box,
  .icon-box {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
  }

  .isSelected-icon-box {
    .btnView,
    .menu-txt {
      // background-color: white;
      color: #108d32;
    }
  }

  .unreadCountChatIcon {
    position: absolute;
    width: 20px;
    height: 20px;
    font-size: 10px;
    top: 10px;
    /* bottom: 33px; */
    left: 72px;
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
    height: 60px;
    display: flex;
    align-items: center;
  }
  .theme-Wrapper {
    border-radius: 70px;
    border: 1.5px solid #46465d;
    padding: 5px 4px;
    .selected{
    background-Color:var(--color-theme-selected-bg);
    border-radius:40px;
    
  
    }
    .icon-wrapper{
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
  // this is not ideal but it seems that nth-0last-child does not work
  #onion-path-indicator-led-id {
    margin: auto auto 0px auto;
    opacity: 1;
  }
`;
