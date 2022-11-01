import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { contextMenu } from 'react-contexify';

type SProps = {
  onArrowClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMainButtonClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  isMuted?: boolean;
  hidePopoverArrow?: boolean;
  iconType: 'microphone' | 'camera' | 'volume';
};

const StyledRoundedButton = styled.div<{ isMuted: boolean }>`
  background-color: #ffffff;
  color: ${props => (props.isMuted ? '#C1C1C1' : '#128b17')};
  border-radius: 50%;
  cursor: pointer;
  border:1px solid #e6e6e6
  transition-duration: 0.25s;
  border:var(--bchat-border);
  &:hover {
    color: #FFFFFF;
    background-color: #2879F9;
  }
`;

const StyledContainer = styled(StyledRoundedButton)`
  width: 60px;
  height: 60px;
  margin: 10px;
  opacity: 1;
  &:hover { 
    tranform:scale(1.1);
  }
`;

const StyledMainIcon = styled.div`
  padding: 20px;
`;

const StyledArrowIcon = styled(StyledRoundedButton)`
  width: 35%;
  height: 35%;
  position: relative;
  top: -35%;
  right: -65%;
  box-shadow: 0 0 4px 0 #f8f8f8;
  &:hover {
    background-color: #FFFFFF;
    color: #2879F9;
  }
`;

const CameraIcon = (
  <svg viewBox="0 0 488.3 488.3" fill="currentColor">
    <path d="M488.3,142.5v203.1c0,15.7-17,25.5-30.6,17.7l-84.6-48.8v13.9c0,41.8-33.9,75.7-75.7,75.7H75.7C33.9,404.1,0,370.2,0,328.4   V159.9c0-41.8,33.9-75.7,75.7-75.7h221.8c41.8,0,75.7,33.9,75.7,75.7v13.9l84.6-48.8C471.3,117,488.3,126.9,488.3,142.5Z" />
  </svg>
);

const SpeakerIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.726,3.293a1.058,1.058,0,0,0-1.05,1.058,1.028,1.028,0,0,0,.759,1,7.389,7.389,0,0,1,5.552,6.5c.018.21.027.423.027.638a7.381,7.381,0,0,1-5.579,7.136,1.028,1.028,0,0,0-.759,1,1.053,1.053,0,0,0,1.3,1.027,9.449,9.449,0,0,0,0-18.333A1.028,1.028,0,0,0,15.726,3.293Zm-4.1,1.188a1.033,1.033,0,0,0-.862.305L6.225,9.321H4.113A2.112,2.112,0,0,0,2,11.434v2.113a2.112,2.112,0,0,0,2.113,2.113H6.225l4.535,4.535a1.056,1.056,0,0,0,1.8-.747V5.534A1.053,1.053,0,0,0,11.622,4.481Zm4.068,3.295a1.065,1.065,0,0,0-1.015,1.06v.025a1.02,1.02,0,0,0,.522.9,3.139,3.139,0,0,1,0,5.461,1.023,1.023,0,0,0-.522.9v.023a1.051,1.051,0,0,0,1.549.93,5.261,5.261,0,0,0,0-9.164A1,1,0,0,0,15.691,7.776Z" />
  </svg>
);

const MicrophoneIcon = (
  <svg viewBox="3 6 24 24" fill="currentColor">
    <path d="M15.373,6.8a3.09,3.09,0,0,0-3.09,3.09l-.163,8.984a3.09,3.09,0,1,0,6.18,0l.163-8.984A3.09,3.09,0,0,0,15.373,6.8Zm-6.359,6.91A1.03,1.03,0,0,0,8,14.751v4.12A7.224,7.224,0,0,0,14.18,26v2.143H11.09a1.03,1.03,0,1,0,0,2.06h3.947a1.03,1.03,0,0,0,.336,0H19.33a1.03,1.03,0,1,0,0-2.06H16.24V26a7.224,7.224,0,0,0,6.18-7.128v-4.12a1.03,1.03,0,1,0-2.06,0v4.12a5.13,5.13,0,0,1-5.033,5.144.934.934,0,0,0-.245,0,5.131,5.131,0,0,1-5.021-5.144v-4.12a1.03,1.03,0,0,0-1.046-1.044Z" />
  </svg>
);

export const DropDownAndToggleButton = (props: SProps) => {
  const { iconType, hidePopoverArrow, onArrowClick, onMainButtonClick, isMuted } = props;
  const arrowClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onArrowClick(e);
  };

  const mainButtonClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    contextMenu.hideAll();
    onMainButtonClick(e);
  };
  const iconToRender =
    iconType === 'microphone' ? MicrophoneIcon : iconType === 'camera' ? CameraIcon : SpeakerIcon;

  return (
    <StyledContainer isMuted={isMuted || false}>
      <StyledMainIcon onClick={mainButtonClickHandler}>{iconToRender}</StyledMainIcon>
      {!hidePopoverArrow && (
        <StyledArrowIcon isMuted={false} onClick={arrowClickHandler}>
          <svg viewBox="-200 -200 640 640" fill="currentColor">
            <path d="M127.5 191.25L255 63.75L0 63.75L127.5 191.25Z" />
          </svg>
        </StyledArrowIcon>
      )}
    </StyledContainer>
  );
};
