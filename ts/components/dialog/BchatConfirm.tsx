import React, { useState } from 'react';
import { BchatHtmlRenderer } from '../basic/BchatHTMLRenderer';
import { updateConfirmModal } from '../../state/ducks/modalDialog';
import { SpacerLG } from '../basic/Text';
import { BchatButton, BchatButtonColor } from '../basic/BchatButton';
import { BchatSpinner } from '../basic/BchatSpinner';
import { BchatIcon, BchatIconSize, BchatIconType } from '../icon';
import { BchatWrapperModal } from '../BchatWrapperModal';

export interface BchatConfirmDialogProps {
  message?: string;
  messageSub?: string;
  title?: string;
  onOk?: any;
  onClose?: any;
  closeAfterInput?: boolean;

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
  okTheme?: BchatButtonColor;
  closeTheme?: BchatButtonColor;
  bchatIcon?: BchatIconType;
  iconSize?: BchatIconSize;
  shouldShowConfirm?: boolean | undefined;
  showExitIcon?: boolean | undefined;
}

export const BchatConfirm = (props: BchatConfirmDialogProps) => {
  const {
    title = '',
    message = '',
    messageSub = '',
    okTheme = BchatButtonColor.Primary,
    closeTheme = BchatButtonColor.Primary,
    onClickOk,
    onClickClose,
    hideCancel = false,
    bchatIcon,
    iconSize,
    shouldShowConfirm,
    onClickCancel,
    showExitIcon,
    closeAfterInput = true,
  } = props;

  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <BchatWrapperModal
      title={title}
      onClose={onClickClose}
      showExitIcon={showExitIcon}
      showHeader={showHeader}
    >
      {!showHeader && <SpacerLG />}

      <div className="bchat-modal__centered">
        {bchatIcon && iconSize && (
          <>
            <BchatIcon iconType={bchatIcon} iconSize={iconSize} />
            <SpacerLG />
          </>
        )}

        <BchatHtmlRenderer tag="span" className={messageSubText} html={message} />
        <BchatHtmlRenderer
          tag="span"
          className="bchat-confirm-sub-message subtle"
          html={messageSub}
        />

        <BchatSpinner loading={isLoading} />
      </div>

      <div className="bchat-modal__button-group">
        <BchatButton
          text={okText}
          buttonColor={okTheme}
          onClick={onClickOkHandler}
          dataTestId="Bchat-confirm-ok-button"
        />
        {!hideCancel && (
          <BchatButton
            text={cancelText}
            buttonColor={closeTheme}
            onClick={onClickCancelHandler}
            dataTestId="Bchat-confirm-cancel-button"
          />
        )}
      </div>
    </BchatWrapperModal>
  );
};
