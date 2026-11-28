import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isElementNode, LexicalEditor } from 'lexical';
import { $isListNode } from '@lexical/list';
import { isHiddenMarker, stripZeroWidth } from './formatMarks';

/**
 * Nothing typed yet: no letters (hidden markdown markers and caret holders don't count) on one line
 * of one block. Turning on bold, a list, a quote or a code block leaves the box like this, so the
 * placeholder stays until the first letter is typed.
 */
const $isVisiblyEmpty = () => {
  const root = $getRoot();
  if (root.getChildrenSize() > 1) {
    return false;
  }
  const block = root.getFirstChild();
  if (!block) {
    return true;
  }
  if (!$isElementNode(block)) {
    return false;
  }
  if ($isListNode(block) && block.getChildrenSize() > 1) {
    return false;
  }
  if (block.getTextContent().includes('\n')) {
    return false;
  }
  const typed = block
    .getAllTextNodes()
    .filter((node): boolean => !isHiddenMarker(node))
    .map(node => node.getTextContent())
    .join('');
  return stripZeroWidth(typed) === '';
};

/** How far the empty line's text starts from a plain line's start (a list number, quote bar, code box). */
const measureIndent = (editor: LexicalEditor) => {
  const root = editor.getRootElement();
  // (the placeholder's own start is the plain line's start, so only the difference is added)
  let line = root?.firstElementChild as HTMLElement | null | undefined;
  if (!root || !line) {
    return 0;
  }
  if ((line.tagName === 'OL' || line.tagName === 'UL') && line.firstElementChild) {
    line = line.firstElementChild as HTMLElement;
  }
  const rtl = getComputedStyle(root).direction === 'rtl';
  // an empty line holds a <br> right where the caret sits (after a list number, inside a code box)
  const caretHolder = line.querySelector('br');
  const start = (el: HTMLElement) => {
    if (el === line && caretHolder) {
      const box = caretHolder.getBoundingClientRect();
      return rtl ? -box.right : box.left;
    }
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rtl
      ? -(box.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight))
      : box.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft);
  };
  return Math.max(0, Math.round(start(line) - start(root)));
};

export const ComposerPlaceholder = ({ text }: { text: string }) => {
  const [editor] = useLexicalComposerContext();
  const [view, setView] = useState({ show: true, indent: 0 });

  useEffect(() => {
    const check = () => {
      const show = !editor.isComposing() && editor.getEditorState().read($isVisiblyEmpty);
      const indent = show ? measureIndent(editor) : 0;
      setView(prev => (prev.show === show && prev.indent === indent ? prev : { show, indent }));
    };
    check();
    return editor.registerUpdateListener(check);
  }, [editor]);

  if (!view.show) {
    return null;
  }
  return (
    <div
      className="editor-placeholder"
      style={view.indent ? { marginInlineStart: view.indent } : undefined}
    >
      {text}
    </div>
  );
};
