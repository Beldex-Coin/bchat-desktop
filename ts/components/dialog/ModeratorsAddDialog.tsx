import  { useState } from 'react';
import { PubKey } from '../../bchat/types';
import { ToastUtils } from '../../bchat/utils';
import { Flex } from '../basic/Flex';
import { ApiV2 } from '../../bchat/apis/open_group_api/opengroupV2';
import { getConversationController } from '../../bchat/conversations';
import { useDispatch, useSelector } from 'react-redux';
import { updateAddModeratorsModal } from '../../state/ducks/modalDialog';
import { BchatButtonColor } from '../basic/BchatButton';
import { BchatSpinner } from '../basic/BchatSpinner';
import { BchatWrapperModal } from '../BchatWrapperModal';
import { BchatIcon } from '../icon/BchatIcon';
import { getTheme } from '../../state/selectors/theme';

type Props = {
  conversationId: string;
};

export const AddModeratorsDialog = (props: Props) => {
  const { conversationId } = props;

  const dispatch = useDispatch();
  const convo = getConversationController().get(conversationId);

  const [inputBoxValue, setInputBoxValue] = useState('');
  const [addingInProgress, setAddingInProgress] = useState(false);
  const darkMode = useSelector(getTheme) === 'dark';

  const addAsModerator = async () => {
    // if we don't have valid data entered by the user
    const pubkey = PubKey.from(inputBoxValue);
    if (!pubkey) {
      window.log.info('invalid pubkey for adding as moderator:', inputBoxValue);
      ToastUtils.pushInvalidBchatId();
      return;
    }

    window?.log?.info(`asked to add moderator: ${pubkey.key}`);

    try {
      setAddingInProgress(true);
      let isAdded: any;
      // this is a v2 opengroup
      const roomInfos = convo.toOpenGroupV2();
      isAdded = await ApiV2.addModerator(pubkey, roomInfos);

      if (!isAdded) {
        window?.log?.warn('failed to add moderators:', isAdded);
        dispatch(updateAddModeratorsModal(null));
        ToastUtils.pushFailedToAddAsModerator();
      } else {
        window?.log?.info(`${pubkey.key} added as moderator...`);
        dispatch(updateAddModeratorsModal(null));
        ToastUtils.pushUserAddedToModerators();

        // clear input box
        setInputBoxValue('');
      }
    } catch (e) {
      window?.log?.error('Got error while adding moderator:', e);
    } finally {
      setAddingInProgress(false);
    }
  };

  const { i18n } = window;
  // const chatName = convo.get('name');

  // const title = `${i18n('addModerators')}: ${chatName}`;

  // const onPubkeyBoxChanges = (value: any) => {
  //   setInputBoxValue(value);
  // };

  return (
    <BchatWrapperModal
      showHeader={false}
      okButton={{
        text: i18n('add'),
        onClickOkHandler: addAsModerator,
        color: BchatButtonColor.Primary,
        disabled: addingInProgress || !inputBoxValue.length
      }}
      cancelButton={{
        text: window.i18n('cancel'),
        status: true,
        color: BchatButtonColor.Secondary,
        onClickCancelHandler: () => {
          dispatch(updateAddModeratorsModal(null));
        }

      }}
    >
      <Flex container={true} flexDirection="column" alignItems="center">
        <div className='moderator-addModeratorBox'>
          <BchatIcon iconType={'addModeratorIcon'} iconSize={56} fillRule="evenodd" clipRule="evenodd" iconColor={darkMode ? '#F0F0F0' : '#333333'} />
          <p className='addModeratortext'>Add Moderator</p>
        </div>
        <div className='moderator-inputBox'>
          <input
            type="text"
            value={inputBoxValue}
            placeholder={i18n('enterBchatID')}
            onChange={event => {
              setInputBoxValue(event.target.value)
            }}
          />
        </div>
        <BchatSpinner loading={addingInProgress} />
      </Flex>
    </BchatWrapperModal>
  );
};
