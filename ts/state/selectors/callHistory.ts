import { createSelector } from "reselect";
import { CallHistoryState } from "../ducks/callHistory";
import { StateType } from "../reducer";


export const getCallHistory = (state: StateType): CallHistoryState => state.callHistory;

export const getCallHistoryList = createSelector(
    getCallHistory,
  (state: CallHistoryState): object[] => state.callHistoryList
);