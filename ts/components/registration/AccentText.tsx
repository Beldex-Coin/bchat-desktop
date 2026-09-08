import React from 'react';

// NOIR: the first screen states the thesis in brand voice —
// the hex mark on the dot field, no illustrations.
export const AccentText: React.FC = () => (
  <div className="bchat-content-accent-text">
    <div className="noir-onb-logo">
      <svg width="64" height="64" viewBox="0 0 30 30" fill="none">
        <polygon
          points="15,1.5 27,8 27,22 15,28.5 3,22 3,8"
          stroke="var(--color-accent)"
          strokeWidth="1.4"
          fill="none"
        />
        <rect
          x="10"
          y="10"
          width="10"
          height="10"
          fill="none"
          stroke="var(--color-text)"
          strokeWidth="1.4"
        />
      </svg>
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
