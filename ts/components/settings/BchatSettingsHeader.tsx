import React from 'react';
import { BchatSettingCategory, SettingsViewProps } from './BchatSettings';
// import { Avatar, AvatarSize, BNSWrapper } from '../avatar/Avatar';
// import { editProfileModal } from '../../state/ducks/modalDialog';
import { useDispatch, useSelector } from 'react-redux';
// import { getOurNumber } from '../../state/selectors/user';
import { BchatIconButton } from '../icon/BchatIconButton';
import { toggleMultipleSelection } from '../../state/ducks/userConfig';
import { getMultipleSelection } from '../../state/selectors/userConfig';
import { getBlockedPubkeys } from '../../state/selectors/conversations';
// import { getConversationController } from '../../bchat/conversations';
// import { useUpdate } from 'react-use';

type Props = Pick<SettingsViewProps, 'category'> & {
  categoryTitle: string;
};

export const SettingsHeader = (props: Props) => {
  const { categoryTitle,category } = props;
  // const forceUpdate = useUpdate();

  const dispatch = useDispatch();
  // const ourNumber = useSelector(getOurNumber);
  // const converstation = getConversationController().get(ourNumber);

  // let color: any;
  const multipleSelectionValue = useSelector(getMultipleSelection);
  const blockedNumbers = useSelector(getBlockedPubkeys);

  // const temp=useSelector(state=>state)
  // useEffect(() => {
  //   if (multipleSelectionValue) {
  //     color = 'var(--color-text)';
  //     forceUpdate()
  //   }
  //   else {
  //     color = "";
  //     forceUpdate()
  //   }
  // }, [multipleSelectionValue])

  if(category === BchatSettingCategory.Wallet)
  {
    return <></>
  }

  return (
    <div className="bchat-settings-header">
      {/* <div style={{ paddingLeft: '15px' }}>
        <BNSWrapper
          // size={52}
          position={{ left: '34px', top: '34px' }}
          isBnsHolder={converstation?.attributes?.isBnsHolder}
          size={{width:'20',height:'20'}}
        >
          <Avatar
            size={AvatarSize.M}
            onAvatarClick={() => dispatch(editProfileModal({}))}
            pubkey={ourNumber}
            dataTestId="leftpane-primary-avatar"
          />
        </BNSWrapper>
      </div> */}
      <div className="bchat-settings-header-title">{categoryTitle}</div>
      {window.i18n('blockedSettingsTitle') === categoryTitle && blockedNumbers.length != 0 && (
        <div className="bchat-settings-header-selectionBox">
          {multipleSelectionValue ? (
            <BchatIconButton
              iconSize="large"
              iconType="markAllDone"
              onClick={() => {
                dispatch(toggleMultipleSelection());
              }}
            />
          ) : (
            <BchatIconButton
              iconSize="large"
              iconType="markAll"
              onClick={() => {
                dispatch(toggleMultipleSelection());
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
