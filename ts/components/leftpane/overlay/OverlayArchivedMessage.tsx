import { useDispatch, useSelector } from 'react-redux';
import { getArchivedConversations } from '../../../state/selectors/conversations';
import styled from 'styled-components';
import { SpacerLG, SpacerSM } from '../../basic/Text';
import { BchatIconButton } from '../../icon/BchatIconButton';
import { setOverlayMode } from '../../../state/ducks/section';
import { MemoConversationListItemWithDetails } from '../conversation-list-item/ConversationListItem';
import { Flex } from '../../basic/Flex';
import { SettingsKey } from '../../../data/settings-key';
import { BchatToggle } from '../../basic/BchatToggle';
import { useClickAway, useUpdate } from 'react-use';
import { useEffect, useRef, useState } from 'react';
import { updateIsKeepChatArchived } from '../../../state/ducks/userConfig';
import { getIsKeepChatArchived } from '../../../state/selectors/userConfig';


const ArchivedListContainer = styled.div`
  max-height: 99vh;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: none;
  min-width: 300px;
  width: 25vw;
  max-width: 420px;
  padding: 15px;
  position: relative;
  // margin-bottom: auto;
`;
const OverlayArchivedMessage = () => {
  const archivedConversations = useSelector(getArchivedConversations);
  const dispatch = useDispatch();
  const [isopenPopup, setIsOpenPopup] = useState(false);
  const popUpRef = useRef<HTMLDivElement>(null);
  const keepChatArchived = Boolean(useSelector(getIsKeepChatArchived));
  const archivedDiscription = keepChatArchived
    ? window.i18n('archivedKeepChatDescription')
    : window.i18n('archivedDescription');

  useEffect(()=>{
    if(archivedConversations.length===0)
     window.inboxStore?.dispatch(setOverlayMode(undefined));
  },[archivedConversations])
  useClickAway(popUpRef, () => {
    setIsOpenPopup(false);
  });
  const openPopUp=() => {
    setIsOpenPopup(true);
  }
  return (
    <ArchivedListContainer className='archivedList'>
       <KeepChatArchivedPopup isopenPopup={isopenPopup} popUpRef={popUpRef} />
      <SpacerLG />
      <Flex
        container={true}
        flexDirection={'row'}
        alignItems="center"
        justifyContent="space-between"
        className="module-left-pane-overlay-closed--header"
      >
        <Flex container={true} alignItems="center" flexDirection="row">
          <BchatIconButton
            onClick={() => {
              dispatch(setOverlayMode(undefined));
            }}
            iconType="backArrowInlineUnfilled"
            iconSize={25}
            iconColor='var(--color-unfilled-back-btn)'
          />
          <SpacerSM />
          <StyledHeader>{window.i18n('archivedChat')}</StyledHeader>
          </Flex>
          <BchatIconButton iconType="ellipses" iconSize={24}  onClick={openPopUp} />
        </Flex>
      <SpacerLG />
      <StyledArchiveDescription className="archivedDesc">
        {archivedDiscription}
        <span onClick={openPopUp}>{window.i18n('tapToChange')}</span>
      </StyledArchiveDescription>
      <SpacerLG />
      <ListContainer className='list-container'>
      {archivedConversations.map(conversation => {
        return (
          <MemoConversationListItemWithDetails
            key={conversation.id}
            isMessageRequest={true}
            {...conversation}
          />
        );
      })}
      </ListContainer>
    </ArchivedListContainer>
  );
};
type KeepChatArchivedPopupProps = {
  isopenPopup: boolean;
  popUpRef: React.RefObject<HTMLDivElement>;
};

const KeepChatArchivedPopup = ({ isopenPopup, popUpRef }:KeepChatArchivedPopupProps) => {
  const forceUpdate = useUpdate();
  const dispatch=useDispatch()
  const isKeepChatArchivedOn =  Boolean(useSelector(getIsKeepChatArchived));
   async function toggleKeepChatArchived() {
        window.setSettingValue(SettingsKey.settingsKeepChatArchived,!isKeepChatArchivedOn);
        dispatch(updateIsKeepChatArchived(!isKeepChatArchivedOn))
      }
  return (
    <StyledKeepChatArchivedPopupWrapper className='keepchatSettingWrapper' isopenPopup={isopenPopup} >
     <StyledKeepChatArchivedPopup ref={popUpRef}>
      <Flex container={true} justifyContent="center" alignItems="center" flexDirection="row">
        <div>
          <div className="title">{window.i18n('keepChatArchived')}</div>
          <div className="desc">{window.i18n('keepChatArchivedDescription')}</div>
        </div>
        <BchatToggle
          active={isKeepChatArchivedOn}
          onClick={async () => {
              await toggleKeepChatArchived();
              forceUpdate();
            }}
        />
      </Flex>
    </StyledKeepChatArchivedPopup>
    </StyledKeepChatArchivedPopupWrapper>
  );
};

export default OverlayArchivedMessage;

const StyledHeader = styled.div`
  font-weight: 600;
  font-size: 24px;
`;
const StyledArchiveDescription = styled.div`
  word-break: break-word;
  // max-width: 290px;
  border: 1px solid var(--color-profile-info-border);
  padding: 9px;
  border-radius: 20px;
  color: #a7a7ba;
  font-size: 16px;
  span {
    cursor: pointer;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const StyledKeepChatArchivedPopup = styled.div`

position: absolute;
background: var(--color-archived-setting-popup-bg);
box-shadow: var(--color-bchat-shadow);
margin: 0 15px;
margin-top: 83px;
z-index: 9;
border-radius: 19px;
padding: 15px;
.title{
  font-weight: 300;
  font-size: 16px;
}
  .desc{
    font-weight: 300;
    font-size: 14px;
    margin-top: 5px;
    color: var(--color-archived-setting-popup-desc);
    margin-right:10px;
`;

const StyledKeepChatArchivedPopupWrapper = styled.div <{ isopenPopup: boolean }>`
  display: ${props => (props.isopenPopup ? 'flex' : 'none')};
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9;

` 

const ListContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
   &::-webkit-scrollbar {
  display: none; /* or width: 0; height: 0; */
}
  `