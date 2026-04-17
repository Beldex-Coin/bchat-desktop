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
  /** If set, all emoji will be the same size. Otherwise, just one emoji will be large. */
  disableJumbomoji: boolean;
  /** If set, links will be left alone instead of turned into clickable `<a>` tags. Used in quotes, convo list item, etc */
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
  // if (!isConvoListItem && textWithNewLines.includes('```')) {
  //   return (
  //     <span key={key}>
  //       {renderMarkdownBlocks(textWithNewLines, isConvoListItem)}
  //     </span>
  //   );
  // }
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
  //  if (!isConvoListItem && text.includes('```')) {
  //   return (
  //     <span key={key}>
  //       {renderMarkdownBlocks(text, isConvoListItem)}
  //     </span>
  //   );
  // }
  return (
    <span key={key}>
      <AddMentions
        text={text}
        isGroup={isGroup}
        renderOther={({ text, key }) => (
          <>
            {renderMarkdownBlocks(text, isConvoListItem).map((part, i) => (
              <React.Fragment key={`${key}-${i}`}>
                {typeof part === 'string' ? part : part}
              </React.Fragment>
            ))}
          </>
        )}
      />
    </span>
  );
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

/**
 * This component makes it very easy to use all three of our message formatting
 * components: `Emojify`, `Linkify`, and `AddNewLines`. Because each of them is fully
 * configurable with their `renderXXX` props, this component will assemble all three of
 * them for you.
 */

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

  // if (!isConvoListItem && text.includes('```')) {
  //   const segments: { content: string; isCode: boolean }[] = [];
  //   const parts = text.split(/(```[\s\S]*?```)/g);

  //   parts.forEach(part => {
  //     if (part.startsWith('```') && part.endsWith('```')) {
  //       segments.push({ content: part, isCode: true });
  //     } else {
  //       segments.push({ content: part, isCode: false });
  //     }
  //   });

  //   return JsxSelectable(
  //     <span>
  //       {segments.map((seg, i) => {
  //         if (seg.isCode) {
  //           // Render code block via renderMarkdownBlocks — safe, no linkify
  //           return (
  //             <React.Fragment key={i}>
  //               {renderMarkdownBlocks(seg.content, isConvoListItem)}
  //             </React.Fragment>
  //           );
  //         }
  //         // Non-code segment — render normally through Linkify + emoji
  //         if (!seg.content) return null;
  //         return (
  //           <Linkify
  //             key={i}
  //             text={seg.content}
  //             isGroup={isGroup}
  //             isConvoListItem={isConvoListItem}
  //             renderNonLink={({ key, text: nonLinkText, isConvoListItem }) =>
  //               renderEmoji({
  //                 text: nonLinkText,
  //                 sizeClass,
  //                 key,
  //                 renderNonEmoji: params =>
  //                   renderNewLines({ ...params, isGroup, isConvoListItem }),
  //                 isGroup,
  //               })
  //             }
  //           />
  //         );
  //       })}
  //     </span>
  //   );
  // }
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

  return JsxSelectable(
    <Linkify
      text={text}
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
};

type LinkifyProps = {
  text: string;
  /** Allows you to customize now non-links are rendered. Simplest is just a <span>. */
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
      // No links inside, just wrap as formatted text
      return (
        <Wrapper key={key}>
          {renderNonLink({ text: innerText, key, isGroup, isConvoListItem })}
        </Wrapper>
      );
    }

    // Mix of text and links inside formatted block
    const innerParts: Array<any> = [];
    let innerLast = 0;
    let innerCount = 0;

    innerMatches.forEach((m: { index: number; url: string; lastIndex: number; text: string }) => {
      // Plain text before this link
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

    // Remaining plain text after last link
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

      // ✅ Check if this non-link segment starts a formatting marker
      // and the closing marker comes after the link
      const boldMatch = textWithNoLink.match(/^(.*)\*([^*]*)$/);
      const italicMatch = textWithNoLink.match(/^(.*)_([^_]*)$/);
      const strikeMatch = textWithNoLink.match(/^(.*)~([^~]*)$/);

      const orderedPrefix = textWithNoLink.match(/^([\s\S]*?\n|)((\d+)\.\s+)$/);
      const bulletPrefix = textWithNoLink.match(/^([\s\S]*?\n|)([-*]\s+)$/);

      const charAfter = match.lastIndex < text.length ? text[match.lastIndex] : '';

      if (orderedPrefix) {
        // Push everything before the list prefix as normal
        if (orderedPrefix[1]) {
          results.push(
            renderNonLink({ text: orderedPrefix[1], isGroup, isConvoListItem, key: count++ })
          );
        }
        // Render the list item WITH the link inline
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
        // Push text before the opening *
        if (boldMatch[1]) {
          results.push(
            renderNonLink({ text: boldMatch[1], isGroup, isConvoListItem, key: count++ })
          );
        }
        // The inner text before the URL (e.g. "dev ")
        const innerBefore = boldMatch[2];
        const innerText = innerBefore + match.text;
        results.push(renderFormattedInner(innerText, 'strong', count++));
        last = match.lastIndex + 1; // skip closing *
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

const renderFormatted: RenderTextCallbackType = ({ text, key, isConvoListItem }) => {
  return <span key={key}>{renderMarkdownBlocks(text, isConvoListItem)}</span>;
};
const isValidBoundary = (text: string, start: number, end: number) => {
  const before = start === 0 ? '' : text[start - 1];
  const after = end >= text.length ? '' : text[end];

  // ✅ Add formatting markers as valid boundaries
  const boundaryRegex = /[\s.,!?()[\]{}"'`*_~]/;

  const isStartValid = start === 0 || boundaryRegex.test(before);
  const isEndValid = end === text.length || boundaryRegex.test(after);

  return isStartValid && isEndValid;
};

// export const formatText = (text: string, isConvoListItem?: boolean): (string | JSX.Element)[] => {
//   const parts: (string | JSX.Element)[] = [];

//   // ✅ Supports multiple symbols on both sides
//   // it allow to multiple line code block support like ```code```
//   // const regex = /(```[\s\S]*?```|`[^`]+`|\*+[^*]+\*+|_+[^_]+_+|~+[^~]+~+)/g;
//   const regex = /(`[^`]+`|\*+[^*]+\*+|_+[^_]+_+|~+[^~]+~+)/g;

//   let lastIndex = 0;
//   let match;

//   while ((match = regex.exec(text)) !== null) {
//     // Push normal text
//     if (match.index > lastIndex) {
//       parts.push(text.slice(lastIndex, match.index));
//     }

//     const token = match[0];
//     const start = match.index;
//     const end = regex.lastIndex;

//     // 🚫 Skip formatting if not valid boundary
//     if (!isValidBoundary(text, start, end)) {
//       parts.push(token);
//       lastIndex = regex.lastIndex;
//       continue;
//     }
//     // ✅ NEW: empty content check
//     const inner = token.slice(1, -1);
//     if (!inner || inner.trim().length === 0) {
//       parts.push(token);
//       lastIndex = regex.lastIndex;
//       continue;
//     }

//     // =========================
//     // 🔹 BLOCK CODE ```
//     // =========================
//     // if (token.startsWith('```')) {
//     //   const content = token.slice(3, -3);

//     //   if (!content.trim()) {
//     //     lastIndex = regex.lastIndex;
//     //     continue;
//     //   }

//     //   if (isConvoListItem) {
//     //     parts.push(
//     //       <code key={match.index} className="inline-code">
//     //         {content}
//     //       </code>
//     //     );
//     //   } else {
//     //     parts.push(
//     //       <pre key={match.index} className="code-block">
//     //         <code>{content}</code>
//     //       </pre>
//     //     );
//     //   }
//     // }

//     // =========================
//     // 🔹 INLINE CODE `
//     // =========================
//      if (token.startsWith('`')) {
//       const content = token.slice(1, -1);

//       parts.push(
//         <code key={match.index} className="inline-code">
//           {content}
//         </code>
//       );
//     }

//     // =========================
//     // 🔹 BOLD (*)
//     // =========================
//     else if (token.startsWith('*')) {
//       const content = token.substring(1, token.length - 1);

//       parts.push(<strong key={match.index}>{formatText(content, isConvoListItem)}</strong>);
//     }

//     // =========================
//     // 🔹 ITALIC (_)
//     // =========================
//     else if (token.startsWith('_')) {
//       const content = token.substring(1, token.length - 1);

//       parts.push(<em key={match.index}>{formatText(content, isConvoListItem)}</em>);
//     }

//     // =========================
//     // 🔹 STRIKETHROUGH (~)
//     // =========================
//     else if (token.startsWith('~')) {
//       const content = token.substring(1, token.length - 1);

//       parts.push(<del key={match.index}>{formatText(content, isConvoListItem)}</del>);
//     }

//     lastIndex = regex.lastIndex;
//   }

//   // Push remaining text
//   if (lastIndex < text.length) {
//     parts.push(text.slice(lastIndex));
//   }

//   return parts;
// };

export const formatText = (
  text: string,
  isConvoListItem?: boolean,
  parentKey: string = 'root'
): (string | JSX.Element)[] => {
  const parts: (string | JSX.Element)[] = [];

  // ✅ Strict regex — each marker only matches its own closing marker, no crossing
  const regex = /(\*([^*]+)\*|_([^_]+)_|~([^~]+)~)/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Plain text before match
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index);
      parts.push(<span key={`${parentKey}-txt-${lastIndex}`}>{plainText}</span>);
    }

    const token = match[0];
    const start = match.index;
    const end = regex.lastIndex;
    const currentKey = `${parentKey}-${start}`;

    if (!isValidBoundary(text, start, end)) {
      parts.push(<span key={`${currentKey}-invalid`}>{token}</span>);
      lastIndex = regex.lastIndex;
      continue;
    }

    // ✅ Inline code `
    if (token.startsWith('`')) {
      const inner = token.slice(1, -1);
      if (!inner.trim()) {
        parts.push(<span key={`${currentKey}-empty`}>{token}</span>);
      } else {
        parts.push(
          <code key={currentKey} className="inline-code">
            {inner}
          </code>
        );
      }
    }

    // ✅ Bold *
    else if (token.startsWith('*')) {
      const inner = match[2]; // captured group — no asterisks
      if (!inner || !inner.trim()) {
        parts.push(<span key={`${currentKey}-empty`}>{token}</span>);
      } else {
        parts.push(
          <strong key={currentKey}>{formatText(inner, isConvoListItem, currentKey)}</strong>
        );
      }
    }

    // ✅ Italic _
    else if (token.startsWith('_')) {
      const inner = match[3]; // captured group — no underscores
      if (!inner || !inner.trim()) {
        parts.push(<span key={`${currentKey}-empty`}>{token}</span>);
      } else {
        parts.push(<em key={currentKey}>{formatText(inner, isConvoListItem, currentKey)}</em>);
      }
    }

    // ✅ Strikethrough ~
    else if (token.startsWith('~')) {
      const inner = match[4]; // captured group — no tildes
      if (!inner || !inner.trim()) {
        parts.push(<span key={`${currentKey}-empty`}>{token}</span>);
      } else {
        parts.push(<del key={currentKey}>{formatText(inner, isConvoListItem, currentKey)}</del>);
      }
    }

    lastIndex = regex.lastIndex;
  }

  // Remaining trailing text
  if (lastIndex < text.length) {
    parts.push(<span key={`${parentKey}-txt-end`}>{text.slice(lastIndex)}</span>);
  }

  return parts;
};
export const renderMarkdownBlocks = (text: string, isConvoListItem?: boolean): JSX.Element[] => {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks: JSX.Element[] = [];

  let currentListItems: JSX.Element[] = [];
  let currentListType: 'ul' | 'ol' | null = null;
  let listStartIndex = 1;

  // 🔥 NEW: State trackers for multiline code blocks
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

    // 🔥 NEW: Catch Multi-line Code Block bounds
    // if (line.trim().startsWith('```') && !isConvoListItem) {
    //   if (inCodeBlock) {
    //     // Close the block
    //     blocks.push(
    //       <pre key={`pre-${i}`} className="code-block">
    //         <code>{codeBlockContent.join('\n')}</code>
    //       </pre>
    //     );
    //     inCodeBlock = false;
    //     codeBlockContent = [];
    //   } else {
    //     // Open the block
    //     pushPendingList();
    //     inCodeBlock = true;
    //   }
    //   continue;
    // }

    // 🔥 NEW: If we are inside a code block, just store the text and skip other parsing
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Check for unordered list item (- or *)
    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      if (currentListType === 'ol') pushPendingList();
      currentListType = 'ul';
      currentListItems.push(
        <li key={`li-${i}`}>{formatText(bulletMatch[1], isConvoListItem, `li-${i}`)}</li>
      );
      continue;
    }

    // Check for ordered list item (1., 2., etc)
    const numberMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberMatch) {
      if (currentListType === 'ul') pushPendingList();
      if (currentListItems.length === 0) listStartIndex = parseInt(numberMatch[1], 10);
      currentListType = 'ol';
      currentListItems.push(
        <li key={`li-${i}`}>{formatText(numberMatch[2], isConvoListItem, `li-${i}`)}</li>
      );
      continue;
    }

    pushPendingList();

    // Check for blockquote (> quote)
    // const quoteMatch = line.match(/^>\s+(.*)/);
    // if (quoteMatch) {
    //   if (isConvoListItem) {
    //     blocks.push(<span key={`quote-${i}`}> {window.i18n('quoteMessage')} </span>);
    //     continue;
    //   }
    //   blocks.push(
    //     <blockquote key={`quote-${i}`} className="markdown-quote">
    //       {formatText(quoteMatch[1], false, `quote-${i}`)}
    //     </blockquote>
    //   );
    //   continue;
    // }

    // Standard paragraph or empty line
    if (line.trim() === '') {
      blocks.push(<br key={`br-${i}`} />);
    } else {
      blocks.push(
        // <p key={`p-${i}`} className="markdown-p">
        <>{formatText(line, false, `p-${i}`)}</>
        // </p>
      );
    }
  }

  // Flush any open blocks at the end of the text
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
