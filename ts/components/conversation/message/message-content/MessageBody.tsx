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
const renderFormattedFirst: RenderTextCallbackType = ({ text, key, isGroup, isConvoListItem }) => {
  return (
    <span key={key}>
      {renderMarkdownBlocks(text, isConvoListItem).map((part, i) =>
        typeof part === 'string' ? <AddMentions key={i} text={part} isGroup={isGroup} /> : part
      )}
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

  // disable click on <a> elements so clicking a message containing a link doesn't
  // select the message. The link will still be opened in the browser.
  const handleClick = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const url = e.target.href;

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

  if (matchData.length === 0) {
    return renderNonLink({ text, key: 0, isGroup });
  }

  matchData.forEach((match: { index: number; url: string; lastIndex: number; text: string }) => {
    if (last < match.index) {
      const textWithNoLink = text.slice(last, match.index);
      results.push(renderNonLink({ text: textWithNoLink, isGroup, isConvoListItem, key: count++ }));
    }

    const { url, text: originalText } = match;
    const isLink = SUPPORTED_PROTOCOLS.test(url) && !LinkPreviews.isLinkSneaky(url);
    if (isLink) {
      results.push(
        <a key={count++} href={url} onClick={handleClick}>
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

  // ✅ Allowed boundaries:
  // - start/end of string
  // - whitespace
  // - punctuation / brackets
  const boundaryRegex = /[\s.,!?()[\]{}"'`]/;

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
  // const regex = /(`[^`]+`|\*(?=\S).+\*|_+.+_+|~+.+~+)/g;
  const regex = /(`[^`]+`|\*[\s\S]+\*|_+.+_+|~+.+~+)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 1. Wrap plain text before the match in a keyed span
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

    const inner = token.slice(1, -1);
    if (!inner || inner.trim().length === 0) {
      parts.push(<span key={`${currentKey}-empty`}>{token}</span>);
      lastIndex = regex.lastIndex;
      continue;
    }

    // 🔹 FORMATTING LOGIC
    if (token.startsWith('`')) {
      parts.push(
        <code key={currentKey} className="inline-code">
          {inner}
        </code>
      );
    } else if (token.startsWith('*')) {
      parts.push(
        <strong key={currentKey}>{formatText(inner, isConvoListItem, currentKey)}</strong>
      );
    } else if (token.startsWith('_')) {
      parts.push(<em key={currentKey}>{formatText(inner, isConvoListItem, currentKey)}</em>);
    } else if (token.startsWith('~')) {
      parts.push(<del key={currentKey}>{formatText(inner, isConvoListItem, currentKey)}</del>);
    }

    lastIndex = regex.lastIndex;
  }

  // 2. Wrap the remaining trailing plain text in a keyed span
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
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // Close the block
        blocks.push(
          <pre key={`pre-${i}`} className="code-block">
            <code>{codeBlockContent.join('\n')}</code>
          </pre>
        );
        inCodeBlock = false;
        codeBlockContent = [];
      } else {
        // Open the block
        pushPendingList();
        inCodeBlock = true;
      }
      continue;
    }

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
    const quoteMatch = line.match(/^>\s+(.*)/);
    if (quoteMatch) {
      if(isConvoListItem){
         blocks.push( <span key={`quote-${i}`}> {window.i18n('quoteMessage')} </span>  );
        continue;
      }
      blocks.push(
        <blockquote key={`quote-${i}`} className="markdown-quote">
          {formatText(quoteMatch[1], false, `quote-${i}`)}
        </blockquote>
      );
      continue;
    }

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
