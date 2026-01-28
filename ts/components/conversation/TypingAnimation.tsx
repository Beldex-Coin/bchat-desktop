// import React from 'react';
import classNames from 'classnames';

export const TypingAnimation = () => {
  return (
    <div className="module-typing-animation" title={window.i18n('typingAlt')}>
      <div className='module-typing-Txt'>
     { window.i18n('typing')}
      
      </div>
      <div
        className={classNames(
          'module-typing-animation__dot',
          'module-typing-animation__dot--first'
        )}
      />
      <div className="module-typing-animation__spacer" />
      <div
        className={classNames(
          'module-typing-animation__dot',
          'module-typing-animation__dot--second'
        )}
      />
      <div className="module-typing-animation__spacer" />
      <div
        className={classNames(
          'module-typing-animation__dot',
          'module-typing-animation__dot--third'
        )}
      />
    </div>
  );
};
