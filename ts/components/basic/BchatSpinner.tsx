import React from 'react';

type Props = {
  loading: boolean;
};

export const BchatSpinner = (props: Props) => {
  const { loading } = props;
  const darkMode = window.Events.getThemeSetting() === 'dark';

  const imgsrc = darkMode
    ? 'images/bchat/Load_animation.gif'
    : 'images/bchat/Loading__white_theme.gif';
  return loading ? (
    <div className="bchat-loader" data-testid="loading-spinner">
      <div>
        <img src={imgsrc} style={{ width: '150px', height: '150px', display: 'flex' }} />
      </div>
    </div>
  ) : null;
};
