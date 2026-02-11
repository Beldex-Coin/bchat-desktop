// import React from 'react';
import { Slide, ToastContainer, ToastContainerProps } from 'react-toastify';
import styled from 'styled-components';
import { BchatIconButton } from './icon';
import { Flex } from './basic/Flex';

const BchatToastContainerPrivate = () => {
  return (
    <WrappedToastContainer
      position="bottom-right"
      // position='top-right'
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={true}
      transition={Slide}
      limit={5}
    />
  );
};
const CloseButton = ({ closeToast }:{closeToast:any}) => (
  <Flex container={true} justifyContent='center' alignItems='center' >
  <BchatIconButton iconType={'xWithCircle'} iconSize={20} onClick={closeToast} style={{height: '31px'}}/>
  </Flex>
);
const WrappedToastContainer = ({
  className,
  ...rest
}: ToastContainerProps & { className?: string }) => (
  <div className={className}>
    <ToastContainer {...rest} closeButton={CloseButton} />
   
  </div>
);

// tslint:disable-next-line: no-default-export
export const BchatToastContainer = styled(BchatToastContainerPrivate).attrs({
  // custom props
})`
  .Toastify__toast-container {
  }
  .Toastify__toast {
  }
  .Toastify__toast--error {
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
  }
  .Toastify__toast-body {
  }
  .Toastify__progress-bar {
  }
`;
