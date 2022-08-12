import { SignalService } from '../../protobuf';
import { PubKey } from '../types';
import { concatUInt8Array, getSodiumRenderer, MessageEncrypter } from '.';
import { fromHexToArray } from '../utils/String';
export { concatUInt8Array, getSodiumRenderer };
import { getLatestClosedGroupEncryptionKeyPair } from '../../data/data';
import { UserUtils } from '../utils';
import { addMessagePadding } from './BufferPadding';

type EncryptResult = {
  envelopeType: SignalService.Envelope.Type;
  cipherText: Uint8Array;
};

/**
 * Encrypt `plainTextBuffer` with given `encryptionType` for `device`.
 *
 * @param device The device `PubKey` to encrypt for.
 * @param plainTextBuffer The unpadded plaintext buffer. It will be padded
 * @param encryptionType The type of encryption.
 * @returns The envelope type and the base64 encoded cipher text
 */
export async function encrypt(
  device: PubKey,
  plainTextBuffer: Uint8Array,
  encryptionType: SignalService.Envelope.Type
): Promise<EncryptResult> {
  const { CLOSED_GROUP_MESSAGE, BCHAT_MESSAGE } = SignalService.Envelope.Type;

  if (encryptionType !== CLOSED_GROUP_MESSAGE && encryptionType !== BCHAT_MESSAGE) {
    throw new Error(`Invalid encryption type:${encryptionType}`);
  }

  const encryptForClosedGroup = encryptionType === CLOSED_GROUP_MESSAGE;
  const plainText = addMessagePadding(plainTextBuffer);

  if (encryptForClosedGroup) {
    // window?.log?.info(
    //   'Encrypting message with BchatProtocol and envelope type is CLOSED_GROUP_MESSAGE'
    // );
    const hexEncryptionKeyPair = await getLatestClosedGroupEncryptionKeyPair(device.key);
    if (!hexEncryptionKeyPair) {
      window?.log?.warn("Couldn't get key pair for closed group during encryption");
      throw new Error("Couldn't get key pair for closed group");
    }
    const hexPubFromECKeyPair = PubKey.cast(hexEncryptionKeyPair.publicHex);

    const cipherTextClosedGroup = await MessageEncrypter.encryptUsingBchatProtocol(
      hexPubFromECKeyPair,
      plainText
    );

    return {
      envelopeType: CLOSED_GROUP_MESSAGE,
      cipherText: cipherTextClosedGroup,
    };
  }
  const cipherText = await MessageEncrypter.encryptUsingBchatProtocol(device, plainText);

  return { envelopeType: BCHAT_MESSAGE, cipherText };
}

export async function encryptUsingBchatProtocol(
  recipientHexEncodedX25519PublicKey: PubKey,
  plaintext: Uint8Array
): Promise<Uint8Array> {
  const userED25519KeyPairHex = await UserUtils.getUserED25519KeyPair();
  if (
    !userED25519KeyPairHex ||
    !userED25519KeyPairHex.pubKey?.length ||
    !userED25519KeyPairHex.privKey?.length
  ) {
    throw new Error("Couldn't find user ED25519 key pair.");
  }
  const sodium = await getSodiumRenderer();

  // window?.log?.info('encryptUsingBchatProtocol for ', recipientHexEncodedX25519PublicKey.key);

  const recipientX25519PublicKey = recipientHexEncodedX25519PublicKey.withoutPrefixToArray();
  const userED25519PubKeyBytes = fromHexToArray(userED25519KeyPairHex.pubKey);
  const userED25519SecretKeyBytes = fromHexToArray(userED25519KeyPairHex.privKey);

  // const walletAddress="bxdis3VF318i2QDjvqwoG9GyfP4sVjTvwZyf1JGLNFyTJ8fbtBgzW6ieyKnpbMw5bU9dggbAiznaPGay96WAmx1Z2B32B86PE";
  let walletAddress :any = localStorage.getItem("userAddress");
  console.log("walletAddress", walletAddress);

  let utf8Encode = new TextEncoder();

  const beldexWalletAddress = utf8Encode.encode(walletAddress);
  const walletAddressConCatPlaintext = concatUInt8Array(beldexWalletAddress, plaintext);


  // merge all arrays into one
  const verificationData = concatUInt8Array(
    walletAddressConCatPlaintext,
    userED25519PubKeyBytes,
    recipientX25519PublicKey
  );

  const signature = sodium.crypto_sign_detached(verificationData, userED25519SecretKeyBytes);
  if (!signature || signature.length === 0) {
    throw new Error("Couldn't sign message");
  }

  const plaintextWithMetadata = concatUInt8Array(walletAddressConCatPlaintext, userED25519PubKeyBytes, signature);

  const ciphertext = sodium.crypto_box_seal(plaintextWithMetadata, recipientX25519PublicKey);
  if (!ciphertext) {
    throw new Error("Couldn't encrypt message.");
  }
  return ciphertext;
}
