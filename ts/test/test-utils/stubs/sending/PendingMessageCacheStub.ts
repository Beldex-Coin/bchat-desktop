import { PendingMessageCache } from '../../../../bchat/sending';
import { RawMessage } from '../../../../bchat/types';

export class PendingMessageCacheStub extends PendingMessageCache {
  public dbData: Array<RawMessage>;
  constructor(dbData: Array<RawMessage> = []) {
    super();
    this.dbData = dbData;
  }

  public getCache(): Readonly<Array<RawMessage>> {
    return this.cache;
  }

  protected async getFromStorage() {
    return this.dbData;
  }

  protected async saveToDB() {
    return;
  }
}
