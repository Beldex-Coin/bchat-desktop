import React, { useRef } from 'react';
import classNames from 'classnames';

import { BchatIconButton } from './icon';

// tslint:disable-next-line: no-submodule-imports
import useKey from 'react-use/lib/useKey';
import styled from 'styled-components';
import { BchatSpinner } from './basic/BchatSpinner';
import { BchatButton, BchatButtonColor, BchatButtonType } from './basic/BchatButton';


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
  isloading?: boolean;
  buttons?: any;
  okButton?: any;
  cancelButton?: any;
  iconShow?: boolean;
  customIcon?: any;
  buttonSizeLg?: boolean;
};
export const Loader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--color-loader-bg);
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  align-items: center;
  z-index: 101;
`;

export const BchatWrapperModal = (props: BchatWrapperModalType) => {
  // const zoomLevel = window.getSettingValue('zoom-factor-setting');
  const {
    title,
    showHeader = true,
    showExitIcon,
    headerIconButtons,
    headerReverse,
    additionalClassName,
    isloading,
    okButton,
    cancelButton,
    iconShow = false,
    customIcon,
    buttonSizeLg = false,
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
  return (
    <div
      className={classNames('bchat-dialog modal', additionalClassName ? additionalClassName : null)}
    >
      <div className="bchat-confirm-wrapper">
        <div ref={modalRef} className="bchat-modal">
          <div className="model-layer">
            {iconShow && <div className="mediaPermission">{customIcon}</div>}
            <div>
              {showHeader ? (
                <div
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <div className={classNames('bchat-modal__header', headerReverse && 'reverse')}>
                    <div className="bchat-modal__header__title">{title}</div>
                    <div className={classNames(headerIconButtons && "bchat-modal__header__icons")}>
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
                  <div className="bchat-modal__header__iconHeader">
                    {showExitIcon && (
                      <div className="bchat-modal__header__close">
                        <BchatIconButton
                          iconType="exit"
                          iconSize={25}
                          onClick={props.onClose}
                          dataTestId="modal-close-button"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="bchat-modal__body" style={{ position: 'relative' }}>
                <div
                  className="bchat-modal__centered"
                  // style={{ maxHeight: zoomLevel > 100 ? '311px' : '' }}
                >
                  {props.children}
                </div>
              </div>
            </div>
          </div>
          <div className="bchat-modal-footer">
            {cancelButton?.status && (
              <BchatButton
                text={cancelButton?.text}
                buttonType={
                  cancelButton?.buttonType ? cancelButton.buttonType : BchatButtonType.Brand
                }
                buttonColor={cancelButton?.color ? cancelButton.color : BchatButtonColor.Secondary}
                onClick={cancelButton.onClickCancelHandler}
                iconSize={cancelButton?.iconSize ? cancelButton.iconSize : 10}
                iconType={cancelButton?.iconType}
                dataTestId="Bchat-confirm-cancel-button"
                style={{ marginRight: '12px', minWidth: iconShow || buttonSizeLg ? '235px' : '200px' }}
              />
            )}
            <BchatButton
              text={okButton?.text ? okButton.text : window.i18n('ok')}
              buttonType={okButton?.buttonType ? okButton.buttonType : BchatButtonType.Brand}
              buttonColor={okButton?.color ? okButton.color : BchatButtonColor.Secondary}
              disabled={okButton?.disabled}
              iconSize={okButton?.iconSize ? okButton.iconSize : 10}
              iconType={okButton?.iconType}
              onClick={okButton?.onClickOkHandler}
              dataTestId={okButton?.dataTestId ? okButton.dataTestId : 'Bchat-confirm-ok-button'}
              style={{ minWidth: iconShow || buttonSizeLg  ? '235px' : '200px' }}
            />
          </div>
          {isloading && (
            <div>
              <Loader>
                <BchatSpinner loading={true} />
              </Loader>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
