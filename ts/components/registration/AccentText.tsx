import React from 'react';
import ChatwithTxtIcon from '../icon/chatwithTxtIcon';

export const AccentText: React.FC = () => (
  <div className="bchat-content-accent-text">
    <ChatwithTxtIcon />
    <div className="bchat-content-accent-text title">
      <span className="light-only-inline">
        {window.i18n('hello')}, <br></br>
        {window.i18n('welcomeBack')}
      </span>
      {/* dark theme: Figma 71:14624 "Welcome to BChat_" */}
      <span className="dark-only-inline">{window.i18n('welcomeToBchat')}</span>
    </div>
    <div className="bchat-content-accent-text title2">{window.i18n('accentDescription')} </div>
   

  </div>
);
