// import React from 'react';
import styled from 'styled-components';
import { RenderTextCallbackType } from '../../types/Util';
import { SizeClassType } from '../../util/emoji';
import { AddNewLines } from '../conversation/AddNewLines';
import { Emojify } from '../conversation/Emojify';
import {
  MessageBody,
  renderTextDefault,
} from '../conversation/message/message-content/MessageBody';

const renderNewLines: RenderTextCallbackType = ({ text, key, isGroup }) => (
  <AddNewLines key={key} text={text} renderNonNewLine={renderTextDefault} isGroup={isGroup} />
);

const SnippetHighlight = styled.span`
  font-weight: bold;
  color: var(--color-text);
`;

const renderEmoji = ({
  text,
  key,
  sizeClass,
  renderNonEmoji,
  isGroup,
}: {
  text: string;
  key: number;
  isGroup: boolean;
  sizeClass: SizeClassType;
  renderNonEmoji: RenderTextCallbackType;
}) => (
  <Emojify
    key={key}
    text={text}
    sizeClass={sizeClass}
    renderNonEmoji={renderNonEmoji}
    isGroup={isGroup}
  />
);

export const MessageBodyHighlight = (props: { text: string; isGroup: boolean }) => {
  const { text, isGroup } = props;
  const results: Array<JSX.Element> = [];
  // this is matching what sqlite fts5 is giving us back
  const FIND_BEGIN_END = /<<left>>(.+?)<<right>>/g;

  let match = FIND_BEGIN_END.exec(text);
  let last = 0;
  let count = 1;
  const getPlainText = (text: string): string => {
    if (!text) return '';

    let cleaned = text;

    // 1. Strip the custom highlight markers first
    cleaned = cleaned.replace(/<<left>>/g, '').replace(/<<right>>/g, '');

    // 2. Remove blockquote markers (at start of lines)
    cleaned = cleaned.replace(/^>\s?/gm, '');

    // 3. Strip Markdown formatting (Bold, Italic, Strikethrough, Monospace)
    // We use non-greedy matching (.+?) to ensure we don't merge two separate blocks

    // Bold + Italic (***triple*** or ___triple___)
    cleaned = cleaned.replace(/(\*|_){3}(.+?)\1{3}/g, '$2');

    // Bold (**double** or __double__)
    cleaned = cleaned.replace(/(\*|_){2}(.+?)\1{2}/g, '$2');

    // Italic (*single* or _single_)
    // Note: We use [^\s] to ensure we don't match random lone asterisks
    cleaned = cleaned.replace(/(\*|_)(?=\S)(.+?)(?<=\S)\1/g, '$2');

    // Strikethrough (~~text~~)
    cleaned = cleaned.replace(/~~(.+?)~~/g, '$2');

    // Inline Code (`text`)
    cleaned = cleaned.replace(/`(.+?)`/g, '$2');

    // 4. Final Polish: Clean up stray symbols and extra whitespace
    return cleaned
      .replace(/[\*_~`]+/g, '') // Remove any dangling stray markers
      .replace(/\s{2,}/g, ' ') // Collapse double spaces
      .trim();
  };

  if (!match) {
    const cleanText = getPlainText(text);
    return (
      <MessageBody disableJumbomoji={true} disableLinks={true} text={cleanText} isGroup={isGroup} />
    );
  }

  const sizeClass = 'default';

  while (match) {
    if (last < match.index) {
      const beforeText = getPlainText(text.slice(last, match.index));
      results.push(
        renderEmoji({
          text: beforeText,
          sizeClass,
          key: count++,
          renderNonEmoji: renderNewLines,
          isGroup,
        })
      );
    }

    const [, toHighlight] = match;
    const cleanHighlight = getPlainText(toHighlight);
    results.push(
      <SnippetHighlight key={count++}>
        {renderEmoji({
          text: cleanHighlight,
          sizeClass,
          key: count++,
          renderNonEmoji: renderNewLines,
          isGroup,
        })}
      </SnippetHighlight>
    );

    // @ts-ignore
    last = FIND_BEGIN_END.lastIndex;
    match = FIND_BEGIN_END.exec(text);
  }

  if (last < text.length) {
     const afterText = getPlainText(text.slice(last)); 
    results.push(
      renderEmoji({
        text: afterText,
        sizeClass,
        key: count++,
        renderNonEmoji: renderNewLines,
        isGroup,
      })
    );
  }

  return <>{results}</>;
};
