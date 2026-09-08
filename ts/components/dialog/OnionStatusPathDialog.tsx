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
import { BchatSpinner } from '../basic/BchatSpinner';
import { BchatIcon, BchatIconButton, BchatIconSize } from '../icon';
// import styled from 'styled-components';
// import { BchatWrapperModal } from '../BchatWrapperModal';

export type StatusLightType = {
  glowStartDelay: number;
  glowDuration: number;
  color?: string;
};

const OnionPathModalInner = () => {
  const onionPath = useSelector(getFirstOnionPath);
  const isOnline = useSelector(getIsOnline);
  if (!isOnline || !onionPath || onionPath.length === 0) {
    return <BchatSpinner loading={true} />;
  }

  const nodes = [
    {
      label: window.i18n('device'),
    },
    ...onionPath,
    {
      label: window.i18n('destination'),
    },
  ];

  // NOIR: the route as a live diagram — diamond nodes on a dashed stem,
  // mono labels, and a stats line. Proof of privacy, not decoration.
  return (
    <div className="hopes noir-hops">
      <div className="noir-hops__head">Onion route</div>
      <div className="noir-hops__sub">{window.i18n('onionPathIndicatorDescription')}</div>
      <div className="noir-hops__path">
        {nodes.map((snode: Snode | any, index: number) => {
          const isFirst = index === 0;
          const isLast = index === nodes.length - 1;
          let country = snode.label
            ? snode.label
            : `${countryLookup.byIso(ip2country(snode.ip))?.country}`;
          if (!country || country === 'undefined') {
            country = window.i18n('unknownCountry');
          }
          const tag = isFirst
            ? 'ORIGIN'
            : isLast
            ? 'DESTINATION'
            : `HOP ${String(index).padStart(2, '0')}`;
          const value = isFirst ? 'You' : isLast ? 'Swarm' : country;
          const note = isFirst
            ? '// this device'
            : isLast
            ? '// encrypted'
            : snode.ip
            ? `// ${snode.ip}`
            : '';
          return (
            <div className="noir-hops__node" key={`node-${index}`}>
              <div className="pin">
                <div className={isFirst ? 'dot you' : 'dot'} />
                {!isLast && <div className="stem" />}
              </div>
              <div className="nd">
                <div className="nl">{tag}</div>
                <div className="nv">
                  {value} <span>{note}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="noir-hops__stat">
        <div className="st">
          <div className="k">STATUS</div>
          <div className="v">
            <i>●</i> LIVE
          </div>
        </div>
        <div className="st">
          <div className="k">HOPS</div>
          <div className="v">{String(onionPath.length).padStart(2, '0')}</div>
        </div>
      </div>
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

  // start with red
  let iconColor = red;
  //if we are not online or the first path is not valid, we keep red as color
  if (isOnline && firstPathLength > 1) {
    iconColor = onionPathsCount >= 2 ? green : onionPathsCount >= 1 ? orange : red;
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
