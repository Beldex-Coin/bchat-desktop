import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useUpdate from 'react-use/lib/useUpdate';
import { SettingMiniModal } from '../../state/ducks/modalDialog';
import { updateOnionPaths } from '../../state/ducks/onion';
import { SettingsKey, getEffectiveOnionRoutingHops } from '../../data/settings-key';
import { OnionPaths } from '../../bchat/onions';
import { BchatSettingsItemWrapper } from './BchatSettingListItem';
import { BchatIcon } from '../icon';

type OnionRoutingHops = 0 | 1 | 3;

const HOP_OPTIONS: Array<OnionRoutingHops> = [0, 1, 3];

function hopLabel(hops: OnionRoutingHops): string {
  switch (hops) {
    case 0:
      return window.i18n('onionRoutingHopsZeroHop');
    case 1:
      return window.i18n('onionRoutingHopsOneHop');
    case 3:
    default:
      return window.i18n('onionRoutingHopsThreeHops');
  }
}

// Live description shown in the popup itself, under the radio list - updates as the user
// clicks through 0/1/3 Hop, before they hit OK. Distinct from onionRoutingDescriptionStable
// (the fixed row description in Settings > Chat, which no longer changes per hop count) and
// from the older, now-unused per-hop onionRoutingDescription{Zero,One,Three} keys.
function hopPopupDescription(hops: OnionRoutingHops): string {
  switch (hops) {
    case 0:
      return window.i18n('onionRoutingHopsPopupDescriptionZero');
    case 1:
      return window.i18n('onionRoutingHopsPopupDescriptionOne');
    case 3:
    default:
      return window.i18n('onionRoutingHopsPopupDescriptionThree');
  }
}

// The closed row's value (not the popup's radio list, which stays plain "1 Hop"/"0 Hop"/
// "3 Hops" per the earlier request to drop this text from there) marks 1 hop with a muted
// "(Default)" suffix, since it's the default for new selections and for the live-build
// migration in getEffectiveOnionRoutingHops().
function hopValueNode(hops: OnionRoutingHops) {
  if (hops === 1) {
    return (
      <>
        {window.i18n('onionRoutingHopsOneHop')}{' '}
        <span className="bchat-settings-item-hops-Change__default">
          {window.i18n('onionRoutingHopsDefaultSuffix')}
        </span>
      </>
    );
  }
  return hopLabel(hops);
}

/**
 * Replaces the old on/off "Onion Routing" toggle with a single/multi-hop picker, styled and
 * wired the same way as ChangeChatFontSetting (BchatSettingsItemWrapper + the generic
 * SettingMiniModal single-choice dialog): a "value + chevron" row that opens a list of the three
 * hop counts BChat supports for a snode request - see getEffectiveOnionRoutingHops() in
 * settings-key.ts and bchatFetch() in bchatRpc.ts for what each one actually does:
 *  - 0 hop: raw, direct request - fastest, no onion encryption.
 *  - 1 hop: still a single direct round trip, but onion-encrypted to the target node.
 *  - 3 hops: the full onion-routed path.
 */
export const ChangeOnionRoutingSetting = () => {
  const forceUpdate = useUpdate();
  const dispatch = useDispatch();
  const [hops, setHops] = useState<OnionRoutingHops>(getEffectiveOnionRoutingHops());

  const labelsByHop = HOP_OPTIONS.map(hopLabel);

  const labelToHop = (label: string): OnionRoutingHops => {
    const index = labelsByHop.indexOf(label);
    return HOP_OPTIONS[index === -1 ? 1 : index];
  };

  const displayPopUp = () => {
    dispatch(
      SettingMiniModal({
        headerName: window.i18n('onionRoutingHopsTitle'),
        content: labelsByHop,
        descriptions: HOP_OPTIONS.map(hopPopupDescription),
        // The shared picker modal defaults this button to "Save" (fine for Font Size), but the
        // Hops design calls for "OK".
        confirmButtonText: window.i18n('ok'),
        selectedItem: hopLabel(hops),
        onClose: () => dispatch(SettingMiniModal(null)),
        onClick: (selected: string) => {
          const chosenHops = labelToHop(selected);
          window.setSettingValue(SettingsKey.settingsOnionRoutingHops, chosenHops);
          setHops(chosenHops);
          dispatch(SettingMiniModal(null));
          forceUpdate();

          // state.onionPaths.snodePaths (what Settings > Hops and the action-panel dot both
          // read) is only ever written from inside an actual request - getOnionPath() dispatches
          // it for 3 hops, bchatOneHopOnionFetch() for 1 hop. Without this, switching modes here
          // wouldn't touch that state at all, so the Hops screen would keep showing whatever the
          // last real send actually used (e.g. a stale 1-hop entry mislabeled as a 3-hop node)
          // until the next message goes out.
          if (chosenHops === 3) {
            // Proactively (re)build and dispatch a real 3-hop path right away - the same call
            // bchatOnionFetch() itself makes, so Settings > Hops reflects the new mode
            // immediately instead of waiting on the next send.
            void OnionPaths.getOnionPath({}).catch(e => {
              window?.log?.warn(
                'Failed to proactively build a 3-hop onion path after switching hop count',
                e
              );
            });
          } else {
            // 0 or 1 hop: whatever path was last dispatched (e.g. a 3-hop path from before) is
            // now stale and would be mislabeled under the new mode. Clear it so the Hops screen
            // falls back to its loading state until the next real request in the new mode
            // dispatches fresh data.
            dispatch(updateOnionPaths([]));
          }
        },
      })
    );
  };

  return (
    <BchatSettingsItemWrapper
      title={window.i18n('onionRoutingTitle')}
      inline={true}
      iconType="hops"
      // Fixed regardless of the selected hop count - the per-mode tradeoff used to live here
      // but that made this row's text change every time the picker below it changed. It's now a
      // single stable description regardless of the picked hop count.
      description={window.i18n('onionRoutingDescriptionStable')}
    >
      <div className="bchat-settings-item-hops-Change" onClick={() => displayPopUp()}>
        <div>{hopValueNode(hops)}</div>
        <BchatIcon iconSize="small" iconType="chevron" iconRotation={270} />
      </div>
    </BchatSettingsItemWrapper>
  );
};
