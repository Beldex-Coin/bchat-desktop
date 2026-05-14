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
} from 'lexical';

import { $createQuoteNode } from '@lexical/rich-text';
import { $createListNode, $createListItemNode, $isListItemNode } from '@lexical/list';

// function $createCodeBlockNode() {
//   return $applyNodeReplacement(new CodeBlockNode());
// }

export default function TextFormatingPlugin({
  onSendMessage,
}: {
  onSendMessage: () => void;
}): null {
  const [editor] = useLexicalComposerContext();
  let isBulletListYmbols = '-';
  useEffect(() => {
    /* ================= AST ENGINE ================= */
    const processText = (text: string, currentFormats: TextFormatType[] = []): TextNode[] => {
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
        const isEndValid = end === text.length || /[\s]|[^\w\s]/.test(after);

        if (markerChar === '`' || markerChar === '```') {
          return isStartValid && isEndValid;
        }

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

              if (
                closeIdx > startInner &&
                isValidBoundary(
                  text,
                  i,
                  closeIdx + marker.char.length,
                  marker.char.length,
                  marker.char
                )
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
        nodes.push(...processText(text.slice(0, firstIndex), currentFormats));
      }

      nodes.push($createTextNode(earliestMarker.char).setMode('token'));
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
        nodes.push(...processText(inside, newFormats));
      }

      nodes.push($createTextNode(earliestMarker.char).setMode('token'));

      const endOfMarker = lastIndex + earliestMarker.char.length;

      if (endOfMarker < text.length) {
        nodes.push(...processText(text.slice(endOfMarker), currentFormats));
      }

      return nodes;
    };

    /* ================= TRANSFORM ================= */
    const removeTransform = editor.registerNodeTransform(TextNode, node => {
      if (!node.isAttached()) return;
      if (!node.isSimpleText() || node.isToken()) return;
      if (node.hasFormat('code')) return;

      const parent = node.getParent();
      if (parent?.getType() === 'codeblock') return;

      let firstNode = node;
      while (firstNode.getPreviousSibling() instanceof TextNode) {
        firstNode = firstNode.getPreviousSibling() as TextNode;
      }

      let lastNode = node;
      while (lastNode.getNextSibling() instanceof TextNode) {
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
      const astNodes = processText(fullText);
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
            n.select(absoluteOffset - length, absoluteOffset - length);
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

          editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
          return true;
        } 
        else {
          event.preventDefault();
          event.stopPropagation();
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

        /* ================= CODE BLOCK BACKSPACE ================= */
        const codeBlock =
          parent?.getType() === 'codeblock' ? parent : anchorNode.getTopLevelElement();

        if (codeBlock && codeBlock.getType() === 'codeblock') {
          const rawContent = codeBlock.getTextContent();
          const isEmpty = rawContent.trim() === '';
          const isAtAbsoluteStart = anchor.offset === 0 && anchorNode.getPreviousSibling() === null;

          if (isEmpty && isAtAbsoluteStart) {
            event.preventDefault();
            const paragraph = $createParagraphNode();
            codeBlock.replace(paragraph);
            paragraph.select();
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

          if (text === '') {
            event.preventDefault();

            const listParent = listItem.getParent();
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(isBulletListYmbols + '  '));

            listParent?.replace(paragraph);
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
    return () => {
      removeTransform();
      removeEnter();
      removeBackspace();
      removeSpace();
    };
  }, [editor, onSendMessage]);

  return null;
}

export class CodeBlockNode extends ElementNode {
  static getType() {
    return 'codeblock';
  }

  static clone(node: CodeBlockNode) {
    return new CodeBlockNode(node.__key);
  }

  createDOM() {
    const code = document.createElement('code');
    code.style = 'display: inline-block; border-radius: 6px;';
    return code;
  }

  updateDOM() {
    return false;
  }
}
