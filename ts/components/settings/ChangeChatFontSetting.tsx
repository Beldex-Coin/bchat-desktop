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

const option = ["Small", 'Medium', 'large']


export const ChangeChatFontSetting = (props: { onSliderChange?: (value: number) => void }) => {
    const currentValueFromSettings = window.getSettingValue('font-size-setting') || "Small";
    const forceUpdate = useUpdate();
    // const zoomSize=options.filter((item)=>item.value===currentValueFromSettings)
    const [value, setValue] = useState(currentValueFromSettings);
    const dispatch = useDispatch();

    const handleSlider = (valueToForward: any) => {
        props?.onSliderChange?.(valueToForward);
        window.setSettingValue('font-size-setting', valueToForward);
        setValue(valueToForward)
        // window.updateZoomFactor();
        dispatch(walletSettingMiniModal(null))
        forceUpdate();

    };
    function displayPopUp() {
        dispatch(
            walletSettingMiniModal({
                headerName: window.i18n('chatFontSize'),
                content: option,
                currency: value,
                onClose: () => dispatch(walletSettingMiniModal(null)),
                onClick: (e: any) => {
                    // console.log(e);
                    handleSlider(e)
                },
            })
        )
    }

    return (
        <BchatSettingsItemWrapper title={window.i18n('chatFontSize')} inline={true} iconType='coverWithA'>
            <div className="bchat-settings-item-font-Change"  onClick={() => displayPopUp()}>
                <div>
                    {value}
                </div>
                <BchatIcon iconSize="small" iconType="chevron" iconRotation={270} />
            </div>
        </BchatSettingsItemWrapper>
    );
};