import React from 'react';
import ChatwithTxtIcon from '../icon/chatwithTxtIcon';

export const AccentText: React.FC = () => (
  <div className="bchat-content-accent-text">
    <ChatwithTxtIcon />
    <div className="bchat-content-accent-text title"> {window.i18n('hello')}, <br></br>{window.i18n('welcomeBack')}</div>
    <div className="bchat-content-accent-text title2">{window.i18n('accentDescription')} </div>
   

  </div>
);
