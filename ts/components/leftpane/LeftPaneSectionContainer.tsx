import styled from 'styled-components';

export const LeftPaneSectionContainer = styled.div`
  width: 96px;
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
    border-radius: 0;
    width: 100%;
    height: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color: var(--color-action-btn-icon);
    cursor: pointer;
    :hover {
      background-color: var(--color-modal-bg);
      // opacity: 0.9;
    }


  }
  .icon-colored-box {
    .btnView {
      background-color: var(--color-modal-bg);
    }
  }
  .menu-txt {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.03em;
  }

  .sub-menu-box-wrapper {
    position: fixed;
    left: 100px;
    top: 82px;
    z-index: 9;

    /* NOIR: drop the speech-bubble connector — the menu is a clean plate */
    > div:first-child {
      display: none;
    }

    .sub-menu-box {
      background-color: var(--color-context-menu-bg);
      border: 1px solid var(--color-settings-right-pane-option-border);
      box-shadow: 0 18px 60px rgba(0, 0, 0, 0.6);
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);

      padding: 6px;
      width: 200px;
      height: auto;
      border-radius: 0;

      /* compact rows, small icons */
      svg {
        width: 18px;
        height: 18px;
        flex: none;
      }
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
        fill: var(--color-accent);
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
    font-family: var(--font-mono);
    border-radius: 0;
    font-weight: 700;
    background: var(--color-accent);
    transition: var(--default-duration);
    opacity: 1;
    text-align: center;
    color: #0a0a0a;
  }

  .module-avatar {
    height: 60px;
    display: flex;
    align-items: center;
  }
  .theme-Wrapper {
    border-radius: 70px;
    border: 1px solid var(--color-borderBottomColor);
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
