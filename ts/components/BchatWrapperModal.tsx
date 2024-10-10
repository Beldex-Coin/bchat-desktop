import React, { useRef } from 'react';
import classNames from 'classnames';

import { BchatIconButton } from './icon';

// tslint:disable-next-line: no-submodule-imports
import useKey from 'react-use/lib/useKey';
import styled from 'styled-components';
import { BchatSpinner } from './basic/BchatSpinner';
import { BchatButton, BchatButtonColor, BchatButtonType } from './basic/BchatButton';
import { useSelector } from 'react-redux';
import { getTheme } from '../state/selectors/theme';

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
};
interface LoaderProps {
  darkMode:boolean;
}
const Loader = styled.div<LoaderProps>`
  position: absolute;
  top: 0;
  left: 0;
  background-color:${(props=>props.darkMode?'#0000009e':'#ffffff9e')};
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  align-items: center;
  z-index: 101;
`;

export const BchatWrapperModal = (props: BchatWrapperModalType) => {
  const darkMode = useSelector(getTheme) === 'dark';
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
    customIcon
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
          <div className='model-layer'>
            {iconShow && <div className='mediaPermission'>
              {customIcon}
            </div>}
            <div>
              {showHeader ? (
                <div className={classNames('bchat-modal__header', headerReverse && 'reverse')}>
                  {showExitIcon ? <div className="bchat-modal__header__close">
                    <BchatIconButton
                      iconType="exit"
                      iconSize="small"
                      onClick={props.onClose}
                      dataTestId="modal-close-button"
                    />
                  </div> : null}
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

              <div className="bchat-modal__body" style={{ position: 'relative' }}>
                <div className="bchat-modal__centered">{props.children}</div>
               
              </div>
            </div>
          </div>
          <div className="bchat-modal-footer">
            {cancelButton?.status && <BchatButton
              text={cancelButton?.text}
              buttonType={cancelButton?.buttonType ? cancelButton.buttonType : BchatButtonType.Brand}
              buttonColor={cancelButton?.color ? cancelButton.color : BchatButtonColor.Secondary}
              onClick={cancelButton.onClickCancelHandler}
              dataTestId="Bchat-confirm-cancel-button"
              style={{ marginRight: '12px', minWidth: iconShow ? '235px' : '200px' }}
            />}
            <BchatButton
              text={okButton?.text ? okButton.text : window.i18n('ok')}
              buttonType={okButton?.buttonType ? okButton.buttonType : BchatButtonType.Brand}
              buttonColor={okButton?.color ? okButton.color : BchatButtonColor.Secondary}
              disabled={okButton?.disabled}
              iconSize={okButton?.iconSize}
              iconType={okButton?.iconType}
              onClick={okButton?.onClickOkHandler}
              dataTestId={okButton?.dataTestId ? okButton.dataTestId : "Bchat-confirm-ok-button"}
              style={{ minWidth: iconShow ? '235px' : '200px' }}
            />
          </div>
          {isloading && <div>
                  <Loader darkMode={darkMode} >
                    <BchatSpinner loading={true} />
                  </Loader>
                </div>
                }
        </div>
      </div>
    </div>
  );
};
