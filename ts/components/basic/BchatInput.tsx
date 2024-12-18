import React, { useState } from 'react';

import classNames from 'classnames';
import { BchatIconButton } from '../icon';

type Props = {
  label?: string;
  error?: string;
  type?: string;
  value?: string;
  placeholder: string;
  maxLength?: number;
  minLength?: number;
  enableShowHide?: boolean;
  onValueChanged?: (value: string) => any;
  onEnterPressed?: any;
  autoFocus?: boolean;
  ref?: any;
  inputDataTestId?: string;
  max?:string;
};

const LabelItem = (props: { inputValue: string; label?: string }) => {
  return (
    <label
      htmlFor="bchat-input-floating-label"
      className={classNames(
        props.inputValue !== ''
          ? 'bchat-input-with-label-container filled'
          : 'bchat-input-with-label-container'
      )}
    >
      {props.label}
    </label>
  );
};

const ErrorItem = (props: { error: string | undefined }) => {
  return (
    <label
      htmlFor="bchat-input-floating-label"
      className={classNames('bchat-input-with-label-container filled error')}
    >
      {props.error}
    </label>
  );
};

const ShowHideButton = (props: { toggleForceShow: () => void,forceShow:boolean }) => {
  
    return <BchatIconButton iconType={!props.forceShow?"eye":'eye_closed'} iconSize="medium" fillRule="evenodd" clipRule="evenodd" onClick={props.toggleForceShow} />;
};

export const BchatInput = (props: Props) => {
  const {
    autoFocus,
    placeholder,
    type,
    value,
    maxLength,
    minLength,
    enableShowHide,
    error,
    label,
    onValueChanged,
    inputDataTestId,
    max
  } = props;
  const [inputValue, setInputValue] = useState('');
  const [forceShow, setForceShow] = useState(false);

  const correctType = forceShow ? 'text' : type;
  const updateInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const val = e.target.value;
    setInputValue(val);
    if (onValueChanged) {
      onValueChanged(val);
    }
  };

  return (
    <div className="bchat-input-with-label-container">
      {error && (
        <ErrorItem error={props.error} />
      ) }
      { label &&(
        <LabelItem inputValue={inputValue} label={label} />
      )}
      <input
        id="bchat-input-floating-label"
        type={correctType}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        minLength={minLength}
        autoFocus={autoFocus}
        data-testid={inputDataTestId}
        max={max}
        onChange={updateInputValue}
        className={classNames(enableShowHide ? 'bchat-input-floating-label-show-hide' : '')}
        // just incase onChange isn't triggered
        onBlur={updateInputValue}
        onKeyPress={event => {
          if (event.key === 'Enter' && props.onEnterPressed) {
            props.onEnterPressed(); 
          }
        }}
      />
      
      {enableShowHide && (
        <ShowHideButton
          toggleForceShow={() => {
            setForceShow(!forceShow);
          }} forceShow={forceShow}
        />
      )}
    </div>
  );
};
