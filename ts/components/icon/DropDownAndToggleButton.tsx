import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { contextMenu } from 'react-contexify';
import { BchatIcon } from './BchatIcon';
import { BchatIconType } from './Icons';

type SProps = {
  onArrowClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMainButtonClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  isMuted?: boolean;
  hidePopoverArrow?: boolean;
  iconType: BchatIconType;
  isCallModalExpandView?:boolean;
};

const StyledRoundedButton = styled.div<{ isMuted: boolean; isSelected?: boolean,isCallModalExpandView?:boolean }>`
  // background-color:var(--color-clickable-hovered);
  color: ${props => (props.isSelected ? '#FF3E3E' : '#128b17')};
  border-radius: 50%;
  cursor: pointer;
  border:1px solid #e6e6e6
  transition-duration: 0.25s;
  border:var(--bchat-border);
  background-color: ${props => props.isSelected ? '#FFBF91':props.isCallModalExpandView ?'var(--color-enable-btn-bg)'
    : 'var(--color-clickable-hovered)'};
  &:hover {
    // background-color: var(--color-call-option-btn-hover);
  background-color:#FFBF91;
  opacity:0.9;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const StyledContainer = styled(StyledRoundedButton)`
  width: 60px;
  height: 60px;
  margin: 5px;
  opacity: 1;
  &:hover {
    tranform: scale(1.1);
  }
`;

const StyledArrowIcon = styled(StyledRoundedButton)`
  width: 35%;
  height: 35%;
  // position: relative;
  top: 39px;
  right: 0px;
  border: 2px solid var(--color-hop-bg);

  position: absolute;
  &:hover {
    background-color: #ffffff;
    color: #2879f9;
  }
`;


export const DropDownAndToggleButton = (props: SProps) => {
  const { iconType, hidePopoverArrow, onArrowClick, onMainButtonClick, isMuted,isCallModalExpandView } = props;
  const arrowClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onArrowClick(e);
  };

  const mainButtonClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    contextMenu.hideAll();
    onMainButtonClick(e);
  };
  const fillColor= 'var(--color-text)';
  return (
    <StyledContainer
      isMuted={isMuted || false}
      isSelected={isMuted}
      onClick={mainButtonClickHandler}
      isCallModalExpandView={isCallModalExpandView}
    >
      <BchatIcon iconType={iconType} iconSize={27} iconColor={isMuted?'#333333':fillColor} />
      {!hidePopoverArrow && (
        <StyledArrowIcon isMuted={isMuted || false} onClick={arrowClickHandler}>
          <BchatIcon iconType="chevron" iconColor={fillColor} iconSize={20} />
        </StyledArrowIcon>
      )}
    </StyledContainer>
  );
};
