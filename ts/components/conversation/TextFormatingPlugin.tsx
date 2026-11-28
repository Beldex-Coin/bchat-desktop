import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  TextFormatType,
  TextNode,
  LexicalNode,
  COMMAND_PRIORITY_HIGH,
  KEY_ENTER_COMMAND,
  ElementNode,
  // $applyNodeReplacement,
  $createParagraphNode,
  KEY_BACKSPACE_COMMAND,
  // INSERT_LINE_BREAK_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  KEY_SPACE_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  PASTE_COMMAND,
  SerializedElementNode,
  ParagraphNode,
  $isTextNode,
  $isElementNode,
  DELETE_CHARACTER_COMMAND,
  DELETE_WORD_COMMAND,
  RangeSelection,
} from 'lexical';

import { $createQuoteNode, QuoteNode } from '@lexical/rich-text';
import { $createListNode, $createListItemNode, $isListItemNode, ListItemNode } from '@lexical/list';
import {
  $isLinkTextNode,
  isHiddenMarker,
  stripZeroWidth,
  ZERO_WIDTH_SPACE,
} from './composition/formatting/formatMarks';

// function $createCodeBlockNode() {
//   return $applyNodeReplacement(new CodeBlockNode());
// }

// the markdown markers around formatted text (*bold* _italic_ ~strike~ `code`) stay in the text - they
// are what is sent - but take no room in the box (Figma 5773:6500: "6:30 PM sharp" shows bold,
// without its asterisks)
const $createMarkerToken = (marker: string) =>
  $createTextNode(marker).setMode('token').setStyle('font-size: 0;');


/**
 * A line left with only hidden markers (its formatted text deleted) gets them removed - otherwise the
 * caret sits on zero-size markers (invisible) and what is typed next lands among them.
 */
const $dropOrphanMarkers = (element: ElementNode) => {
  // a formatted word deleted whole (word delete, cut) leaves its two markers side by side - they go
  // too, or they would show up as "**"
  element.getChildren().forEach(child => {
    if (!child.isAttached() || !isHiddenMarker(child)) {
      return;
    }
    const next = child.getNextSibling();
    if (isHiddenMarker(next) && next.getTextContent() === child.getTextContent()) {
      const selection = $getSelection();
      const holder =
        $isRangeSelection(selection) &&
        (child.is(selection.anchor.getNode()) || next.is(selection.anchor.getNode()));
      const prev = child.getPreviousSibling();
      next.remove();
      child.remove();
      if (holder) {
        if ($isTextNode(prev)) {
          prev.selectEnd();
        } else {
          element.select(0, 0);
        }
      }
    }
  });
  const children = element.getChildren();
  if (!children.length || !children.every(child => isHiddenMarker(child))) {
    return;
  }
  const selection = $getSelection();
  const caretHere =
    $isRangeSelection(selection) &&
    children.some(child => child.is(selection.anchor.getNode()) || child.is(selection.focus.getNode()));
  children.forEach(child => child.remove());
  if (caretHere || ($isRangeSelection(selection) && selection.anchor.getNode().is(element))) {
    element.select(0, 0);
    // and what is typed next starts plain (not the deleted text's bold / italic)
    const fresh = $getSelection();
    if ($isRangeSelection(fresh)) {
      fresh.setFormat(0);
      fresh.setStyle('');
    }
  }
};

/**
 * Deleting next to a hidden marker deletes the letter beside it instead: the caret is moved past the
 * markers (and an empty caret placeholder) in the direction of the delete. A bold word's markers are
 * never deleted one at a time, so it can't turn back into "*word" with a stray asterisk.
 */
const $skipMarkersForDelete = (selection: RangeSelection, isBackward: boolean): TextNode | null => {
  if (!selection.isCollapsed()) {
    return null;
  }
  const { anchor } = selection;
  const node = anchor.getNode();
  let side: LexicalNode | null = null;
  if (isHiddenMarker(node)) {
    side = isBackward
      ? anchor.offset === node.getTextContentSize()
        ? node
        : null
      : anchor.offset === 0
      ? node
      : null;
  } else if ($isTextNode(node)) {
    const text = node.getTextContent();
    const passed = isBackward ? text.slice(0, anchor.offset) : text.slice(anchor.offset);
    if (stripZeroWidth(passed) === '') {
      side = isBackward ? node.getPreviousSibling() : node.getNextSibling();
    }
  } else if ($isElementNode(node)) {
    side = node.getChildAtIndex(isBackward ? anchor.offset - 1 : anchor.offset);
  }
  if (!isHiddenMarker(side)) {
    return null;
  }
  let letter: LexicalNode | null = side;
  while (letter && isHiddenMarker(letter)) {
    letter = isBackward ? letter.getPreviousSibling() : letter.getNextSibling();
  }
  const target = letter as LexicalNode | null;
  if ($isTextNode(target) && !target.isToken()) {
    if (isBackward) {
      target.selectEnd();
    } else {
      target.select(0, 0);
    }
    return target;
  }
  return null;
};

/** Deletes one character (a whole emoji) at the end / start of `node`, keeping the caret there. */
const $deleteCharAtEdge = (node: TextNode, isBackward: boolean) => {
  const chars = Array.from(node.getTextContent());
  if (isBackward) {
    chars.pop();
  } else {
    chars.shift();
  }
  const text = chars.join('');
  if (!text) {
    const prev = node.getPreviousSibling();
    const next = node.getNextSibling();
    node.remove();
    if (isBackward && $isTextNode(prev)) {
      prev.selectEnd();
    } else if ($isTextNode(next)) {
      next.select(0, 0);
    }
    return;
  }
  node.setTextContent(text);
  if (isBackward) {
    node.selectEnd();
  } else {
    node.select(0, 0);
  }
};

/**
 * Puts the caret at `offset` in `node` - but never on a hidden (zero-size) marker, where it can't be
 * seen: just after closing markers it goes to the text after them (or a placeholder made for it, so
 * typing carries on plain after the bold word); just before opening markers, to the text before.
 */
const $placeCaret = (node: TextNode, offset: number) => {
  if (!isHiddenMarker(node)) {
    (node as TextNode).select(offset, offset);
    return;
  }
  if (offset >= node.getTextContentSize()) {
    let last: TextNode = node;
    let next: LexicalNode | null = node.getNextSibling();
    while (isHiddenMarker(next)) {
      last = next;
      next = next.getNextSibling();
    }
    const after = next as LexicalNode | null;
    if ($isTextNode(after) && !after.isToken()) {
      after.select(0, 0);
      return;
    }
    const holder = $createTextNode(ZERO_WIDTH_SPACE);
    last.insertAfter(holder);
    holder.select(1, 1);
    return;
  }
  let prev: LexicalNode | null = node.getPreviousSibling();
  while (isHiddenMarker(prev)) {
    prev = prev.getPreviousSibling();
  }
  const before = prev as LexicalNode | null;
  if ($isTextNode(before) && !before.isToken()) {
    before.selectEnd();
    return;
  }
  node.select(offset, offset);
};

/** The code block (``` box) this node sits in, if any. */
const MARKER_FORMATS: Record<string, TextFormatType> = {
  '*': 'bold',
  _: 'italic',
  '~': 'strikethrough',
  '`': 'code',
};

/**
 * A new line typed inside bold / italic / strike text keeps the format: this line's markers are
 * closed at the caret and the new line opens the same ones again, so the text typed on it is
 * formatted too ("*hi aravind*" / "*next line*"). Returns false when the caret is not in such text.
 */
const $newLineInFormattedRun = (selection: RangeSelection): boolean => {
  if (!selection.isCollapsed()) {
    return false;
  }
  const anchorNode = selection.anchor.getNode();
  const { offset } = selection.anchor;
  if (!$isTextNode(anchorNode)) {
    return false;
  }
  const block = anchorNode.getParent();
  if (!$isElementNode(block)) {
    return false;
  }

  // the nodes before / after the caret (a text node with the caret inside is split there)
  const textNode: TextNode = anchorNode;
  let left: LexicalNode | null = null;
  if (isHiddenMarker(anchorNode)) {
    left = offset > 0 ? anchorNode : anchorNode.getPreviousSibling();
  } else if (offset >= textNode.getTextContentSize()) {
    left = textNode;
  } else if (offset <= 0) {
    left = textNode.getPreviousSibling();
  } else {
    [left] = textNode.splitText(offset);
  }

  // markers still open at the caret
  const open: Array<string> = [];
  for (const child of block.getChildren()) {
    if (left === null) {
      break;
    }
    if (isHiddenMarker(child)) {
      const marker = child.getTextContent();
      if (open[open.length - 1] === marker) {
        open.pop();
      } else {
        open.push(marker);
      }
    }
    if (child.is(left)) {
      break;
    }
  }
  if (!open.length) {
    return false;
  }

  // close them on this line...
  let cursor: LexicalNode | null = left;
  const closers = [...open].reverse().map(marker => $createMarkerToken(marker));
  closers.forEach(closer => {
    if (cursor) {
      cursor.insertAfter(closer);
    } else {
      const first = block.getFirstChild();
      if (first) {
        first.insertBefore(closer);
      } else {
        block.append(closer);
      }
    }
    cursor = closer;
  });
  const lastCloser = closers[closers.length - 1];

  // ...and open them again on the new one, before the rest of the text
  const openers = open.map(marker => $createMarkerToken(marker));
  let at: LexicalNode = lastCloser;
  openers.forEach(opener => {
    at.insertAfter(opener);
    at = opener;
  });
  let caretNode: TextNode | null = null;
  const rest = at.getNextSibling();
  if ($isTextNode(rest) && !rest.isToken() && stripZeroWidth(rest.getTextContent()) !== '') {
    caretNode = rest;
  } else {
    // nothing typed yet on the new line: an empty formatted run holds the caret
    const holder = $createTextNode(ZERO_WIDTH_SPACE);
    open.forEach(marker => holder.toggleFormat(MARKER_FORMATS[marker]));
    at.insertAfter(holder);
    caretNode = holder;
  }

  // split the line between the closing and the opening markers
  const splitAt = lastCloser.getIndexWithinParent() + 1;
  block.select(splitAt, splitAt);
  const split = $getSelection();
  if (!$isRangeSelection(split)) {
    return false;
  }
  split.insertParagraph();
  if (caretNode.getTextContent() === ZERO_WIDTH_SPACE) {
    caretNode.select(1, 1);
  } else {
    caretNode.select(0, 0);
  }
  return true;
};

const $getCodeBlock = (node: LexicalNode | null): ElementNode | null => {
  let current: LexicalNode | null = node;
  while (current) {
    if (current.getType() === 'codeblock') {
      return current as ElementNode;
    }
    current = current.getParent();
  }
  return null;
};

// a code block with nothing typed in it grows to 3 empty rows at most: the next new line (Enter or
// Shift+Enter) takes the caret out - the empty box goes back to a plain empty line (like Slack), so a
// box opened by mistake can be left without reaching for the toolbar
const EMPTY_CODE_BLOCK_MAX_ROWS = 3;
const $closeEmptyCodeBlock = (codeBlock: ElementNode): boolean => {
  if (codeBlock.getTextContent().replace(/[\n\u200B]/g, '').trim() !== '') {
    return false;
  }
  const rows = codeBlock.getChildren().filter(child => child.getType() === 'linebreak').length + 1;
  if (rows < EMPTY_CODE_BLOCK_MAX_ROWS) {
    return false;
  }
  const paragraph = $createParagraphNode();
  codeBlock.replace(paragraph);
  paragraph.select();
  return true;
};


export default function TextFormatingPlugin({
  onSendMessage,
}: {
  onSendMessage: () => void;
}): null {
  const [editor] = useLexicalComposerContext();
  let isBulletListYmbols = '-';
  useEffect(() => {
    /* ================= AST ENGINE ================= */
    // where the run already has hidden marker tokens (text made bold / italic... before): such a pair
    // stays a pair, even when the text inside now starts or ends with a space ("*word *" while the
    // next word is typed) - it must not fall back to showing its markers
    let lockedMarkers = new Set<number>();
    const processText = (
      text: string,
      currentFormats: TextFormatType[] = [],
      base = 0
    ): TextNode[] => {
      if (!text) return [];

      // 🚫 Do NOT process inside code
      if (currentFormats.includes('code')) {
        const node = $createTextNode(text);
        node.toggleFormat('code');
        return [node];
      }

      const MARKERS = [
        { char: '```', format: 'codeblock', noNest: true },
        { char: '`', format: 'code', noNest: true }, // ✅ Restored Inline Code
        { char: '*', format: 'bold' },
        { char: '_', format: 'italic' },
        { char: '~', format: 'strikethrough' },
      ];

      const isValidBoundary = (
        text: string,
        start: number,
        end: number,
        markerLength: number,
        markerChar: string
      ) => {
        const before = text[start - 1];
        const after = text[end];

        const isStartValid = start === 0 || /[\s]|[^\w\s]/.test(before);
        // the closing marker may be followed straight by more text ("*bold*text"): what is typed
        // after a bold word stays plain and the word stays bold (the message gets a word joiner
        // there, see serializeNode)
        const isEndValid =
          end === text.length || /[\s]|[^\w\s]/.test(after) || /\w/.test(after);

        if (markerChar === '```') {
          return isStartValid && isEndValid;
        }

        // no space just inside the markers ("` code`" stays as typed, like Slack) - inline code too
        const charAfterOpen = text[start + markerLength];
        const charBeforeClose = text[end - markerLength - 1];

        if (/\s/.test(charAfterOpen)) return false;
        if (/\s/.test(charBeforeClose)) return false;

        return isStartValid && isEndValid;
      };

      const findClosingIndex = (text: string, start: number, marker: string) => {
        return text.indexOf(marker, start);
      };
      let bestMatch: { marker: any; start: number; end: number } | null = null;

      for (let i = 0; i < text.length; i++) {
        for (const marker of MARKERS) {
          if (text.startsWith(marker.char, i)) {
            if (marker.char === '`') {
              let backtickCount = 0;
              let scanIdx = i;
              // Count all consecutive backticks at this position
              while (scanIdx >= 0 && text[scanIdx] === '`') {
                backtickCount++;
                scanIdx--;
              }
              scanIdx = i + 1;
              while (scanIdx < text.length && text[scanIdx] === '`') {
                backtickCount++;
                scanIdx++;
              }

              // If it's part of a cluster of 3 or more, ignore it for the single-backtick rule
              if (backtickCount >= 3) {
                continue;
              }
            }

            const startInner = i + marker.char.length;
            let closeIdx = findClosingIndex(text, startInner, marker.char);

            while (closeIdx !== -1) {
              if (marker.char === '`') {
                let closeCount = 0;
                let scanIdx = closeIdx;
                while (scanIdx >= 0 && text[scanIdx] === '`') {
                  closeCount++;
                  scanIdx--;
                }
                scanIdx = closeIdx + 1;
                while (scanIdx < text.length && text[scanIdx] === '`') {
                  closeCount++;
                  scanIdx++;
                }

                if (closeCount >= 3) {
                  // Skip past this entire block of triple backticks and look for the next one
                  closeIdx = text.indexOf(marker.char, closeIdx + closeCount);
                  continue;
                }
              }

              const isLockedPair =
                lockedMarkers.has(base + i) && lockedMarkers.has(base + closeIdx);
              if (
                closeIdx > startInner &&
                (isLockedPair ||
                  isValidBoundary(
                    text,
                    i,
                    closeIdx + marker.char.length,
                    marker.char.length,
                    marker.char
                  ))
              ) {
                if (!bestMatch || i < bestMatch.start) {
                  bestMatch = { marker, start: i, end: closeIdx };
                }
                break; // Found a valid pair, stop searching for this marker
              }
              // Look for the next occurrence
              closeIdx = text.indexOf(marker.char, closeIdx + marker.char.length);
            }
          }
        }
      }
      if (!bestMatch) {
        const node = $createTextNode(text);
        currentFormats.forEach(f => {
          if (!node.hasFormat(f)) node.toggleFormat(f);
        });
        return [node];
      }

      const { marker: earliestMarker, start: firstIndex, end: lastIndex } = bestMatch;
      const nodes: TextNode[] = [];

      if (firstIndex > 0) {
        nodes.push(...processText(text.slice(0, firstIndex), currentFormats, base));
      }

      nodes.push($createMarkerToken(earliestMarker.char));
      const inside = text.slice(firstIndex + earliestMarker.char.length, lastIndex);

      if (earliestMarker.noNest) {
        const node = $createTextNode(inside);
        if (earliestMarker.char === '```') {
          node.toggleFormat('code');
          node.setStyle('font-family: monospace; data-triple-backtick: true;background: none;');
        } else {
          node.toggleFormat(earliestMarker.format);
        }

        currentFormats.forEach(f => node.toggleFormat(f));
        nodes.push(node);
      } else {
        const newFormats = [...currentFormats, earliestMarker.format];
        nodes.push(
          ...processText(inside, newFormats, base + firstIndex + earliestMarker.char.length)
        );
      }

      nodes.push($createMarkerToken(earliestMarker.char));

      const endOfMarker = lastIndex + earliestMarker.char.length;

      if (endOfMarker < text.length) {
        nodes.push(...processText(text.slice(endOfMarker), currentFormats, base + endOfMarker));
      }

      return nodes;
    };

    /* ================= TRANSFORM ================= */
    // text typed right next to a hidden marker takes the marker's zero-size style - it must stay visible
    const removeMarkerStyleLeak = editor.registerNodeTransform(TextNode, node => {
      if (node.isAttached() && !node.isToken() && /font-size:\s*0/.test(node.getStyle() || '')) {
        node.setStyle('');
      }
    });
    // every delete (Backspace / Delete keys, the system's delete input, word delete) skips hidden markers
    const removeDeleteSkip = editor.registerCommand(
      DELETE_CHARACTER_COMMAND,
      (isBackward: boolean) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        const target = $skipMarkersForDelete(selection, isBackward);
        if (!target) {
          return false;
        }
        $deleteCharAtEdge(target, isBackward);
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
    const removeDeleteWordSkip = editor.registerCommand(
      DELETE_WORD_COMMAND,
      (isBackward: boolean) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $skipMarkersForDelete(selection, isBackward);
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
    const removeOrphanParagraph = editor.registerNodeTransform(ParagraphNode, $dropOrphanMarkers);
    const removeOrphanListItem = editor.registerNodeTransform(ListItemNode, $dropOrphanMarkers);
    const removeOrphanQuote = editor.registerNodeTransform(QuoteNode, $dropOrphanMarkers);

    const removeTransform = editor.registerNodeTransform(TextNode, node => {
      if (!node.isAttached()) return;
      if (!node.isSimpleText() || node.isToken()) return;
      if (node.hasFormat('code')) return;

      const parent = node.getParent();
      if (parent?.getType() === 'codeblock') return;

      // the run of text around the node - a link (formatting toolbar) ends it: its text is not
      // markdown and it keeps its own address
      const isRunText = (n: LexicalNode | null) => n instanceof TextNode && !$isLinkTextNode(n);
      let firstNode = node;
      while (isRunText(firstNode.getPreviousSibling())) {
        firstNode = firstNode.getPreviousSibling() as TextNode;
      }

      let lastNode = node;
      while (isRunText(lastNode.getNextSibling())) {
        lastNode = lastNode.getNextSibling() as TextNode;
      }

      const nodes: TextNode[] = [];
      let current: LexicalNode | null = firstNode;
      let fullText = '';
      let hasInlineMarker = false;
      while (current instanceof TextNode) {
        nodes.push(current);
        const text = current.getTextContent();
        fullText += text;

        if (/[*_~`]/.test(text) || current.isToken()) {
          hasInlineMarker = true;
        }

        if (current.is(lastNode)) break;
        current = current.getNextSibling();
      }

      const isFirstChild = firstNode.getPreviousSibling() === null;
      let isBlockMarker = false;

      if (isFirstChild && parent && parent.getType() === 'paragraph') {
        if (/^(>[ \u00A0]|[-*][ \u00A0]|\d+\.[ \u00A0])/.test(fullText)) {
          isBlockMarker = true;
        }
      }

      if (!hasInlineMarker && !isBlockMarker) return;

      /* ================= ``` -> CODE BLOCK ================= */
      // three backticks typed at the end of a line open a code block box under it (like Slack); a
      // closed pair (```code```) on one line stays inline code
      if (
        parent?.getType() === 'paragraph' &&
        lastNode.getNextSibling() === null &&
        !lastNode.isToken() &&
        lastNode.getTextContent().endsWith('```') &&
        !/`{4,}$/.test(fullText) &&
        (fullText.match(/```/g) || []).length === 1
      ) {
        const lastText = lastNode.getTextContent();
        const before = fullText.slice(0, -3);
        const codeBlock = new CodeBlockNode();
        if (before.trim() === '') {
          parent.replace(codeBlock);
        } else {
          if (lastText.length > 3) {
            lastNode.setTextContent(lastText.slice(0, -3));
          } else {
            lastNode.remove();
          }
          parent.insertAfter(codeBlock);
        }
        codeBlock.select(0, 0);
        return;
      }

      const topLevel = firstNode.getTopLevelElement();
      if (topLevel?.getType() === 'list') {
        const list = topLevel;
        const firstItem = list.getFirstChild();

        if ($isListItemNode(firstItem)) {
          const text = firstItem.getTextContent();
          if (/^$/.test(text)) {
            const raw = isBulletListYmbols + '  '; // "*  "

            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(raw));

            list.replace(paragraph);
            paragraph.selectEnd();
            return;
          }
        }
      }

      if (topLevel?.getType() === 'quote') {
        const text = topLevel.getTextContent();
        if (text === '') {
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode('>  '));

          topLevel.replace(paragraph);
          paragraph.selectEnd();
          return;
        }
      }

      /* ================= BLOCK AST (Optimized) ================= */
      if (isBlockMarker && parent?.getType() === 'paragraph') {
        let newBlockNode = null;

        if (
          /^[-*][ \u00A0]{2,}/.test(fullText) || // *  or -
          /^\d+\.[ \u00A0]{2,}/.test(fullText) || // 1.
          /^>[ \u00A0]{2,}/.test(fullText) // >
        ) {
          return;
        }

        const bulletMatch = fullText.match(/^([-*])[ \u00A0]([\s\S]*)$/);
        const numberMatch = fullText.match(/^(\d+)\.[ \u00A0]([\s\S]*)$/);
        const quoteMatch = fullText.match(/^>[ \u00A0]([\s\S]*)$/);

        // 🚫 Ensure NOT double space again (extra safety)
        const isValidBullet = bulletMatch && !/^[\u00A0 ]/.test(bulletMatch[2]);

        const isValidNumber = numberMatch && !/^[\u00A0 ]/.test(numberMatch[2]);

        const isValidQuote = quoteMatch && !/^[\u00A0 ]/.test(quoteMatch[1]);

        if (isValidQuote) {
          newBlockNode = $createQuoteNode();
          newBlockNode.append($createTextNode(quoteMatch[1]));
        } else if (isValidBullet) {
          isBulletListYmbols = bulletMatch[1];

          newBlockNode = $createListNode('bullet');
          const li = $createListItemNode();
          li.append($createTextNode(bulletMatch[2]));
          newBlockNode.append(li);
        } else if (isValidNumber) {
          const num = numberMatch[1];
          isBulletListYmbols = `${num}.`;

          newBlockNode = $createListNode('number');
          newBlockNode.setStart(parseInt(num, 10));

          const li = $createListItemNode();
          li.append($createTextNode(numberMatch[2]));
          newBlockNode.append(li);
        }

        if (!newBlockNode) return;

        const prevSibling = parent.getPreviousSibling();

        if (prevSibling && prevSibling.getType() === 'list' && newBlockNode.getType() === 'list') {
          const prevList = prevSibling as any;
          const newList = newBlockNode as any;

          if (prevList.getListType() === newList.getListType()) {
            newList.getChildren().forEach((item: LexicalNode) => {
              prevList.append(item);
            });

            parent.remove();
            prevList.selectEnd();
            return;
          }
        }

        parent.replace(newBlockNode);
        newBlockNode.selectEnd();
        return;
      }

      /* ================= INLINE AST ================= */
      lockedMarkers = new Set<number>();
      let markerOffset = 0;
      nodes.forEach(n => {
        if (isHiddenMarker(n)) {
          lockedMarkers.add(markerOffset);
        }
        markerOffset += n.getTextContentSize();
      });
      const astNodes = processText(fullText);
      lockedMarkers = new Set<number>();
      let isDifferent = nodes.length !== astNodes.length;

      if (!isDifferent) {
        for (let i = 0; i < nodes.length; i++) {
          if (
            nodes[i].getTextContent() !== astNodes[i].getTextContent() ||
            nodes[i].getFormat() !== astNodes[i].getFormat() ||
            nodes[i].getMode() !== astNodes[i].getMode()
          ) {
            isDifferent = true;
            break;
          }
        }
      }

      if (!isDifferent) return;

      const selection = $getSelection();
      let absoluteOffset = -1;

      if ($isRangeSelection(selection) && selection.isCollapsed()) {
        const anchorNode = selection.anchor.getNode();
        let length = 0;
        for (const n of nodes) {
          if (n.is(anchorNode)) {
            absoluteOffset = length + selection.anchor.offset;
            break;
          }
          length += n.getTextContentSize();
        }
      }

      firstNode.replace(astNodes[0]);
      for (let i = 1; i < astNodes.length; i++) {
        astNodes[i - 1].insertAfter(astNodes[i]);
      }
      for (let i = 1; i < nodes.length; i++) {
        nodes[i].remove();
      }

      if (absoluteOffset !== -1) {
        let length = 0;
        for (const n of astNodes) {
          const size = n.getTextContentSize();
          if (absoluteOffset <= length + size) {
            $placeCaret(n, absoluteOffset - length);
            break;
          }
          length += size;
        }
      } else {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const wasRemoved = nodes.some(n => n.is(anchorNode));
          if (wasRemoved && astNodes.length > 0) {
            astNodes[astNodes.length - 1].selectEnd();
          }
        }
      }
    });

    const removeEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        const anchorNode = selection.anchor.getNode();
        const parent = anchorNode.getParent();

        const isInsideCode =
          (anchorNode instanceof TextNode && anchorNode.hasFormat('code')) ||
          parent?.getType() === 'codeblock';

        if (event.shiftKey) {
          event.preventDefault();

          // in the code block box: a new line inside the box
          const shiftCodeBlock = $getCodeBlock(anchorNode);
          if (shiftCodeBlock) {
            if ($closeEmptyCodeBlock(shiftCodeBlock)) {
              return true;
            }
            editor.update(() => {
              const sel = $getSelection();
              if ($isRangeSelection(sel)) {
                sel.insertLineBreak();
              }
            });
            return true;
          }

          if (isInsideCode) {
            editor.update(() => {
              const sel = $getSelection();
              if (!$isRangeSelection(sel)) return;
              const anchor = sel.anchor;
              const node = anchor.getNode();
              if (node instanceof TextNode) {
                const offset = anchor.offset;
                const text = node.getTextContent();
                const newText = text.slice(0, offset) + '\n' + text.slice(offset);
                node.setTextContent(newText);
                node.select(offset + 1, offset + 1);
              }
            });
            return true;
          }

          if ($newLineInFormattedRun(selection)) {
            return true;
          }
          editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
          return true;
        } else {
          event.preventDefault();
          event.stopPropagation();
          // in the code block box (Figma 5773:7834): Enter is a new line in the code, Cmd/Ctrl+Enter
          // sends
          const enterCodeBlock = $getCodeBlock(anchorNode);
          if (enterCodeBlock && !event.metaKey && !event.ctrlKey) {
            if ($closeEmptyCodeBlock(enterCodeBlock)) {
              return true;
            }
            const sel = $getSelection();
            if ($isRangeSelection(sel)) {
              sel.insertLineBreak();
            }
            return true;
          }
          onSendMessage();
          return true;
        }
      },
      COMMAND_PRIORITY_HIGH
    );

    const removeBackspace = editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event: KeyboardEvent) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;

        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();
        const parent = anchorNode.getParent();

        /* ================= EMPTY FORMATTED LINE ================= */
        // a new line still holding only its bold / italic markers (nothing typed on it): Backspace
        // takes the line away, back to the end of the line above
        const line = $isElementNode(anchorNode) ? anchorNode : parent;
        const lineAbove = line?.getPreviousSibling();
        if (
          line &&
          line.getType() === 'paragraph' &&
          lineAbove?.getType() === 'paragraph' &&
          $isElementNode(lineAbove) &&
          line.getChildren().some(child => isHiddenMarker(child)) &&
          line
            .getChildren()
            .every(
              child =>
                isHiddenMarker(child) ||
                ($isTextNode(child) && stripZeroWidth(child.getTextContent()) === '')
            )
        ) {
          event.preventDefault();
          line.remove();
          const lastText = lineAbove
            .getAllTextNodes()
            .reverse()
            .find((node): boolean => !isHiddenMarker(node));
          if (lastText) {
            lastText.selectEnd();
          } else {
            lineAbove.selectEnd();
          }
          return true;
        }

        /* ================= CODE BLOCK BACKSPACE ================= */
        const codeBlock =
          parent?.getType() === 'codeblock' ? parent : anchorNode.getTopLevelElement();

        if (codeBlock && codeBlock.getType() === 'codeblock') {
          const rawContent = codeBlock.getTextContent();
          const isEmpty = rawContent.trim() === '';
          const isAtAbsoluteStart =
            anchor.offset === 0 &&
            (anchorNode.is(codeBlock) || anchorNode.getPreviousSibling() === null);

          if (isEmpty && isAtAbsoluteStart) {
            event.preventDefault();
            // an empty box closes: back to the line it was opened from, or an empty line
            const previous = codeBlock.getPreviousSibling();
            if (previous && previous.getType() === 'paragraph') {
              codeBlock.remove();
              (previous as ElementNode).selectEnd();
            } else {
              const paragraph = $createParagraphNode();
              codeBlock.replace(paragraph);
              paragraph.select();
            }
            return true;
          }
        }

        /* ================= BULLET / QUOTE BACKSPACE ================= */
        const topLevel = anchorNode.getTopLevelElement();

        /* ---------- LIST revert ---------- */
        const listItem = $isListItemNode(anchorNode)
          ? anchorNode
          : $isListItemNode(parent)
          ? parent
          : null;

        if (listItem && anchor.offset === 0) {
          const text = listItem.getTextContent();
          const isSingleLine = !text.includes('\n');
          const listParent = listItem.getParent();

          if (isSingleLine && text.trim() === '' && listParent?.getType() === 'list') {
            event.preventDefault();

            const paragraph = $createParagraphNode();
            const listType =
              typeof (listParent as any).getListType === 'function'
                ? (listParent as any).getListType()
                : 'bullet';
            // WITH this
            if (listType === 'number') {
              const start =
                typeof (listParent as any).getStart === 'function'
                  ? (listParent as any).getStart()
                  : 1;

              const index =
                typeof listItem.getIndexWithinParent === 'function'
                  ? listItem.getIndexWithinParent()
                  : listParent.getChildren().indexOf(listItem);

              const currentNumber = start + index;

              isBulletListYmbols = `${currentNumber}.`;
            }

            paragraph.append($createTextNode(isBulletListYmbols));

            listParent.insertAfter(paragraph);
            listItem.remove();

            if (listParent.getChildrenSize() === 0) {
              listParent.remove();
            }

            paragraph.selectEnd();
            return true;
          }
        }

        /* ---------- QUOTE revert ---------- */
        if (topLevel && topLevel.getType() === 'quote' && anchor.offset === 0) {
          const text = topLevel.getTextContent();
          const isSingleLine = !text.includes('\n');

          if (isSingleLine && text.trim() === '') {
            event.preventDefault();

            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode('>'));

            topLevel.replace(paragraph);
            paragraph.selectEnd();
            return true;
          }
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
    const removeSpace = editor.registerCommand(
      KEY_SPACE_COMMAND,
      (event: KeyboardEvent) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;

        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();
        const parent = anchorNode.getParent();

        /* ================= LIST ================= */
        const listItem = $isListItemNode(anchorNode)
          ? anchorNode
          : $isListItemNode(parent)
          ? parent
          : null;

        if (listItem) {
          const text = listItem.getTextContent();

          const listParent = listItem.getParent();

          const isLastItem = listParent?.getLastChild() && listParent.getLastChild()?.is(listItem);
          if (text === '' && isLastItem) {
            event.preventDefault();

            let marker = isBulletListYmbols;

            // preserve current number for numbered list
            if (
              listParent &&
              typeof (listParent as any).getListType === 'function' &&
              (listParent as any).getListType() === 'number'
            ) {
              const start =
                typeof (listParent as any).getStart === 'function'
                  ? (listParent as any).getStart()
                  : 1;

              const index =
                typeof listItem.getIndexWithinParent === 'function'
                  ? listItem.getIndexWithinParent()
                  : listParent.getChildren().indexOf(listItem);

              marker = `${start + index}.`;
            }

            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(marker + '  '));
            listItem.insertAfter(paragraph);
            listItem.remove();
            if (listParent?.getChildrenSize() === 0) {
              listParent.remove();
            }
            paragraph.selectEnd();
            return true;
          }
        }

        /* =================  QUOTE  ================= */
        const topLevel = anchorNode.getTopLevelElement();

        if (topLevel?.getType() === 'quote') {
          const text = topLevel.getTextContent();

          // 🚫 second space → revert
          if (text === '') {
            event.preventDefault();

            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode('>  '));

            topLevel.replace(paragraph);
            paragraph.selectEnd();
            return true;
          }
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
    // arrow down at the end of the last code block: leave the box onto a new line under it
    const removeArrowDown = editor.registerCommand(
      KEY_ARROW_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;
        const codeBlock = $getCodeBlock(selection.anchor.getNode());
        if (!codeBlock || codeBlock.getNextSibling() !== null) return false;

        const lastDescendant = codeBlock.getLastDescendant();
        const { anchor } = selection;
        const atEnd =
          !lastDescendant ||
          (anchor.getNode().is(lastDescendant) &&
            anchor.offset === lastDescendant.getTextContentSize()) ||
          (anchor.getNode().is(codeBlock) && anchor.offset === codeBlock.getChildrenSize());
        if (!atEnd) return false;

        event.preventDefault();
        const paragraph = $createParagraphNode();
        codeBlock.insertAfter(paragraph);
        paragraph.select();
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    // pasting into the code block keeps it as plain lines inside the box (no rich text blocks)
    const removePaste = editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent | KeyboardEvent | InputEvent) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !$getCodeBlock(selection.anchor.getNode())) {
          return false;
        }
        const text = (event as ClipboardEvent).clipboardData?.getData('text/plain');
        if (!text) return false;
        event.preventDefault();
        selection.insertRawText(text.replace(/\r\n?/g, '\n'));
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      removeTransform();
      removeEnter();
      removeBackspace();
      removeMarkerStyleLeak();
      removeDeleteSkip();
      removeDeleteWordSkip();
      removeOrphanParagraph();
      removeOrphanListItem();
      removeOrphanQuote();
      removeSpace();
      removeArrowDown();
      removePaste();
    };
  }, [editor, onSendMessage]);

  return null;
}

/** The ``` code block box in the message box. It is sent as ```code``` (see serializeNode). */
export class CodeBlockNode extends ElementNode {
  static getType() {
    return 'codeblock';
  }

  static clone(node: CodeBlockNode) {
    return new CodeBlockNode(node.__key);
  }

  static importJSON(_serialized: SerializedElementNode): CodeBlockNode {
    return new CodeBlockNode();
  }

  exportJSON(): SerializedElementNode {
    return { ...super.exportJSON(), type: 'codeblock', version: 1 };
  }

  createDOM() {
    const code = document.createElement('code');
    code.className = 'composer-code-block';
    code.spellcheck = false;
    return code;
  }

  updateDOM() {
    return false;
  }

  canBeEmpty() {
    return true;
  }
}
