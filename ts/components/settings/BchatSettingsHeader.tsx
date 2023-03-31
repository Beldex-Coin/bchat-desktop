import React from 'react';
import { SettingsViewProps } from './BchatSettings';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { editProfileModal, } from '../../state/ducks/modalDialog';
import { useDispatch, useSelector } from 'react-redux';
import { getOurNumber } from '../../state/selectors/user';
import { BchatIconButton } from '../icon/BchatIconButton';
 import { toggleMultipleSelection } from '../../state/ducks/userConfig';
import { getMultipleSelection } from '../../state/selectors/userConfig';
// import { useUpdate } from 'react-use';

type Props = Pick<SettingsViewProps, 'category'> & {
  categoryTitle: string;
};

export const SettingsHeader = (props: Props) => {

  const { categoryTitle } = props;
  // const forceUpdate = useUpdate();

  const dispatch = useDispatch();
  const ourNumber = useSelector(getOurNumber);
  // let color: any;
  const multipleSelectionValue = useSelector(getMultipleSelection);
  // const temp=useSelector(state=>state)
  // console.log('multipleSelectionValue', multipleSelectionValue,temp);

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

  return (
    <div className="bchat-settings-header">
      <div style={{ paddingLeft: '15px' }}>
        <Avatar
          size={AvatarSize.M}
          onAvatarClick={() => dispatch(editProfileModal({}))}
          pubkey={ourNumber}
          dataTestId="leftpane-primary-avatar"
        />
      </div>
      <div className="bchat-settings-header-title">{categoryTitle}</div>
      {window.i18n('blockedSettingsTitle') === categoryTitle &&
        <div className='bchat-settings-header-selectionBox'>
          {multipleSelectionValue ?
            <BchatIconButton
              iconSize="medium"
              iconType="markAllDone"

              onClick={() => { dispatch(toggleMultipleSelection()) }}
            />
            :
            <BchatIconButton
              iconSize="medium"
              iconType="markAll"

              onClick={() => { dispatch(toggleMultipleSelection()) }}
            />
          }
        </div>
      }
      
    </div>
  );
};
