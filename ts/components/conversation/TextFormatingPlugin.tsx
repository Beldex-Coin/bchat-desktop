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

      /* ---------- ✅ Boundary Fix ---------- */
      const isValidBoundary = (text: string, start: number, end: number, markerLength: number) => {
        const before = text[start - 1];
        const after = text[end];

        const charAfterOpen = text[start + markerLength];
        const charBeforeClose = text[end - markerLength - 1];

        // Prevents formatting * hello *
        if (charAfterOpen === ' ') return false;
        if (charBeforeClose === ' ') return false;

        const isStartValid = start === 0 || /\s|[*_~]/.test(before);
        const isEndValid = end === text.length || /\s|[*_~]/.test(after);

        return isStartValid && isEndValid;
      };

      const findClosingIndex = (text: string, start: number, marker: string) => {
        return text.indexOf(marker, start);
      };
      let bestMatch: { marker: any; start: number; end: number } | null = null;

      for (let i = 0; i < text.length; i++) {
        for (const marker of MARKERS) {
          if (text.startsWith(marker.char, i)) {
            const startInner = i + marker.char.length;
            const closeIdx = findClosingIndex(text, startInner, marker.char);

            // ✅ FIX: Ensure there is actual content between the markers (closeIdx > startInner).
            // This prevents empty pairs like **, __, or ~~ from being stripped into empty AST nodes.
            if (
              closeIdx > startInner &&
              isValidBoundary(text, i, closeIdx + marker.char.length, marker.char.length)
            ) {
              if (!bestMatch || i < bestMatch.start) {
                bestMatch = { marker, start: i, end: closeIdx };
              }
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

        // ✅ FIX: triple backtick inline handling
        if (earliestMarker.char === '```') {
          node.toggleFormat('code');
          node.setStyle('font-family: monospace; data-triple-backtick: true;background: none;');
        } else {
          node.toggleFormat(earliestMarker.format);
        }

        currentFormats.forEach(f => node.toggleFormat(f));
        nodes.push(node);
      } else {
        // ✅ FIX: Recursively process the inner text so it formats instead of deleting
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

      /* ================= BLOCK AST (Lists & Quotes) ================= */
      if (isBlockMarker && parent && parent.getType() === 'paragraph') {
        const matchQuote = fullText.match(/^>[ \u00A0]([\s\S]*)$/); // ✅ Restored Quote
        const matchBullet = fullText.match(/^[-*][ \u00A0]([\s\S]*)$/);
        const matchNumber = fullText.match(/^(\d+)\.[ \u00A0]([\s\S]*)$/);

        let newBlockNode = null;

        if (matchQuote) {
          newBlockNode = $createQuoteNode();
          newBlockNode.append($createTextNode(matchQuote[1]));
        } else if (matchBullet) {
          isBulletListYmbols = fullText[0];
          newBlockNode = $createListNode('bullet');
          const listItem = $createListItemNode();
          listItem.append($createTextNode(matchBullet[1]));
          newBlockNode.append(listItem);
        } else if (matchNumber) {
          isBulletListYmbols = `${matchNumber[1]}.`;
          newBlockNode = $createListNode('number');
          newBlockNode.setStart(parseInt(matchNumber[1], 10));
          const listItem = $createListItemNode();
          listItem.append($createTextNode(matchNumber[2]));
          newBlockNode.append(listItem);
        }

        if (newBlockNode) {
          const selection = $getSelection();
          let hasCursor = false;

          if ($isRangeSelection(selection)) {
            let curr: LexicalNode | null = selection.anchor.getNode();
            while (curr !== null) {
              if (curr.is(parent)) {
                hasCursor = true;
                break;
              }
              curr = curr.getParent();
            }
          }

          const prevSibling = parent.getPreviousSibling();
          const newBlockType = newBlockNode.getType();

          if (prevSibling && prevSibling.getType() === 'list' && newBlockType === 'list') {
            const prevList = prevSibling as any;
            const newList = newBlockNode as any;

            if (prevList.getListType() === newList.getListType()) {
              const newItems = newList.getChildren();
              newItems.forEach((item: LexicalNode) => {
                prevList.append(item);
              });
              parent.remove();
              if (hasCursor) prevList.selectEnd();
              return;
            }
          }

          parent.replace(newBlockNode);
          if (hasCursor) newBlockNode.selectEnd();
          return;
        }
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

    // Inside TextFormatingPlugin.tsx -> useEffect
   const removeEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;
        // --- SHIFT + ENTER ---
        if (event.shiftKey) {
          event.preventDefault(); // Prevent the browser's default <br>
          editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
          return true;
        }

        // --- ENTER (No Shift) ---
        else {
          event.preventDefault();
          onSendMessage();
          return true;
        }
      },
      COMMAND_PRIORITY_HIGH
    );

    // REPLACE only your current removeBackspace command with below code
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

        // REPLACE only this whole "BULLET LIST BACKSPACE" block inside removeBackspace

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

    return () => {
      removeTransform();
      removeEnter();
      removeBackspace();
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
