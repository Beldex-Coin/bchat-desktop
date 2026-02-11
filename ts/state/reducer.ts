import { combineReducers } from 'redux';

import { reducer as search, SearchStateType } from './ducks/search';
import { ConversationsStateType, reducer as conversations } from './ducks/conversations';
import { reducer as user, UserStateType } from './ducks/user';
import { reducer as theme, ThemeStateType } from './ducks/theme';
import {reducer as isVerifyBnsCalled ,IsVerifyBnsCalledStateType} from './ducks/bnsConfig'
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
import {reducer as callHistory,CallHistoryState} from "./ducks//callHistory";


export type StateType = {
  search: SearchStateType;
  user: UserStateType;
  conversations: ConversationsStateType;
  theme: ThemeStateType;
  isVerifyBnsCalled:IsVerifyBnsCalledStateType;
  section: SectionStateType;
  defaultRooms: DefaultRoomsState;
  onionPaths: OnionState;
  modals: ModalState;
  userConfig: UserConfigState;
  timerOptions: TimerOptionsState;
  stagedAttachments: StagedAttachmentsStateType;
  call: CallStateType;
  callHistory:CallHistoryState

};

export const reducers:any  = {
  search,
  conversations,
  user,
  theme,
  isVerifyBnsCalled,
  section,
  defaultRooms,
  onionPaths,
  modals,
  userConfig,
  timerOptions,
  stagedAttachments,
  call,
  callHistory
};

// Making this work would require that our reducer signature supported AnyAction, not
//   our restricted actions

export const rootReducer = combineReducers(reducers);
