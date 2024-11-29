import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

interface CustomProps {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: Object;
  customIcon: any;
  className?:string;
}

const CustomIconButtonInner = React.forwardRef<HTMLDivElement, CustomProps>((props, ref) => {
  const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (props.onClick) {
      e.stopPropagation();
      props.onClick(e);
    }
  };
  const style:object = { ...props.style ?? {} };
  return (
    <div
      className={classNames('bchat-icon-button',props.className)}
      role="button"
      ref={ref}
      onClick={clickHandler}
      style={style}
    >
      {props.customIcon}
    </div>
  );
});

export const CustomIconButton = React.memo(CustomIconButtonInner, _.isEqual);
