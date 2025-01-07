import React, { forwardRef, MutableRefObject, useEffect } from 'react';
import classNames from 'classnames';
import data from '@emoji-mart/data';

import { useSelector } from 'react-redux';
import { getTheme } from '../../state/selectors/theme';
import styled from 'styled-components';

import { FixedBaseEmoji, FixedPickerProps } from '../../types/Reaction';
import { Picker } from 'emoji-mart';
import { noop } from 'lodash';
import { loadEmojiPanelI18n } from '../../util/i18n';

type Props = {
  onEmojiClicked: (emoji: FixedBaseEmoji) => void;
  show: boolean;
  isModal?: boolean;
};
const pickerProps: FixedPickerProps = {
  title: '',
  showPreview: true,
  autoFocus: true,
  skinTonePosition: 'preview',
};

export const StyledEmojiPanel = styled.div<{ isModal: boolean; theme: 'light' | 'dark' }>`
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
  em-emoji-picker {
    font-family: var(--font-default);
    font-size: var(--font-size-sm);
    background-color: var(--color-cell-background);
    border: 1px solid var(--color-session-border);
    border-radius: 8px;
    padding-bottom: var(--margins-sm);
    ${props => {
      switch (props.theme) {
        case 'dark':
          return `
            --background-rgb: 27, 27, 27; // var(--color-cell-background)
            --rgb-background: 27, 27, 27;
            --rgb-color: 255, 255, 255; // var(--color-text)
            --rgb-input: 27, 27, 27;
          `;
        case 'light':
        default:
          return `
            --background-rgb: 249, 249, 249; // var(--color-cell-background)
            --rgb-background: 249, 249, 249;
            --rgb-color: 0, 0, 0; // var(--color-text)
            --rgb-input: 249, 249, 249;
        `;
      }
    }}
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
export const BchatEmojiPanel = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
  const { onEmojiClicked, show, isModal = false } = props;
  // const darkMode = useSelector(getTheme) === 'dark';
  const theme = useSelector(getTheme);
  const pickerRef = ref as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    let isCancelled = false;
    if (pickerRef.current && pickerRef.current.children.length === 0) {
      // tslint:disable-next-line: no-unused-expression

      loadEmojiPanelI18n()
        .then(async i18n => {
          if (isCancelled) {
            return;
          }
          // tslint:disable-next-line: no-unused-expression
          new Picker({
            data,
            ref,
            i18n,
            onEmojiSelect: onEmojiClicked,
            ...pickerProps,
          });
        })
        .catch(noop);
    }
    return () => {
      isCancelled = true;
    };
  }, [data, pickerProps]);

  return (
    <StyledEmojiPanel
      isModal={isModal}
      theme={theme}
      className={classNames(show && 'show')}
      ref={ref}
    />
  );
})  ;
