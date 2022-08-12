import React from 'react';
import classNames from 'classnames';
import { Picker } from 'emoji-mart';
import { Constants } from '../../bchat';
import { useSelector } from 'react-redux';
import { getTheme } from '../../state/selectors/theme';

type Props = {
  onEmojiClicked: (emoji: any) => void;
  show: boolean;
};

export const BchatEmojiPanel = (props: Props) => {
  const { onEmojiClicked, show } = props;
  const darkMode = useSelector(getTheme) === 'dark';

  return (
    <div className={classNames('bchat-emoji-panel', show && 'show')}>
      <Picker
        backgroundImageFn={() => './images/emoji/emoji-sheet-twitter-32.png'}
        set={'twitter'}
        sheetSize={32}
        darkMode={darkMode}
        color={Constants.UI.COLORS.GREEN}
        showPreview={true}
        title={''}
        onSelect={onEmojiClicked}
        autoFocus={true}
      />
    </div>
  );
};
