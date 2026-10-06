const settingsReadReceipt = 'read-receipt-setting';
const settingsTypingIndicator = 'typing-indicators-setting';
const settingsAutoUpdate = 'auto-update';

const settingsMenuBar = 'hide-menu-bar';
const settingsSpellCheck = 'spell-check';
const settingsLinkPreview = 'link-preview-setting';
const settingsStartInTray = 'start-in-tray-setting';
const settingsOpengroupPruning = 'prune-setting';
const settingsAudioNotification = 'audio-notification-setting';
// 0, 1 or 3 - the number of hops chosen from the "Onion Routing" picker in Settings > Chat
// (0 = direct/no onion encryption, 1 = direct but onion-encrypted, 3 = full onion routing).
// See getEffectiveOnionRoutingHops() below, which is what bchatFetch() in bchatRpc.ts actually
// reads.
const settingsOnionRoutingHops = 'onion-routing-hops-setting';



export const SettingsKey = { 
  settingsReadReceipt,
  settingsTypingIndicator, 
  settingsAutoUpdate,
  settingsMenuBar,
  settingsSpellCheck,
  settingsLinkPreview,
  settingsStartInTray,
  settingsOpengroupPruning,
  settingsAudioNotification,
  settingsOnionRoutingHops,
};

/**
 * Resolves the effective onion-routing hop count for a snode request:
 *  - 0 hop: no onion encryption at all - the request goes out as a raw, direct call (see the
 *    insecureNodeFetch fallback in bchatFetch(), bchatRpc.ts).
 *  - 1 hop: still a single direct round trip to the target node, but the body is encrypted to
 *    that node's own x25519 key (bchatOneHopOnionFetch, onions.ts).
 *  - 3 hops: the full onion-routed path (bchatOnionFetch, onions.ts).
 *
 * settingsOnionRoutingHops (set from the "Onion Routing" picker in Settings > Chat, replacing
 * the old on/off toggle) is the source of truth once the user has actually picked something.
 * Until then it's unset and this returns 1 hop, the default. Before this picker existed, onion
 * routing wasn't a stored setting at all - it was hardcoded on (3 hops) via
 * window.bchatFeatureFlags.useOnionRequests in preload.js - so every existing user moves from 3
 * hops to 1 hop on upgrade, until they pick something else from the picker.
 *
 * Shared by bchatRpc.ts (picks bchatOnionFetch vs bchatOneHopOnionFetch vs the raw request) and
 * OnionStatusPathDialog.tsx (renders the Settings > Hops screen for whichever mode is live), so
 * both stay in sync with the same definition of "how many hops are we actually using right now".
 */
export function getEffectiveOnionRoutingHops(): 0 | 1 | 3 {
  const storedHops = window.getSettingValue(SettingsKey.settingsOnionRoutingHops);
  if (storedHops === 0 || storedHops === 1 || storedHops === 3) {
    return storedHops;
  }
  return 1;
}
