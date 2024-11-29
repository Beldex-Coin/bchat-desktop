import classNames from 'classnames';
import { clipboard } from 'electron';
import React from 'react';
import { pushUserCopySuccess } from '../../bchat/utils/Toast';
import _ from 'lodash';

interface SProps{
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  notificationCount?: number;
  isSelected?: boolean;
  isHidden?: boolean;
  margin?: string;
  dataTestId?: string;
  id?: string;
  style?: any;
  iconSize:number;
  content:string ;
}
const CopyIconButtonInner=React.forwardRef<HTMLDivElement, SProps>((props, ref) => {
  const {
    iconSize,  
    isHidden,
    content,
    margin,
    id,
    dataTestId,
  } = props;
  const handleCopy = () => {
    clipboard.writeText(content, 'clipboard');
    pushUserCopySuccess()
  };
  const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (props.onClick) {
      e.stopPropagation();
      handleCopy();
      props.onClick(e);
    }
  };
  return (
    <div
      className={classNames('bchat-icon-button', iconSize)}     
      role="button"
      ref={ref}
      id={id}
      onClick={clickHandler}
      style={{ display: isHidden ? 'none' : 'flex', margin: margin ? margin : '',alignItems:"center" }}
      data-testid={dataTestId}
    >
    <svg xmlns="http://www.w3.org/2000/svg"  width={iconSize} height={iconSize} viewBox="0 0 20 22" fill="none">
    <path d="M14.0249 12.2832V15.0332C14.0249 18.6998 12.7049 20.1665 9.4049 20.1665H6.2699C2.9699 20.1665 1.6499 18.6998 1.6499 15.0332V11.5498C1.6499 7.88317 2.9699 6.4165 6.2699 6.4165H8.7449" stroke="#00A638" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.0251 12.2832H11.3851C9.40512 12.2832 8.74512 11.5498 8.74512 9.34984V6.4165L14.0251 12.2832Z" stroke="#00A638" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.56982 1.8335H12.8698" stroke="#00A638" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.7749 4.5835C5.7749 3.06183 6.8804 1.8335 8.2499 1.8335H10.4114" stroke="#00A638" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.1498 7.3335V13.0077C18.1498 14.4285 17.1103 15.5835 15.8315 15.5835" stroke="#00A638" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.1502 7.3335H15.6752C13.8189 7.3335 13.2002 6.646 13.2002 4.5835V1.8335L18.1502 7.3335Z" stroke="#00A638" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
    </div>
  );
});

export const CopyIconButton=React.memo(CopyIconButtonInner,_.isEqual);