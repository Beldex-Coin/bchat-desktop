import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { getCallMessagesByConversation } from '../../data/data';
import { getDirectContacts } from '../selectors/conversations';

// Each call detail entry
interface CallDetail {
  callType: 'started-call' | 'missed-call' | 'ended-call';
  messageId: string;
  timeStamp: number;
}

// Main call notification object
interface CallNotification {
  callNotificationType: 'started-call' | 'missed-call' | 'ended-call';
  call_details: CallDetail[];
  conversationId: string;
  direction: 'incoming' | 'outgoing';
  received_at: number;
}

export type CallHistoryState = {
  callHistoryList: CallNotification[];
};
export const initialCallHistoryState: CallHistoryState = {
  callHistoryList: [],
};
const callHistorySlice = createSlice({
  name: 'callHistory',
  initialState: initialCallHistoryState,
  reducers: {
    updateCallhistory: (state: CallHistoryState, action: PayloadAction<CallNotification[]>) => {
      return { ...state, callHistoryList: action.payload };
    },
  },
});

export const { actions, reducer } = callHistorySlice;
export const { updateCallhistory } = actions;
export const callHistoryReducer = reducer;

export async function openCallHistory() {
  const state = window.inboxStore?.getState();
  const members = getDirectContacts(state);
  const callHistory = (
    await Promise.all(members.map((item: any) => getCallMessagesByConversation(item.id)))
  ).flat();

  const sortedCallHistory = callHistory.sort((a: any, b: any) => b.received_at - a.received_at);
  let verify_data: any = null;
  const refinedHistory: any[] = [];

  for (const item of sortedCallHistory) {
    const verifyCalls =
      verify_data &&
      item.conversationId === verify_data.conversationId &&
      item.callNotificationType === verify_data.callNotificationType &&
      moment(item.received_at).isSame(moment(verify_data.received_at), 'day');
    if (verifyCalls) {
      verify_data.call_details.push({
        callType: item.callNotificationType,
        timeStamp: item.received_at,
        messageId: item.id,
      });
    } else {
      const newEntry = {
        callNotificationType: item.callNotificationType,
        conversationId: item.conversationId,
        direction: item.direction,
        received_at: item.received_at,
        call_details: [
          {
            callType: item.callNotificationType,
            timeStamp: item.received_at,
            messageId: item.id,
          },
        ],
      };

      refinedHistory.push(newEntry);
      verify_data = newEntry; // keep reference to current group
    }
  }
  window.inboxStore?.dispatch(updateCallhistory(refinedHistory));
}
