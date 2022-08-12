import React from 'react';
import { BchatHtmlRenderer } from '../basic/BchatHTMLRenderer';

export const TermsAndConditions = () => {
  // let a =  "<a href=\"https://bchat.beldex.io/terms-and-conditions\">Terms of Service</a> ";
  return (
    <div className="bchat-terms-conditions-agreement">
      {/* <BchatHtmlRenderer html={a}/> */}
      <BchatHtmlRenderer html={window.i18n('ByUsingThisService...')} />
    </div>
  );
};
