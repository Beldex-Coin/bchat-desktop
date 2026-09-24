const settingsReadReceipt = 'read-receipt-setting';
const settingsTypingIndicator = 'typing-indicators-setting';
const settingsAutoUpdate = 'auto-update';

const settingsMenuBar = 'hide-menu-bar';
const settingsSpellCheck = 'spell-check';
const settingsLinkPreview = 'link-preview-setting';
const settingsStartInTray = 'start-in-tray-setting';
const settingsOpengroupPruning = 'prune-setting';
const settingsAudioNotification = 'audio-notification-setting';
const settingsOnionRouting = 'onion-routing-setting';
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
  settingsOnionRouting,
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
 * Before that picker existed, settingsOnionRouting was a plain on/off toggle - an explicit
 * `false` there becomes 0 hop (matching what "off" already did), and unset or `true` becomes 1
 * hop, the new default. This keeps every existing user's outcome the same (or, for users who had
 * it on, deliberately moves them from the old 3-hop default down to 1 hop - see bchatRpc.ts for
 * the full rationale) without needing a separate migration step; once a user picks anything from
 * the new picker, settingsOnionRoutingHops is set explicitly and this fallback no longer applies
 * to them.
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
  const onionRoutingSetting = window.getSettingValue(SettingsKey.settingsOnionRouting);
  return onionRoutingSetting === false ? 0 : 1;
}
