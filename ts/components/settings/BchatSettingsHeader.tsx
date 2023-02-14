import React from 'react';
import { SettingsViewProps } from './BchatSettings';
import { Avatar, AvatarSize } from '../avatar/Avatar';
import { editProfileModal, } from '../../state/ducks/modalDialog';
import { useDispatch, useSelector } from 'react-redux';
import { getOurNumber } from '../../state/selectors/user';
import { BchatIconButton } from '../icon/BchatIconButton';
import { blockedContactMarkAS } from '../../state/ducks/userConfig';
import { getBlockedContactMarkAS } from '../../state/selectors/userConfig';
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
  const blockedContactMarkASValue = useSelector(getBlockedContactMarkAS);
  console.log('blockedContactMarkASValue', blockedContactMarkASValue);

  // useEffect(() => {
  //   if (blockedContactMarkASValue) {
  //     color = 'var(--color-text)';
  //     forceUpdate()
  //   }
  //   else {
  //     color = "";
  //     forceUpdate()
  //   }
  // }, [blockedContactMarkASValue])

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
          {blockedContactMarkASValue ?
            <BchatIconButton
              iconSize="medium"
              iconType="markAllDone"

              onClick={() => { dispatch(blockedContactMarkAS()) }}
            />
            :
            <BchatIconButton
              iconSize="medium"
              iconType="markAll"

              onClick={() => { dispatch(blockedContactMarkAS()) }}
            />
          }
        </div>
      }
      
    </div>
  );
};
