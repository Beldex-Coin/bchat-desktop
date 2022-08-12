import React, { useEffect, useState } from 'react';

import { BchatRadio } from './BchatRadio';

interface Props {
  // tslint:disable: react-unused-props-and-state
  initialItem: string;
  items: Array<any>;
  group: string;
  onClick: (selectedValue: string) => any;
}

export const BchatRadioGroup = (props: Props) => {
  const [activeItem, setActiveItem] = useState('');
  const { items, group, initialItem } = props;

  useEffect(() => {
    setActiveItem(initialItem);
  }, []);

  return (
    <div className="bchat-radio-group">
      <fieldset id={group}>
        {items.map(item => {
          const itemIsActive = item.value === activeItem;

          return (
            <BchatRadio
              key={item.value}
              label={item.label}
              active={itemIsActive}
              value={item.value}
              group={group}
              onClick={(value: string) => {
                setActiveItem(value);
                props.onClick(value);
              }}
            />
          );
        })}
      </fieldset>
    </div>
  );
};
