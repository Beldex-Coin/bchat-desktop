import chai, { expect } from 'chai';
import * as crypto from 'crypto';
import Sinon, * as sinon from 'sinon';
import { concatUInt8Array, getSodiumRenderer, MessageEncrypter } from '../../../../bchat/crypto';
import { TestUtils } from '../../../test-utils';
import { SignalService } from '../../../../protobuf';

import { StringUtils, UserUtils } from '../../../../bchat/utils';

import chaiBytes from 'chai-bytes';
import { PubKey } from '../../../../bchat/types';
import { fromHex, toHex } from '../../../../bchat/utils/String';
import { addMessagePadding } from '../../../../bchat/crypto/BufferPadding';

chai.use(chaiBytes);

// tslint:disable-next-line: max-func-body-length
describe('MessageEncrypter', () => {
  const ourNumber = '0123456789abcdef';
  const ourUserEd25516Keypair = {
    pubKey: '37e1631b002de498caf7c5c1712718bde7f257c6dadeed0c21abf5e939e6c309',
    privKey:
      'be1d11154ff9b6de77873f0b6b0bcc460000000000000000000000000000000037e1631b002de498caf7c5c1712718bde7f257c6dadeed0c21abf5e939e6c309',
  };

  const ourIdentityKeypair = {
    pubKey: new Uint8Array([
      5,
      44,
      2,
      168,
      162,
      203,
      50,
      66,
      136,
      81,
      30,
      221,
      57,
      245,
      1,
      148,
      162,
      194,
      255,
      47,
      134,
      104,
      180,
      207,
      188,
      18,
      71,
      62,
      58,
      107,
      23,
      92,
      97,
    ]),
    privKey: new Uint8Array([
      200,
      45,
      226,
      75,
      253,
      235,
      213,
      108,
      187,
      188,
      217,
      9,
      51,
      105,
      65,
      15,
      97,
      36,
      233,
      33,
      21,
      31,
      7,
      90,
      145,
      30,
      52,
      254,
      47,
      162,
      192,
      105,
    ]),
  };

  beforeEach(() => {
    Sinon.stub(UserUtils, 'getOurPubKeyStrFromCache').returns(ourNumber);
    Sinon.stub(UserUtils, 'getUserED25519KeyPair').resolves(ourUserEd25516Keypair);
  });

  afterEach(() => {
    Sinon.restore();
  });

  describe('EncryptionType', () => {
    describe('ClosedGroup', () => {
      it('should return a CLOSED_GROUP_MESSAGE envelope type for ClosedGroup', async () => {
        const hexKeyPair = {
          publicHex: `bd${ourUserEd25516Keypair.pubKey}`,
          privateHex: '0123456789abcdef',
        };

        TestUtils.stubData('getLatestClosedGroupEncryptionKeyPair').resolves(hexKeyPair);

        const data = crypto.randomBytes(10);

        const result = await MessageEncrypter.encrypt(
          TestUtils.generateFakePubKey(),
          data,
          SignalService.Envelope.Type.CLOSED_GROUP_MESSAGE
        );
        chai
          .expect(result.envelopeType)
          .to.deep.equal(SignalService.Envelope.Type.CLOSED_GROUP_MESSAGE);
      });

      it('should return a BCHAT_MESSAGE envelope type for Fallback', async () => {
        const data = crypto.randomBytes(10);

        const result = await MessageEncrypter.encrypt(
          TestUtils.generateFakePubKey(),
          data,
          SignalService.Envelope.Type.BCHAT_MESSAGE
        );
        chai.expect(result.envelopeType).to.deep.equal(SignalService.Envelope.Type.BCHAT_MESSAGE);
      });

      it('should throw an error for anything else than Fallback or ClosedGroup', () => {
        const data = crypto.randomBytes(10);
        return MessageEncrypter.encrypt(
          TestUtils.generateFakePubKey(),
          data,
          3 as any
        ).should.eventually.be.rejectedWith(Error);
      });
    });
  });

  // tslint:disable-next-line: max-func-body-length
  describe('Bchat Protocol', () => {
    beforeEach(() => {
      Sinon.stub(UserUtils, 'getIdentityKeyPair').resolves(ourIdentityKeypair);
    });

    afterEach(() => {
      Sinon.restore();
    });

    it('should pass the padded message body to encrypt', async () => {
      const data = crypto.randomBytes(10);
      const spy = sinon.spy(MessageEncrypter, 'encryptUsingBchatProtocol');
      await MessageEncrypter.encrypt(
        TestUtils.generateFakePubKey(),
        data,
        SignalService.Envelope.Type.BCHAT_MESSAGE
      );
      chai.expect(spy.callCount).to.be.equal(1);
      const paddedData = addMessagePadding(data);
      const firstArgument = new Uint8Array(spy.args[0][1]);
      chai.expect(firstArgument).to.deep.equal(paddedData);
      spy.restore();
    });

    it('should pass the correct data for sodium crypto_sign', async () => {
      const keypair = await UserUtils.getUserED25519KeyPair();
      const recipient = TestUtils.generateFakePubKey();
      const sodium = await getSodiumRenderer();
      const cryptoSignDetachedSpy = Sinon.spy(sodium, 'crypto_sign_detached');
      const plainText = '123456';
      const plainTextBytes = new Uint8Array(StringUtils.encode(plainText, 'utf8'));
      const userED25519PubKeyBytes = new Uint8Array(
        // tslint:disable: no-non-null-assertion
        StringUtils.fromHex(keypair!.pubKey)
      );
      const recipientX25519PublicKeyWithoutPrefix = PubKey.remove05PrefixIfNeeded(recipient.key);

      const recipientX25519PublicKey = new Uint8Array(
        StringUtils.fromHex(recipientX25519PublicKeyWithoutPrefix)
      );
      await MessageEncrypter.encryptUsingBchatProtocol(recipient, plainTextBytes);
      const [dataForSign, userED25519SecretKeyBytes] = cryptoSignDetachedSpy.args[0];
      const userEdPrivkeyBytes = new Uint8Array(StringUtils.fromHex(keypair!.privKey));
      expect(userED25519SecretKeyBytes).to.equalBytes(userEdPrivkeyBytes);
      // dataForSign must be plaintext | userED25519PubKeyBytes | recipientX25519PublicKey
      expect((dataForSign as Uint8Array).subarray(0, plainTextBytes.length)).to.equalBytes(
        plainTextBytes
      );
      expect(
        (dataForSign as Uint8Array).subarray(
          plainTextBytes.length,
          plainTextBytes.length + userED25519PubKeyBytes.length
        )
      ).to.equalBytes(userED25519PubKeyBytes);

      // the recipient pubkey must have its 05 prefix removed
      expect(
        (dataForSign as Uint8Array).subarray(plainTextBytes.length + userED25519PubKeyBytes.length)
      ).to.equalBytes(recipientX25519PublicKey);
    });

    it('should return valid decodable ciphertext', async () => {
      // for testing, we encode a message to ourself
      const userX25519KeyPair = await UserUtils.getIdentityKeyPair();
      const userEd25519KeyPair = await UserUtils.getUserED25519KeyPair();

      const plainTextBytes = new Uint8Array(StringUtils.encode('123456789', 'utf8'));

      const sodium = await getSodiumRenderer();

      const recipientX25519PrivateKey = userX25519KeyPair!.privKey;
      const recipientX25519PublicKeyHex = toHex(userX25519KeyPair!.pubKey);
      const recipientX25519PublicKeyWithoutPrefix = PubKey.remove05PrefixIfNeeded(
        recipientX25519PublicKeyHex
      );
      const recipientX25519PublicKey = new PubKey(recipientX25519PublicKeyWithoutPrefix);
      const ciphertext = await MessageEncrypter.encryptUsingBchatProtocol(
        recipientX25519PublicKey,
        plainTextBytes
      );

      // decrypt content
      const plaintextWithMetadata = sodium.crypto_box_seal_open(
        ciphertext,
        new Uint8Array(fromHex(recipientX25519PublicKey.key)),
        new Uint8Array(recipientX25519PrivateKey)
      );

      // get message parts
      const signatureSize = sodium.crypto_sign_BYTES;
      const ed25519PublicKeySize = sodium.crypto_sign_PUBLICKEYBYTES;
      const signatureStart = plaintextWithMetadata.byteLength - signatureSize;
      const signature = plaintextWithMetadata.subarray(signatureStart);
      const pubkeyStart = plaintextWithMetadata.byteLength - (signatureSize + ed25519PublicKeySize);
      const pubkeyEnd = plaintextWithMetadata.byteLength - signatureSize;
      // this should be ours ed25519 pubkey
      const senderED25519PublicKey = plaintextWithMetadata.subarray(pubkeyStart, pubkeyEnd);

      const plainTextEnd =
        plaintextWithMetadata.byteLength - (signatureSize + ed25519PublicKeySize);
      const plaintextDecoded = plaintextWithMetadata.subarray(0, plainTextEnd);

      expect(plaintextDecoded).to.equalBytes(plainTextBytes);
      expect(senderED25519PublicKey).to.equalBytes(userEd25519KeyPair!.pubKey);

      // verify the signature is valid
      const dataForVerify = concatUInt8Array(
        plaintextDecoded,
        senderED25519PublicKey,
        new Uint8Array(fromHex(recipientX25519PublicKey.key))
      );
      const isValid = sodium.crypto_sign_verify_detached(
        signature,
        dataForVerify,
        senderED25519PublicKey
      );
      expect(isValid).to.be.equal(true, 'the signature cannot be verified');
    });
  });
});
