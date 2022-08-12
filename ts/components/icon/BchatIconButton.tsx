import React from 'react';
import classNames from 'classnames';
import { BchatIcon, BchatIconProps } from '.';
import _ from 'lodash';
import { BchatNotificationCount } from './BchatNotificationCount';

interface SProps extends BchatIconProps {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  notificationCount?: number;
  isSelected?: boolean;
  isHidden?: boolean;
  margin?: string;
  dataTestId?: string;
  id?: string;
  style?: any;
}

const   BchatIconButtonInner = React.forwardRef<HTMLDivElement, SProps>((props, ref) => {
  const {
    iconType,
    iconSize,
    iconColor,
    iconRotation,
    isSelected,
    notificationCount,
    glowDuration,
    glowStartDelay,
    noScale,
    isHidden,
    backgroundColor,
    borderRadius,
    iconPadding,
    margin,
    id,
    dataTestId,
    // style
  } = props;
  const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (props.onClick) {
      e.stopPropagation();
      props.onClick(e);
    }
  };

  return (
    <div
      className={classNames('bchat-icon-button', iconSize, isSelected ? 'no-opacity' : '')}
      // className={classNames('bchat-icon-button', iconSize,)}
     
      role="button"
      ref={ref}
      id={id}
      onClick={clickHandler}
      style={{ display: isHidden ? 'none' : 'flex', margin: margin ? margin : '',alignItems:"center" }}
      data-testid={dataTestId}
    >
      <BchatIcon
        iconType={iconType}
        iconSize={iconSize}
        iconColor={iconColor}
        iconRotation={iconRotation}
        glowDuration={glowDuration}
        glowStartDelay={glowStartDelay}
        noScale={noScale}
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
        iconPadding={iconPadding}
      />
      {Boolean(notificationCount) && <BchatNotificationCount count={notificationCount} />}
    </div>
  );
});

export const BchatIconButton = React.memo(BchatIconButtonInner, _.isEqual);
