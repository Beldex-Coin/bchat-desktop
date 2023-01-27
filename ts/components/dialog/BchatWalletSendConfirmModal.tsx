import React, { useState } from 'react';
// import { BchatHtmlRenderer } from '../basic/BchatHTMLRenderer';
import { updateConfirmModal } from '../../state/ducks/modalDialog';
import { SpacerLG, SpacerMD } from '../basic/Text';
import { BchatButton, BchatButtonColor } from '../basic/BchatButton';
// import { BchatSpinner } from '../basic/BchatSpinner';
import { BchatIcon, BchatIconSize, BchatIconType } from '../icon';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { useKey } from 'react-use';

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
  btndisable?: boolean | undefined;
  address?: string | undefined;
  amount?: number | undefined;
  fee?: number | undefined;
  Priority?: string | undefined;
}

export const BchatSendConfirm = (props: BchatConfirmDialogProps) => {
  const {
    // message = '',
    // messageSub = '',
    closeTheme = BchatButtonColor.White,
    onClickOk,
    onClickClose,
    hideCancel = false,
    bchatIcon,
    iconSize,
    shouldShowConfirm,
    onClickCancel,
    showExitIcon,
    closeAfterInput = true,
    btndisable,
    address,
    amount,
    fee = 2,
    Priority
  } = props;

  // const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [password, setPassword] = useState('')

  const okText = props.okText || window.i18n('ok');

  const cancelText = props.cancelText || window.i18n('cancel');
  // const showHeader = !!props.title;

  //   const messageSubText = messageSub ? 'bchat-confirm-main-message' : 'subtle';

 
  const onClickOkHandler = async () => {
    if (onClickOk) {
      // setIsLoading(true);
      try {
        
        if(confirm)
        {
          await onClickOk();
        }
        else{
          passwordVerify();
        }
        
      } catch (e) {
        window.log.warn(e);
      } finally {
        // setIsLoading(false);
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

  useKey((event: KeyboardEvent) => {
    return event.key === 'Enter';
  }, onClickOkHandler);

  async function passwordVerify()
  {
    setConfirm(true)
  }

  return (
    <BchatWrapperModal
      title={confirm ? 'Confirm Transaction' : 'Password'}
      onClose={onClickClose}
      showExitIcon={showExitIcon}
      showHeader={true}
    >
      {/* {!showHeader && <SpacerLG />} */}

      <div className="bchat-modal__centered">
        <SpacerMD />
        {bchatIcon && iconSize && (
          <>
            <BchatIcon iconType={bchatIcon} iconSize={iconSize} />
            <SpacerLG />
          </>
        )}
        {confirm ? <article className='bchat-modal__centered-sendConfirm_content'>
          <div className='senderBox'>
            <div className='bchat-modal__centered-sendConfirm_content-probTitle'>Send to:</div> <div className='senderBox-address'>{address}</div>

          </div>
          <SpacerMD />
          <div className='senderBox'>
            <div className='bchat-modal__centered-sendConfirm_content-probTitle'>Amount:</div> <div className='senderBox-address'>{amount}BDX</div>

          </div>
          <SpacerMD />
          <div className='senderBox'>
            <div className='bchat-modal__centered-sendConfirm_content-probTitle'>Fee:</div> <div className='senderBox-address'>{fee}BDX</div>

          </div>
          <SpacerMD />
          <div className='senderBox'>
            <div className='bchat-modal__centered-sendConfirm_content-probTitle'>Priority:</div><div className='senderBox-address'>{Priority}</div>
          </div>
          <SpacerMD />

        </article> :
          <div>
            <div className='bchat-modal__centered-sendConfirm_content-subHeader'>Enter your wallet Password</div>
            <div className="bchat-modal__centered-sendConfirm_content-passwordBox">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <SpacerMD />
            <SpacerMD />
          </div>  
        }







        {/* <BchatSpinner loading={isLoading} /> */}
      </div>

      <div className="bchat-modal__button-group">

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
      </div>
    </BchatWrapperModal>
  );
};
