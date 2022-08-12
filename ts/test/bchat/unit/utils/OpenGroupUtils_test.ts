// tslint:disable: no-implicit-dependencies max-func-body-length no-unused-expression

import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';
import {
  getCompleteUrlFromRoom,
  getOpenGroupV2ConversationId,
  prefixify,
} from '../../../../bchat/apis/open_group_api/utils/OpenGroupUtils';
chai.use(chaiAsPromised as any);

// tslint:disable: no-http-string
describe('OpenGroupUtils', () => {
  describe('prefixify', () => {
    it('should just return if http:// is as prefix', () => {
      expect(prefixify('http://plop.com')).to.be.equal('http://plop.com');
    });
    it('should just return if https:// is as prefix', () => {
      expect(prefixify('https://plop.com')).to.be.equal('https://plop.com');
    });

    it('should just return if http:// is as prefix even with hasSSL = true', () => {
      expect(prefixify('http://plop.com', true)).to.be.equal('http://plop.com');
    });
    it('should just return if https:// is as prefix even with hasSSL = true', () => {
      expect(prefixify('https://plop.com', true)).to.be.equal('https://plop.com');
    });

    it('should just return if http:// is as prefix even with hasSSL = false', () => {
      expect(prefixify('http://plop.com', false)).to.be.equal('http://plop.com');
    });
    it('should just return if https:// is as prefix even with hasSSL = false', () => {
      expect(prefixify('https://plop.com', false)).to.be.equal('https://plop.com');
    });

    it('should prefix with http if ssl is false and no prefix', () => {
      expect(prefixify('plop.com', false)).to.be.equal('http://plop.com');
    });

    it('should prefix with https if ssl is true and no prefix', () => {
      expect(prefixify('plop.com', true)).to.be.equal('https://plop.com');
    });
  });

  describe('getOpenGroupV2ConversationId', () => {
    describe('throws if roomId is not valid', () => {
      it('throws if roomId is too long 64 ', () => {
        expect(() => {
          getOpenGroupV2ConversationId(
            'http://plop.com',
            '012345678901234567890#1234567!89012345678901234567890123456789fg01234'
          );
        }).to.throw('getOpenGroupV2ConversationId: Invalid roomId');
      });

      it('throws if roomId is too short ', () => {
        expect(() => {
          getOpenGroupV2ConversationId('http://plop.com', '');
        }).to.throw('getOpenGroupV2ConversationId: Invalid roomId');
      });
      it('throws if roomId is has forbidden chars ', () => {
        expect(() => {
          getOpenGroupV2ConversationId('http://plop.com', '1&%^%');
        }).to.throw('getOpenGroupV2ConversationId: Invalid roomId');
      });
    });

    it('doesnt throw if roomId and serverUrl are valid ', () => {
      expect(() => {
        getOpenGroupV2ConversationId('http://127.0.0.1/', 'plop1234');
      }).to.not.throw();
    });

    it('doesnt throw if roomId and serverUrl are valid with port', () => {
      expect(() => {
        getOpenGroupV2ConversationId('http://127.0.0.1:22/', 'plop1234');
      }).to.not.throw();
    });

    it('doesnt throw if roomId and serverUrl are valid with port', () => {
      expect(() => {
        getOpenGroupV2ConversationId('https://opengroup.com/', 'plop1234');
      }).to.not.throw();
    });

    it('throw if serverUrl is no url', () => {
      expect(() => {
        getOpenGroupV2ConversationId('opengroup', 'plop1234');
      }).to.throw();
    });
  });

  describe('getCompleteUrlFromRoom', () => {
    it('doesnt throw if roomId and serverUrl are valid with port', () => {
      expect(
        getCompleteUrlFromRoom({
          roomId: 'plop1234',
          serverPublicKey: '05123456789',
          serverUrl: 'https://example.org',
        })
      ).to.be.eq('https://example.org/plop1234?public_key=05123456789');
    });

    it('throws if pubkey is empty', () => {
      expect(() =>
        getCompleteUrlFromRoom({
          roomId: 'plop1234',
          serverPublicKey: '',
          serverUrl: 'https://example.org',
        })
      ).to.throw('getCompleteUrlFromRoom needs serverPublicKey, roomid and serverUrl to be set');
    });

    it('throws if serverUrl is empty', () => {
      expect(() =>
        getCompleteUrlFromRoom({
          roomId: 'plop1234',
          serverPublicKey: '05123456789',
          serverUrl: '',
        })
      ).to.throw('getCompleteUrlFromRoom needs serverPublicKey, roomid and serverUrl to be set');
    });

    it('throws if roomId is empty', () => {
      expect(() =>
        getCompleteUrlFromRoom({
          roomId: '',
          serverPublicKey: '05123456789',
          serverUrl: 'https://example.org',
        })
      ).to.throw('getCompleteUrlFromRoom needs serverPublicKey, roomid and serverUrl to be set');
    });
    it('throws if pubkey is null', () => {
      expect(() =>
        getCompleteUrlFromRoom({
          roomId: 'plop1234',
          serverPublicKey: null as any,
          serverUrl: 'https://example.org',
        })
      ).to.throw('getCompleteUrlFromRoom needs serverPublicKey, roomid and serverUrl to be set');
    });

    it('throws if serverUrl is null', () => {
      expect(() =>
        getCompleteUrlFromRoom({
          roomId: 'plop1234',
          serverPublicKey: '05123456789',
          serverUrl: null as any,
        })
      ).to.throw('getCompleteUrlFromRoom needs serverPublicKey, roomid and serverUrl to be set');
    });

    it('throws if roomId is null', () => {
      expect(() =>
        getCompleteUrlFromRoom({
          roomId: null as any,
          serverPublicKey: '05123456789',
          serverUrl: 'https://example.org',
        })
      ).to.throw('getCompleteUrlFromRoom needs serverPublicKey, roomid and serverUrl to be set');
    });
  });
});
