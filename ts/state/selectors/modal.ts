import { createSelector } from 'reselect';

import { StateType } from '../reducer';
import {
  AddModeratorsModalState,
  AdminLeaveClosedGroupModalState,
  BanOrUnbanUserModalState,
  ChangeNickNameModalState,
  ConfirmModalState,
  DeleteAccountModalState,
  EditProfileModalState,
  InviteContactModalState,
  ModalState,
  OnionPathModalState,
  RecoveryPhraseModalState,
  RemoveModeratorsModalState,
  BchatPasswordModalState,
  UpdateGroupMembersModalState,
  UpdateGroupNameModalState,
  UserDetailsModalState,
  ChangePasswordModalState,
  SettingMiniModalState,
  BchatUpdateInstruntionState,
  BnsLinkModalState,
  AboutBnsModalState,
  MessageMoreInfoState,
  CommunityGuidelinesModalState,
  ReactModalsState,
} from '../ducks/modalDialog';

export const getModal = (state: StateType): ModalState => {
  return state.modals;
};

export const getConfirmModal = createSelector(
  getModal,
  (state: ModalState): ConfirmModalState => state.confirmModal
);

export const getInviteContactModal = createSelector(
  getModal,
  (state: ModalState): InviteContactModalState => state.inviteContactModal
);

export const getAddModeratorsModal = createSelector(
  getModal,
  (state: ModalState): AddModeratorsModalState => state.addModeratorsModal
);

export const getRemoveModeratorsModal = createSelector(
  getModal,
  (state: ModalState): RemoveModeratorsModalState => state.removeModeratorsModal
);

export const getBanOrUnbanUserModalState = createSelector(
  getModal,
  (state: ModalState): BanOrUnbanUserModalState => state.banOrUnbanUserModal
);

export const getUpdateGroupNameModal = createSelector(
  getModal,
  (state: ModalState): UpdateGroupNameModalState => state.groupNameModal
);

export const getUpdateGroupMembersModal = createSelector(
  getModal,
  (state: ModalState): UpdateGroupMembersModalState => state.groupMembersModal
);

export const getUserDetailsModal = createSelector(
  getModal,
  (state: ModalState): UserDetailsModalState => state.userDetailsModal
);

export const getChangeNickNameDialog = createSelector(
  getModal,
  (state: ModalState): ChangeNickNameModalState => state.nickNameModal
);

export const getEditProfileDialog = createSelector(
  getModal,
  (state: ModalState): EditProfileModalState => state.editProfileModal
);
export const getBnsLinkDialog = createSelector(
  getModal,
  (state: ModalState): BnsLinkModalState => state.bnsLinkModal
);

export const getOnionPathDialog = createSelector(
  getModal,
  (state: ModalState): OnionPathModalState => state.onionPathModal
);

export const getRecoveryPhraseDialog = createSelector(
  getModal,
  (state: ModalState): RecoveryPhraseModalState => state.recoveryPhraseModal
);

export const getAdminLeaveClosedGroupDialog = createSelector(
  getModal,
  (state: ModalState): AdminLeaveClosedGroupModalState => state.adminLeaveClosedGroup
);

export const getBchatPasswordDialog = createSelector(
  getModal,
  (state: ModalState): BchatPasswordModalState => state.bchatPasswordModal
);

export const getDeleteAccountModalState = createSelector(
  getModal,
  (state: ModalState): DeleteAccountModalState => state.deleteAccountModal
);

export const getChangePasswordModalState = createSelector(
  getModal,
  (state: ModalState): ChangePasswordModalState => state.ChangePasswordModal
);
export const getSettingMiniModalState = createSelector(
  getModal,
  (state: ModalState): SettingMiniModalState => state.SettingMiniModal
);
export const getBchatUpdateInstruntion = createSelector(
  getModal,
  (state: ModalState): BchatUpdateInstruntionState => state.BchatUpdateInstruntion
);
export const getAboutBnsModal = createSelector(
  getModal,
  (state: ModalState): AboutBnsModalState => state.aboutBnsModal
);
export const getMessageMoreInfoModal = createSelector(
  getModal,
  (state: ModalState): MessageMoreInfoState => state.messageMoreInfo
);
export const getCommunityGuidelinesModal = createSelector(
  getModal,
  (state: ModalState): CommunityGuidelinesModalState => state.communityGuidelinesModal
);
export const getReactListDialog = createSelector(
  getModal,
  (state: ModalState): ReactModalsState => state.reactListModalState
);

export const getReactClearAllDialog = createSelector(
  getModal,
  (state: ModalState): ReactModalsState => state.reactClearAllModalState
);

