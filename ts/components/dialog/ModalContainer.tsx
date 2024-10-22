import React from 'react';
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
  getChangePasswordModalState,
  getwalletSettingMiniModalState,
  getTransactionInitModal,
  getwalletSendConfirmModal,
  getBchatUpdateInstruntion,
  getBchatWalletPasswordModal,
  getBchatAlertConfirmModal,
  getBnsLinkDialog,
  getAboutBnsModal,
  getBchatWalletForgotPasswordModal,
  getMessageMoreInfoModal,
  getCommunityGuidelinesModal,
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
import { ChangePassword } from '../wallet/BchatWalletChangePassword';
import { WalletModal } from '../wallet/BchatWalletModal';
import { TransactionInitModal } from '../wallet/BchatWalletTransactionInitModal';
import { BchatSendConfirm } from './BchatWalletSendConfirmModal';
import BchatUpdateInstruntion from './updateInstructionModal';
import { BchatWalletPasswordModal } from './BchatWalletPasswordModal';
import { BchatAlertConfirmModal } from './bchatAlertConfirmModal';
import {BnsLinkDialog} from './BnsLinkDialog'
import { AboutBnsDialog } from './AboutBnsDialog';
import { BchatWalletForgotPasswordModal } from './BchatWalletForgotPasswordModal';
import { MessageMoreInfoModal } from '../conversation/message/message-item/MessageDetail';
import { InviteContactsDialog } from './InviteContactDialog';
import { CommunityGuidelinesDialog } from './CommunityGuidelinesDialog';


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
  const ChangePasswordModalState = useSelector(getChangePasswordModalState);
  const walletSettingMiniModal = useSelector(getwalletSettingMiniModalState);
  const TransactionInitModalState = useSelector(getTransactionInitModal);
  const BchatSendConfirmState = useSelector(getwalletSendConfirmModal);
  const BchatUpdateInstruntionState = useSelector(getBchatUpdateInstruntion);
  const BchatWalletPasswordModalState = useSelector(getBchatWalletPasswordModal);
  const BchatWalletForgotPasswordModalState=useSelector(getBchatWalletForgotPasswordModal)
  const BchatAlertConfirmModalState = useSelector(getBchatAlertConfirmModal);
  const aboutBnsModalState=useSelector(getAboutBnsModal);
  const messageMoreInfoState=useSelector(getMessageMoreInfoModal);
  const communityGuidelinesModalState=useSelector(getCommunityGuidelinesModal);


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
      {ChangePasswordModalState && <ChangePassword />}
      {walletSettingMiniModal && <WalletModal {...walletSettingMiniModal} />}
      {TransactionInitModalState && <TransactionInitModal />}
      {BchatSendConfirmState && <BchatSendConfirm {...BchatSendConfirmState} />}
      {BchatUpdateInstruntionState && <BchatUpdateInstruntion {...BchatUpdateInstruntionState} />}
      {BchatWalletPasswordModalState && (
        <BchatWalletPasswordModal {...BchatWalletPasswordModalState} />
      )}
      {BchatWalletForgotPasswordModalState && <BchatWalletForgotPasswordModal {...BchatWalletForgotPasswordModalState}/> }
      {BchatAlertConfirmModalState && <BchatAlertConfirmModal {...BchatAlertConfirmModalState} />}
      {aboutBnsModalState && <AboutBnsDialog />}
      {messageMoreInfoState && <MessageMoreInfoModal {...messageMoreInfoState}/>}
      {communityGuidelinesModalState && <CommunityGuidelinesDialog  />}
    </>
  );
};
