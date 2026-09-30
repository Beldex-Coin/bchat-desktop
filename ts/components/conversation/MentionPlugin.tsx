import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  TextNode,
  $getNodeByKey,
  $getRoot,
  $isElementNode,
  LexicalNode,
} from 'lexical';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MentionNode } from './MentionNode';
import classNames from 'classnames';

export default function MentionPlugin({
  fetchUsers,
  renderSuggestion,
  containerRef,
  draft,
  darkMode,
  isSelected,
}: {
  fetchUsers: (query: string) => Promise<any[]>;
  renderSuggestion: (user: any) => React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
  draft:string;
  // dark theme (Figma 71:12012): the list spans the input box, left edges aligned
  darkMode?: boolean;
  // members already mentioned in the draft get the highlighted row + ticked box
  isSelected?: (user: any) => boolean;
}) {
  const [editor] = useLexicalComposerContext();
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    const container = containerRef.current;
    if (!container) return;

    // dark: line the list up with the whole input box, not the text area inside it
    const anchor = (darkMode && container.closest('.send-message-input')) || container;
    const rect = anchor.getBoundingClientRect();

    const left = darkMode ? rect.left : rect.left + 10;
    const top = rect.top; 

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

  // ✅ NEW: NodeTransform to instantly parse pasted pubkeys and serialized strings back into Mentions
  useEffect(() => {
    const removeTransform = editor.registerNodeTransform(TextNode, (node) => {
      // Ignore if it's already a MentionNode to prevent infinite formatting loops
      if (node.getType() === 'mention') return;

      const text = node.getTextContent();

      // 1. Check for serialized draft format (e.g., @ￒidￗdisplayￒ)
      const serializedMatch = text.match(/@ￒ(.*?)ￗ(.*?)ￒ/);
      if (serializedMatch) {
        const [fullMatch, id, display] = serializedMatch;
        const index = serializedMatch.index!;

        let targetNode = node;
        if (index > 0) {
          [, targetNode] = targetNode.splitText(index);
        }
        if (targetNode.getTextContent().length > fullMatch.length) {
          [targetNode] = targetNode.splitText(fullMatch.length);
        }
        targetNode.replace(new MentionNode(id, display));
        return;
      }

      // 2. Check for raw pubkey format (from message history copy/paste)
      const pubkeyMatch = text.match(/@([a-fA-F0-9]{64,})/);
      if (pubkeyMatch) {
        const fullMatch = pubkeyMatch[0];
        const pubKey = pubkeyMatch[1];
        const nodeKey = node.getKey();

        // Fetch all users async to resolve the pasted ID back to the display name
        fetchUsers('').then((users) => {
          const matchedUser = users.find((u: any) => u.id === pubKey);
          if (matchedUser) {
            editor.update(() => {
              const latestNode = $getNodeByKey(nodeKey);
              if ($isTextNode(latestNode) && latestNode.getType() !== 'mention') {
                const currentText = latestNode.getTextContent();
                const matchIdx = currentText.indexOf(fullMatch);
                
                if (matchIdx !== -1) {
                  let target = latestNode;
                  if (matchIdx > 0) {
                    [, target] = target.splitText(matchIdx);
                  }
                  if (target.getTextContent().length > fullMatch.length) {
                    [target] = target.splitText(fullMatch.length);
                  }
                  target.replace(new MentionNode(matchedUser.id, matchedUser.value));
                }
              }
            });
          }
        });
      }
    });

    return () => {
      removeTransform();
    };
  }, [editor, fetchUsers]);

  // ORIGINAL KEYSTROKE LISTENER
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        
        // ✅ FIX: If selection is lost, close the popup
        if (!$isRangeSelection(selection)) {
          setShow(false);
          return;
        }

        const node = selection.anchor.getNode();
        
        // ✅ FIX: When the '@' is deleted, the TextNode is destroyed. 
        // We must close the popup instead of just returning early.
        if (!$isTextNode(node)) {
          setShow(false);
          return;
        }

        // ✅ FIX: Slice the text up to the cursor offset. 
        // This makes it work perfectly even if you type mid-sentence.
        const textBeforeCursor = node.getTextContent().slice(0, selection.anchor.offset);
        const match = textBeforeCursor.match(/@(\w*)$/);

        if (match) {
          const query = match[1];

          // Prevent the dropdown from flashing open if we just pasted a raw pubkey
          if (/^[a-fA-F0-9]{64,}$/.test(query)) {
            setShow(false);
            return;
          }

          setShow(true);

          fetchUsers(query).then((res: any) => {
            setResults(res);

            requestAnimationFrame(() => {
              updatePosition(); 
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

  // Clicking a member that is already mentioned (ticked row, dark theme) takes the mention out
  // again: every mention of that member is removed with the space typed after it, and so is the
  // "@..." that opened the list.
  const removeMention = (user: any) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = selection.anchor.getNode();
        if ($isTextNode(node)) {
          const offset = selection.anchor.offset;
          const text = node.getTextContent();
          const before = text.slice(0, offset).replace(/@\w*$/, '');
          node.setTextContent(before + text.slice(offset));
          node.select(before.length, before.length);
        }
      }

      const mentions: Array<MentionNode> = [];
      const collect = (current: LexicalNode) => {
        if (current instanceof MentionNode) {
          if (current.getId() === user.id) {
            mentions.push(current);
          }
          return;
        }
        if ($isElementNode(current)) {
          current.getChildren().forEach(collect);
        }
      };
      collect($getRoot());

      mentions.forEach(mention => {
        const next = mention.getNextSibling();
        if ($isTextNode(next) && next.getTextContent().startsWith(' ')) {
          const rest = next.getTextContent().slice(1);
          if (rest) {
            next.setTextContent(rest);
          } else {
            next.remove();
          }
        }
        mention.remove();
      });

      const after = $getSelection();
      if (!$isRangeSelection(after) || !after.anchor.getNode().isAttached()) {
        $getRoot().selectEnd();
      }
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
        width: darkMode ? 560 : 260,
        zIndex: 9999,
        transform: darkMode ? 'translateY(calc(-100% - 7px))' : 'translateY(calc(-100% - 10px))',
      }}
    >
      {results.map((user: any) => (
        <div
          key={user.id}
          className={classNames('mention-item', isSelected?.(user) && 'mention-item--selected')}
          onClick={() => (isSelected?.(user) ? removeMention(user) : insertMention(user))}
        >
          {renderSuggestion(user)}
        </div>
      ))}
    </div>
  );
}