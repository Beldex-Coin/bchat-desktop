import { OpenGroupV2Room } from "../data/opengroups";

export type MsgDuplicateSearchOpenGroup = Array<{
  sender: string;
  serverTimestamp: number;
}>;

export type UpdateLastHashType = {
  convoId: string;
  snode: string;
  hash: string;
  expiresAt: number;
  namespace: number;
};

export function roomHasBlindEnabled(openGroup?: OpenGroupV2Room) {
  return capabilitiesListHasBlindEnabled(openGroup?.capabilities);
}

export function capabilitiesListHasBlindEnabled(caps?: Array<string> | null) {
  return Boolean(caps?.includes('blind'));
}

export function roomHasReactionsEnabled(openGroup?: OpenGroupV2Room) {
  return Boolean(openGroup?.capabilities?.includes('reactions'));
}