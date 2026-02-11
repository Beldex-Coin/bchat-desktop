import classNames from 'classnames';
import { useState } from 'react';
import { BchatButtonColor } from '../basic/BchatButton';
import { SpacerSM } from '../basic/Text';
import { BchatWrapperModal } from '../BchatWrapperModal';
// import { useKey } from 'react-use';
import { BchatIcon } from '../icon';
import { Constants } from '../../bchat';
import { SettingMiniModalState } from '../../state/ducks/modalDialog';

export const BchatSettingMiniModal = (props: SettingMiniModalState) => {
  const [select, setSelect] = useState(props?.selectedItem||'');
  const data=props?.content || []
  return (
    <div>
      <BchatWrapperModal
        title={props?.headerName}
        onClose={props?.onClose}
        showExitIcon={false}
        // headerReverse={true}
        okButton={{
          text: window.i18n('save'),
          color: BchatButtonColor.Primary,
          onClickOkHandler: () => {
            props?.onClick(select);
          },
        }}
        cancelButton={{
          status: true,
          text: window.i18n('cancel'),
          onClickCancelHandler: props?.onClose,
        }}
      >
          <div className="bchat-modal__settingMiniModel">
            <div style={{ width: '100%', overflowY: 'auto' }}>
              { data.map((item: string, i: number) => (
                  <>
                    <div
                      className={classNames(
                        'bchat-modal__centered-SettingMiniModalContent',
                        select === item && 'isSelect'
                      )}
                      key={i}
                      onClick={() => setSelect(item)}
                    >
                      <div
                        className={
                          select !== item
                            ? 'bchat-modal__centered-SettingMiniModalContent-circle'
                            : 'selected'
                        }
                      >
                        {select === item && (
                          <BchatIcon
                            iconType="circle"
                            iconSize={10}
                            iconColor={Constants.UI.COLORS.GREEN}
                          />
                        )}
                      </div>
                      {item}
                    </div>
                    <SpacerSM />
                  </>
                ))}
            </div>
          </div>
      </BchatWrapperModal>
    </div>
  );
};
