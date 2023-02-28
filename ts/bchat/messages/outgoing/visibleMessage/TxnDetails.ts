import { DataMessage } from '..';
import { SignalService } from '../../../../protobuf';
import { MessageParams } from '../Message';

interface TxnDetailsMessageParams extends MessageParams {
    amount: string |any;
  txnId: string | any;
  // if there is an expire timer set for the conversation, we need to set it.
  // otherwise, it will disable the expire timer on the receiving side.
  expireTimer?: number;
}

export class TxnDetailsMessage extends DataMessage {
  private readonly amount: string|any;
  private readonly txnId: string|any;
  private readonly expireTimer?: number;

  constructor(params: TxnDetailsMessageParams) {
    super({ timestamp: params.timestamp, identifier: params.identifier });
    this.amount = params.amount;
    this.txnId = params.txnId;
    this.expireTimer = params.expireTimer;
  }

  public dataProto(): SignalService.DataMessage {
    const Payment = new SignalService.DataMessage.Payment({
        amount: this.amount,
        txnId: this.txnId,
    });
    return new SignalService.DataMessage({
      payment:Payment,
      expireTimer: this.expireTimer,
    });
  }
}