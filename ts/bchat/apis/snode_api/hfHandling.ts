import { isNumber } from 'lodash';
import { createOrUpdateItem, getItemById } from '../../../data/channelsItem';

let hasSeenHardfork170: boolean | undefined;
let hasSeenHardfork180: boolean | undefined;

/**
 * this is only intended for testing. Do not call this in production.
 */
export function resetHardForkCachedValues() {
  hasSeenHardfork170 = hasSeenHardfork180 = undefined;
}

export async function getHasSeenHF170() {
  if (hasSeenHardfork170 === undefined) {
    // read values from db and cache them as it looks like we did not
    const oldHhasSeenHardfork170 = (await getItemById('hasSeenHardfork170'))?.value;
    // values do not exist in the db yet. Let's store false for now in the db and update our cached value.
    if (oldHhasSeenHardfork170 === undefined) {
      await createOrUpdateItem({ id: 'hasSeenHardfork170', value: false });
      hasSeenHardfork170 = false;
    } else {
      hasSeenHardfork170 = oldHhasSeenHardfork170;
    }
  }
  return hasSeenHardfork170;
}

export async function getHasSeenHF180() {
  if (hasSeenHardfork180 === undefined) {
    // read values from db and cache them as it looks like we did not
    const oldHhasSeenHardfork180 = (await getItemById('hasSeenHardfork180'))?.value;

    // values do not exist in the db yet. Let's store false for now in the db and update our cached value.
    if (oldHhasSeenHardfork180 === undefined) {
      await createOrUpdateItem({ id: 'hasSeenHardfork180', value: false });
      hasSeenHardfork180 = false;
    } else {
      hasSeenHardfork180 = oldHhasSeenHardfork180;
    }
  }
  return hasSeenHardfork180;
}

export async function handleHardforkResult(json: Record<string, any>) {
  if (hasSeenHardfork170 === undefined || hasSeenHardfork180 === undefined) {
    // read values from db and cache them as it looks like we did not
    const oldHhasSeenHardfork170 = (await getItemById('hasSeenHardfork170'))?.value;
    const oldHasSeenHardfork180 = (await getItemById('hasSeenHardfork180'))?.value;

    // values do not exist in the db yet. Let's store false for now in the db and update our cached value.
    if (oldHhasSeenHardfork170 === undefined) {
      await createOrUpdateItem({ id: 'hasSeenHardfork170', value: false });
      hasSeenHardfork170 = false;
    } else {
      hasSeenHardfork170 = oldHhasSeenHardfork170;
    }
    if (oldHasSeenHardfork180 === undefined) {
      await createOrUpdateItem({ id: 'hasSeenHardfork180', value: false });
      hasSeenHardfork180 = false;
    } else {
      hasSeenHardfork180 = oldHasSeenHardfork180;
    }
  }

  if (hasSeenHardfork180 && hasSeenHardfork170) {
    // no need to do any of this if we already know both forks happened
    window.log.info('hardfork 18.0 already happened. No need to go any further');
    return;
  }

  // json.hf is an array of 2 number if it is set. Make sure this is the case before doing anything else
  if (
    json?.hf &&
    Array.isArray(json.hf) &&
    json.hf.length === 2 &&
    isNumber(json.hf[0]) &&
    isNumber(json.hf[1])
  ) {
    if (!hasSeenHardfork170 && json.hf[0] >= 17 && json.hf[1] >= 0) {
      window.log.info('[HF]: We just detected HF 17.0 on "retrieve"');
      await createOrUpdateItem({ id: 'hasSeenHardfork170', value: true });
      hasSeenHardfork170 = true;
    }
    if (!hasSeenHardfork180 && json.hf[0] >= 18 && json.hf[1] >= 0) {
      window.log.info('[HF]: We just detected HF 18.0 on "retrieve"');
      await createOrUpdateItem({ id: 'hasSeenHardfork180', value: true });
      hasSeenHardfork180 = true;
    }
  }
}
