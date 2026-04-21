// import { RenderTextCallbackType } from '../../types/Util';
import classNames from 'classnames';
import { PubKey } from '../../bchat/types';
import { UserUtils } from '../../bchat/utils';
import { getConversationController } from '../../bchat/conversations';
import React from 'react';
// import React from 'react';

interface MentionProps {
  key: string;
  text: string;
}

const Mention = (props: MentionProps) => {
  const foundConvo = getConversationController().get(props.text.slice(1));
  let us = false;
  if (foundConvo) {
    us = UserUtils.isUsFromCache(foundConvo.id);
  }

  if (foundConvo) {
    // TODO: We don't have to search the database of message just to know that the message is for us!
    const className = classNames('mention-profile-name', us && 'mention-profile-name-us');

    const displayedName = foundConvo.getContactProfileNameOrShortenedPubKey();
    return <span className={className}>@{displayedName}</span>;
  } else {
    return <span className="mention-profile-name">{PubKey.shorten(props.text)}</span>;
  }
};

type Props = {
  text: string;
  renderOther?: (args: {
    text: string;
    key: number;
    isGroup: boolean;
  }) => React.ReactNode;
  isGroup: boolean;
};


const defaultRenderOther = ({ text }: { text: string }) => <>{text}</>;

export const AddMentions = (props: Props): JSX.Element => {
  const { text, renderOther, isGroup } = props;

  const results: Array<React.ReactNode> = [];
  const FIND_MENTIONS = new RegExp(`@${PubKey.regexForPubkeys}`, 'g');

  const renderWith = renderOther || defaultRenderOther;

  let match = FIND_MENTIONS.exec(text);
  let last = 0;
  let count = 0;

  // ✅ No mentions → render full text with markdown
  if (!match) {
    return <>{renderWith({ text, key: 0, isGroup })}</>;
  }

  while (match) {
    const key = count++;

    // ✅ Normal text before mention
    if (last < match.index) {
      const otherText = text.slice(last, match.index);
      results.push(
        <React.Fragment key={`text-${key}`}>
          {renderWith({ text: otherText, key, isGroup })}
        </React.Fragment>
      );
    }

    // ✅ Mention part
    const pubkey = text.slice(match.index, FIND_MENTIONS.lastIndex);
    results.push(<Mention text={pubkey} key={`mention-${key}`} />);

    last = FIND_MENTIONS.lastIndex;
    match = FIND_MENTIONS.exec(text);
  }

  // ✅ Remaining text after last mention
  if (last < text.length) {
    const key = count++;
    results.push(
      <React.Fragment key={`text-${key}`}>
        {renderWith({ text: text.slice(last), key, isGroup })}
      </React.Fragment>
    );
  }

  return <>{results}</>;
};
