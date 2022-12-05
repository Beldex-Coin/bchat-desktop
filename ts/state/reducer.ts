import { combineReducers } from 'redux';

import { reducer as search, SearchStateType } from './ducks/search';
import { ConversationsStateType, reducer as conversations } from './ducks/conversations';
import { reducer as user, UserStateType } from './ducks/user';
import { reducer as theme, ThemeStateType } from './ducks/theme';
import {reducer as walletFocused, WalletSectionStateType  } from './ducks/walletSection'
import {reducer as walletInnerFocused, WalletInnerSectionStateType } from "./ducks/walletInnerSection"
import { reducer as section, SectionStateType } from './ducks/section';
import { defaultRoomReducer as defaultRooms, DefaultRoomsState } from './ducks/defaultRooms';
import { callReducer as call, CallStateType } from './ducks/call';

import { defaultOnionReducer as onionPaths, OnionState } from './ducks/onion';
import { modalReducer as modals, ModalState } from './ducks/modalDialog';
import { userConfigReducer as userConfig, UserConfigState } from './ducks/userConfig';
import { timerOptionReducer as timerOptions, TimerOptionsState } from './ducks/timerOptions';
import {
  reducer as stagedAttachments,
  StagedAttachmentsStateType,
} from './ducks/stagedAttachments';
import { reducer as wallet,WalletStateType } from './ducks/wallet';
import { reducer as daemon,DaemonStateType } from './ducks/daemon';
import {reducer as walletConfig, WalletConfigState } from "./ducks/walletConfig"

export type StateType = {
  search: SearchStateType;
  user: UserStateType;
  conversations: ConversationsStateType;
  theme: ThemeStateType;
  wallet: WalletStateType;
  daemon: DaemonStateType;
  section: SectionStateType;
  defaultRooms: DefaultRoomsState;
  onionPaths: OnionState;
  modals: ModalState;
  userConfig: UserConfigState;
  timerOptions: TimerOptionsState;
  stagedAttachments: StagedAttachmentsStateType;
  call: CallStateType;
  walletFocused:WalletSectionStateType
  walletInnerFocused:WalletInnerSectionStateType;
  walletConfig:WalletConfigState

};

export const reducers = {
  search,
  conversations,
  user,
  wallet,
  daemon,
  theme,
  section,
  defaultRooms,
  onionPaths,
  modals,
  userConfig,
  timerOptions,
  stagedAttachments,
  call,
  walletFocused,
  walletInnerFocused,
  walletConfig
};

// Making this work would require that our reducer signature supported AnyAction, not
//   our restricted actions
// @ts-ignore
export const rootReducer = combineReducers(reducers);
