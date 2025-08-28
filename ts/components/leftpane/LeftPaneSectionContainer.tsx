import styled from 'styled-components';

export const LeftPaneSectionContainer = styled.div`
  width: 125px;
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
      background: var(--color-logo-bg);
      padding: 14px;
      position: relative;
    }
  }
  .isSelected-icon-box .btnView,
  .icon-box .btnView {
    // border-radius: 66px;
    border-radius: 26px;
    width: 100%;
    height: 77px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color: var(--color-action-btn-icon);
    cursor: pointer;
    :hover {
      background-color: var(--color-modal-bg);
      opacity: 0.9;
    }


  }
  .icon-colored-box {
    .btnView {
      background-color: var(--color-modal-bg);
    }
  }
  .menu-txt {
    font-size: 20px;
    font-weight: 400;
  }
 
  .sub-menu-box-wrapper {
    position: fixed;
    left: 102px;
    top: 82px;
    z-index: 9;
    .sub-menu-box {
      background-color: var(--color-modal-bg);

      padding: 10px;
      width: 247px;
      height: 243px;
      border-radius: 26px;
    }
  }
  .sub-menu-box-wrapper-disabled {
    display: none;
  }

  .isSelected-icon-box,
  .icon-box {
    // width: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
  }
 

  .isSelected-icon-box {
    .btnView {
      background-color: var(--color-modal-bg);
      svg {
        fill: #108d32;
      }
    }

    .menu-txt {
      // background-color: white;
      // color: #108d32;
    }
  }
  .isSelected-icon-box,
  .icon-box {
    .btnView {
      &:hover + .d-visiblity {
        display: block; // show sibling on hover
      }
    }

    .d-visiblity {
      display: none; // hidden by default
    }
  }
  .unreadCountChatIcon {
    position: absolute;
    width: 30px;
    height: 20px;
    font-size: 12px;
    top: 11px;
    right: 13px;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-default);
    border-radius: 12px;
    font-weight: 600;
    background: var(--color-destructive);
    transition: var(--default-duration);
    opacity: 1;
    text-align: center;
    color: white;
  }

  .module-avatar {
    height: 60px;
    display: flex;
    align-items: center;
  }
  .theme-Wrapper {
    border-radius: 70px;
    border: 1.5px solid #46465d;
    padding: 5px 4px;
    .selected {
      background-color: var(--color-theme-selected-bg);
      border-radius: 40px;
    }
    .icon-wrapper {
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
