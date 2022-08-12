// tslint:disable: no-implicit-dependencies max-func-body-length no-unused-expression

import chai from 'chai';
import Sinon, * as sinon from 'sinon';
import _ from 'lodash';
import { describe } from 'mocha';

import { TestUtils } from '../../../test-utils';
import { Onions, SnodePool } from '../../../../bchat/apis/snode_api';
import * as Data from '../../../../data/data';

import chaiAsPromised from 'chai-as-promised';
import * as OnionPaths from '../../../../bchat/onions/onionPath';
import { generateFakeSnodes, generateFakeSnodeWithEdKey } from '../../../test-utils/utils';
import { SeedNodeAPI } from '../../../../bchat/apis/seed_node_api';
chai.use(chaiAsPromised as any);
chai.should();

const { expect } = chai;

const guard1ed = 'e3ec6fcc79e64c2af6a48a9865d4bf4b739ec7708d75f35acc3d478f9161534e';
const guard2ed = 'e3ec6fcc79e64c2af6a48a9865d4bf4b739ec7708d75f35acc3d478f91615349';
const guard3ed = 'e3ec6fcc79e64c2af6a48a9865d4bf4b739ec7708d75f35acc3d478f9161534a';

const fakeSnodePool: Array<Data.Snode> = [
  ...generateFakeSnodes(12),
  generateFakeSnodeWithEdKey(guard1ed),
  generateFakeSnodeWithEdKey(guard2ed),
  generateFakeSnodeWithEdKey(guard3ed),
  ...generateFakeSnodes(3),
];

// tslint:disable: variable-name

// tslint:disable-next-line: max-func-body-length
describe('GuardNodes', () => {
  let getSnodePoolFromDBOrFetchFromSeed: sinon.SinonStub;
  let fetchFromSeedWithRetriesAndWriteToDb: sinon.SinonStub;
  describe('selectGuardNodes', () => {
    beforeEach(() => {
      OnionPaths.clearTestOnionPath();

      TestUtils.stubWindowLog();
      TestUtils.stubWindow('getGlobalOnlineStatus', () => true);

      Onions.resetSnodeFailureCount();
      OnionPaths.resetPathFailureCount();
      SnodePool.TEST_resetState();
    });

    afterEach(() => {
      Sinon.restore();
    });

    it('does not fetch from seed if we got 12 or more snodes in the db', async () => {
      Sinon.stub(Data, 'getSnodePoolFromDb').resolves(fakeSnodePool);

      getSnodePoolFromDBOrFetchFromSeed = Sinon.stub(
        SnodePool,
        'getSnodePoolFromDBOrFetchFromSeed'
      ).callThrough();
      fetchFromSeedWithRetriesAndWriteToDb = Sinon.stub(
        SnodePool,
        'TEST_fetchFromSeedWithRetriesAndWriteToDb'
      ).resolves();
      const testGuardNode = Sinon.stub(OnionPaths, 'testGuardNode').resolves(true);

      Sinon.stub(Data, 'updateGuardNodes').resolves();
      // run the command
      const fetchedGuardNodes = await OnionPaths.selectGuardNodes();

      expect(
        getSnodePoolFromDBOrFetchFromSeed.callCount,
        'getSnodePoolFromDBOrFetchFromSeed should have been called'
      ).to.be.eq(1);
      expect(
        fetchFromSeedWithRetriesAndWriteToDb.callCount,
        'fetchFromSeedWithRetriesAndWriteToDb should not have been called'
      ).to.be.eq(0);
      expect(
        testGuardNode.callCount,
        'firstGuardNode should have been called three times'
      ).to.be.eq(3);
      const firstGuardNode = testGuardNode.firstCall.args[0];
      const secondGuardNode = testGuardNode.secondCall.args[0];
      const thirdGuardNode = testGuardNode.thirdCall.args[0];
      expect(fetchedGuardNodes).to.deep.equal([firstGuardNode, secondGuardNode, thirdGuardNode]);
    });

    it('throws an error if we got enough snodes in the db but none test passes', async () => {
      Sinon.stub(Data, 'getSnodePoolFromDb').resolves(fakeSnodePool);

      getSnodePoolFromDBOrFetchFromSeed = Sinon.stub(
        SnodePool,
        'getSnodePoolFromDBOrFetchFromSeed'
      ).callThrough();
      fetchFromSeedWithRetriesAndWriteToDb = Sinon.stub(
        SnodePool,
        'TEST_fetchFromSeedWithRetriesAndWriteToDb'
      ).resolves();
      const testGuardNode = Sinon.stub(OnionPaths, 'testGuardNode').resolves(false);

      Sinon.stub(Data, 'updateGuardNodes').resolves();
      // run the command
      let throwedError: string | undefined;
      try {
        await OnionPaths.selectGuardNodes();
      } catch (e) {
        throwedError = e.message;
      }

      expect(
        getSnodePoolFromDBOrFetchFromSeed.callCount,
        'getSnodePoolFromDBOrFetchFromSeed should have been called'
      ).to.be.eq(1);
      expect(
        fetchFromSeedWithRetriesAndWriteToDb.callCount,
        'fetchFromSeedWithRetriesAndWriteToDb should not have been called'
      ).to.be.eq(0);
      expect(
        testGuardNode.callCount,
        'firstGuardNode should have been called three times'
      ).to.be.eq(18);
      expect(throwedError).to.be.equal('selectGuardNodes stopping after attempts: 6');
    });

    it('throws an error if we have to fetch from seed, fetch from seed enough snode but we still fail', async () => {
      const invalidSndodePool = fakeSnodePool.slice(0, 11);
      Sinon.stub(Data, 'getSnodePoolFromDb').resolves(invalidSndodePool);
      TestUtils.stubWindow('getSeedNodeList', () => [{ url: 'whatever' }]);

      getSnodePoolFromDBOrFetchFromSeed = Sinon.stub(
        SnodePool,
        'getSnodePoolFromDBOrFetchFromSeed'
      ).callThrough();
      fetchFromSeedWithRetriesAndWriteToDb = Sinon.stub(
        SeedNodeAPI,
        'fetchSnodePoolFromSeedNodeWithRetries'
      ).resolves(fakeSnodePool);

      Sinon.stub(Data, 'updateGuardNodes').resolves();
      // run the command
      let throwedError: string | undefined;
      try {
        await OnionPaths.selectGuardNodes();
      } catch (e) {
        throwedError = e.message;
      }

      expect(throwedError).to.be.equal('selectGuardNodes stopping after attempts: 6');
    });

    it('returns valid guardnode if we have to fetch from seed, fetch from seed enough snodes but guard node tests passes', async () => {
      const invalidSndodePool = fakeSnodePool.slice(0, 11);
      Sinon.stub(Data, 'getSnodePoolFromDb').resolves(invalidSndodePool);
      TestUtils.stubWindow('getSeedNodeList', () => [{ url: 'whatever' }]);
      const testGuardNode = Sinon.stub(OnionPaths, 'testGuardNode').resolves(true);

      getSnodePoolFromDBOrFetchFromSeed = Sinon.stub(
        SnodePool,
        'getSnodePoolFromDBOrFetchFromSeed'
      ).callThrough();
      fetchFromSeedWithRetriesAndWriteToDb = Sinon.stub(
        SeedNodeAPI,
        'fetchSnodePoolFromSeedNodeWithRetries'
      ).resolves(fakeSnodePool);

      Sinon.stub(Data, 'updateGuardNodes').resolves();
      // run the command
      const guardNodes = await OnionPaths.selectGuardNodes();

      expect(guardNodes.length).to.be.equal(3);
      expect(testGuardNode.callCount).to.be.equal(3);
    });

    it('throws if we have to fetch from seed, fetch from seed but not have enough fetched snodes', async () => {
      const invalidSndodePool = fakeSnodePool.slice(0, 11);
      Sinon.stub(Data, 'getSnodePoolFromDb').resolves(invalidSndodePool);
      TestUtils.stubWindow('getSeedNodeList', () => [{ url: 'whatever' }]);

      getSnodePoolFromDBOrFetchFromSeed = Sinon.stub(
        SnodePool,
        'getSnodePoolFromDBOrFetchFromSeed'
      ).callThrough();
      fetchFromSeedWithRetriesAndWriteToDb = Sinon.stub(
        SeedNodeAPI,
        'fetchSnodePoolFromSeedNodeWithRetries'
      ).resolves(invalidSndodePool);

      Sinon.stub(Data, 'updateGuardNodes').resolves();
      // run the command
      let throwedError: string | undefined;
      try {
        await OnionPaths.selectGuardNodes();
      } catch (e) {
        throwedError = e.message;
      }
      expect(throwedError).to.be.equal(
        'Could not select guard nodes. Not enough nodes in the pool: 11'
      );
    });
  });
});
