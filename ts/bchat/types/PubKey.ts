import { fromHexToArray } from '../utils/String';

export const getStoragePubKey = (key: string) =>
  window.bchatFeatureFlags.useTestNet ? key.substring(2) : key;

export class PubKey {
  public static readonly PUBKEY_LEN = 66;
  public static readonly HEX = '[0-9a-fA-F]';

  // This is a temporary fix to allow groupPubkeys created from mobile to be handled correctly
  // They have a different regex to match
  // FIXME move this to a new class which validates group ids and use it in all places where we have group ids (message sending included)
  // tslint:disable: member-ordering
  public static readonly regexForPubkeys = `((bd)?${PubKey.HEX}{64})`;
  public static readonly PREFIX_GROUP_TEXTSECURE = '__textsecure_group__!';
  // prettier-ignore
  private static readonly regex: RegExp = new RegExp(
    `^(${PubKey.PREFIX_GROUP_TEXTSECURE})?(bd)?(${PubKey.HEX}{64}|${PubKey.HEX}{32})$`
  );
  /**
   * If you want to update this regex. Be sure that those are matches ;
   *  __textsecure_group__!05010203040506070809a0b0c0d0e0f0ff010203040506070809a0b0c0d0e0f0ff
   *  __textsecure_group__!010203040506070809a0b0c0d0e0f0ff010203040506070809a0b0c0d0e0f0ff
   *  __textsecure_group__!05010203040506070809a0b0c0d0e0f0ff
   *  __textsecure_group__!010203040506070809a0b0c0d0e0f0ff
   *  05010203040506070809a0b0c0d0e0f0ff010203040506070809a0b0c0d0e0f0ff
   *  010203040506070809a0b0c0d0e0f0ff010203040506070809a0B0c0d0e0f0FF
   *  05010203040506070809a0b0c0d0e0f0ff
   *  010203040506070809a0b0c0d0e0f0ff
   */

  public readonly key: string;

  /**
   * A PubKey object.
   * If `pubKeyString` is not valid then this will throw an `Error`.
   *
   * @param pubkeyString The public key string.
   */
  constructor(pubkeyString: string) {
    if (!PubKey.validate(pubkeyString)) {
      throw new Error(`Invalid pubkey string passed: ${pubkeyString}`);
    }
    this.key = pubkeyString.toLowerCase();
  }

  /**
   * Cast a `value` to a `PubKey`.
   * If `value` is not valid then this will throw.
   *
   * @param value The value to cast.
   */
  public static cast(value?: string | PubKey): PubKey {
    if (!value) {
      throw new Error(`Invalid pubkey string passed: ${value}`);
    }
    return typeof value === 'string' ? new PubKey(value) : value;
  }

  public static shorten(value: string | PubKey): string {
    const valAny = value as PubKey;
    const pk = value instanceof PubKey ? valAny.key : value;

    if (!pk) {
      throw new Error('PubkKey.shorten was given an invalid PubKey to shorten.');
    }

    return `(...${pk.substring(pk.length - 6)})`;
  }

  /**
   * Try convert `pubKeyString` to `PubKey`.
   *
   * @param pubkeyString The public key string.
   * @returns `PubKey` if valid otherwise returns `undefined`.
   */
  public static from(pubkeyString: string): PubKey | undefined {
    // Returns a new instance if the pubkey is valid
    if (PubKey.validate(pubkeyString)) {
      return new PubKey(pubkeyString);
    }

    return undefined;
  }

  /**
   * Returns the pubkey as a string if it's valid, or undefined
   */
  public static normalize(pubkeyString: string): string | undefined {
    // Returns a new instance if the pubkey is valid
    if (PubKey.validate(pubkeyString)) {
      return pubkeyString;
    }

    return undefined;
  }

  public static validate(pubkeyString: string): boolean {
    return this.regex.test(pubkeyString);
  }

  /**
   * Returns a localized string of the error, or undefined in the given pubkey is valid.
   */
  public static validateWithError(pubkey: string): string | undefined {
    // Check if it's hex
    const isHex = pubkey.replace(/[\s]*/g, '').match(/^[0-9a-fA-F]+$/);
    if (!isHex) {
      return window.i18n('invalidBchatId');
    }

    // Check if the pubkey length is 33 and leading with 05 or of length 32
    const len = pubkey.length;
    if ((len !== 33 * 2 || !/^bd/.test(pubkey)) && len !== 32 * 2) {
      return window.i18n('invalidPubkeyFormat');
    }
    return undefined;
  }

  /**
   * This removes the 05 prefix from a Pubkey which have it and have a length of 66
   * @param keyWithOrWithoutPrefix the key with or without the prefix
   */
  public static remove05PrefixIfNeeded(keyWithOrWithoutPrefix: string): string {
    if (keyWithOrWithoutPrefix.length === 66 && keyWithOrWithoutPrefix.startsWith('bd')) {
      return keyWithOrWithoutPrefix.substr(2);
    }
    return keyWithOrWithoutPrefix;
  }

  /**
   * This adds the `__textsecure_group__!` prefix to a pubkey if this pubkey does not already have it
   * @param keyWithOrWithoutPrefix the key to use as base
   */
  public static addTextSecurePrefixIfNeeded(keyWithOrWithoutPrefix: string | PubKey): string {
    const key =
      keyWithOrWithoutPrefix instanceof PubKey
        ? keyWithOrWithoutPrefix.key
        : keyWithOrWithoutPrefix;
    if (!key.startsWith(PubKey.PREFIX_GROUP_TEXTSECURE)) {
      return PubKey.PREFIX_GROUP_TEXTSECURE + key;
    }
    return key;
  }

  /**
   * This removes the `__textsecure_group__!` prefix from a pubkey if this pubkey have one
   * @param keyWithOrWithoutPrefix the key to use as base
   */
  public static removeTextSecurePrefixIfNeeded(keyWithOrWithoutPrefix: string | PubKey): string {
    const key =
      keyWithOrWithoutPrefix instanceof PubKey
        ? keyWithOrWithoutPrefix.key
        : keyWithOrWithoutPrefix;
    return key.replace(PubKey.PREFIX_GROUP_TEXTSECURE, '');
  }

  public static isEqual(comparator1: PubKey | string, comparator2: PubKey | string) {
    return PubKey.cast(comparator1).isEqual(comparator2);
  }

  public isEqual(comparator: PubKey | string) {
    return comparator instanceof PubKey
      ? this.key === comparator.key
      : this.key === comparator.toLowerCase();
  }

  public withoutPrefix(): string {
    return PubKey.remove05PrefixIfNeeded(this.key);
  }

  public toArray(): Uint8Array {
    return fromHexToArray(this.key);
  }

  public withoutPrefixToArray(): Uint8Array {
    return fromHexToArray(PubKey.remove05PrefixIfNeeded(this.key));
  }
}
