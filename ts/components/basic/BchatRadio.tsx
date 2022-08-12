import React from 'react';
import { Flex } from './Flex';
// tslint:disable: react-unused-props-and-state

interface Props {
  label: string;
  value: string;
  active: boolean;
  group?: string;
  onClick: (value: string) => any;
}

export const BchatRadio = (props: Props) => {
  const { label, group, value, active, onClick } = props;

  function clickHandler(e: any) {
    e.stopPropagation();
    onClick(value);
  }

  return (
    <Flex>
      <input
        type="radio"
        name={group || ''}
        value={value}
        aria-checked={active}
        checked={active}
        onChange={clickHandler}
      />
      <label role="button" onClick={clickHandler}>
        {label}
      </label>
    </Flex>
  );
};
