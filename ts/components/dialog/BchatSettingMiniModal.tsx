import classNames from 'classnames';
import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import useKey from 'react-use/lib/useKey';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { SpacerSM } from '../basic/Text';
import { BchatWrapperModal } from '../BchatWrapperModal';
// import { useKey } from 'react-use';
import { BchatIcon } from '../icon';
import { Constants } from '../../bchat';
import { SettingMiniModalState } from '../../state/ducks/modalDialog';
import { getTheme } from '../../state/selectors/theme';

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
  const isDark = useSelector(getTheme) === 'dark';
  useKey('Escape', () => isDark && props?.onClose?.(), undefined, [isDark, props?.onClose]);

  // Dark theme: Figma 1:34208 "Font Size" picker - radio rows in a boxed list, the
  // picked row framed in green, the saved value tagged "Active", Cancel / Save underneath.
  if (isDark) {
    const saved = props?.selectedItem || '';
    return (
      <div className="bchat-dialog modal option-picker-overlay">
        <div
          className="bchat-confirm-wrapper"
          onMouseDown={e => {
            if (e.target === e.currentTarget) {
              props?.onClose?.();
            }
          }}
        >
          <div className="option-picker" role="dialog" aria-label={props?.headerName}>
            <p className="option-picker__title">{props?.headerName}</p>
            <div className="option-picker__box">
            <div className="option-picker__list" role="radiogroup">
              {data.map((item: { value: string; label: string }, i: number) => (
                <div
                  key={item.value}
                  role="radio"
                  aria-checked={select === item.value}
                  className={classNames('option-picker__option', select === item.value && 'is-selected')}
                  onClick={() => setSelect(item.value)}
                >
                  <span className="radio-dot" aria-hidden="true" />
                  <span className="option-picker__label">
                    {item.label}
                    {props?.contentSuffixes?.[i] && (
                      <span className="option-picker__suffix"> {props.contentSuffixes[i]}</span>
                    )}
                  </span>
                  {saved === item.value && (
                    <span className="option-picker__active">{window.i18n('pickerActive')}</span>
                  )}
                </div>
              ))}
            </div>
            </div>
            {hasNotes && (
              <div className="option-picker__note">
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
            )}
            <div className="option-picker__actions">
              <BchatButton
                text={window.i18n('cancel')}
                buttonType={BchatButtonType.Brand}
                buttonColor={BchatButtonColor.Secondary}
                onClick={props?.onClose}
              />
              <BchatButton
                text={props?.confirmButtonText || window.i18n('save')}
                buttonType={BchatButtonType.Brand}
                buttonColor={BchatButtonColor.Primary}
                onClick={() => props?.onClick(select)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
