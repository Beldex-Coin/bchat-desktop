import { DataMessage } from '..';
import { SignalService } from '../../../../protobuf';
import { MessageParams } from '../Message';

interface GroupInvitationMessageParams extends MessageParams {
  url: string;
  name: string;
  // if there is an expire timer set for the conversation, we need to set it.
  // otherwise, it will disable the expire timer on the receiving side.

}

export class GroupInvitationMessage extends DataMessage {
  private readonly url: string;
  private readonly name: string;

  constructor(params: GroupInvitationMessageParams) {
    super({ timestamp: params.timestamp});
    this.url = params.url;
    this.name = params.name;
  }

  public dataProto(): SignalService.DataMessage {
    const openGroupInvitation = new SignalService.DataMessage.OpenGroupInvitation({
      url: this.url,
      name: this.name,
    });

    return new SignalService.DataMessage({
      openGroupInvitation
    });
  }
}
