import { DataMessage } from '..';
import { SignalService } from '../../../../protobuf';
import { MessageParams } from '../Message';

export interface SharedContactMessageParams extends MessageParams {
  address: string ;
  name: string ;
}
export class SharedContactMessage extends DataMessage {
private readonly address: string;
private readonly name: string;
constructor(params: SharedContactMessageParams) {
  super({ timestamp: params.timestamp, identifier: params.identifier });
  this.address = params.address;
  this.name = params.name;
}
public dataProto(): SignalService.DataMessage {
  const SharedContact = new SignalService.DataMessage.SharedContact({
      address: this.address,
      name: this.name,
  });
  return new SignalService.DataMessage({
    sharedContact:SharedContact
  });
}
}