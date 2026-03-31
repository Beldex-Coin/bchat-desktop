import { $getSelection, $isRangeSelection, $isTextNode, TextNode } from 'lexical';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MentionNode } from './MentionNode';

export default function MentionPlugin({
  fetchUsers,
  renderSuggestion,
  containerRef,
  draft
}: {
  fetchUsers: (query: string) => Promise<any[]>;
  renderSuggestion: (user: any) => React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
  draft:string
}) {
  const [editor] = useLexicalComposerContext();
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    const left = rect.left + 10;
    const top = rect.top; // anchor point ONLY

    setPosition({
      top: top + window.scrollY,
      left: left + window.scrollX,
    });
  };
  useLayoutEffect(() => {
    if (show) {
      updatePosition();
    }
  }, [results, show]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const node = selection.anchor.getNode();
        if (!$isTextNode(node)) return;

        const text = node.getTextContent();
        const match = text.match(/@(\w*)$/);

        if (match) {
          const query = match[1];

          setShow(true);

          fetchUsers(query).then((res: any) => {
            setResults(res);

            requestAnimationFrame(() => {
              updatePosition(); // Ensure position is updated after DOM changes
            });
          });
          updatePosition();
        } else {
          setShow(false);
        }
      });
    });
  }, [editor, fetchUsers]);

  const insertMention = (user: any) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const node = selection.anchor.getNode();

      if ($isTextNode(node)) {
        const text = node.getTextContent();
        const newText = text.replace(/@\w*$/, '');

        node.setTextContent(newText);
      }

      selection.insertNodes([new MentionNode(user.id, user.value), new TextNode(' ')]);
    });

    setShow(false);
  };

  if (!show || results.length===0 || draft.length===0) return null;

  return (
    <div
      ref={dropdownRef} 
      className="mention-dropdown"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: 260,
        zIndex: 9999,
        transform: 'translateY(calc(-100% - 10px))',
      }}
    >
      {results.map((user: any) => (
        <div key={user.id} className="mention-item" onClick={() => insertMention(user)}>
          {renderSuggestion(user)}
        </div>
      ))}
    </div>
  );
}
