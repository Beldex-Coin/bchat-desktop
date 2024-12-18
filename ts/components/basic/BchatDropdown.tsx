import React, { useState } from 'react';
import { BchatIcon, BchatIconType } from '../icon';

import { BchatDropdownItem, BchatDropDownItemType } from './BchatDropdownItem';
import { MenuWrapper } from '../menu/Menu';

// THIS IS DROPDOWN ACCORDIAN STYLE OPTIONS SELECTOR ELEMENT, NOT A CONTEXTMENU

type Props = {
  label: string;
  labelIcon?: BchatIconType;
  onClick?: any;
  expanded?: boolean;
  options: Array<{
    content: string;
    id?: string;
    icon?: BchatIconType | null;
    type?: BchatDropDownItemType;
    active?: boolean;
    onClick?: any;
  }>;
};

export const BchatDropdown = (props: Props) => {
  const { label, options, labelIcon } = props;
  const [expanded, setExpanded] = useState(!!props.expanded);
  const chevronOrientation = expanded ? 180 : 0;

  return (
    <div className="bchat-dropdown">
      <div
        className="bchat-dropdown__label"
        onClick={() => {
          setExpanded(!expanded);
        }}
        role="button"
      >
        <div>
          {labelIcon ? (
            <>
              <BchatIcon iconType={labelIcon} iconSize={18} fillRule="evenodd" clipRule="evenodd" />
              <MenuWrapper>{label}</MenuWrapper>
            </>
          ) : (
            { label }
          )}
        </div>
        <BchatIcon iconType="chevron" iconSize="small" iconRotation={chevronOrientation} />
      </div>

      {expanded && (
        <div className="bchat-dropdown__list-container">
          {options.map((item: any) => {
            return (
              <BchatDropdownItem
                key={item.content}
                content={item.content}
                icon={item.icon}
                type={item.type}
                active={item.active}
                onClick={() => {
                  setExpanded(false);
                  item.onClick();
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
