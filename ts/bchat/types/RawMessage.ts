import { SignalService } from '../../protobuf';

export type RawMessage = {
  identifier: string;
  plainTextBuffer: Uint8Array;
  device: string;
  ttl: number;
  encryption: SignalService.Envelope.Type;
  // The syncTarget of the ContentMessage this was built from, if any. Kept per message so that
  // MessageQueue.processPending() can tell a sync copy apart from a Note to Self send on its own,
  // even when both sit in the same per-device queue (and after a restart, from the persisted cache).
  syncTarget?: string;
};

// For building RawMessages from JSON
export interface PartialRawMessage {
  identifier: string;
  plainTextBuffer: any;
  device: string;
  ttl: number;
  encryption: number;
  syncTarget?: string;
}
