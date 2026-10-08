import { expect } from 'chai';
import Sinon from 'sinon';

import * as Data from '../../../../data/data';
import { SNodeAPI, SnodePool } from '../../../../bchat/apis/snode_api';
import {
  OFFLINE_PROBE_EVERY_TICKS,
  setPollReconnectHandler,
  SwarmPolling,
} from '../../../../bchat/apis/snode_api/swarmPolling';
import { UserUtils } from '../../../../bchat/utils';
import { TestUtils } from '../../../test-utils';
import { generateFakeSnodes } from '../../../test-utils/utils';

describe('SwarmPolling while marked offline', () => {
  const ourPubkey = TestUtils.generateFakePubKey();
  let swarmPolling: SwarmPolling;
  let pollOnceForKey: Sinon.SinonStub;
  let reconnect: Sinon.SinonStub;
  let clock: Sinon.SinonFakeTimers;
  let navigatorOnLine: boolean;

  beforeEach(() => {
    TestUtils.stubWindowLog();
    TestUtils.stubWindow('inboxStore', undefined);
    TestUtils.stubWindow('getGlobalOnlineStatus', () => false);
    Sinon.stub(UserUtils, 'getOurPubKeyFromCache').returns(ourPubkey);
    navigatorOnLine = false;
    // under Node, the global navigator is Node's own, not jsdom's window.navigator
    [window.navigator, globalThis.navigator].forEach(nav =>
      Object.defineProperty(nav, 'onLine', { configurable: true, get: () => navigatorOnLine })
    );
    reconnect = Sinon.stub();
    setPollReconnectHandler(reconnect);
    swarmPolling = new SwarmPolling();
    pollOnceForKey = Sinon.stub(swarmPolling, 'pollOnceForKey').resolves();
    // pollForAllKeys() schedules its next run, which must not actually run here
    clock = Sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
    Sinon.restore();
    setPollReconnectHandler(undefined);
    [window.navigator, globalThis.navigator].forEach(nav => Reflect.deleteProperty(nav, 'onLine'));
  });

  it('reconnects when the browser says we are online again but its online event never came', async () => {
    navigatorOnLine = true;

    await swarmPolling.pollForAllKeys();

    expect(reconnect.calledOnce).to.equal(true);
  });

  it(`does not poll while offline, except a probe of our own swarm every ${OFFLINE_PROBE_EVERY_TICKS} runs`, async () => {
    for (let i = 1; i < OFFLINE_PROBE_EVERY_TICKS; i++) {
      // eslint-disable-next-line no-await-in-loop
      await swarmPolling.pollForAllKeys();
    }
    expect(pollOnceForKey.called).to.equal(false);

    await swarmPolling.pollForAllKeys();

    expect(pollOnceForKey.calledOnceWith(ourPubkey, false, 0)).to.equal(true);
    expect(reconnect.called).to.equal(false);
  });
});

describe('SwarmPolling: a successful poll while marked offline', () => {
  const ourPubkey = TestUtils.generateFakePubKey();

  beforeEach(() => {
    TestUtils.stubWindowLog();
    TestUtils.stubWindow('inboxStore', undefined);
    Sinon.stub(Data, 'getLastHashBySnode').resolves(undefined);
    Sinon.stub(SnodePool, 'getSwarmFor').resolves(generateFakeSnodes(3));
    Sinon.stub(SNodeAPI, 'retrieveNextMessages').resolves([]);
  });

  afterEach(() => {
    Sinon.restore();
    setPollReconnectHandler(undefined);
  });

  it('reconnects even if disconnect() has not run yet (window.isOnline still true)', async () => {
    TestUtils.stubWindow('isOnline', true);
    TestUtils.stubWindow('getGlobalOnlineStatus', () => false);
    const reconnect = Sinon.stub();
    setPollReconnectHandler(reconnect);

    await new SwarmPolling().pollOnceForKey(ourPubkey, false, 0);

    expect(reconnect.calledOnce).to.equal(true);
  });

  it('does not reconnect when we are already online', async () => {
    TestUtils.stubWindow('isOnline', true);
    TestUtils.stubWindow('getGlobalOnlineStatus', () => true);
    const reconnect = Sinon.stub();
    setPollReconnectHandler(reconnect);

    await new SwarmPolling().pollOnceForKey(ourPubkey, false, 0);

    expect(reconnect.called).to.equal(false);
  });
});
