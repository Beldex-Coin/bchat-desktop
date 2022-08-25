import React from 'react';

import { Flex } from './Flex';
import styled from 'styled-components';
import { noop } from 'lodash';
import { BchatIcon, BchatIconType } from '../icon';

export enum BchatToastType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

type Props = {
  title: string;
  id?: string;
  type?: BchatToastType;
  icon?: BchatIconType;
  description?: string;
  closeToast?: any;
  onToastClick?: () => void;
};

const TitleDiv = styled.div`
  font-size: 12px;
  line-height: var(--font-size-md);
  font-family: poppin-medium
  color: var(--color-text);
  text-overflow: ellipsis;
`;

const DescriptionDiv = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-subtle);
  text-overflow: ellipsis;
  font-family: var(--font-default);
  padding-bottom: var(--font-size-xs);
  padding-top: var(--font-size-xs);
`;

const IconDiv = styled.div`
  flex-shrink: 0;
  padding-inline-end: var(--margins-xs);
`;

export const BchatToast = (props: Props) => {
  const { title, description, type, icon } = props;

  const toastDesc = description ? description : '';
  const toastIconSize = toastDesc ? 'huge' : 'medium';

  // Set a custom icon or allow the theme to define the icon
  let toastIcon = icon || undefined;
  let toastColor :any;
  if (!toastIcon) {
    switch (type) {
      case BchatToastType.Info:
        toastIcon = 'info';
        toastColor = '#2879FB';
        break;
      case BchatToastType.Success:
        toastIcon = 'check';
        toastColor = '#17a61b'
        break;
      case BchatToastType.Error:
        toastIcon = 'error';
        toastColor = '#FF3C3C'
        break;
      case BchatToastType.Warning:
        toastIcon = 'warning';
        break;
      default:
        toastIcon = 'info';
    }
  }
  console.log("BCHATTOASTTYPE:",toastIcon)

  return (
    // tslint:disable-next-line: use-simple-attributes
    <Flex
      container={true}
      alignItems="center"
      onClick={props?.onToastClick || noop}
      data-testid="bchat-toast"
    >
      <IconDiv style={{paddingLeft:'10px',paddingRight:'13px'}}>
        <BchatIcon iconType={toastIcon} iconSize={toastIconSize} iconColor={toastColor}/>
      </IconDiv>
      <Flex
        container={true}
        justifyContent="flex-start"
        flexDirection="column"
        className="bchat-toast"
      >
        <TitleDiv>{title}</TitleDiv>
        {toastDesc && <DescriptionDiv>{toastDesc}</DescriptionDiv>}
      </Flex>
    </Flex>
  );
};
