import classNames from 'classnames';
import { Fragment, useState } from 'react';
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
  // Optional: a note describing whichever option is currently selected, updating live as the
  // user clicks through the radio list (before they confirm). Only rendered when the caller
  // passes `descriptions` (parallel to `content` by index) - the Font Size picker doesn't, so it
  // keeps the plain radio list with no note.
  const descriptions = props?.descriptions;
  const hasNotes = !!descriptions && descriptions.length > 0;
  const selectedIndex = data.findIndex(option => option.value === select);
  return (
    <div>
      <BchatWrapperModal
        title={props?.headerName}
        onClose={props?.onClose}
        showExitIcon={false}
        // headerReverse={true}
        okButton={{
          text: props?.confirmButtonText || window.i18n('save'),
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
        <>
          <div
            className={classNames(
              'bchat-modal__settingMiniModel',
              hasNotes && 'bchat-modal__settingMiniModel--withNote'
            )}
          >
            <div style={{ width: '100%', overflowY: 'auto' }}>
              { data.map((item: { value: string; label: string }, i: number) => (
                  <Fragment key={item.value}>
                    <div
                      className={classNames(
                        'bchat-modal__centered-SettingMiniModalContent',
                        select === item.value && 'isSelect'
                      )}
                      onClick={() => setSelect(item.value)}
                    >
                      <div
                        className={
                          select !== item.value
                            ? 'bchat-modal__centered-SettingMiniModalContent-circle'
                            : 'selected'
                        }
                      >
                        {select === item.value && (
                          <BchatIcon
                            iconType="circle"
                            iconSize={10}
                            iconColor={Constants.UI.COLORS.GREEN}
                          />
                        )}
                      </div>
                      {item.label}
                      {props?.contentSuffixes?.[i] && (
                        <span className="bchat-modal__centered-SettingMiniModalContent-suffix">
                          {props.contentSuffixes[i]}
                        </span>
                      )}
                    </div>
                    <SpacerSM />
                  </Fragment>
                ))}
            </div>
          </div>
          {/* The note sits below the options box, on the modal's own background (not inside the
              box), left-aligned with a circled "i" - infoCircle is drawn as "!", so it's rotated
              180deg to read as "i".
              All notes are rendered stacked in the same grid cell, with only the selected one
              visible: the cell always takes the height of the LONGEST note, so the popup keeps
              one fixed height instead of growing/shrinking as the user clicks between options
              whose notes wrap to a different number of lines. */}
          {hasNotes && (
            <div className="bchat-modal__settingMiniModel-note">
              <BchatIcon iconType="infoCircle" iconSize="small" iconRotation={180} />
              <div className="bchat-modal__settingMiniModel-note-text">
                {descriptions?.map((description, i) => (
                  <span
                    key={i}
                    aria-hidden={i !== selectedIndex}
                    className={classNames(i !== selectedIndex && 'is-hidden')}
                  >
                    {description}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      </BchatWrapperModal>
    </div>
  );
};
