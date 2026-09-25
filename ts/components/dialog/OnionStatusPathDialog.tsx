// import React from 'react';
import { useSelector } from 'react-redux';

import ip2country from 'ip2country';
import countryLookup from 'country-code-lookup';
import { Snode } from '../../data/data';
import {
  getFirstOnionPath,
  getFirstOnionPathLength,
  getIsOnline,
  getOnionPathsCount,
} from '../../state/selectors/onions';
import { Flex } from '../basic/Flex';
// tslint:disable-next-line: no-submodule-imports
import useHover from 'react-use/lib/useHover';
import { BchatSpinner } from '../basic/BchatSpinner';
import { BchatIcon, BchatIconButton, BchatIconSize } from '../icon';
import { getEffectiveOnionRoutingHops } from '../../data/settings-key';
// import styled from 'styled-components';
// import { BchatWrapperModal } from '../BchatWrapperModal';

export type StatusLightType = {
  glowStartDelay: number;
  glowDuration: number;
  color?: string;
};

const OnionCountryDisplay = ({
  index,
  labelText,
  snodeIp,
  role,
}: {
  snodeIp?: string;
  labelText: string;
  role: string;
  index: number;
}) => {
  const element = () => (
    <div className="onion__node__country" key={`country-${index}`}>
      <div>{role}</div>
      <span className='ip-country'>
        {snodeIp ? labelText + '(' + snodeIp + ')' : <div></div>}
      </span>
    </div>
  );
  const [hoverable] = useHover(element);
  return hoverable;
};

const OnionPathModalInner = () => {
  const onionPath = useSelector(getFirstOnionPath);
  const isOnline = useSelector(getIsOnline);

  // getEffectiveOnionRoutingHops() reads the hop count chosen from the "Onion Routing" picker in
  // Settings > Chat (0 / 1 / 3) - the same source of truth bchatFetch() uses to pick between the
  // raw request, bchatOneHopOnionFetch, and bchatOnionFetch.
  const onionRoutingHops = getEffectiveOnionRoutingHops();
  const isNoHops = onionRoutingHops === 0;

  // Only ever display a path that matches the selected mode: exactly one node for 1 hop, a real
  // multi-node path for 3 hops. Anything else is left over from before a mode switch and would
  // show the wrong mode - show the loading state until a request in the current mode publishes
  // fresh data (swarm polling does that within a few seconds).
  // 0 hops needs no path at all: requests go straight to the destination, so it never waits.
  const pathMatchesMode = onionRoutingHops === 1 ? onionPath?.length === 1 : onionPath?.length > 1;

  if (!isNoHops && (!isOnline || !onionPath || onionPath.length === 0 || !pathMatchesMode)) {
    return <BchatSpinner loading={true} />;
  }

  // With "1 hop" chosen, bchatOneHopOnionFetch() sends a single onion-encrypted request
  // straight to the storage node instead of building a 3-hop path via
  // OnionPaths.getOnionPath() - there's no separate entry/relay node to show, the one node in
  // the path *is* the destination.
  const isDirectSingleHop = onionRoutingHops === 1;

  // 0 hops: same card as the other modes, just You -> Destination with nothing in between.
  // (state.onionPaths.snodePaths isn't used for this mode and can only hold stale data from a
  // previous mode, so it's deliberately ignored here.)
  const pathToShow = isNoHops ? [] : onionPath;
  const glowDuration = pathToShow.length + 2;

  const nodes = [
    {
      label: window.i18n('device'),
    },
    ...pathToShow,
    {
      label: window.i18n('destination'),
    },
  ];
  const lastIndex = nodes.length - 1;

  const description = isNoHops
    ? window.i18n('onionPathIndicatorDescriptionZero')
    : isDirectSingleHop
    ? window.i18n('onionPathIndicatorDescriptionOneHop')
    : window.i18n('onionPathIndicatorDescription');

  return (
    <div className='hopes'>
      {/* <Flex style={{backgroundColor:'#202329'}}
        container={true}
        flexDirection="column"
        alignItems="center"
        height="62vh"
        justifyContent="center"
        margin="auto"
      > */}
      <div className='layer'>
        <div className="onion__description">{description}</div>
        <div className="onion__node-list">
          <Flex container={true}>
            <div className="onion__node-list-lights">
              <div className="onion__vertical-line" />

              <Flex container={true} flexDirection="column" alignItems="center" height="100%">
                {nodes.map((_snode: Snode | any, index: number) => {
                  return (
                    <OnionNodeStatusLight
                      glowDuration={glowDuration}
                      glowStartDelay={index}
                      key={`light-${index}`}
                    />
                  );
                })}
              </Flex>
            </div>
            <Flex container={true} flexDirection="column" alignItems="flex-start">
              {nodes.map((snode: Snode | any, index: number) => {
                // No template literal here: `${undefined}` is the string "undefined", which is
                // truthy, so a failed lookup used to render "undefined(65.109.88.141)" instead of
                // falling back to "Unknown Country".
                const labelText: string =
                  snode.label ||
                  countryLookup.byIso(ip2country(snode.ip))?.country ||
                  window.i18n('unknownCountry');

                // Endpoints (You / Destination) keep their own label. A single-node direct path
                // has nothing to call an "Entry Node" - it's the destination itself, reached in
                // one hop. Otherwise, fall back to the original entry/relay convention.
                const role =
                  index === 0 || index === lastIndex
                    ? labelText
                    : isDirectSingleHop
                    ? window.i18n('entryNode')
                    : index === 1
                    ? 'Entry Node'
                    : 'Master Node';

                return labelText ? (
                  <OnionCountryDisplay
                    index={index}
                    labelText={labelText}
                    snodeIp={snode.ip}
                    role={role}
                  />
                ) : null;
              })}
            </Flex>
          </Flex>
        </div>
      </div>
      {/* </Flex> */}
    </div>
  );
};

export type OnionNodeStatusLightType = {
  glowStartDelay: number;
  glowDuration: number;
};

/**
 * Component containing a coloured status light.
 */
export const OnionNodeStatusLight = (props: OnionNodeStatusLightType): JSX.Element => {
  const { glowStartDelay, glowDuration } = props;

  return (
    <ModalStatusLight
      glowDuration={glowDuration}
      glowStartDelay={glowStartDelay}
      color={'#108D32'}
    />
  );
};

/**
 * An icon with a pulsating glow emission.
 */
export const ModalStatusLight = (props: StatusLightType) => {
  const { glowStartDelay, glowDuration, color } = props;

  return (
    <div className="onion__growing-icon">
      <BchatIcon
        borderRadius={'50px'}
        iconColor={color}
        glowDuration={glowDuration}
        glowStartDelay={glowStartDelay}
        iconType="circle"
        iconSize={'small'}
      />
    </div>
  );
};

/**
 * A status light specifically for the action panel. Color is based on aggregate node states instead of individual onion node state
 */
export const ActionPanelOnionStatusLight = (props: {
  isSelected: boolean;
  handleClick: () => void;
  dataTestId?: string;
  id: string;
  size: BchatIconSize | number;
}) => {
  const { isSelected, handleClick, dataTestId, id, size } = props;

  const onionPathsCount = useSelector(getOnionPathsCount);
  const firstPathLength = useSelector(getFirstOnionPathLength);
  const isOnline = useSelector(getIsOnline);

  // Set icon color based on result
  const red = 'var(--color-destructive)';
  const green = 'var(--green-color)';
  const orange = 'var(--color-warning)';

  // Red here reads to users as "BChat isn't connected to the internet" - that's only true when
  // we're actually offline, so red is reserved for that. It must never be the resting color for
  // a mode that's working correctly.
  let iconColor = red;

  const onionRoutingHops = getEffectiveOnionRoutingHops();

  if (onionRoutingHops === 3) {
    // Full 3-hop onion routing: color reflects path redundancy - how many alternate 3-hop paths
    // are currently built (2+ = green, 1 = orange), not just "are we online". A valid path needs
    // at least 2 nodes (guard + relay/destination, by OnionPaths' own minimumGuardCount).
    if (isOnline && firstPathLength >= 2) {
      iconColor = onionPathsCount >= 2 ? green : orange;
    }
  } else {
    // 0 or 1 hop: bchatFetch() makes a single direct connection with no path-redundancy concept
    // to report (see bchatRpc.ts) - there's nothing here that should ever read as "1 of
    // however-many paths are up". The only meaningful signal is whether the app is actually
    // online, so: green while online, red only when it's not.
    if (isOnline) {
      iconColor = green;
    }
  }


  return (
    <BchatIconButton
      iconSize={size}
      iconType="circle"
      iconColor={iconColor}
      onClick={handleClick}
      // glowDuration={10}
      // glowStartDelay={0}
      // noScale={true}
      isSelected={isSelected}
      dataTestId={dataTestId}
      id={id}
      padding='0'
    />
  );
};

export const OnionPathModal = () => {
  return <OnionPathModalInner />;
};
