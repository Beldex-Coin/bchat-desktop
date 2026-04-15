// import React from 'react';
import { RenderTextCallbackType } from '../../types/Util';

type Props = {
  text: string;
  /** Allows you to customize now non-newlines are rendered. Simplest is just a <span>. */
  renderNonNewLine: RenderTextCallbackType;
  isGroup: boolean;
  isConvoListItem?: boolean;
};

// export const AddNewLines = (props: Props) => {
//   const { text, renderNonNewLine, isGroup,isConvoListItem } = props;
//   const rendered = renderNonNewLine({ text, key: 0, isGroup,isConvoListItem });
//   if (typeof rendered === 'string') {
//     return <>{rendered}</>;
//   }
//   return rendered;
// };

export const AddNewLines = (props: Props) => {
  const { text, renderNonNewLine, isGroup, isConvoListItem } = props;

  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, index) => {
        // ✅ Check if this line is a list item (ordered or unordered)
        const isListLine =
          /^[-*]\s+/.test(line) ||   // unordered: - item or * item
          /^\d+\.\s+/.test(line);    // ordered: 1. item

        // ✅ Check if next line is also a list item
        const nextLine = lines[index + 1] ?? '';
        const isNextListLine =
          /^[-*]\s+/.test(nextLine) ||
          /^\d+\.\s+/.test(nextLine);

        const showBr =
          index !== lines.length - 1 && // not last line
          !isListLine &&                 // current line is not a list item
          !isNextListLine;               // next line is not a list item

        return (
          <span key={index}>
            {renderNonNewLine({
              text: line,
              key: index,
              isGroup,
              isConvoListItem,
            })}
            {showBr && <br />}
          </span>
        );
      })}
    </>
  );
};
