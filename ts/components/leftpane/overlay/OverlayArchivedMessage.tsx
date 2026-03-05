import { useDispatch, useSelector } from 'react-redux';
import { getArchivedConversations } from '../../../state/selectors/conversations';
import styled from 'styled-components';
import { SpacerLG } from '../../basic/Text';
import { BchatIconButton } from '../../icon/BchatIconButton';
import { SectionType, setOverlayMode, showLeftPaneSection } from '../../../state/ducks/section';
import { MemoConversationListItemWithDetails } from '../conversation-list-item/ConversationListItem';
import { Flex } from '../../basic/Flex';

const ArchivedListContainer = styled.div`
  padding: 15px;
  max-height: 75vh;
  overflow-y: auto;
  // margin-bottom: auto;
`;
const OverlayArchivedMessage = () => {
  const archivedConversations = useSelector(getArchivedConversations);
  const dispatch = useDispatch();
  const keepChatArchived = Boolean(window.getSettingValue('settingsKeepChatArchived'));
  const archivedDiscription = keepChatArchived
    ? window.i18n('archivedKeepChatDescription')
    : window.i18n('archivedDescription');
    const openSettings = () => {
      // show open settings
      dispatch(showLeftPaneSection(SectionType.Settings));
      dispatch(setOverlayMode(undefined));
    }
  return (
    <ArchivedListContainer>
      <SpacerLG />

      <Flex
        container={true}
        flexDirection={'row'}
        alignItems="center"
        className="module-left-pane-overlay-closed--header"
      >
        {' '}
        <BchatIconButton
          onClick={() => {
            dispatch(setOverlayMode(undefined));
          }}
          iconType="chevron"
          iconRotation={90}
          iconSize="large"
          // margin="0 0 var(--margins-xs) var(--margins-xs)"
        />
        <span>{window.i18n('archived')}</span>
      </Flex>
      <SpacerLG />
      <div style={{ wordBreak: 'break-all', maxWidth: '290px' }}>
        {archivedDiscription},
        <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={openSettings}>Tap to change</span>
      </div>
      <SpacerLG />
      {archivedConversations.map(conversation => {
        return (
          <MemoConversationListItemWithDetails
            key={conversation.id}
            isMessageRequest={true}
            {...conversation}
          />
        );
      })}
    </ArchivedListContainer>
  );
};

export default OverlayArchivedMessage;
