// import React from 'react';
import { SuggestionDataItem } from 'react-mentions';
import { MemberListItem } from '../../MemberListItem';

export const styleForCompositionBoxSuggestions = {
  suggestions: {
    list: {
      fontSize: 14,
      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
      backgroundColor: 'var(--color-cell-background)',
    },
    item: {
      height: '100%',
      paddingTop: '5px',
      paddingBottom: '5px',
      backgroundColor: 'var(--color-cell-background)',
      transition: '0.25s',

      '&focused': {
        backgroundColor: 'var(--color-clickable-hovered)',
      },
    },
  },
};

// `mentioned` is only passed in the dark theme (Figma 71:12012): each row then shows the square
// checkbox, ticked when that member is already mentioned in the draft.
export const renderUserMentionRow = (suggestion: SuggestionDataItem, mentioned?: boolean) => {
  return (
    <MemberListItem
      isSelected={!!mentioned}
      key={suggestion.id}
      pubkey={`${suggestion.id}`}
      disableBg={true}
      onlyList={mentioned === undefined}
      dataTestId="mentions-popup-row"
    />
  );
};

// the draft keeps a mention as @\uFFD2<pubkey>\uFFD7<name>\uFFD2
export const isMentionedInDraft = (draft: string, pubkey: string) =>
  draft.includes(`@\uFFD2${pubkey}\uFFD7`);

// this is dirty but we have to replace all @(xxx) by @xxx manually here
// export function cleanMentions(text: string): string {
//   const matches = text.match(mentionsRegex);
//   let replacedMentions = text;
//   (matches || []).forEach(match => {
//     const replacedMention = match.substring(2, match.indexOf('\uFFD7'));
//     replacedMentions = replacedMentions.replace(match, `@${replacedMention}`);
//   });
//  ;

//   return replacedMentions;
// }

// export const mentionsRegex = /@\uFFD205[0-9a-f]{64}\uFFD7[^\uFFD2]+\uFFD2/gu;


export function cleanMentions(text: string): string {
  return text.replace(/@ￒ(.*?)ￗ.*?ￒ/g, '@$1');
}

export const mentionsRegex = /@ￒ(.*?)ￗ.*?ￒ/g;
