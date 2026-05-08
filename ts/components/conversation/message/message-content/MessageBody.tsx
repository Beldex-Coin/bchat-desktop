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
 const codeRegex = /((?:^|\n)```\n[\s\S]*?\n```(?:\n|$))/g;

  const parts = text.split(codeRegex);

  parts.forEach(part => {
    if (!part) return;
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
    let mText = match.text;
    let mUrl = match.url;
    let mLastIndex = match.lastIndex;

    if (last < match.index) {
      const textWithNoLink = text.slice(last, match.index);

      const boldMatch = textWithNoLink.match(/^(.*)\*([^*]*)$/);
      const italicMatch = textWithNoLink.match(/^(.*)_([^_]*)$/);
      const strikeMatch = textWithNoLink.match(/^(.*)~([^~]*)$/);

      while (mText.length > 0) {
        const lastChar = mText[mText.length - 1];
        if (lastChar === '*' && boldMatch) {
          mText = mText.slice(0, -1);
          mUrl = mUrl.slice(0, -1);
          mLastIndex--;
        } else if (lastChar === '_' && italicMatch) {
          mText = mText.slice(0, -1);
          mUrl = mUrl.slice(0, -1);
          mLastIndex--;
        } else if (lastChar === '~' && strikeMatch) {
          mText = mText.slice(0, -1);
          mUrl = mUrl.slice(0, -1);
          mLastIndex--;
        } else {
          break;
        }
      }

      const mdLinkMatch = textWithNoLink.match(/^(.*)\[([^\]]+)\]\($/);
      const orderedPrefix = textWithNoLink.match(/^([\s\S]*?\n|)((\d+)\.\s+)$/);
      const bulletPrefix = textWithNoLink.match(/^([\s\S]*?\n|)([-*]\s+)$/);

      const charAfter = mLastIndex < text.length ? text[mLastIndex] : '';

      if (mdLinkMatch && charAfter === ')') {
        if (mdLinkMatch[1]) {
          results.push(
            renderNonLink({ text: mdLinkMatch[1], isGroup, isConvoListItem, key: count++ })
          );
        }

        const linkText = mdLinkMatch[2];
        const isValidLink = SUPPORTED_PROTOCOLS.test(mUrl) && !LinkPreviews.isLinkSneaky(mUrl);

        if (isValidLink) {
          results.push(
            <a key={count++} href={mUrl} onClick={(e: any) => handleClick(e, mUrl)}>
              {linkText}
            </a>
          );
        } else {
          results.push(
            renderNonLink({
              text: `[${linkText}](${mText})`,
              isGroup,
              isConvoListItem,
              key: count++,
            })
          );
        }

        last = mLastIndex + 1;
        return;
      }

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
              <a href={mUrl} onClick={(e: any) => handleClick(e, mUrl)}>
                {mText}
              </a>
            </li>
          </ol>
        );
        last = mLastIndex;
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
              <a href={mUrl} onClick={(e: any) => handleClick(e, mUrl)}>
                {mText}
              </a>
            </li>
          </ul>
        );
        last = mLastIndex;
        return;
      }

      if (boldMatch && charAfter === '*') {
        if (boldMatch[1]) {
          results.push(
            renderNonLink({ text: boldMatch[1], isGroup, isConvoListItem, key: count++ })
          );
        }
        const innerBefore = boldMatch[2];
        const innerText = innerBefore + mText; // Use adjusted mText
        results.push(renderFormattedInner(innerText, 'strong', count++));
        last = mLastIndex + 1; // Use adjusted mLastIndex
        return;
      }

      if (italicMatch && charAfter === '_') {
        if (italicMatch[1]) {
          results.push(
            renderNonLink({ text: italicMatch[1], isGroup, isConvoListItem, key: count++ })
          );
        }
        const innerText = italicMatch[2] + mText;
        results.push(renderFormattedInner(innerText, 'em', count++));
        last = mLastIndex + 1;
        return;
      }

      if (strikeMatch && charAfter === '~') {
        if (strikeMatch[1]) {
          results.push(
            renderNonLink({ text: strikeMatch[1], isGroup, isConvoListItem, key: count++ })
          );
        }
        const innerText = strikeMatch[2] + mText;
        results.push(renderFormattedInner(innerText, 'del', count++));
        last = mLastIndex + 1;
        return;
      }

      results.push(renderNonLink({ text: textWithNoLink, isGroup, isConvoListItem, key: count++ }));
    }

    const isLink = SUPPORTED_PROTOCOLS.test(mUrl) && !LinkPreviews.isLinkSneaky(mUrl);

    if (isLink) {
      results.push(
        <a key={count++} href={mUrl} onClick={(e: any) => handleClick(e, mUrl)}>
          {mText}
        </a>
      );
    } else {
      results.push(renderNonLink({ text: mText, isGroup, isConvoListItem, key: count++ }));
    }

    last = mLastIndex;
  });

  if (last < text.length) {
    results.push(renderNonLink({ text: text.slice(last), isGroup, isConvoListItem, key: count++ }));
  }

  return <>{results}</>;
};

const isValidBoundary = (text: string, start: number, end: number) => {
  const before = start === 0 ? '' : text[start - 1];
  const after = end >= text.length ? '' : text[end];
  const isStartValid = start === 0 || /[^a-zA-Z0-9]/.test(before);
  const isEndValid = end === text.length || /[^a-zA-Z0-9]/.test(after);

  return isStartValid && isEndValid;
};

export const formatText = (
  text: string,
  isConvoListItem?: boolean,
  parentKey: string = 'root',
  isGroup: boolean = false
): (string | JSX.Element)[] => {
  const parts: (string | JSX.Element)[] = [];
  const regex = /(?<!\\)(```(.*?)```|`([^`]+)`|\*(?!\s)(.+?)(?<!\s)\*(?=[^a-zA-Z0-9]|$)|_(?!\s)(.+?)(?<!\s)_(?=[^a-zA-Z0-9]|$)|~(?!\s)(.+?)(?<!\s)~(?=[^a-zA-Z0-9]|$))/g;
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

  const renderInnerContent = (inner: string, key: string) => {
    const hasLink = linkify.test(inner);
    if (hasLink) {
      return (
        <Linkify
          key={key}
          text={inner}
          isGroup={isGroup}
          isConvoListItem={isConvoListItem}
          renderNonLink={({ text: nonLink }) => <>{nonLink}</>}
        />
      );
    }
    return formatText(inner, isConvoListItem, key, isGroup);
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
      parts.push(
        inner && inner.trim() ? (
          <code key={currentKey} className="code-block">
            {inner}
          </code>
        ) : (
          renderPlainText(token, `${currentKey}-empty`)
        )
      );
    } else if (token.startsWith('`')) {
      const inner = match[3];
      parts.push(
        inner && inner.trim() ? (
          <code key={currentKey} className="inline-code">
            {inner}
          </code>
        ) : (
          renderPlainText(token, `${currentKey}-empty`)
        )
      );
    } else if (token.startsWith('*')) {
      const inner = match[4];
      parts.push(
        inner && inner.trim() ? (
          <strong key={currentKey}>{renderInnerContent(inner, currentKey)}</strong>
        ) : (
          renderPlainText(token, `${currentKey}-empty`)
        )
      );
    } else if (token.startsWith('_')) {
      const inner = match[5];
      parts.push(
        inner && inner.trim() ? (
          <em key={currentKey}>{renderInnerContent(inner, currentKey)}</em>
        ) : (
          renderPlainText(token, `${currentKey}-empty`)
        )
      );
    } else if (token.startsWith('~')) {
      const inner = match[6];
      parts.push(
        inner && inner.trim() ? (
          <del key={currentKey}>{renderInnerContent(inner, currentKey)}</del>
        ) : (
          renderPlainText(token, `${currentKey}-empty`)
        )
      );
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

    const earlyBulletMatch =
      !/^[-*]\s{2,}/.test(line) && (/^[-*]\s$/.test(line) || /^[-*]\s[^\s]/.test(line))
        ? line.match(/^[-*]\s+(.*)/)
        : null;
    const earlyNumberMatch =
      !/^\d+\.\s{2,}/.test(line) && (/^\d+\.\s$/.test(line) || /^\d+\.\s[^\s]/.test(line))
        ? line.match(/^(\d+)\.\s+(.*)/)
        : null;

    if (earlyBulletMatch) {
      if (currentListType === 'ol') pushPendingList();
      currentListType = 'ul';
      currentListItems.push(
        <li key={`li-${i}`}>{formatText(earlyBulletMatch[1], isConvoListItem, `li-${i}`, isGroup)}</li>
      );
      continue;
    }

    if (earlyNumberMatch) {
      if (currentListType === 'ul') pushPendingList();
      if (currentListItems.length === 0) listStartIndex = parseInt(earlyNumberMatch[1], 10);
      currentListType = 'ol';
      currentListItems.push(
        <li key={`li-${i}`}>{formatText(earlyNumberMatch[2], isConvoListItem, `li-${i}`, isGroup)}</li>
      );
      continue;
    }

    if (trimmedLine.startsWith('```') && !isConvoListItem) {
      if (inCodeBlock) {
        const endIdx = line.indexOf('```');
        if (endIdx > 0) {
          codeBlockContent.push(line.slice(0, endIdx));
        }
        
        const codeElement = (
          <code key={`pre-${i}`} className="code-block">
            {codeBlockContent.join('\n')}
          </code>
        );
        
        if (currentListType !== null) {
          currentListItems.push(
            <li key={`li-cb-${i}`} style={{ listStyleType: 'none', margin: 0 }}>
              {codeElement}
            </li>
          );
        } else {
          blocks.push(codeElement);
        }

        inCodeBlock = false;
        codeBlockContent = [];
        
        const remainingText = line.slice(endIdx + 3);
        if (remainingText.length > 0) {
          const textElement = (
            <React.Fragment key={`post-code-${i}`}>
              {formatText(remainingText, false, `post-code-${i}`, isGroup)}
            </React.Fragment>
          );
          if (currentListType !== null) {
            currentListItems.push(
              <li key={`li-post-${i}`} style={{ listStyleType: 'none', margin: 0 }}>
                {textElement}
              </li>
            );
          } else {
            blocks.push(textElement);
          }
        }
      } else {
        const closingTicksIndex = line.indexOf('```', line.indexOf('```') + 3);
        
        if (closingTicksIndex !== -1) {
          const content = line.slice(line.indexOf('```') + 3, closingTicksIndex);
          const codeElement = (
            <code key={`pre-${i}`} className="code-block">
              {content}
            </code>
          );
          
          if (currentListType !== null) {
            currentListItems.push(
              <li key={`li-cb-${i}`} style={{ listStyleType: 'none', margin: 0 }}>
                {codeElement}
              </li>
            );
          } else {
            blocks.push(codeElement);
          }
          
          const remainingText = line.slice(closingTicksIndex + 3);
          if (remainingText.length > 0) {
            const textElement = (
              <React.Fragment key={`post-code-${i}`}>
                {formatText(remainingText, false, `post-code-${i}`, isGroup)}
              </React.Fragment>
            );
            if (currentListType !== null) {
              currentListItems.push(
                <li key={`li-post-${i}`} style={{ listStyleType: 'none', margin: 0 }}>
                  {textElement}
                </li>
              );
            } else {
              blocks.push(textElement);
            }
          }
        } else {
          inCodeBlock = true;
          const startContent = line.slice(line.indexOf('```') + 3);
          if (startContent.trim()) {
            codeBlockContent.push(startContent);
          }
        }
      }
      continue;
    }

    if (inCodeBlock) {
      if (trimmedLine.endsWith('```')) {
        const endIdx = line.lastIndexOf('```');
        if (endIdx > 0) {
          codeBlockContent.push(line.slice(0, endIdx));
        }
        
        const codeElement = (
          <code key={`pre-${i}`} className="code-block">
            {codeBlockContent.join('\n')}
          </code>
        );
        
        if (currentListType !== null) {
          currentListItems.push(
            <li key={`li-cb-${i}`} style={{ listStyleType: 'none', margin: 0 }}>
              {codeElement}
            </li>
          );
        } else {
          blocks.push(codeElement);
        }

        inCodeBlock = false;
        codeBlockContent = [];
      } else {
        codeBlockContent.push(line);
      }
      continue;
    }

    pushPendingList();

    let quoteMatch: RegExpMatchArray | null = null;

    if (!/^>\s{2,}/.test(line)) {
      if (/^>\s$/.test(line) || /^>\s[^\s]/.test(line)) {
        quoteMatch = line.match(/^>\s+(.*)/);
      }
    }
    if (quoteMatch) {
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
      <code>{codeBlockContent.join('\n')}</code>
    );
  }

  return blocks;
};