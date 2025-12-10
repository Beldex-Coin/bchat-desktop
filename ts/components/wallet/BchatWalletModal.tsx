import classNames from 'classnames';
import { useState } from 'react';
import { BchatButtonColor } from '../basic/BchatButton';
import { SpacerSM } from '../basic/Text';
import { BchatWrapperModal } from '../BchatWrapperModal';
// import { useKey } from 'react-use';
import { BchatIcon } from '../icon';
import { Constants } from '../../bchat';

export const WalletModal = (props: any) => {
  const [select, setSelect] = useState(props.currency);
  const [data, setData] = useState(props.content);
  const [searchTerm, setSearchTerm] = useState('');
  const { needSearch } = props;
  //   useKey((event: KeyboardEvent) => {
  //     props.onClick(select);
  //     return event.key === 'Enter';
  //   });

  function search(sTerm: string) {
    setSearchTerm(sTerm.trim());
    if (sTerm.trim() !== '') {
      const filtered = props.content.filter((item: any) =>
        item.toLowerCase().includes(sTerm.toLowerCase())
      );
      setData(filtered);
    } else {
      setData(props.content);
    }
  }
  return (
    <div>
      <BchatWrapperModal
        title={props.headerName}
        onClose={props.onClose}
        showExitIcon={false}
        // headerReverse={true}
        okButton={{
          text: window.i18n('save'),
          color: BchatButtonColor.Primary,
          onClickOkHandler: () => {
            props.onClick(select);
          },
        }}
        cancelButton={{
          status: true,
          text: window.i18n('cancel'),
          onClickCancelHandler: props.onClose,
        }}
      >
        <div >
          {needSearch && (
            <>
              <SpacerSM />
              <div>
                <div className="currency-search">
                  <div className="search">
                    <BchatIcon iconSize={20} iconType="search" />
                  </div>
                  <input
                    value={searchTerm}
                    onChange={e => {
                      const inputValue = e.target.value;
                      search(inputValue);
                    }}
                    placeholder={'Search Currency'}
                    maxLength={26}
                  />
                </div>
              </div>
              <SpacerSM />
            </>
          )}
          <div className="bchat-modal__walletModel" style={{height:needSearch?'300px':""}}>
            <div style={{ width: '100%', overflowY: 'auto' }}>
              {data?.length !== 0 &&
                data.map((item: any, i: any) => (
                  <>
                    <div
                      className={classNames(
                        'bchat-modal__centered-walletModalContent',
                        select === item && 'isSelect'
                      )}
                      key={i}
                      onClick={() => setSelect(item)}
                    >
                      <div
                        className={
                          select !== item
                            ? 'bchat-modal__centered-walletModalContent-circle'
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
            {/* <SpacerMD /> */}
          </div>
          {/* <div className="bchat-modal__button-group__center"> */}
          {/* <BchatButton
                        text={window.i18n('cancel')}
                        buttonType={BchatButtonType.Default}
                        buttonColor={BchatButtonColor.Primary}
                        onClick={props.onClose}
                        style={{
                            width: '100px',
                            borderRadius: '5px'
                        }}
                    /> */}
          {/* <BchatButton
                        text={window.i18n('save')}
                        buttonType={BchatButtonType.Default}
                        buttonColor={BchatButtonColor.Green}
                        onClick={() => { props.onClick(select) }}
                        style={{
                            width: '100px',
                            borderRadius: '5px'
                        }}
                    /> */}

          {/* </div> */}
        </div>
      </BchatWrapperModal>
    </div>
  );
};
