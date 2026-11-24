import { $createTextNode, $isTextNode, LexicalNode, TextNode } from 'lexical';

// Links typed with the formatting toolbar (Figma 5773:7369 "Add link"): a token text node (it moves,
// deletes and keeps its formats as one piece) that carries its address in a CSS custom property of its
// style. It is sent as markdown, [text](https://address), which the chat renders as a link.
const LINK_PROPERTY = '--bchat-link';

/** Holds the caret inside an empty bold / italic / ... run until a letter is typed; never sent. */
export const ZERO_WIDTH_SPACE = '\u200B';

export const stripZeroWidth = (text: string) => text.replace(/\u200B/g, '');

export const $isLinkTextNode = (node: LexicalNode | null | undefined): boolean =>
  $isTextNode(node) && (node.getStyle() || '').includes(`${LINK_PROPERTY}:`);

export const getLinkUrl = (node: TextNode): string => {
  const match = (node.getStyle() || '').match(new RegExp(`${LINK_PROPERTY}:\\s*([^;]+)`));
  if (!match) {
    return '';
  }
  try {
    return decodeURIComponent(match[1].trim());
  } catch (e) {
    return match[1].trim();
  }
};

/** "bchat.link/x" -> "https://bchat.link/x"; an address with its own scheme is kept as it is. */
export const normalizeLinkUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }
  return /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export const $createLinkTextNode = (text: string, url: string): TextNode =>
  $createTextNode(text)
    .setMode('token')
    .setStyle(
      `${LINK_PROPERTY}: ${encodeURIComponent(url)}; color: var(--composer-link); text-decoration: underline;`
    );

/** The markdown a link node is sent as. */
export const serializeLinkTextNode = (node: TextNode) =>
  `[${stripZeroWidth(node.getTextContent())}](${getLinkUrl(node)})`;
