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
      {lines.map((line, index) => (
        <span key={index}>
          {renderNonNewLine({
            text: line,
            key: index,
            isGroup,
            isConvoListItem,
          })}
          {index !== lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
};
