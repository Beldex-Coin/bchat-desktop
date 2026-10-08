import { expect } from 'chai';
import Sinon from 'sinon';

import * as Data from '../../../../data/data';
import { SNodeAPI, SnodePool } from '../../../../bchat/apis/snode_api';
import { ERROR_CODE_NO_CONNECT } from '../../../../bchat/apis/snode_api/SNodeAPI';
import { SwarmPolling } from '../../../../bchat/apis/snode_api/swarmPolling';
import { TestUtils } from '../../../test-utils';
import { generateFakeSnodes } from '../../../test-utils/utils';

describe('SwarmPolling node rotation', () => {
  const ourPubkey = TestUtils.generateFakePubKey();
  let swarmPolling: SwarmPolling;
  let retrieveStub: Sinon.SinonStub;

  beforeEach(() => {
    TestUtils.stubWindowLog();
    TestUtils.stubWindow('inboxStore', undefined);
    TestUtils.stubWindow('isOnline', true);
    Sinon.stub(Data, 'getLastHashBySnode').resolves(undefined);
    Sinon.stub(Data, 'updateLastHash').resolves();
    Sinon.stub(Data, 'getSeenMessagesByHashList').resolves([]);
    Sinon.stub(Data, 'saveSeenMessageHashes').resolves();
    retrieveStub = Sinon.stub(SNodeAPI, 'retrieveNextMessages');
    swarmPolling = new SwarmPolling();
  });

  afterEach(() => {
    Sinon.restore();
  });

  const polledNodes = () => retrieveStub.getCalls().map(call => call.args[0].pubkey_ed25519);

  it('polls a different swarm node in the same cycle when the first one fails', async () => {
    Sinon.stub(SnodePool, 'getSwarmFor').resolves(generateFakeSnodes(3));
    retrieveStub.onFirstCall().rejects(new Error('timeout'));
    retrieveStub.onSecondCall().resolves([]);

    await swarmPolling.pollOnceForKey(ourPubkey, false, 0);

    expect(retrieveStub.callCount).to.equal(2);
    expect(polledNodes()[0]).to.not.equal(polledNodes()[1]);
  });

  it('does not rotate when our own connection is down', async () => {
    Sinon.stub(SnodePool, 'getSwarmFor').resolves(generateFakeSnodes(3));
    retrieveStub.rejects(new Error(ERROR_CODE_NO_CONNECT));

    await swarmPolling.pollOnceForKey(ourPubkey, false, 0);

    expect(retrieveStub.callCount).to.equal(1);
  });

  it('polls a single node when it succeeds', async () => {
    Sinon.stub(SnodePool, 'getSwarmFor').resolves(generateFakeSnodes(3));
    retrieveStub.resolves([]);

    await swarmPolling.pollOnceForKey(ourPubkey, false, 0);

    expect(retrieveStub.callCount).to.equal(1);
  });

  it('prefers the node that answered over the one that failed on the next cycle', async () => {
    const [failing, working] = generateFakeSnodes(2);
    Sinon.stub(SnodePool, 'getSwarmFor').resolves([failing, working]);
    retrieveStub.callsFake(async (node: { pubkey_ed25519: string }) => {
      if (node.pubkey_ed25519 === failing.pubkey_ed25519) {
        throw new Error('timeout');
      }
      return [];
    });

    // run enough cycles that a sticky pick of the failing node would show up
    for (let i = 0; i < 10; i++) {
      // eslint-disable-next-line no-await-in-loop
      await swarmPolling.pollOnceForKey(ourPubkey, false, 0);
    }

    const failingPolls = polledNodes().filter(edkey => edkey === failing.pubkey_ed25519);
    expect(failingPolls.length).to.be.at.most(1);
  });
});
