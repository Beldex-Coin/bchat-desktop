// import Slider from 'rc-slider';
import React, { useState } from 'react';
// tslint:disable-next-line: no-submodule-imports

import useUpdate from 'react-use/lib/useUpdate';
import { BchatSettingsItemWrapper } from './BchatSettingListItem';
// import { BchatIconButton } from '../icon';

// import Dropdown from 'react-dropdown';
// import 'react-dropdown/style.css';

import Select from 'react-select'



const options = [
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  {value: 100, label: '100%'},
  {value: 125, label: '125%'},
  { value: 150, label: '150%' },

]


export const ZoomingBchatSlider = (props: { onSliderChange?: (value: number) => void }) => {
  const currentValueFromSettings = window.getSettingValue('zoom-factor-setting') || 100;
  const forceUpdate = useUpdate();
  const zoomSize=options.filter((item)=>item.value===currentValueFromSettings)
  const [value,setValue]=useState(zoomSize)

  const handleSlider = (valueToForward:any) => {    
    props?.onSliderChange?.(valueToForward.value);
    window.setSettingValue('zoom-factor-setting', valueToForward.value);
    setValue(valueToForward)
    window.updateZoomFactor();
    forceUpdate();
  };
 
  console.log("currentValueFromSettings",currentValueFromSettings);
  
  
  const customStyles = {
    option: (provided:any, state:any) => ({
      ...provided,
      // borderBottom: '1px dotted pink',
      color: state.isSelected ? '#128b17' : 'white',
    
      textAlign:'center',
      padding:"10 2",

    }),
   
    singleValue: (provided:any, state:any) => ({
      ...provided,
      opacity : state.isDisabled ? 0.5 : 1,
      transition : 'opacity 300ms',
      color:"white",
      
  
     
    }),
    container:(provided:any) => ({
      ...provided,
      backgroundColor:"transparent",
        }),
    control:(provided:any) => ({
      ...provided,
      backgroundColor:"#3A3A4E",
      border:"none",
      outline:"none",
      width:"90px" 
    }),
    indicatorSeparator:(provided:any) => ({
      ...provided,
     display:"none"
    }),
    menu:(provided:any,) => ({
      ...provided,
      backgroundColor:"#3A3A4E",
    }),
  }
  
  return (
    <BchatSettingsItemWrapper title={window.i18n('zoomFactorSettingTitle')} inline={true}>
      {/* <div className="slider-wrapper">
        <Slider
          dots={true}
          step={20}
          min={60}
          max={200}
          defaultValue={currentValueFromSettings}
          onAfterChange={handleSlider}  
        /> 

        <div className="slider-info">
          <p>{currentValueFromSettings}%</p>
        </div>
      </div> */}
      <div className="bchat-settings-item__selection">
      <Select
      styles={customStyles}
        options={options}
         value={value}
        onChange={(e)=>handleSlider(e)}
        isSearchable={false}
        placeholder={""}
    />
      
    </div>
    
   
    </BchatSettingsItemWrapper>
  );
};
