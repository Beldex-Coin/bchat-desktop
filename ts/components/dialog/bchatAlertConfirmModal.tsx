import React, { useState } from 'react';
import { updateConfirmModal } from '../../state/ducks/modalDialog';
import { SpacerMD } from '../basic/Text';
import { BchatButtonColor } from '../basic/BchatButton';
import { BchatSpinner } from '../basic/BchatSpinner';
import { BchatWrapperModal } from '../BchatWrapperModal';
// import { useKey } from 'react-use';

export interface BchatAlertConfirmModalProps {
  /**
   * function to run on ok click. Closes modal after execution by default
   */
  onClickOk?: () => Promise<void> | void;
  onClickClose?: () => any;
  /**
   * function to run on close click. Closes modal after execution by default
   */
  onClickCancel?: () => any;
  settings: boolean;
  btndisable?: boolean | undefined;
}

export const BchatAlertConfirmModal = (props: BchatAlertConfirmModalProps) => {
  const { settings = false, onClickOk, onClickClose, onClickCancel, btndisable } = props;

  const [isLoading, setIsLoading] = useState(false);
  // const cancelText = window.i18n('cancel');

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
  };
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

  // useKey((event: KeyboardEvent) => {
  //   return event.key === 'Enter';
  // }, onClickOkHandler);

  return (
    <BchatWrapperModal title={''} onClose={onClickClose} showExitIcon={false} showHeader={false}
      okButton={{
        text: window.i18n('ok'),
        onClickOkHandler,
        color: BchatButtonColor.Primary,
        disabled: btndisable ? btndisable : false
      }}
      cancelButton={{
        text: window.i18n('cancel'),
        status: true,
        onClickCancelHandler
      }}
    >
      <div className="bchat-modal__centered">
        <div className="bchat-modal-imgConfirmBox">
          <img src={'images/bchat/walletinchat.svg'} width={'50px'} height={'50px'} />
          <SpacerMD />

          <div className="bchat-modal-imgConfirmBox-header">{window.i18n('payYouChat')}</div>
          <SpacerMD />
          <div className="bchat-modal-imgConfirmBox-message">
            {settings ? (
              window.i18n('warningWalletPassword')
            ) : (
              <>
                Enable pay as you chat from <span>Settings -&gt; Chat -&gt; Pay As You Chat </span>
                to use this option
              </>
            )}
          </div>
          <BchatSpinner loading={isLoading} />
        </div>
      </div>
      {/* <div className="bchat-modal__button-group">
        <BchatButton
          text={cancelText}
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Secondary}
          onClick={onClickCancelHandler}
          dataTestId="Bchat-confirm-cancel-button"
        // style={{ width: '120px', height: '35px' }}
        />
        <BchatButton
          text={window.i18n('ok')}
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Primary}
          onClick={onClickOkHandler}
          dataTestId="Bchat-confirm-ok-button"
          disabled={btndisable ? btndisable : false}
        // style={{ width: '120px', height: '35px' }}
        />
      </div> */}
    </BchatWrapperModal>
  );
};
