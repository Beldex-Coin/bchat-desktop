import React, { useRef } from 'react';
import classNames from 'classnames';

import { BchatIconButton } from './icon';

// tslint:disable-next-line: no-submodule-imports
import useKey from 'react-use/lib/useKey';
import styled from 'styled-components';
import { BchatSpinner } from './basic/BchatSpinner';

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
};
const Loader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #0000009e;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  align-items: center;
  z-index: 101;
`;

export const BchatWrapperModal = (props: BchatWrapperModalType) => {
  const {
    title,
    showHeader = true,
    showExitIcon,
    headerIconButtons,
    headerReverse,
    additionalClassName,
    isloading
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
            {isloading && <div>
              <Loader>
                <BchatSpinner loading={true} />
              </Loader>
            </div>
            }
          </div>
          <div className="bchat-modal-childhood"
          // style={{
          //   height: "90px",
          //   width: "100%",
          //   display: "flex",
          //   flexDirection: 'row',
          //   justifyContent: "center",
          //   backgroundColor: "#202329",
          //   alignItems:'center'
          // }}
          >
            {props.buttons}
          </div>
        </div>
      </div>
    </div>
  );
};
