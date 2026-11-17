import  { useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  useConversationBnsHolder,
  useConversationRealName,
  useConversationUsername,
  useHasNickname,
  useIsMe,
} from '../../../hooks/useParamSelector';
import { PubKey } from '../../../bchat/types';
import { isSearching } from '../../../state/selectors/search';
import { ContactName } from '../../conversation/ContactName';
import { ContextConversationId } from './ConversationListItem';
import { BchatIcon } from '../../icon';

export const UserItem = () => {
  const conversationId = useContext(ContextConversationId);

  // we want to show the nickname in brackets if a nickname is set for search results
  const isSearchResultsMode = useSelector(isSearching);

  const shortenedPubkey = PubKey.shorten(conversationId);
  const isMe = useIsMe(conversationId);
  const username = useConversationUsername(conversationId);
  const realName = useConversationRealName(conversationId);
  const hasNickname = useHasNickname(conversationId);
  const isBnsHolder = useConversationBnsHolder(conversationId);

  const displayedPubkey = username ? shortenedPubkey : conversationId;
  const displayName = isMe
    ? window.i18n('noteToSelf')
    : isSearchResultsMode && hasNickname && realName
    ? `${realName} (${username})`
    : username;

  let shouldShowPubkey = false;
  if ((!username || username.length === 0) && (!displayName || displayName.length === 0)) {
    shouldShowPubkey = true;
  }

  return (
    <div className="module-conversation__user">
      <ContactName
        pubkey={displayedPubkey}
        name={username}
        profileName={displayName}
        module="module-conversation__user"
        boldProfileName={true}
        shouldShowPubkey={shouldShowPubkey}
      />
      {/* verified BNS holder: the "BNS" chip with the green mark after the name (Figma 5629:1415) */}
      {isBnsHolder && (
        <span className="bns-tag">
          BNS
          <span className="bns-tag__mark">
            <BchatIcon iconType="verifiedAccount" iconSize={11} iconColor="var(--pal-t-00bc33)" />
          </span>
        </span>
      )}
    </div>
  );
};
