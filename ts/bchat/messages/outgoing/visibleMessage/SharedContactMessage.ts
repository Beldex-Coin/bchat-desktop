import { DataMessage } from '..';
import { SignalService } from '../../../../protobuf';
import { MessageParams } from '../Message';

interface SharedContactMessageParams extends MessageParams {
    address: string ;
    name: string ;
  // if there is an expire timer set for the conversation, we need to set it.
  // otherwise, it will disable the expire timer on the receiving side.
  expireTimer?: number;
}

export class SharedContactMessage extends DataMessage {
  private readonly address: string;
  private readonly name: string;
  private readonly expireTimer?: number;

  constructor(params: SharedContactMessageParams) {
    super({ timestamp: params.timestamp, identifier: params.identifier });
    this.address = params.address;
    this.name = params.name;
    this.expireTimer = params.expireTimer;
  }

  public dataProto(): SignalService.DataMessage {
    const SharedContact = new SignalService.DataMessage.SharedContact({
        address: this.address,
        name: this.name,
    });
    return new SignalService.DataMessage({
      sharedContact:SharedContact,
      expireTimer: this.expireTimer,
    });
  }
} 