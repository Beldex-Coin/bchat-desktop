// import React from 'react';
import { useSelector } from 'react-redux';
import {
  getAddModeratorsModal,
  getAdminLeaveClosedGroupDialog,
  getBanOrUnbanUserModalState,
  getChangeNickNameDialog,
  getConfirmModal,
  getDeleteAccountModalState,
  getEditProfileDialog,
  getInviteContactModal,
  getOnionPathDialog,
  getRecoveryPhraseDialog,
  getRemoveModeratorsModal,
  getBchatPasswordDialog,
  getUpdateGroupMembersModal,
  getUpdateGroupNameModal,
  getUserDetailsModal,
  getwalletSettingMiniModalState,
  getBchatUpdateInstruntion,
  getBnsLinkDialog,
  getAboutBnsModal,
  getMessageMoreInfoModal,
  getCommunityGuidelinesModal,
  // getReactListDialog,
  getReactClearAllDialog,
} from '../../state/selectors/modal';
import { AdminLeaveClosedGroupDialog } from './AdminLeaveClosedGroupDialog';
// import { InviteContactsDialog } from '../conversation/InviteContacts';
import { DeleteAccountModal } from './DeleteAccountModal';
import { EditProfileDialog } from './EditProfileDialog';
import { OnionPathModal } from './OnionStatusPathDialog';
import { UserDetailsDialog } from './UserDetailsDialog';
import { BchatConfirm } from './BchatConfirm';
import { BchatPasswordDialog } from './BchatPasswordDialog';
import { BchatSeedModal } from './BchatSeedModal';
import { AddModeratorsDialog } from './ModeratorsAddDialog';
import { RemoveModeratorsDialog } from './ModeratorsRemoveDialog';
import { UpdateGroupMembersDialog } from './UpdateGroupMembersDialog';
import { UpdateGroupNameDialog } from './UpdateGroupNameDialog';
import { BchatNicknameDialog } from './BchatNicknameDialog';
import { BanOrUnBanUserDialog } from './BanOrUnbanUserDialog';

import { WalletModal } from '../wallet/BchatWalletModal';

import BchatUpdateInstruntion from './updateInstructionModal';
import {BnsLinkDialog} from './BnsLinkDialog'
import { AboutBnsDialog } from './AboutBnsDialog';
import { MessageMoreInfoModal } from '../conversation/message/message-item/MessageDetail';
import { InviteContactsDialog } from './InviteContactDialog';
import { CommunityGuidelinesDialog } from './CommunityGuidelinesDialog';
// import { ReactListModal } from './ReactListModal';
import { ReactClearAllModal } from './ReactClearAllModal';




export const ModalContainer: any = () => {
  const confirmModalState = useSelector(getConfirmModal);
  const inviteModalState = useSelector(getInviteContactModal);
  const addModeratorsModalState = useSelector(getAddModeratorsModal);
  const removeModeratorsModalState = useSelector(getRemoveModeratorsModal);
  const updateGroupMembersModalState = useSelector(getUpdateGroupMembersModal);
  const updateGroupNameModalState = useSelector(getUpdateGroupNameModal);
  const userDetailsModalState = useSelector(getUserDetailsModal);
  const changeNicknameModal = useSelector(getChangeNickNameDialog);
  const editProfileModalState = useSelector(getEditProfileDialog);
  const bnsLinkModalState = useSelector(getBnsLinkDialog);
  const onionPathModalState = useSelector(getOnionPathDialog);
  const recoveryPhraseModalState = useSelector(getRecoveryPhraseDialog);
  const adminLeaveClosedGroupModalState = useSelector(getAdminLeaveClosedGroupDialog);
  const bchatPasswordModalState = useSelector(getBchatPasswordDialog);
  const deleteAccountModalState = useSelector(getDeleteAccountModalState);
  const banOrUnbanUserModalState = useSelector(getBanOrUnbanUserModalState);
  const walletSettingMiniModal = useSelector(getwalletSettingMiniModalState);
  const BchatUpdateInstruntionState = useSelector(getBchatUpdateInstruntion);
  const aboutBnsModalState=useSelector(getAboutBnsModal);
  const messageMoreInfoState=useSelector(getMessageMoreInfoModal);
  const communityGuidelinesModalState=useSelector(getCommunityGuidelinesModal);
  // const reactListModalState = useSelector(getReactListDialog);
  const reactClearAllModalState = useSelector(getReactClearAllDialog);

  return (
    <>
      {banOrUnbanUserModalState && <BanOrUnBanUserDialog {...banOrUnbanUserModalState} />}
      {inviteModalState && <InviteContactsDialog {...inviteModalState} />}
      {addModeratorsModalState && <AddModeratorsDialog {...addModeratorsModalState} />}
      {removeModeratorsModalState && <RemoveModeratorsDialog {...removeModeratorsModalState} />}
      {updateGroupMembersModalState && (
        <UpdateGroupMembersDialog {...updateGroupMembersModalState} />
      )}
      {updateGroupNameModalState && <UpdateGroupNameDialog {...updateGroupNameModalState} />}
      {userDetailsModalState && <UserDetailsDialog {...userDetailsModalState} />}
      {changeNicknameModal && <BchatNicknameDialog {...changeNicknameModal} />}
      {editProfileModalState && <EditProfileDialog {...editProfileModalState} />}
      {bnsLinkModalState && <BnsLinkDialog {...bnsLinkModalState} /> }

      {onionPathModalState && <OnionPathModal {...onionPathModalState} />}
      {recoveryPhraseModalState && <BchatSeedModal {...recoveryPhraseModalState} />}
      {adminLeaveClosedGroupModalState && (
        <AdminLeaveClosedGroupDialog {...adminLeaveClosedGroupModalState} />
      )}
      {bchatPasswordModalState && <BchatPasswordDialog {...bchatPasswordModalState} />}
      {deleteAccountModalState && <DeleteAccountModal {...deleteAccountModalState} />}
      {confirmModalState && <BchatConfirm {...confirmModalState} />}
      {walletSettingMiniModal && <WalletModal {...walletSettingMiniModal} />}
      {BchatUpdateInstruntionState && <BchatUpdateInstruntion {...BchatUpdateInstruntionState} />}
      {aboutBnsModalState && <AboutBnsDialog />}
      {messageMoreInfoState && <MessageMoreInfoModal {...messageMoreInfoState}/>}
      {communityGuidelinesModalState && <CommunityGuidelinesDialog  />}
      {/* {reactListModalState && <ReactListModal {...reactListModalState} />} */}
      {reactClearAllModalState && <ReactClearAllModal {...reactClearAllModalState} />}
    </>
  );
};
