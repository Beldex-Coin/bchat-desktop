import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BchatConfirmDialogProps } from '../../components/dialog/BchatConfirm';
import { PasswordAction } from '../../components/dialog/BchatPasswordDialog';
import { MessagePropsDetails } from './conversations';
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
export type BnsLinkModalState={} | null;
export type OnionPathModalState = EditProfileModalState;
export type RecoveryPhraseModalState = EditProfileModalState;
export type DeleteAccountModalState = EditProfileModalState;
export type MessageMoreInfoState=MessagePropsDetails | null;

export type BchatPasswordModalState = { passwordAction: PasswordAction; onOk: () => void } | null;

export type UserDetailsModalState = {
  conversationId: string;
  authorAvatarPath: string | null;
  userName: string;
} | null;

export type ChangePasswordModalState={} | null;
export type walletSettingMiniModalState={
  headerName:string,
  content:any,
  onClose:any,
  onClick:any,
  currency:string
} | null;

export type TransactionInitModalState={} | null;
export type InsufficientBalanceModalState={} |  null;
export type WalletSendConfirmState=any | null;
export type BchatUpdateInstruntionState=any | null;
export type BchatWalletPasswordModalState={from?:string} |null;
export type BchatWalletForgotPasswordModalState={}|null;
export type BchatAlertConfirmModalState=any |null;
export type AboutBnsModalState={} | null;
export type CommunityGuidelinesModalState={} | null;



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
  bnsLinkModal:BnsLinkModalState;
  onionPathModal: OnionPathModalState;
  recoveryPhraseModal: RecoveryPhraseModalState;
  adminLeaveClosedGroup: AdminLeaveClosedGroupModalState;
  bchatPasswordModal: BchatPasswordModalState;
  deleteAccountModal: DeleteAccountModalState;
  ChangePasswordModal:ChangePasswordModalState;
  walletSettingMiniModal:walletSettingMiniModalState;
  transactionInitModal:TransactionInitModalState;
  insufficientBalanceModal:InsufficientBalanceModalState;
  walletSendConfirm:WalletSendConfirmState;
  BchatUpdateInstruntion:BchatUpdateInstruntionState;
  BchatWalletPasswordModal:BchatWalletPasswordModalState;
  BchatWalletForgotPasswordModal:BchatWalletForgotPasswordModalState;
  BchatAlertConfirmModal:BchatAlertConfirmModalState;
  aboutBnsModal:AboutBnsModalState;
  messageMoreInfo:MessageMoreInfoState;
  communityGuidelinesModal:CommunityGuidelinesModalState;
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
  bnsLinkModal:null,
  onionPathModal: null,
  recoveryPhraseModal: null,
  adminLeaveClosedGroup: null,
  bchatPasswordModal: null,
  deleteAccountModal: null,
  ChangePasswordModal:null,
  walletSettingMiniModal:null,
  transactionInitModal:null,
  insufficientBalanceModal:null,
  walletSendConfirm:null,
  BchatUpdateInstruntion:null,
  BchatWalletPasswordModal:null,
  BchatWalletForgotPasswordModal:null,
  BchatAlertConfirmModal:null,
  aboutBnsModal:null,
  messageMoreInfo:null,
  communityGuidelinesModal:null
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
    bnsLinkModal(state, action: PayloadAction<BnsLinkModalState | null>) {
      return { ...state, bnsLinkModal: action.payload };
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
    ChangePasswordModal(state,action:PayloadAction<ChangePasswordModalState>)
    {
      return { ...state, ChangePasswordModal: action.payload };
    },
    walletSettingMiniModal(state,action:PayloadAction<walletSettingMiniModalState>)
    {
      return { ...state, walletSettingMiniModal: action.payload };
    },
    updateTransactionInitModal(state,action:PayloadAction<TransactionInitModalState>)
    {
      return { ...state, transactionInitModal: action.payload };
    },
    updateInsufficientBalanceModal(state,action:PayloadAction<InsufficientBalanceModalState>)
    {
      return { ...state, insufficientBalanceModal: action.payload };
    },
    updateSendConfirmModal(state,action:PayloadAction<WalletSendConfirmState>)
    {
      return { ...state, walletSendConfirm: action.payload };
    },
    updateBchatUpgradeInstructionModal(state,action:PayloadAction<BchatUpdateInstruntionState>)
    {
      return { ...state, BchatUpdateInstruntion: action.payload};
    },
    updateBchatWalletPasswordModal(state,action:PayloadAction<BchatWalletPasswordModalState>)
    {
      return { ...state, BchatWalletPasswordModal: action.payload};
    },
    updateBchatWalletForgotPasswordModal(state,action:PayloadAction<BchatWalletForgotPasswordModalState>)
    {
      return { ...state, BchatWalletForgotPasswordModal: action.payload};
    },
    updateBchatAlertConfirmModal(state,action:PayloadAction<BchatAlertConfirmModalState>)
    {
      return { ...state, BchatAlertConfirmModal: action.payload};
    },
    updateAboutBnsModal(state,action:PayloadAction<AboutBnsModalState>)
    {
      return { ...state, aboutBnsModal: action.payload};
    },
    updateMessageMoreInfoModal(state,action:PayloadAction<MessageMoreInfoState>)
    {
      return { ...state, messageMoreInfo: action.payload};
    },
    updateCommunityGuidelinesModal(state,action:PayloadAction<CommunityGuidelinesModalState>)
    {
      return { ...state, communityGuidelinesModal: action.payload};
    }
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
  bnsLinkModal,
  onionPathModal,
  recoveryPhraseModal,
  adminLeaveClosedGroup,
  bchatPassword,
  updateDeleteAccountModal,
  updateBanOrUnbanUserModal,
  ChangePasswordModal,
  walletSettingMiniModal,
  updateTransactionInitModal,
  updateInsufficientBalanceModal,
  updateSendConfirmModal,
  updateBchatUpgradeInstructionModal,
  updateBchatWalletPasswordModal,
  updateBchatWalletForgotPasswordModal,
  updateBchatAlertConfirmModal,
  updateAboutBnsModal,
  updateMessageMoreInfoModal,
  updateCommunityGuidelinesModal
} = actions;
export const modalReducer = reducer;
