import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { getSelectedConversationKey } from '../../state/selectors/conversations';
import { getTheme } from '../../state/selectors/theme';
import { searchMessagesInConversation } from '../../data/data';
import { cleanSearchTerm } from '../../util/cleanSearchTerm';
import { openConversationToSpecificMessage } from '../../state/ducks/conversations';
import { BchatIcon, BchatIconButton } from '../icon';

// Search inside the open conversation (dark theme only, Figma 1:45529): a search icon in
// the header opens a boxed field with a clear button and down / up arrows that step through the
// matching messages (newest first), jumping to and highlighting each one.
const goToMessage = (conversationKey: string, messageId?: string) => {
  if (!messageId) {
    return;
  }
  void openConversationToSpecificMessage({
    conversationKey,
    messageIdToNavigateTo: messageId,
    shouldHighlightMessage: true,
  });
};

// Matched words in the visible messages get a light box with dark text (Figma 5466:1804). This
// uses the CSS Custom Highlight API: ranges are registered over the existing text nodes, so the
// message rendering itself is untouched, and they're styled by ::highlight(chat-search) in CSS.
const HIGHLIGHT_NAME = 'chat-search';

const highlightRegistry = () => (window as any).CSS?.highlights as Map<string, any> | undefined;

const clearSearchHighlights = () => {
  highlightRegistry()?.delete(HIGHLIGHT_NAME);
};

const searchTokens = (text: string) =>
  text
    .toLowerCase()
    .replace(/([!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const applySearchHighlights = (text: string) => {
  const registry = highlightRegistry();
  const HighlightCtor = (window as any).Highlight;
  if (!registry || !HighlightCtor) {
    return;
  }
  const tokens = searchTokens(text);
  const root = document.getElementById('messages-container');
  if (!tokens.length || !root) {
    registry.delete(HIGHLIGHT_NAME);
    return;
  }
  const ranges: Array<Range> = [];
  root.querySelectorAll('.module-message__text').forEach(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const value = (node.nodeValue || '').toLowerCase();
      tokens.forEach(token => {
        let at = value.indexOf(token);
        while (at !== -1) {
          const range = document.createRange();
          range.setStart(node as Node, at);
          range.setEnd(node as Node, at + token.length);
          ranges.push(range);
          at = value.indexOf(token, at + token.length);
        }
      });
      node = walker.nextNode();
    }
  });
  registry.set(HIGHLIGHT_NAME, new HighlightCtor(...ranges));
};

export const ConversationSearch = () => {
  const isDark = useSelector(getTheme) === 'dark';
  const convoId = useSelector(getSelectedConversationKey);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<string>>([]);
  const [index, setIndex] = useState(0);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setQuery('');
    setResults([]);
    setIndex(0);
    setSearched(false);
  };

  // a different conversation starts closed and empty
  useEffect(() => {
    setOpen(false);
    reset();
  }, [convoId]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const runSearch = useMemo(
    () =>
      debounce(async (text: string, conversationKey: string) => {
        const trimmed = text.trim();
        if (!trimmed) {
          setResults([]);
          setIndex(0);
          setSearched(false);
          return;
        }
        try {
          const found = await searchMessagesInConversation(
            cleanSearchTerm(trimmed),
            conversationKey,
            200
          );
          const ids = found.map(m => m.id);
          setResults(ids);
          setIndex(0);
          setSearched(true);
          goToMessage(conversationKey, ids[0]);
        } catch (e) {
          window?.log?.warn('conversation search failed', e?.message);
          setResults([]);
          setSearched(true);
        }
      }, 300),
    []
  );

  useEffect(() => () => runSearch.cancel(), [runSearch]);

  // keep the matches highlighted while the search is open - re-applied whenever the message list
  // changes (scrolling loads more, jumping to a result re-renders it)
  useEffect(() => {
    if (!isDark || !open || !query.trim()) {
      clearSearchHighlights();
      return undefined;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => applySearchHighlights(query), 80);
    };
    refresh();
    const root = document.getElementById('messages-container');
    const observer = root ? new MutationObserver(refresh) : undefined;
    observer?.observe(root as HTMLElement, { childList: true, subtree: true, characterData: true });
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      observer?.disconnect();
      clearSearchHighlights();
    };
  }, [isDark, open, query, convoId]);

  if (!isDark || !convoId) {
    return null;
  }

  const step = (delta: number) => {
    if (!results.length) {
      return;
    }
    const next = Math.min(Math.max(index + delta, 0), results.length - 1);
    if (next !== index) {
      setIndex(next);
      goToMessage(convoId, results[next]);
    }
  };
  const close = () => {
    runSearch.cancel();
    setOpen(false);
    reset();
  };

  if (!open) {
    return (
      <div className="conversation-search-toggle">
        <BchatIconButton
          iconType="search"
          iconSize={22}
          iconColor="#EBEBEB"
          onClick={() => setOpen(true)}
          dataTestId="conversation-search-button"
        />
      </div>
    );
  }

  return (
    <div className="conversation-search" role="search">
      <span className="conversation-search__clear" role="button" aria-label={window.i18n('close')} onClick={close}>
        <BchatIcon iconType="x" iconSize={7} iconColor="#8D8D8D" fillRule="evenodd" clipRule="evenodd" />
      </span>
      <input
        ref={inputRef}
        className="conversation-search__input"
        type="text"
        value={query}
        placeholder={window.i18n('searchInChat')}
        onChange={e => {
          setQuery(e.target.value);
          void runSearch(e.target.value, convoId);
        }}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            close();
          } else if (e.key === 'Enter') {
            step(e.shiftKey ? -1 : 1);
          }
        }}
      />
      {searched && (
        <span className="conversation-search__count">
          {results.length ? `${index + 1}/${results.length}` : '0/0'}
        </span>
      )}
      {/* down = newer match, up = older match */}
      <span
        className="conversation-search__nav"
        role="button"
        aria-disabled={index <= 0}
        onClick={() => step(-1)}
      >
        <BchatIcon
          iconType="arrowCircleDown"
          iconSize={20}
          iconColor={index > 0 ? '#00BC33' : '#555555'}
        />
      </span>
      <span
        className="conversation-search__nav"
        role="button"
        aria-disabled={index >= results.length - 1}
        onClick={() => step(1)}
      >
        <BchatIcon
          iconType="arrowCircleDown"
          iconSize={20}
          iconRotation={180}
          iconColor={index < results.length - 1 ? '#00BC33' : '#555555'}
        />
      </span>
    </div>
  );
};
