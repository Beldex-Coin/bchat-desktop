import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BchatConfirmDialogProps } from '../../components/dialog/BchatConfirm';
import { PasswordAction } from '../../components/dialog/BchatPasswordDialog';
export type BanType = 'ban' | 'unban';

export type ConfirmModalState = BchatConfirmDialogProps | null;
export type InviteContactModalState = { conversationId: string } | null;
export type BanOrUnbanUserModalState = {
  conversationId: string;
  banType: BanType;
  pubkey?: string;
} | null;
export type AddModeratorsModalState = InviteContactModalState;
export type RemoveModeratorsModalState = InviteContactModalState;
export type UpdateGroupMembersModalState = InviteContactModalState;
export type UpdateGroupNameModalState = InviteContactModalState;
export type ChangeNickNameModalState = InviteContactModalState;
export type AdminLeaveClosedGroupModalState = InviteContactModalState;
export type EditProfileModalState = {} | null;
export type OnionPathModalState = EditProfileModalState;
export type RecoveryPhraseModalState = EditProfileModalState;
export type DeleteAccountModalState = EditProfileModalState;

export type BchatPasswordModalState = { passwordAction: PasswordAction; onOk: () => void } | null;

export type UserDetailsModalState = {
  conversationId: string;
  authorAvatarPath: string | null;
  userName: string;
} | null;

export type ModalState = {
  confirmModal: ConfirmModalState;
  inviteContactModal: InviteContactModalState;
  banOrUnbanUserModal: BanOrUnbanUserModalState;
  removeModeratorsModal: RemoveModeratorsModalState;
  addModeratorsModal: AddModeratorsModalState;
  groupNameModal: UpdateGroupNameModalState;
  groupMembersModal: UpdateGroupMembersModalState;
  userDetailsModal: UserDetailsModalState;
  nickNameModal: ChangeNickNameModalState;
  editProfileModal: EditProfileModalState;
  onionPathModal: OnionPathModalState;
  recoveryPhraseModal: RecoveryPhraseModalState;
  adminLeaveClosedGroup: AdminLeaveClosedGroupModalState;
  bchatPasswordModal: BchatPasswordModalState;
  deleteAccountModal: DeleteAccountModalState;
};

export const initialModalState: ModalState = {
  confirmModal: null,
  inviteContactModal: null,
  addModeratorsModal: null,
  removeModeratorsModal: null,
  banOrUnbanUserModal: null,
  groupNameModal: null,
  groupMembersModal: null,
  userDetailsModal: null,
  nickNameModal: null,
  editProfileModal: null,
  onionPathModal: null,
  recoveryPhraseModal: null,
  adminLeaveClosedGroup: null,
  bchatPasswordModal: null,
  deleteAccountModal: null,
};

const ModalSlice = createSlice({
  name: 'modals',
  initialState: initialModalState,
  reducers: {
    updateConfirmModal(state, action: PayloadAction<ConfirmModalState | null>) {
      return { ...state, confirmModal: action.payload };
    },
    updateInviteContactModal(state, action: PayloadAction<InviteContactModalState | null>) {
      return { ...state, inviteContactModal: action.payload };
    },
    updateBanOrUnbanUserModal(state, action: PayloadAction<BanOrUnbanUserModalState | null>) {
      return { ...state, banOrUnbanUserModal: action.payload };
    },
    updateAddModeratorsModal(state, action: PayloadAction<AddModeratorsModalState | null>) {
      return { ...state, addModeratorsModal: action.payload };
    },
    updateRemoveModeratorsModal(state, action: PayloadAction<RemoveModeratorsModalState | null>) {
      return { ...state, removeModeratorsModal: action.payload };
    },
    updateGroupNameModal(state, action: PayloadAction<UpdateGroupNameModalState | null>) {
      return { ...state, groupNameModal: action.payload };
    },
    updateGroupMembersModal(state, action: PayloadAction<UpdateGroupMembersModalState | null>) {
      return { ...state, groupMembersModal: action.payload };
    },
    updateUserDetailsModal(state, action: PayloadAction<UserDetailsModalState | null>) {
      return { ...state, userDetailsModal: action.payload };
    },
    changeNickNameModal(state, action: PayloadAction<ChangeNickNameModalState | null>) {
      return { ...state, nickNameModal: action.payload };
    },
    editProfileModal(state, action: PayloadAction<EditProfileModalState | null>) {
      return { ...state, editProfileModal: action.payload };
    },
    onionPathModal(state, action: PayloadAction<OnionPathModalState | null>) {
      return { ...state, onionPathModal: action.payload };
    },
    recoveryPhraseModal(state, action: PayloadAction<RecoveryPhraseModalState | null>) {
      return { ...state, recoveryPhraseModal: action.payload };
    },
    adminLeaveClosedGroup(state, action: PayloadAction<AdminLeaveClosedGroupModalState | null>) {
      return { ...state, adminLeaveClosedGroup: action.payload };
    },
    bchatPassword(state, action: PayloadAction<BchatPasswordModalState>) {
      return { ...state, bchatPasswordModal: action.payload };
    },
    updateDeleteAccountModal(state, action: PayloadAction<DeleteAccountModalState>) {
      return { ...state, deleteAccountModal: action.payload };
    },
  },
});

export const { actions, reducer } = ModalSlice;
export const {
  updateConfirmModal,
  updateInviteContactModal,
  updateAddModeratorsModal,
  updateRemoveModeratorsModal,
  updateGroupNameModal,
  updateGroupMembersModal,
  updateUserDetailsModal,
  changeNickNameModal,
  editProfileModal,
  onionPathModal,
  recoveryPhraseModal,
  adminLeaveClosedGroup,
  bchatPassword,
  updateDeleteAccountModal,
  updateBanOrUnbanUserModal,
} = actions;
export const modalReducer = reducer;
