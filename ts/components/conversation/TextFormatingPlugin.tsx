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
  $applyNodeReplacement,
  $createParagraphNode,
  KEY_BACKSPACE_COMMAND,
} from 'lexical';

import { $createQuoteNode } from '@lexical/rich-text';
import { $createListNode, $createListItemNode } from '@lexical/list';

function $createCodeBlockNode() {
  return $applyNodeReplacement(new CodeBlockNode());
}

export default function TextFormatingPlugin(): null {
  const [editor] = useLexicalComposerContext();

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
        { char: '`', format: 'code', noNest: true },
        { char: '*', format: 'bold' },
        { char: '_', format: 'italic' },
        { char: '~', format: 'strikethrough' },
      ];

      /* ---------- ✅ Boundary Fix ---------- */
      const isValidBoundary = (text: string, start: number, end: number) => {
        const before = text[start - 1];
        const after = text[end];

        const charAfterOpen = text[start + 1];
        const charBeforeClose = text[end - 1];

        if (charAfterOpen === ' ') return false;
        if (charBeforeClose === ' ') return false;

        const isStartValid = start === 0 || /\s|[*_~`]/.test(before);
        const isEndValid = end === text.length || /\s|[*_~`]/.test(after);

        return isStartValid && isEndValid;
      };

      /* ---------- ✅ Correct Closing Finder (non-greedy + safe) ---------- */
      const findClosingIndex = (text: string, start: number, char: string) => {
        let depth = 0;

        for (let i = start; i < text.length; i++) {
          // skip ```
          if (text.startsWith('```', i)) {
            i += 2;
            continue;
          }

          if (text[i] === char) {
            // handle repeated markers like **
            if (text[i + 1] === char) {
              depth++;
              i++;
              continue;
            }

            if (depth === 0) return i;
            depth--;
          }
        }

        return -1;
      };

      /* ---------- ✅ Find BEST match (not first match) ---------- */
      let bestMatch: {
        marker: any;
        start: number;
        end: number;
      } | null = null;

      for (let i = 0; i < text.length; i++) {
        if (text.startsWith('```', i)) {
          i += 2;
          continue;
        }

        for (const marker of MARKERS) {
          if (text.startsWith(marker.char, i)) {
            const closeIdx = findClosingIndex(text, i + 1, marker.char);

            if (closeIdx !== -1 && isValidBoundary(text, i, closeIdx + 1)) {
              if (!bestMatch || i < bestMatch.start) {
                bestMatch = {
                  marker,
                  start: i,
                  end: closeIdx,
                };
              }
            }
          }
        }
      }

      /* ---------- ❌ No marker ---------- */
      if (!bestMatch) {
        const node = $createTextNode(text);
        currentFormats.forEach(f => {
          if (!node.hasFormat(f)) {
            node.toggleFormat(f);
          }
        });
        return [node];
      }

      const { marker: earliestMarker, start: firstIndex, end: lastIndex } = bestMatch;

      const nodes: TextNode[] = [];

      /* ---------- Left ---------- */
      if (firstIndex > 0) {
        nodes.push(...processText(text.slice(0, firstIndex), currentFormats));
      }

      /* ---------- Opening token ---------- */
      nodes.push($createTextNode(earliestMarker.char).setMode('token'));

      const inside = text.slice(firstIndex + 1, lastIndex);

      /* ---------- Inside ---------- */
      if (earliestMarker.noNest) {
        const node = $createTextNode(inside);
        node.toggleFormat(earliestMarker.format);
        currentFormats.forEach(f => node.toggleFormat(f));
        nodes.push(node);
      } else {
        const innerNodes = processText(inside, [...currentFormats, earliestMarker.format]);

        // 🔥 APPLY FORMAT TO ALL CHILD NODES
        innerNodes.forEach(n => {
          if (!n.hasFormat(earliestMarker.format)) {
            n.toggleFormat(earliestMarker.format);
          }
        });

        nodes.push(...innerNodes);
      }

      /* ---------- Closing token ---------- */
      nodes.push($createTextNode(earliestMarker.char).setMode('token'));

      /* ---------- Right ---------- */
      if (lastIndex + 1 < text.length) {
        nodes.push(...processText(text.slice(lastIndex + 1), currentFormats));
      }

      return nodes;
    };

    /* ================= TRANSFORM ================= */
    const removeTransform = editor.registerNodeTransform(TextNode, node => {
      // ✅ Safety guards
      if (!node.isAttached()) return;
      if (!node.isSimpleText() || node.isToken()) return;

      const parent = node.getParent();
      if (parent?.getType() === 'codeblock') {
        return;
      }

      /* -------- Collect full text -------- */
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

        if (/[`*_~]/.test(text) || current.isToken()) {
          hasInlineMarker = true;
        }

        if (current.is(lastNode)) break;
        current = current.getNextSibling();
      }

      /* ================= CODE BLOCK AST ================= */

      if (parent && parent.getType() === 'paragraph' && fullText.trim() === '```') {
        const codeBlock = $createCodeBlockNode();
        codeBlock.append($createTextNode(''));

        parent.replace(codeBlock);
        codeBlock.selectEnd();
        return;
      }

      if (parent && parent.getType() === 'codeblock') {
        if (fullText.trim() === '```') {
          const paragraph = $createParagraphNode();
          parent.replace(paragraph);
          paragraph.selectEnd();
          return;
        }
      }

      // 🔥 NEW: Check for Block Markers (Lists, Quotes) at the start of a paragraph
      const isFirstChild = firstNode.getPreviousSibling() === null;
      let isBlockMarker = false;

      if (isFirstChild && parent && parent.getType() === 'paragraph') {
        // Matches "> ", "- ", "* ", or "1. "
        if (/^(> |[-*] |\d+\. )/.test(fullText)) {
          isBlockMarker = true;
        }
      }

      if (!hasInlineMarker && !isBlockMarker) return;

      /* ================= BLOCK AST (Lists & Quotes) ================= */
      if (isBlockMarker && parent && parent.getType() === 'paragraph') {
        const matchQuote = fullText.match(/^> ([\s\S]*)$/);
        const matchBullet = fullText.match(/^[-*] ([\s\S]*)$/);
        const matchNumber = fullText.match(/^(\d+)\. ([\s\S]*)$/);

        let newBlockNode = null;

        if (matchQuote) {
          newBlockNode = $createQuoteNode();
          newBlockNode.append($createTextNode(matchQuote[1]));
        } else if (matchBullet) {
          newBlockNode = $createListNode('bullet');
          const listItem = $createListItemNode();
          listItem.append($createTextNode(matchBullet[1]));
          newBlockNode.append(listItem);
        } else if (matchNumber) {
          newBlockNode = $createListNode('number');
          newBlockNode.setStart(parseInt(matchNumber[1], 10));
          const listItem = $createListItemNode();
          listItem.append($createTextNode(matchNumber[2]));
          newBlockNode.append(listItem);
        }

        if (newBlockNode) {
          // 🔥 1. Check if the cursor is currently inside the paragraph we are destroying
          const selection = $getSelection();
          let hasCursor = false;

          if ($isRangeSelection(selection)) {
            let curr: LexicalNode | null = selection.anchor.getNode();
            // Traverse up the tree to see if our anchor node lives inside 'parent'
            while (curr !== null) {
              if (curr.is(parent)) {
                hasCursor = true;
                break;
              }
              curr = curr.getParent();
            }
          }

          // 2. Replace the old paragraph with the new Block
          parent.replace(newBlockNode);

          // 🔥 3. If the cursor was in the old paragraph, move it to the end of the new block
          if (hasCursor) {
            newBlockNode.selectEnd();
          }

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

      /* -------- Cursor Preserve -------- */
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

      /* -------- Replace -------- */
      firstNode.replace(astNodes[0]);

      for (let i = 1; i < astNodes.length; i++) {
        astNodes[i - 1].insertAfter(astNodes[i]);
      }

      for (let i = 1; i < nodes.length; i++) {
        nodes[i].remove();
      }

      /* -------- Restore Cursor -------- */
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
      (event: any) => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) return false;

        const anchorNode = selection.anchor.getNode();
        const parent = anchorNode.getParent();

        // ✅ Only inside CodeBlockNode
        if (parent && parent.getType() === 'codeblock') {
          event.preventDefault();

          // ✅ Insert newline
          selection.insertNodes([$createTextNode('\n')]);

          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
    const removeBackspace = editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event: KeyboardEvent) => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          return false;
        }

        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        // We check the parent, or the parent of the parent in case of nested text
        const parent = anchorNode.getParent();
        const codeBlock =
          parent?.getType() === 'codeblock' ? parent : anchorNode.getTopLevelElement();

        if (!codeBlock || codeBlock.getType() !== 'codeblock') {
          return false;
        }

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

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      removeTransform();
      removeEnter();
      removeBackspace();
    };
  }, [editor]);

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
    code.style = 'display: block; border-radius: 6px;';
    return code;
  }

  updateDOM() {
    return false;
  }
}
