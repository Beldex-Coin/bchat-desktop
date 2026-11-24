import {
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getSelection,
  $isElementNode,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  createCommand,
  ElementNode,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
  PointType,
  RangeSelection,
  TextNode,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createQuoteNode, $isQuoteNode } from '@lexical/rich-text';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { CodeBlockNode } from '../../TextFormatingPlugin';
import {
  $createLinkTextNode,
  $isLinkTextNode,
  normalizeLinkUrl,
  stripZeroWidth,
  ZERO_WIDTH_SPACE,
} from './formatMarks';

// The formatting toolbar, the quick format bar and the shortcuts (Figma Text_Formatting 5773:5729)
// write the same markdown a user can type - *bold* _italic_ ~strike~ `code` - so the message box keeps
// one way of holding formats: TextFormatingPlugin turns the markers into hidden tokens around the
// formatted text, and serializeNode sends them as typed. Lists, quotes and the code block are the
// box's own block nodes.

export type InlineFormat = 'bold' | 'italic' | 'strikethrough' | 'code';

const MARKERS: Record<InlineFormat, string> = {
  bold: '*',
  italic: '_',
  strikethrough: '~',
  code: '`',
};

export type FormatState = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  code: boolean;
  link: boolean;
  number: boolean;
  bullet: boolean;
  quote: boolean;
  codeBlock: boolean;
  hasSelection: boolean;
};

export const EMPTY_FORMAT_STATE: FormatState = {
  bold: false,
  italic: false,
  strikethrough: false,
  code: false,
  link: false,
  number: false,
  bullet: false,
  quote: false,
  codeBlock: false,
  hasSelection: false,
};

/** Opens the Add link popover (LinkDialogPlugin) for the current selection. */
export const OPEN_LINK_DIALOG_COMMAND: LexicalCommand<void> = createCommand('OPEN_LINK_DIALOG');

export const $getCodeBlock = (node: LexicalNode | null): ElementNode | null => {
  let current: LexicalNode | null = node;
  while (current) {
    if (current.getType() === 'codeblock') {
      return current as ElementNode;
    }
    current = current.getParent();
  }
  return null;
};

const $topLevel = (node: LexicalNode): ElementNode | null => {
  try {
    return node.getTopLevelElement() as ElementNode | null;
  } catch (e) {
    return null;
  }
};

const isMarkerToken = (node: LexicalNode | null, marker?: string): node is TextNode =>
  $isTextNode(node) &&
  node.isToken() &&
  !$isLinkTextNode(node) &&
  (marker === undefined ? /^[*_~`]+$/.test(node.getTextContent()) : node.getTextContent() === marker);

/** Text nodes that carry a format of their own (not the hidden markers, not links). */
const $formattableTextNodes = (selection: RangeSelection): Array<TextNode> => {
  if (selection.isCollapsed()) {
    const anchor = selection.anchor.getNode();
    if ($isTextNode(anchor) && !anchor.isToken()) {
      return [anchor];
    }
    // the caret right after an opening marker / before a closing one: the text beside it
    if (isMarkerToken(anchor)) {
      const beside =
        selection.anchor.offset === 0 ? anchor.getPreviousSibling() : anchor.getNextSibling();
      return $isTextNode(beside) && !beside.isToken() ? [beside] : [];
    }
    return [];
  }
  return selection
    .getNodes()
    .filter(
      (n): n is TextNode =>
        $isTextNode(n) && !n.isToken() && stripZeroWidth(n.getTextContent()).trim() !== ''
    );
};

export const $getFormatState = (): FormatState => {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return EMPTY_FORMAT_STATE;
  }
  const anchor = selection.anchor.getNode();
  const top = $topLevel(anchor);
  const textNodes = $formattableTextNodes(selection);
  const has = (format: InlineFormat) =>
    textNodes.length > 0 && textNodes.every(n => n.hasFormat(format));

  return {
    bold: has('bold'),
    italic: has('italic'),
    strikethrough: has('strikethrough'),
    code: has('code'),
    link: selection.isCollapsed()
      ? $isLinkTextNode(anchor)
      : selection.getNodes().some(n => $isLinkTextNode(n)),
    number: $isListNode(top) && top.getListType() === 'number',
    bullet: $isListNode(top) && top.getListType() === 'bullet',
    quote: $isQuoteNode(top),
    codeBlock: !!$getCodeBlock(anchor),
    hasSelection: !selection.isCollapsed(),
  };
};

/* ---------------------------------------------------------------------------------------------- */
/* offsets inside one block (paragraph, list item, quote)                                          */
/* ---------------------------------------------------------------------------------------------- */

type Piece = { node: LexicalNode; start: number; end: number };

const $blockPieces = (block: ElementNode): Array<Piece> => {
  const pieces: Array<Piece> = [];
  let offset = 0;
  block.getChildren().forEach(child => {
    const size = child.getTextContentSize();
    pieces.push({ node: child, start: offset, end: offset + size });
    offset += size;
  });
  return pieces;
};

const $pointOffset = (block: ElementNode, pieces: Array<Piece>, point: PointType): number | null => {
  const node = point.getNode();
  if (point.type === 'element' && node.is(block)) {
    const piece = pieces[point.offset];
    return piece ? piece.start : pieces.length ? pieces[pieces.length - 1].end : 0;
  }
  const piece = pieces.find(p => p.node.is(node));
  return piece ? piece.start + point.offset : null;
};

const $blockOf = (point: PointType): ElementNode | null => {
  const node = point.getNode();
  if ($isElementNode(node) && !node.isInline()) {
    return node;
  }
  const parent = node.getParent();
  return parent && $isElementNode(parent) ? parent : null;
};

/** Puts the selection on [start, end) of the block's text. */
const $selectBlockRange = (block: ElementNode, start: number, end: number) => {
  const pieces = $blockPieces(block);
  const locate = (offset: number) => {
    for (const p of pieces) {
      if ($isTextNode(p.node) && offset >= p.start && offset <= p.end) {
        return { key: p.node.getKey(), offset: offset - p.start, type: 'text' as const };
      }
    }
    return { key: block.getKey(), offset: block.getChildrenSize(), type: 'element' as const };
  };
  const a = locate(start);
  const f = locate(end);
  const selection = $createRangeSelection();
  selection.anchor.set(a.key, a.offset, a.type);
  selection.focus.set(f.key, f.offset, f.type);
  $setSelection(selection);
  return selection;
};

/* ---------------------------------------------------------------------------------------------- */
/* bold / italic / strikethrough / inline code                                                     */
/* ---------------------------------------------------------------------------------------------- */

const $applyInlineFormat = (selection: RangeSelection, format: InlineFormat) => {
  const marker = MARKERS[format];
  const block = $blockOf(selection.anchor);
  if (!block || !block.is($blockOf(selection.focus))) {
    return; // formats stay within one line / list item
  }
  const pieces = $blockPieces(block);
  const anchorOffset = $pointOffset(block, pieces, selection.anchor);
  const focusOffset = $pointOffset(block, pieces, selection.focus);
  if (anchorOffset === null || focusOffset === null) {
    return;
  }
  let start = Math.min(anchorOffset, focusOffset);
  let end = Math.max(anchorOffset, focusOffset);
  // links and mentions are kept whole: no marker inside one
  const isWhole = (p: Piece) => !$isTextNode(p.node) || $isLinkTextNode(p.node);
  if (start !== end && pieces.some(p => isWhole(p) && p.start < end && p.end > start)) {
    return;
  }
  const full = pieces.map(p => p.node.getTextContent()).join('');
  const isWord = (ch: string | undefined) => !!ch && /\w/.test(ch);

  if (start === end) {
    // typing with the format on (Figma 5773:6500): an empty marked run with the caret in it - a
    // zero-width space holds its place until a letter is typed
    const needsSpace = isWord(full[start - 1]);
    $selectBlockRange(block, start, end).insertText(
      `${needsSpace ? ' ' : ''}${marker}${ZERO_WIDTH_SPACE}${marker}`
    );
    const caret = start + (needsSpace ? 1 : 0) + marker.length + 1;
    $selectBlockRange(block, caret, caret);
    return;
  }

  // markers only work on whole words (as when they are typed): widen the selection to them
  while (start > 0 && isWord(full[start - 1]) && isWord(full[start])) {
    start--;
  }
  while (end < full.length && isWord(full[end]) && isWord(full[end - 1])) {
    end++;
  }
  const chosen = full.slice(start, end);
  const core = chosen.trim();
  if (!core) {
    return;
  }
  const lead = chosen.slice(0, chosen.indexOf(core));
  const trail = chosen.slice(chosen.indexOf(core) + core.length);
  $selectBlockRange(block, start, end).insertText(`${lead}${marker}${core}${marker}${trail}`);
};

/** The hidden markers around a formatted text node: the nearest ones of that format on each side. */
const $markersAround = (node: TextNode, marker: string): [TextNode | null, TextNode | null] => {
  let before: LexicalNode | null = node.getPreviousSibling();
  while (before && !isMarkerToken(before, marker)) {
    before = before.getPreviousSibling();
  }
  let after: LexicalNode | null = node.getNextSibling();
  while (after && !isMarkerToken(after, marker)) {
    after = after.getNextSibling();
  }
  return [before as TextNode | null, after as TextNode | null];
};

const $removeInlineFormat = (selection: RangeSelection, format: InlineFormat) => {
  const textNodes = $formattableTextNodes(selection).filter(n => n.hasFormat(format));
  if (!textNodes.length) {
    return;
  }
  const markersFor = (n: TextNode) => {
    const style = n.getStyle() || '';
    const marker =
      format === 'code' && style.includes('data-triple-backtick: true') ? '```' : MARKERS[format];
    return $markersAround(n, marker);
  };

  if (selection.isCollapsed()) {
    const node = textNodes[0];
    const [open, close] = markersFor(node);
    if (!open || !close) {
      return;
    }
    // nothing typed in the run yet: the run goes away
    let between: LexicalNode | null = open.getNextSibling();
    let isEmpty = true;
    while (between && !between.is(close)) {
      if (!isMarkerToken(between) && stripZeroWidth(between.getTextContent()) !== '') {
        isEmpty = false;
      }
      between = between.getNextSibling();
    }
    if (isEmpty) {
      const place = $createTextNode('');
      open.insertBefore(place);
      let n: LexicalNode | null = open;
      while (n) {
        const next: LexicalNode | null = n.is(close) ? null : n.getNextSibling();
        n.remove();
        n = next;
      }
      place.select(0, 0);
      return;
    }
    // text in the run: carry on typing after it, without the format
    const after = $createTextNode(ZERO_WIDTH_SPACE);
    close.insertAfter(after);
    after.select(1, 1);
    return;
  }

  const markers = new Set<TextNode>();
  const formatted = new Set<TextNode>();
  textNodes.forEach(n => {
    const [open, close] = markersFor(n);
    if (open && close) {
      markers.add(open);
      markers.add(close);
      // the whole run between them loses the format (this also has the box re-read the line)
      let between: LexicalNode | null = open.getNextSibling();
      while (between && !between.is(close)) {
        if ($isTextNode(between) && !between.isToken() && between.hasFormat(format)) {
          formatted.add(between);
        }
        between = between.getNextSibling();
      }
    }
  });
  const last = textNodes[textNodes.length - 1];
  markers.forEach(m => m.remove());
  formatted.forEach(n => n.toggleFormat(format));
  if (last.isAttached()) {
    last.selectEnd();
  }
};

export const $toggleInlineFormat = (format: InlineFormat) => {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || $getCodeBlock(selection.anchor.getNode())) {
    return;
  }
  if ($getFormatState()[format]) {
    $removeInlineFormat(selection, format);
  } else {
    $applyInlineFormat(selection, format);
  }
};

/* ---------------------------------------------------------------------------------------------- */
/* lists, quote, code block                                                                        */
/* ---------------------------------------------------------------------------------------------- */

export const $toggleList = (editor: LexicalEditor, type: 'number' | 'bullet') => {
  const state = $getFormatState();
  if (state.codeBlock) {
    return;
  }
  if (state[type]) {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(
      type === 'number' ? INSERT_ORDERED_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
      undefined
    );
  }
};

export const $toggleQuote = () => {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || $getCodeBlock(selection.anchor.getNode())) {
    return;
  }
  const isQuote = $getFormatState().quote;
  $setBlocksType(selection, () => (isQuote ? $createParagraphNode() : $createQuoteNode()));
};

export const $toggleCodeBlock = () => {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }
  const anchor = selection.anchor.getNode();
  const codeBlock = $getCodeBlock(anchor);
  if (codeBlock) {
    // back to a plain line, its text kept
    const paragraph = $createParagraphNode();
    codeBlock.getChildren().forEach(child => paragraph.append(child));
    codeBlock.replace(paragraph);
    paragraph.selectEnd();
    return;
  }
  const top = $topLevel(anchor);
  const box = new CodeBlockNode();
  if (top && $isParagraphNode(top)) {
    // the line becomes the code: its text as typed, markers included
    const text = stripZeroWidth(top.getTextContent());
    if (text) {
      box.append($createTextNode(text));
    }
    top.replace(box);
    box.selectEnd();
  } else if (top) {
    // an empty list item / quote line is replaced by the box, otherwise it goes under the block
    const line = anchor.getType() === 'listitem' || $isQuoteNode(anchor) ? anchor : anchor.getParent();
    if (line && $isElementNode(line) && line.getTextContent() === '' && !line.is(top)) {
      line.remove();
      if (top.getChildrenSize() === 0) {
        top.replace(box);
      } else {
        top.insertAfter(box);
      }
    } else if (line && line.is(top) && top.getTextContent() === '') {
      top.replace(box);
    } else {
      top.insertAfter(box);
    }
    box.select(0, 0);
  }
};

/* ---------------------------------------------------------------------------------------------- */
/* links                                                                                           */
/* ---------------------------------------------------------------------------------------------- */

/** The selected text without the hidden markers (the Add link popover's TEXT field). */
export const $getSelectedPlainText = (): string => {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || selection.isCollapsed()) {
    return '';
  }
  const block = $blockOf(selection.anchor);
  if (!block || !block.is($blockOf(selection.focus))) {
    return stripZeroWidth(selection.getTextContent()).trim();
  }
  const pieces = $blockPieces(block);
  const a = $pointOffset(block, pieces, selection.anchor);
  const f = $pointOffset(block, pieces, selection.focus);
  if (a === null || f === null) {
    return '';
  }
  const [start, end] = [Math.min(a, f), Math.max(a, f)];
  const text = pieces
    .filter(p => !isMarkerToken(p.node) && p.end > start && p.start < end)
    .map(p =>
      p.node.getTextContent().slice(Math.max(0, start - p.start), Math.min(p.end, end) - p.start)
    )
    .join('');
  return stripZeroWidth(text).trim();
};

export const $insertLink = (saved: RangeSelection | null, text: string, url: string) => {
  const href = normalizeLinkUrl(url);
  const label = text.trim() || href;
  if (!href) {
    return;
  }
  if (saved) {
    $setSelection(saved.clone());
  }
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || $getCodeBlock(selection.anchor.getNode())) {
    return;
  }
  const link = $createLinkTextNode(label, href);
  selection.insertNodes([link]);
  // a plain space after it to carry on typing
  const next = link.getNextSibling();
  if ($isTextNode(next) && !next.isToken() && next.getTextContent().startsWith(' ')) {
    next.select(1, 1);
  } else {
    const space = $createTextNode(' ');
    link.insertAfter(space);
    space.select(1, 1);
  }
};

/** The link under the caret becomes plain text again. */
export const $removeLink = () => {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }
  const links = (selection.isCollapsed()
    ? [selection.anchor.getNode()]
    : selection.getNodes()
  ).filter(n => $isLinkTextNode(n)) as Array<TextNode>;
  let lastText: TextNode | null = null;
  links.forEach(link => {
    const plain = $createTextNode(link.getTextContent());
    link.replace(plain);
    lastText = plain;
  });
  if (lastText) {
    (lastText as TextNode).selectEnd();
  }
};
