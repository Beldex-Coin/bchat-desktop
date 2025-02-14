import React, { useState } from 'react';
import { BchatHtmlRenderer } from '../basic/BchatHTMLRenderer';
import { updateConfirmModal } from '../../state/ducks/modalDialog';
import { SpacerLG } from '../basic/Text';
import { BchatButtonColor } from '../basic/BchatButton';
import { BchatIcon, BchatIconSize, BchatIconType } from '../icon';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { useKey } from 'react-use';
// import { clipboard } from 'electron';
// import { ToastUtils } from '../../bchat/utils';

export interface BchatConfirmDialogProps {
  message?: string;
  messageSub?: string;
  title?: string;
  onOk?: any;
  onClose?: any;
  closeAfterInput?: boolean;
  iconShow?: any;
  customIcon?: any;

  /**
   * function to run on ok click. Closes modal after execution by default
   */
  onClickOk?: () => Promise<void> | void;

  onClickClose?: () => any;

  /**
   * function to run on close click. Closes modal after execution by default
   */
  onClickCancel?: () => any;
  okText?: string;
  cancelText?: string;
  hideCancel?: boolean;
  // showCopyBtn?: boolean;
  // copyTxt?: string;
  // seed?: string;
  okTheme?: BchatButtonColor;
  closeTheme?: BchatButtonColor;
  bchatIcon?: BchatIconType;
  iconSize?: BchatIconSize | number;
  shouldShowConfirm?: boolean | undefined;
  showExitIcon?: boolean | undefined;
  btndisable?: boolean | undefined;
  Childern?: any;
  okIcon?: any;
  cancelIcon?: any;
}

export const BchatConfirm = (props: BchatConfirmDialogProps) => {
  const {
    title = '',
    message = '',
    messageSub = '',
    closeTheme = BchatButtonColor.Secondary,
    // seed="",
    onClickOk,
    onClickClose,
    hideCancel = false,
    // showCopyBtn = false,
    bchatIcon,
    iconSize,
    shouldShowConfirm,
    onClickCancel,
    showExitIcon,
    closeAfterInput = true,
    btndisable,
    Childern = '',
    iconShow,
    customIcon,
    okIcon,
    cancelIcon
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  // const [copied, setCopied] = useState(false);

  const okText = props.okText || window.i18n('ok');

  const cancelText = props.cancelText || window.i18n('cancel');
  const showHeader = !!props.title;

  const messageSubText = messageSub ? 'bchat-confirm-main-message' : 'subtle';
  const onClickOkHandler = async () => {
    if (onClickOk) {
      setIsLoading(true);
      try {
        await onClickOk();
      } catch (e) {
        window.log.warn(e);
      } finally {
        setIsLoading(false);
      }
    }

    if (closeAfterInput) {
      window.inboxStore?.dispatch(updateConfirmModal(null));
    }
  };

  if (shouldShowConfirm && !shouldShowConfirm) {
    return null;
  }

  /**
   * Performs specified on close action then removes the modal.
   */
  const onClickCancelHandler = () => {
    if (onClickCancel) {
      onClickCancel();
    }

    if (onClickClose) {
      onClickClose();
    }

    window.inboxStore?.dispatch(updateConfirmModal(null));
  };

  // function copyToClipboard() {
  //   clipboard.writeText(seed, 'clipboard');
  //   setCopied(true)
  //   ToastUtils.pushCopiedToClipBoard();

  // }
  // function disableValidate()
  // {
  //   let disable;
  //   if(showCopyBtn)
  //   {
  //     if(copied)
  //     {
  //       disable=false
  //     }
  //     else
  //     {
  //       disable=true
  //     }
  //   }
  //   else
  //   {
  //     disable=btndisable  ? btndisable : false
  //   }

  //   return disable
  // }
  const validCustomIcon =
    bchatIcon && iconSize ? <BchatIcon iconType={bchatIcon} iconSize={iconSize} clipRule='evenodd' fillRule='evenodd' /> : customIcon;

  useKey((event: KeyboardEvent) => {
    return event.key === 'Enter';
  }, onClickOkHandler);

  return (
    <BchatWrapperModal
      title={title}
      onClose={onClickClose}
      showExitIcon={showExitIcon}
      showHeader={showHeader}
      okButton={{
        text: okText,
        onClickOkHandler,
        disabled: btndisable ? btndisable : false,
        color: props.okTheme,
        iconType: okIcon ? okIcon.icon : '',
        iconSize: okIcon ? okIcon.size : ''
      }}
      cancelButton={{
        status: !hideCancel,
        text: cancelText,
        color: closeTheme,
        onClickCancelHandler,
        iconType: cancelIcon ? cancelIcon.icon : '',
        iconSize: cancelIcon ? cancelIcon.size : ''
      }}
      iconShow={iconShow}
      customIcon={validCustomIcon}
      isloading={isLoading}
    >
      {!showHeader && <SpacerLG />}

      {/* <div className="bchat-modal__centered"> */}
        <div className="bchat-modal-bchatConfirm">
          {/* {bchatIcon && iconSize && (
            <>
              <BchatIcon iconType={bchatIcon} iconSize={iconSize} />
              <SpacerLG />
            </>
          )} */}
          {Childern}

          <BchatHtmlRenderer tag="span" className={messageSubText} html={message} />
          <BchatHtmlRenderer
            tag="span"
            className="bchat-confirm-sub-message subtle"
            html={messageSub}
          />

        </div>
      {/* </div> */}

      {/* <div className="bchat-modal__button-group">

        {!hideCancel && (
          <BchatButton
            text={cancelText}
            buttonColor={closeTheme}
            onClick={onClickCancelHandler}
            dataTestId="Bchat-confirm-cancel-button"
          />
        )}
        <BchatButton
          text={okText}
          buttonColor={props.okTheme}
          onClick={onClickOkHandler}
          dataTestId="Bchat-confirm-ok-button"
          disabled={btndisable ? btndisable : false}
        />
      </div> */}
    </BchatWrapperModal>
  );
};
