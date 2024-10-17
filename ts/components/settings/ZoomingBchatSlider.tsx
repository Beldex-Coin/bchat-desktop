// import Slider from 'rc-slider';
import React, { useState } from 'react';
// tslint:disable-next-line: no-submodule-imports

import useUpdate from 'react-use/lib/useUpdate';
import { BchatSettingsItemWrapper } from './BchatSettingListItem';
// import { BchatIconButton } from '../icon';

// import Dropdown from 'react-dropdown';
// import 'react-dropdown/style.css';

// import Select from 'react-select'
import { useDispatch } from 'react-redux';
import { walletSettingMiniModal } from '../../state/ducks/modalDialog';
import { BchatIcon } from '../icon';


// const options = [
//   { value: 50, label: '50%' },
//   { value: 75, label: '75%' },
//   {value: 100, label: '100%'},
//   {value: 125, label: '125%'},
//   { value: 150, label: '150%' },

// ]
const option = ['50%', '75%', '100%', '125%', '150%']

export const ZoomingBchatSlider = (props: { onSliderChange?: (value: number) => void }) => {
  const currentValueFromSettings = window.getSettingValue('zoom-factor-setting') || 100;
  const forceUpdate = useUpdate();
  // const zoomSize=options.filter((item)=>item.value===currentValueFromSettings)
  const [value, setValue] = useState(currentValueFromSettings);
  const dispatch = useDispatch()
  // const [value,setValue]=useState(zoomSize)

  // const handleSlider = (valueToForward:any) => {    
  //   props?.onSliderChange?.(valueToForward.value);
  //   window.setSettingValue('zoom-factor-setting', valueToForward.value);
  //   setValue(valueToForward)
  //   window.updateZoomFactor();
  //   forceUpdate();
  // };

  const handleSlider = (valueToForward: any) => {
    let value = valueToForward.substring(0, valueToForward.length - 1)
    console.log("value:",value)
    if(value == 100){
      value =85;
    }
    console.log("value1:",value)
    props?.onSliderChange?.(value);
    window.setSettingValue('zoom-factor-setting', value);
    setValue(value)
    window.updateZoomFactor();
    dispatch(walletSettingMiniModal(null))
    forceUpdate();

  };

  // const customStyles = {
  //   option: (provided: any, state: any) => ({
  //     ...provided,
  //     // borderBottom: '1px dotted pink',
  //     // color: state.isSelected ? '#128b17' : 'var(--color-text)',
  //     color: state.isSelected ? 'var(--color-text)' : 'var(--color-text)',
  //     backgroundColor: state.isFocused ?"#00B504":null,
  //     textAlign:'center',
  //     padding:"10 2",

  //   }),


  //   singleValue: (provided:any, state:any) => ({
  //     ...provided,
  //     opacity : state.isDisabled ? 0.5 : 1,
  //     transition : 'opacity 300ms',
  //     color:"var(--color-text)",



  //   }),
  //   container:(provided:any) => ({
  //     ...provided,
  //     backgroundColor:"transparent",
  //       }),
  //   control:(provided:any) => ({
  //     ...provided,
  //     backgroundColor:"var(--color-inboxBgColor)",
  //     border:"none",
  //     outline:"none",
  //     width:"90px" 
  //   }),
  //   indicatorSeparator:(provided:any) => ({
  //     ...provided,
  //    display:"none"
  //   }),
  //   menu:(provided:any,) => ({
  //     ...provided,
  //     backgroundColor:"var(--color-inboxBgColor)",
  //     zIndex:10000
  //   }),
  // }
  function displayPopUp() {
    dispatch(
      walletSettingMiniModal({
        headerName: 'Zoom Level',
        content: option,
        currency: value + '%',
        onClose: () => dispatch(walletSettingMiniModal(null)),
        onClick: (e: any) => {
          console.log(e);
          handleSlider(e)
        },
      })
    )
  }
  return (
    <BchatSettingsItemWrapper title={window.i18n('zoomFactorSettingTitle')} inline={true} iconType='zoom'>
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
      {/* <div className="bchat-settings-item__selection"> */}
      <div className="bchat-settings-item__dropdownValue" onClick={() => displayPopUp()}>
        {/* <Select
      styles={customStyles}
        options={options}
         value={value}
        onChange={(e)=>handleSlider(e)}
        isSearchable={false}
        placeholder={""}
    /> */}
        <div >
          {value}%
        </div>
        <BchatIcon iconSize="small" iconType="chevron" iconRotation={270} />

      </div>


    </BchatSettingsItemWrapper>
  );
};
