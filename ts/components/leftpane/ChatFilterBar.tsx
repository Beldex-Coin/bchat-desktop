import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { getTheme } from '../../state/selectors/theme';
import { getConversationController } from '../../bchat/conversations';

export type ChatFilter = 'all' | 'social' | 'groups';

const FILTERS: Array<{ value: ChatFilter; labelKey: 'chatFilterAll' | 'chatFilterSocial' | 'chatFilterGroups' }> = [
  { value: 'all', labelKey: 'chatFilterAll' },
  { value: 'social', labelKey: 'chatFilterSocial' },
  { value: 'groups', labelKey: 'chatFilterGroups' },
];

/**
 * Whether a conversation belongs in the list for the given filter.
 * "Social" = social (open) groups, "Groups" = secret (closed) groups, "All" = everything.
 */
export function conversationMatchesFilter(conversationId: string, filter: ChatFilter): boolean {
  if (filter === 'all') {
    return true;
  }
  const convo = getConversationController().get(conversationId);
  if (!convo) {
    return false;
  }
  return filter === 'social' ? convo.isPublic() : convo.isClosedGroup() && !convo.isPublic();
}

/**
 * All / Social / Groups pills above the Chats list (Figma node 28:9763).
 * Dark theme only: hidden in light theme, and it resets the filter to "all"
 * when the theme leaves dark so the list is never left filtered with no visible control.
 */
export const ChatFilterBar = (props: { value: ChatFilter; onChange: (value: ChatFilter) => void }) => {
  const { value, onChange } = props;
  const isDark = useSelector(getTheme) === 'dark';

  useEffect(() => {
    if (!isDark && value !== 'all') {
      onChange('all');
    }
  }, [isDark, value, onChange]);

  if (!isDark) {
    return null;
  }

  return (
    <div className="chat-filters" role="tablist">
      {FILTERS.map(filter => (
        <button
          key={filter.value}
          type="button"
          role="tab"
          aria-selected={value === filter.value}
          className={classNames('chat-filter', value === filter.value && 'chat-filter--active')}
          onClick={() => onChange(filter.value)}
        >
          {window.i18n(filter.labelKey)}
        </button>
      ))}
    </div>
  );
};

/**
 * Dark theme: shown under the pills when "Social" or "Groups" has nothing in it (Figma 328:6136
 * "empty_social"): just the two-bubble artwork, centred in the list area.
 */
export const ChatFilterEmpty = (_props: { filter: ChatFilter }) => {
  return (
    <div className="chat-filter-empty">
      <span className="chat-filter-empty__art" aria-hidden="true" />
    </div>
  );
};
