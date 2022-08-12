import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

import { BchatIconButton } from './icon';

// tslint:disable-next-line: no-submodule-imports
import useKey from 'react-use/lib/useKey';
// import { BchatButton } from './basic/BchatButton';

export type BchatWrapperModalType = {
  title?: string;
  showHeader?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  showClose?: boolean;
  confirmText?: string;
  cancelText?: string;
  showExitIcon?: boolean;
  headerIconButtons?: Array<any>;
  children: any;
  headerReverse?: boolean;
  additionalClassName?: string;
};

export const BchatWrapperModal = (props: BchatWrapperModalType) => {
  const {
    title,
    // onConfirm,
    // onClose,
    showHeader = true,
    // showClose = false,
    // confirmText,
    // cancelText,
    showExitIcon,
    headerIconButtons,
    headerReverse,
    additionalClassName,
  } = props;

  useKey(
    'Esc',
    () => {
      props.onClose?.();
    },
    undefined,
    [props.onClose]
  );

  useKey(
    'Escape',
    () => {
      props.onClose?.();
    },
    undefined,
    [props.onClose]
  );

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: any) => {
    if (!modalRef.current?.contains(e.target)) {
      props.onClose?.();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div
      className={classNames('loki-dialog modal', additionalClassName ? additionalClassName : null)}
    >
      <div className="bchat-confirm-wrapper">
        <div ref={modalRef} className="bchat-modal">
          {showHeader ? (
            <div className={classNames('bchat-modal__header', headerReverse && 'reverse')}>
              <div className="bchat-modal__header__close">
                {showExitIcon ? (
                  <BchatIconButton
                    iconType="exit"
                    iconSize="small"
                    onClick={props.onClose}
                    dataTestId="modal-close-button"
                  />
                ) : null}
              </div>
              <div className="bchat-modal__header__title">{title}</div>
              <div className="bchat-modal__header__icons">
                {headerIconButtons
                  ? headerIconButtons.map((iconItem: any) => {
                      return (
                        <BchatIconButton
                          key={iconItem.iconType}
                          iconType={iconItem.iconType}
                          iconSize={'large'}
                          iconRotation={iconItem.iconRotation}
                          onClick={iconItem.onClick}
                        />
                      );
                    })
                  : null}
              </div>
            </div>
          ) : null}

          <div className="bchat-modal__body">
            <div className="bchat-modal__centered">
              {props.children}

              {/* <div className="bchat-modal__button-group">
                {onClose && showClose ? (
                  <BchatButton onClick={props.onClose}>
                    {cancelText || window.i18n('close')}
                  </BchatButton>
                ) : null}
                {onConfirm ? (
                  <BchatButton onClick={props.onConfirm}>
                    {confirmText || window.i18n('ok')}
                  </BchatButton>
                ) : null}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
