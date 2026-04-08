import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  TextFormatType,
  TextNode,
  LexicalNode,
  // $applyNodeReplacement,
  COMMAND_PRIORITY_HIGH,
  KEY_ENTER_COMMAND,
  ElementNode,
} from 'lexical';

// import { $createCodeBlockNode } from './your-code-node-path';

// function $createCodeBlockNode() {
//   return $applyNodeReplacement(new CodeBlockNode());
// }

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

      let earliestMarker: any = null;
      let firstIndex = -1;
      let lastIndex = -1;

      for (let i = 0; i < text.length; i++) {
        // skip ``` block markers
        if (text.startsWith('```', i)) {
          i += 2;
          continue;
        }

        for (const marker of MARKERS) {
          if (text.startsWith(marker.char, i)) {
            const prevChar = i === 0 ? ' ' : text[i - 1];

            // ❌ must not be attached to previous word
            if (!/\s/.test(prevChar)) continue;

            const closeIdx = text.indexOf(marker.char, i + 1);

            if (closeIdx !== -1) {
              const nextChar = closeIdx + 1 >= text.length ? ' ' : text[closeIdx + 1];

              // ❌ must not be attached to next word
              if (!/\s/.test(nextChar)) continue;

              earliestMarker = marker;
              firstIndex = i;
              lastIndex = closeIdx;
              break;
            }
          }
        }
        if (earliestMarker) break;
      }

      if (!earliestMarker) {
        const node = $createTextNode(text);
        currentFormats.forEach(f => node.toggleFormat(f));
        return [node];
      }

      const nodes: TextNode[] = [];

      if (firstIndex > 0) {
        nodes.push(...processText(text.slice(0, firstIndex), currentFormats));
      }

      // opening token
      nodes.push($createTextNode(earliestMarker.char).setMode('token'));

      const inside = text.slice(firstIndex + 1, lastIndex);

      if (earliestMarker.noNest) {
        const node = $createTextNode(inside);
        node.toggleFormat(earliestMarker.format);
        currentFormats.forEach(f => node.toggleFormat(f));
        nodes.push(node);
      } else {
        nodes.push(...processText(inside, [...currentFormats, earliestMarker.format]));
      }

      // closing token
      nodes.push($createTextNode(earliestMarker.char).setMode('token'));

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

      if (node.getParent()?.getType() === 'codeblock') {
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
      let hasMarker = false;

      while (current instanceof TextNode) {
        nodes.push(current);
        const text = current.getTextContent();
        fullText += text;

        if (/[`*_~]/.test(text) || current.isToken()) {
          hasMarker = true;
        }

        if (current.is(lastNode)) break;
        current = current.getNextSibling();
      }

      if (!hasMarker) return;

      const parent = firstNode.getParent();
      if (!parent) return;

      /* ================= MULTI-LINE CODE BLOCK ================= */
      // const tripleRegex = /```([\s\S]*?)```/;
      // const match = fullText.match(tripleRegex);

      // if (match) {
      //   if (parent.getType() === 'codeblock') return;

      //   const before = fullText.slice(0, match.index);
      //   const inside = match[1];
      //   const after = fullText.slice(match.index! + match[0].length);

      //   const newNodes: LexicalNode[] = [];

      //   // BEFORE
      //   if (before) {
      //     newNodes.push(...processText(before));
      //   }

      //   // CODE BLOCK
      //   // @ts-ignore
      //   const codeNode = $createCodeBlockNode();

      //   inside.split('\n').forEach((line, i, arr) => {
      //     codeNode.append($createTextNode(line));
      //     if (i !== arr.length - 1) {
      //       codeNode.append($createTextNode('\n'));
      //     }
      //   });

      //   newNodes.push(codeNode);

      //   // AFTER
      //   if (after) {
      //     newNodes.push(...processText(after));
      //   }

      //   // Replace safely
      //   firstNode.replace(newNodes[0]);
      //   for (let i = 1; i < newNodes.length; i++) {
      //     newNodes[i - 1].insertAfter(newNodes[i]);
      //   }

      //   nodes.forEach(n => n.remove());

      //   return;
      // }

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

    return () => {
      removeTransform();
      removeEnter(); // 🔥 important
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
