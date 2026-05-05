import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { shell } from 'electron';
import LinkifyIt from 'linkify-it';

import { RenderTextCallbackType } from '../../../../types/Util';
import { getEmojiSizeClass, SizeClassType } from '../../../../util/emoji';
import { AddMentions } from '../../AddMentions';
import { AddNewLines } from '../../AddNewLines';
import { Emojify } from '../../Emojify';
import { MessageInteraction } from '../../../../interactions';
import { updateConfirmModal } from '../../../../state/ducks/modalDialog';
import { LinkPreviews } from '../../../../util/linkPreviews';
import { BchatButtonColor } from '../../../basic/BchatButton';
import { BchatIcon } from '../../../icon/BchatIcon';
import React from 'react';

const linkify = LinkifyIt();

type Props = {
  text: string;
  disableJumbomoji: boolean;
  disableLinks: boolean;
  isGroup: boolean;
  isConvoListItem?: boolean;
};

export const renderTextDefault: RenderTextCallbackType = ({ text }) => <>{text}</>;

const renderNewLines: RenderTextCallbackType = ({
  text: textWithNewLines,
  key,
  isGroup,
  isConvoListItem,
}) => {
  const hasBlockMarkdown = /(^|\n)(```|>\s|[-*]\s|\d+\.\s)/.test(textWithNewLines);
  
  if (!isConvoListItem && hasBlockMarkdown) {
    return (
      <span key={key}>{renderMarkdownBlocks(textWithNewLines, isConvoListItem, isGroup)}</span>
    );
  }

  const renderOther = isGroup ? renderFormattedFirst : renderFormatted;
  return (
    <AddNewLines
      key={key}
      text={textWithNewLines}
      renderNonNewLine={renderOther}
      isGroup={isGroup}
      isConvoListItem={isConvoListItem}
    />
  );
};

export const renderFormattedFirst: RenderTextCallbackType = ({
  text,
  key,
  isGroup,
  isConvoListItem,
}) => {
  if (!text) return <></>;

  return (
    <span key={key}>
      {renderMarkdownBlocks(text, isConvoListItem, isGroup).map((part, i) => (
        <React.Fragment key={`${key}-${i}`}>{part}</React.Fragment>
      ))}
    </span>
  );
};

const renderFormatted: RenderTextCallbackType = ({ text, key, isGroup, isConvoListItem }) => {
  if (!text) return <></>;
  return <span key={key}>{renderMarkdownBlocks(text, isConvoListItem, isGroup)}</span>;
};

const renderEmoji = ({
  text,
  key,
  sizeClass,
  renderNonEmoji,
  isGroup,
  isConvoListItem,
}: {
  text: string;
  key: number;
  sizeClass: SizeClassType;
  renderNonEmoji: RenderTextCallbackType;
  isGroup: boolean;
  isConvoListItem?: boolean;
}) => {
  return (
    <Emojify
      key={key}
      text={text}
      sizeClass={sizeClass}
      renderNonEmoji={renderNonEmoji}
      isGroup={isGroup}
      isConvoListItem={isConvoListItem}
    />
  );
};

const JsxSelectable = (jsx: JSX.Element): JSX.Element => {
  return (
    <span
      className="text-selectable"
      onDragStart={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
    >
      {jsx}
    </span>
  );
};

export const MessageBody = (props: Props) => {
  const { text, disableJumbomoji, disableLinks, isGroup, isConvoListItem } = props;
  const sizeClass: SizeClassType = disableJumbomoji ? 'default' : getEmojiSizeClass(text);

  if (disableLinks) {
    return JsxSelectable(
      renderEmoji({
        text,
        sizeClass,
        key: 0,
        renderNonEmoji: renderNewLines,
        isGroup,
        isConvoListItem,
      })
    );
  }

 const segments: { content: string; isCode: boolean }[] = [];
  // 1. Enforce a newline so we ONLY split true multiline code blocks
  const codeRegex = /(```[\s\S]*?\n[\s\S]*?```)/g;

  const parts = text.split(codeRegex);

  parts.forEach(part => {
    if (!part) return;
    // 2. Ensure we strictly identify the multiline code blocks
    if (part.startsWith('```') && part.endsWith('```') && part.includes('\n')) {
      segments.push({ content: part, isCode: true });
    } else {
      segments.push({ content: part, isCode: false });
    }
  });

  return JsxSelectable(
    <span>
      {segments.map((seg, i) => {
        if (seg.isCode) {
          return (
            <React.Fragment key={i}>
              {renderEmoji({
                text: seg.content,
                sizeClass,
                key: i,
                renderNonEmoji: params => renderNewLines({ ...params, isGroup, isConvoListItem }),
                isGroup,
                isConvoListItem,
              })}
            </React.Fragment>
          );
        }

        return (
          <Linkify
            key={i}
            text={seg.content}
            isGroup={isGroup}
            isConvoListItem={isConvoListItem}
            renderNonLink={({ key, text: nonLinkText, isConvoListItem }) => {
              return renderEmoji({
                text: nonLinkText,
                sizeClass,
                key,
                renderNonEmoji: params =>
                  renderNewLines({
                    ...params,
                    isGroup,
                    isConvoListItem,
                  }),
                isGroup,
              });
            }}
          />
        );
      })}
    </span>
  );
};

type LinkifyProps = {
  text: string;
  renderNonLink: RenderTextCallbackType;
  isGroup: boolean;
  isConvoListItem?: boolean;
};

const SUPPORTED_PROTOCOLS = /^(http|https):/i;

const Linkify = (props: LinkifyProps): JSX.Element => {
  const { text, isGroup, isConvoListItem, renderNonLink } = props;
  const results: Array<any> = [];
  let count = 1;
  const dispatch = useDispatch();
  const matchData = linkify.match(text) || [];
  let last = 0;

  const handleClick = useCallback((e: any, url: any) => {
    e.preventDefault();
    e.stopPropagation();

    const openLink = () => {
      void shell.openExternal(url);
    };

    dispatch(
      updateConfirmModal({
        title: window.i18n('linkVisitWarningTitle'),
        message: window.i18n('linkVisitWarningMessage', url),
        okText: window.i18n('openLink'),
        cancelText: window.i18n('editMenuCopy'),
        showExitIcon: true,
        iconShow: true,
        customIcon: <BchatIcon iconType="openLink" iconSize={30} />,
        okTheme: BchatButtonColor.Primary,
        onClickOk: openLink,
        onClickClose: () => {
          dispatch(updateConfirmModal(null));
        },
        onClickCancel: () => {
          MessageInteraction.copyBodyToClipboard(url);
        },
        okIcon: { icon: 'openLinkBtn', size: 20 },
        cancelIcon: { icon: 'copy', size: 20 },
      })
    );
  }, []);

  const renderFormattedInner = (
    innerText: string,
    Wrapper: 'strong' | 'em' | 'del',
    key: number
  ) => {
    const innerMatches = linkify.match(innerText) || [];

    if (innerMatches.length === 0) {
      return (
        <Wrapper key={key}>
          {renderNonLink({ text: innerText, key, isGroup, isConvoListItem })}
        </Wrapper>
      );
    }

    const innerParts: Array<any> = [];
    let innerLast = 0;
    let innerCount = 0;

    innerMatches.forEach((m: { index: number; url: string; lastIndex: number; text: string }) => {
      if (innerLast < m.index) {
        const plainText = innerText.slice(innerLast, m.index);
        innerParts.push(
          renderNonLink({ text: plainText, key: innerCount++, isGroup, isConvoListItem })
        );
      }

      const isValidLink = SUPPORTED_PROTOCOLS.test(m.url) && !LinkPreviews.isLinkSneaky(m.url);
      if (isValidLink) {
        innerParts.push(
          <a key={innerCount++} href={m.url} onClick={(e: any) => handleClick(e, m.url)}>
            {m.text}
          </a>
        );
      } else {
        innerParts.push(
          renderNonLink({ text: m.text, key: innerCount++, isGroup, isConvoListItem })
        );
      }

      innerLast = m.lastIndex;
    });

    if (innerLast < innerText.length) {
      innerParts.push(
        renderNonLink({
          text: innerText.slice(innerLast),
          key: innerCount++,
          isGroup,
          isConvoListItem,
        })
      );
    }

    return <Wrapper key={key}>{innerParts}</Wrapper>;
  };

  if (matchData.length === 0) {
    return renderNonLink({ text, key: 0, isGroup });
  }

  matchData.forEach((match: { index: number; url: string; lastIndex: number; text: string }) => {
    if (last < match.index) {
      const textWithNoLink = text.slice(last, match.index);

      const boldMatch = textWithNoLink.match(/^(.*)\*([^*]*)$/);
      const italicMatch = textWithNoLink.match(/^(.*)_([^_]*)$/);
      const strikeMatch = textWithNoLink.match(/^(.*)~([^~]*)$/);

      const orderedPrefix = textWithNoLink.match(/^([\s\S]*?\n|)((\d+)\.\s+)$/);
      const bulletPrefix = textWithNoLink.match(/^([\s\S]*?\n|)([-*]\s+)$/);

      const charAfter = match.lastIndex < text.length ? text[match.lastIndex] : '';

      if (orderedPrefix) {
        if (orderedPrefix[1]) {
          results.push(
            renderNonLink({ text: orderedPrefix[1], isGroup, isConvoListItem, key: count++ })
          );
        }
        const num = orderedPrefix[3];
        results.push(
          <ol key={count++} start={parseInt(num, 10)} className="markdown-list">
            <li>
              <a href={match.url} onClick={(e: any) => handleClick(e, match.url)}>
                {match.text}
              </a>
            </li>
          </ol>
        );
        last = match.lastIndex;
        return;
      }
      if (bulletPrefix) {
        if (bulletPrefix[1]) {
          results.push(
            renderNonLink({ text: bulletPrefix[1], isGroup, isConvoListItem, key: count++ })
          );
        }
        results.push(
          <ul key={count++} className="markdown-list">
            <li>
              <a href={match.url} onClick={(e: any) => handleClick(e, match.url)}>
                {match.text}
              </a>
            </li>
          </ul>
        );
        last = match.lastIndex;
        return;
      }
      if (boldMatch && charAfter === '*') {
        if (boldMatch[1]) {
          results.push(
            renderNonLink({ text: boldMatch[1], isGroup, isConvoListItem, key: count++ })
          );
        }
        const innerBefore = boldMatch[2];
        const innerText = innerBefore + match.text;
        results.push(renderFormattedInner(innerText, 'strong', count++));
        last = match.lastIndex + 1;
        return;
      }

      if (italicMatch && charAfter === '_') {
        if (italicMatch[1]) {
          results.push(
            renderNonLink({ text: italicMatch[1], isGroup, isConvoListItem, key: count++ })
          );
        }
        const innerText = italicMatch[2] + match.text;
        results.push(renderFormattedInner(innerText, 'em', count++));
        last = match.lastIndex + 1;
        return;
      }

      if (strikeMatch && charAfter === '~') {
        if (strikeMatch[1]) {
          results.push(
            renderNonLink({ text: strikeMatch[1], isGroup, isConvoListItem, key: count++ })
          );
        }
        const innerText = strikeMatch[2] + match.text;
        results.push(renderFormattedInner(innerText, 'del', count++));
        last = match.lastIndex + 1;
        return;
      }

      results.push(renderNonLink({ text: textWithNoLink, isGroup, isConvoListItem, key: count++ }));
    }

    const { url, text: originalText } = match;
    const isLink = SUPPORTED_PROTOCOLS.test(url) && !LinkPreviews.isLinkSneaky(url);

    if (isLink) {
      results.push(
        <a key={count++} href={url} onClick={(e: any) => handleClick(e, url)}>
          {originalText}
        </a>
      );
    } else {
      results.push(renderNonLink({ text: originalText, isGroup, isConvoListItem, key: count++ }));
    }

    last = match.lastIndex;
  });

  if (last < text.length) {
    results.push(renderNonLink({ text: text.slice(last), isGroup, isConvoListItem, key: count++ }));
  }

  return <>{results}</>;
};

const isValidBoundary = (text: string, start: number, end: number) => {
  const before = start === 0 ? '' : text[start - 1];
  const after = end >= text.length ? '' : text[end];

  const boundaryRegex = /[\s.,!?()[\]{}"'`*_~]/;

  const isStartValid = start === 0 || boundaryRegex.test(before);
  const isEndValid = end === text.length || boundaryRegex.test(after);

  return isStartValid && isEndValid;
};

export const formatText = (
  text: string,
  isConvoListItem?: boolean,
  parentKey: string = 'root',
  isGroup: boolean = false
): (string | JSX.Element)[] => {
  const parts: (string | JSX.Element)[] = [];

  const regex = /(?<!\\)(```(.*?)```|`([^`]+)`|\*(?!\s)([^*]+?)(?<!\s)\*|_(?!\s)([^_]+?)(?<!\s)_|~(?!\s)([^~]+?)(?<!\s)~)/g;

  let lastIndex = 0;
  let match;

  const renderPlainText = (txt: string, key: string) => {
    const cleanTxt = txt.replace(/\\([*_\~`])/g, '$1');
    return isGroup ? (
      <AddMentions
        key={key}
        text={cleanTxt}
        isGroup={isGroup}
        renderOther={({ text }) => <>{text}</>}
      />
    ) : (
      <span key={key}>{cleanTxt}</span>
    );
  };

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        renderPlainText(text.slice(lastIndex, match.index), `${parentKey}-txt-${lastIndex}`)
      );
    }

    const token = match[0];
    const start = match.index;
    const end = regex.lastIndex;
    const currentKey = `${parentKey}-${start}`;

    if (!isValidBoundary(text, start, end)) {
      parts.push(renderPlainText(token, `${currentKey}-invalid`));
      lastIndex = regex.lastIndex;
      continue;
    }

    if (token.startsWith('```')) {
      const inner = match[2];
      if (!inner || !inner.trim()) {
        parts.push(renderPlainText(token, `${currentKey}-empty`));
      } else {
        parts.push(
          <code key={currentKey} className="code-block">
            {inner}
          </code>
        );
      }
    } else if (token.startsWith('`')) {
      const inner = match[3];
      if (!inner || !inner.trim()) {
        parts.push(renderPlainText(token, `${currentKey}-empty`));
      } else {
        parts.push(
          <code key={currentKey} className="inline-code">
            {inner}
          </code>
        );
      }
    } else if (token.startsWith('*')) {
      const inner = match[4];
      if (!inner || !inner.trim()) {
        parts.push(renderPlainText(token, `${currentKey}-empty`));
      } else {
        parts.push(
          <strong key={currentKey}>
            {formatText(inner, isConvoListItem, currentKey, isGroup)}
          </strong>
        );
      }
    } else if (token.startsWith('_')) {
      const inner = match[5];
      if (!inner || !inner.trim()) {
        parts.push(renderPlainText(token, `${currentKey}-empty`));
      } else {
        parts.push(
          <em key={currentKey}>{formatText(inner, isConvoListItem, currentKey, isGroup)}</em>
        );
      }
    } else if (token.startsWith('~')) {
      const inner = match[6];
      if (!inner || !inner.trim()) {
        parts.push(renderPlainText(token, `${currentKey}-empty`));
      } else {
        parts.push(
          <del key={currentKey}>{formatText(inner, isConvoListItem, currentKey, isGroup)}</del>
        );
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(renderPlainText(text.slice(lastIndex), `${parentKey}-txt-end`));
  }

  return parts;
};

export const renderMarkdownBlocks = (
  text: string,
  isConvoListItem?: boolean,
  isGroup: boolean = false
): JSX.Element[] => {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks: JSX.Element[] = [];

  let currentListItems: JSX.Element[] = [];
  let currentListType: 'ul' | 'ol' | null = null;
  let listStartIndex = 1;

  let inCodeBlock = false;
  let codeBlockContent: string[] = [];

  const pushPendingList = () => {
    if (currentListItems.length > 0) {
      const ListTag = currentListType!;
      const props =
        currentListType === 'ol' && listStartIndex !== 1 ? { start: listStartIndex } : {};
      blocks.push(
        <ListTag key={`list-${blocks.length}`} {...props} className="markdown-list">
          {currentListItems}
        </ListTag>
      );
      currentListItems = [];
      currentListType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // ✅ FIX: Process codeblocks properly to prevent single-line ```code``` from being swallowed
    if (trimmedLine.startsWith('```') && !isConvoListItem) {
      if (inCodeBlock) {
        // Find closing backticks if they are appended to code on the same line
        const endIdx = line.indexOf('```');
        if (endIdx > 0) {
          codeBlockContent.push(line.slice(0, endIdx));
        }
        blocks.push(
          // <pre className="code-block">
            <code key={`pre-${i}`} className="code-block">
              {codeBlockContent.join('\n')}
            </code>
          // </pre>
        );
        inCodeBlock = false;
        codeBlockContent = [];
      } else {
        pushPendingList();
        // Check if it's a completely single-line block (e.g. ```code```)
        if (trimmedLine.length >= 6 && trimmedLine.endsWith('```')) {
          const content = trimmedLine.slice(3, -3);
          blocks.push(
            <code key={`pre-${i}`} className="code-block">
              {content}
            </code>
          );
        } else {
          inCodeBlock = true;
          // Capture potential code situated directly after the opening ```
          const startContent = line.slice(line.indexOf('```') + 3);
          if (startContent.trim()) {
            codeBlockContent.push(startContent);
          }
        }
      }
      continue;
    }

    if (inCodeBlock) {
      // ✅ FIX: Allows the closing ``` to sit at the end of a populated line
      if (trimmedLine.endsWith('```')) {
        const endIdx = line.lastIndexOf('```');
        if (endIdx > 0) {
          codeBlockContent.push(line.slice(0, endIdx));
        }
        blocks.push(
          <pre key={`pre-${i}`} className="code-block">
            <code>{codeBlockContent.join('\n')}</code>
          </pre>
        );
        inCodeBlock = false;
        codeBlockContent = [];
      } else {
        codeBlockContent.push(line);
      }
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      if (currentListType === 'ol') pushPendingList();
      currentListType = 'ul';
      currentListItems.push(
        <li key={`li-${i}`}>{formatText(bulletMatch[1], isConvoListItem, `li-${i}`, isGroup)}</li>
      );
      continue;
    }

    const numberMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberMatch) {
      if (currentListType === 'ul') pushPendingList();
      if (currentListItems.length === 0) listStartIndex = parseInt(numberMatch[1], 10);
      currentListType = 'ol';
      currentListItems.push(
        <li key={`li-${i}`}>{formatText(numberMatch[2], isConvoListItem, `li-${i}`, isGroup)}</li>
      );
      continue;
    }

    pushPendingList();

    const quoteMatch = line.match(/^>\s+(.*)/);
    if (quoteMatch) {
      console.log('Quote match:', quoteMatch[1]);
      if (isConvoListItem) {
        blocks.push(<span key={`quote-${i}`}> {window.i18n('quoteMessage')} </span>);
        continue;
      }
      blocks.push(
        <blockquote key={`quote-${i}`} className="markdown-quote">
          {formatText(quoteMatch[1], false, `quote-${i}`, isGroup)}
        </blockquote>
      );
      continue;
    }

    if (line === '') {
      blocks.push(<br key={`br-${i}`} />);
    } else {
      blocks.push(
        <React.Fragment key={`p-${i}`}>{formatText(line, false, `p-${i}`, isGroup)}</React.Fragment>
      );
      
      if (i < lines.length - 1) {
        const nextLine = lines[i + 1];
        const isNextLineBlock = /^```|^>\s|^[-*]\s|^\d+\.\s/.test(nextLine.trim());
        if (!isNextLineBlock) {
          blocks.push(<br key={`br-auto-${i}`} />);
        }
      }
    }
  }

  pushPendingList();
  if (inCodeBlock && codeBlockContent.length > 0) {
    blocks.push(
      <pre key="pre-end" className="code-block">
        <code>{codeBlockContent.join('\n')}</code>
      </pre>
    );
  }

  return blocks;
};
