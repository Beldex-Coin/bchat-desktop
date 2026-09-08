import React from 'react';

// NOIR: the first screen states the thesis in brand voice —
// the hex mark on the dot field, no illustrations.
export const AccentText: React.FC = () => (
  <div className="bchat-content-accent-text">
    <div className="noir-onb-logo">
      <img src="images/bchat/bchat_logo.svg" width={72} height={72} alt="BChat" />
    </div>
    <div className="noir-onb-kicker">BELDEX NETWORK // BCHAT</div>
    <div className="bchat-content-accent-text title">
      Privacy, in every message<span className="noir-cursor">_</span>
    </div>
    <div className="bchat-content-accent-text title2">
      NO PHONE NUMBER // NO EMAIL // NO TRACE
    </div>
  </div>
);
