import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import data from '@emoji-mart/data';



import { useSelector } from 'react-redux';
import { getTheme } from '../../state/selectors/theme';
import styled from 'styled-components';

import { FixedBaseEmoji, FixedPickerProps } from '../../types/Util.js';
import { Picker } from 'emoji-mart'

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

const loadLocale = async () => {
  if (!window) {
    return undefined;
  }

  const lang = (window.i18n as any).getLocale();
  if (lang !== 'en') {
    const langData = await import(`@emoji-mart/data/i18n/${lang}.json`);
    return langData;
  }
}
export const StyledEmojiPanel = styled.div<{ isModal: boolean;theme: 'light' | 'dark' }>`
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
export const BchatEmojiPanel = (props: Props) => {
  const { onEmojiClicked, show,isModal = false } = props;
  // const darkMode = useSelector(getTheme) === 'dark';
  const theme = useSelector(getTheme);

  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    if (pickerRef.current && pickerRef.current.children.length === 0) {
        // tslint:disable-next-line: no-unused-expression
       
        loadLocale()
        .then(async i18n => {
          if (isCancelled) {
            return;
          }
          // tslint:disable-next-line: no-unused-expression
          new Picker({
            data,
            ref: pickerRef,
            i18n,
            onEmojiSelect: onEmojiClicked,
            ...pickerProps,
          });
        })
        .catch(() => {
          if (isCancelled) {
            return;
          }
        })
      
    }
    return () => {
      isCancelled = true;
    };
  }, [data, pickerProps,loadLocale]);

  return (
    <StyledEmojiPanel
    isModal={isModal}
  theme={theme}
    className={classNames(show && 'show')}
    ref={pickerRef}
  />
  );
};
