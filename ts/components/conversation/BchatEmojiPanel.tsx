import React from 'react';
import classNames from 'classnames';
import { Picker } from 'emoji-mart';
import { Constants } from '../../bchat';
import { useSelector } from 'react-redux';
import { getTheme } from '../../state/selectors/theme';
import styled from 'styled-components';

type Props = {
  onEmojiClicked: (emoji: any) => void;
  show: boolean;
  isModal?: boolean;
};
export const StyledEmojiPanel = styled.div<{ isModal: boolean }>`
  padding: var(--margins-lg);
  z-index: 5;
  opacity: 0;
  visibility: hidden;
  transition: var(--default-duration);
  button:focus {
    outline: none;
  }
  &.show {
    opacity: 1;
    visibility: visible;
  }
  & > section.emoji-mart {
    font-family: var(--font-default);
    font-size: var(--font-size-sm);
    background-color: var(--color-cell-background);
    border: 1px solid var(--color-session-border);
    border-radius: 8px;
    padding-bottom: var(--margins-sm);
    .emoji-mart-category-label {
      top: -2px;
      span {
        font-family: var(--font-default);
        padding-top: var(--margins-sm);
        background-color: var(--color-cell-background);
      }
    }
    .emoji-mart-scroll {
      height: 340px;
    }
    .emoji-mart-category .emoji-mart-emoji span {
      cursor: pointer;
    }
    .emoji-mart-bar:last-child {
      border: none;
      .emoji-mart-preview {
        display: none;
      }
    }
    ${props =>
      !props.isModal &&
      `
      &:after {
        content: '';
        position: absolute;
        top: calc(100% - 40px);
        left: calc(100% - 79px);
        width: 22px;
        height: 22px;
        background-color: var(--color-cell-background);
        transform: rotate(45deg);
        border-radius: 3px;
        transform: scaleY(1.4) rotate(45deg);
        border: 0.7px solid var(--color-session-border);
        clip-path: polygon(100% 100%, 7.2px 100%, 100% 7.2px);
      }
    `}
  }
`;
export const BchatEmojiPanel = (props: Props) => {
  const { onEmojiClicked, show,isModal = false } = props;
  const darkMode = useSelector(getTheme) === 'dark';

  return (
    <StyledEmojiPanel className={classNames(show && 'show')} isModal={isModal}>
      <Picker
        backgroundImageFn={() => './images/emoji/emoji-sheet-twitter-32.png'}
        set={'twitter'}
        sheetSize={32}
        darkMode={darkMode}
        color={Constants.UI.COLORS.GREEN}
        showPreview={true}
        title={''}
        onSelect={onEmojiClicked}
        autoFocus={true}
      />
    </StyledEmojiPanel>
  );
};
