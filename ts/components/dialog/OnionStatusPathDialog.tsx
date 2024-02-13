import React from 'react';
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
}: {
  snodeIp?: string;
  labelText: string;
  index: number;
}) => {
  const element = () => (
    <div className="onion__node__country" key={`country-${index}`}>
      <div>
        {index === 1 ? 'Entry Node' : index !== 0 && index !== 4 ? 'Master Node' : labelText}
      </div>
      <span style={{ fontSize: '11px' }}>
        {index !== 0 && index !== 4 ? labelText + '(' + snodeIp + ')' : <div></div>}
      </span>
    </div>
  );
  const [hoverable] = useHover(element);
  return hoverable;
};

const OnionPathModalInner = () => {
  const onionPath = useSelector(getFirstOnionPath);
  const isOnline = useSelector(getIsOnline);
  const glowDuration = onionPath.length + 2;
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

  return (
    <>
      <Flex
        container={true}
        flexDirection="column"
        alignItems="center"
        height="70vh"
        justifyContent="center"
      >
        <p className="onion__description">{window.i18n('onionPathIndicatorDescription')}</p>
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
                let labelText = snode.label
                  ? snode.label
                  : `${countryLookup.byIso(ip2country(snode.ip))?.country}`;
                if (!labelText) {
                  labelText = window.i18n('unknownCountry');
                }
                return labelText ? (
                  <OnionCountryDisplay index={index} labelText={labelText} snodeIp={snode.ip} />
                ) : null;
              })}
            </Flex>
          </Flex>
        </div>
      </Flex>
    </>
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
      color={'var(--color-accent)'}
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

  // const OuterCircle=styled.div`
  //   // border: 2px solid ${iconColor};
  //   // padding: 1px 1px;
  //   border-radius: 17px;
  // `

  return (
    <BchatIconButton
      iconSize={size}
      iconType="circle"
      iconColor={iconColor}
      onClick={handleClick}
      glowDuration={10}
      glowStartDelay={0}
      noScale={true}
      isSelected={isSelected}
      dataTestId={dataTestId}
      id={id}
    />
  );
};

export const OnionPathModal = () => {
  return <OnionPathModalInner />;
};
