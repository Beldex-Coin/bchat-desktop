import React from 'react';
import { BchatHtmlRenderer } from '../basic/BchatHTMLRenderer';

export const TermsAndConditions = () => {
  return (
    <div className="bchat-terms-conditions-agreement">
      <BchatHtmlRenderer html={window.i18n('ByUsingThisService...')} />
    </div>
  );
};
