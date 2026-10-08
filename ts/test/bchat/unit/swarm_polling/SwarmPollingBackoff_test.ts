import { expect } from 'chai';
import Sinon from 'sinon';

import { SWARM_POLLING_TIMEOUT } from '../../../../bchat/constants';
import {
  getPollBackoffDelay,
  POLL_BACKOFF_MAX,
  SwarmPolling,
} from '../../../../bchat/apis/snode_api/swarmPolling';
import { UserUtils } from '../../../../bchat/utils';
import { TestUtils } from '../../../test-utils';

describe('getPollBackoffDelay', () => {
  it('polls at the normal interval when our swarm answers', () => {
    expect(getPollBackoffDelay(0)).to.equal(SWARM_POLLING_TIMEOUT.ACTIVE);
  });

  it('doubles the interval on each failure, up to the cap', () => {
    expect(getPollBackoffDelay(1)).to.equal(2 * SWARM_POLLING_TIMEOUT.ACTIVE);
    expect(getPollBackoffDelay(2)).to.equal(POLL_BACKOFF_MAX);
    expect(getPollBackoffDelay(50)).to.equal(POLL_BACKOFF_MAX);
  });
});

describe('SwarmPolling backoff', () => {
  const ourPubkey = TestUtils.generateFakePubKey();
  let swarmPolling: SwarmPolling;
  let pollOnceForKey: Sinon.SinonStub;
  let clock: Sinon.SinonFakeTimers;

  beforeEach(() => {
    TestUtils.stubWindowLog();
    TestUtils.stubWindow('getGlobalOnlineStatus', () => true);
    Sinon.stub(UserUtils, 'getOurPubKeyFromCache').returns(ourPubkey);
    swarmPolling = new SwarmPolling();
    pollOnceForKey = Sinon.stub(swarmPolling, 'pollOnceForKey');
    clock = Sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
    Sinon.restore();
  });

  /** runs the poll loop once per outcome, and returns the delay before the run after the last */
  async function delayAfter(...outcomes: Array<string>) {
    outcomes.forEach((outcome, i) => pollOnceForKey.onCall(i).resolves(outcome));
    pollOnceForKey.resolves('succeeded');

    await swarmPolling.pollForAllKeys();
    for (let i = 1; i < outcomes.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await clock.nextAsync();
    }
    const runsBefore = pollOnceForKey.callCount;
    const start = clock.now;
    await clock.nextAsync();
    expect(pollOnceForKey.callCount).to.equal(runsBefore + 1);
    return clock.now - start;
  }

  it('polls again at the normal interval after a poll that worked', async () => {
    expect(await delayAfter('succeeded')).to.equal(SWARM_POLLING_TIMEOUT.ACTIVE);
  });

  it('waits longer after each failed poll of our swarm, up to the cap', async () => {
    expect(await delayAfter('failed')).to.equal(2 * SWARM_POLLING_TIMEOUT.ACTIVE);
  });

  it('caps the wait after many failed polls', async () => {
    expect(await delayAfter('failed', 'failed', 'failed', 'failed')).to.equal(POLL_BACKOFF_MAX);
  });

  it('goes back to the normal interval once a poll works again', async () => {
    expect(await delayAfter('failed', 'failed', 'succeeded')).to.equal(
      SWARM_POLLING_TIMEOUT.ACTIVE
    );
  });

  it('does not back off when our own connection is down (the offline handling covers that)', async () => {
    expect(await delayAfter('failed-no-connection', 'failed-no-connection')).to.equal(
      SWARM_POLLING_TIMEOUT.ACTIVE
    );
  });
});
