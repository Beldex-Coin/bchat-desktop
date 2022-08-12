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
  font-size: var(--font-size-md);
  line-height: var(--font-size-md);
  font-family: var(--font-default);
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
  if (!toastIcon) {
    switch (type) {
      case BchatToastType.Info:
        toastIcon = 'info';
        break;
      case BchatToastType.Success:
        toastIcon = 'check';
        break;
      case BchatToastType.Error:
        toastIcon = 'error';
        break;
      case BchatToastType.Warning:
        toastIcon = 'warning';
        break;
      default:
        toastIcon = 'info';
    }
  }

  return (
    // tslint:disable-next-line: use-simple-attributes
    <Flex
      container={true}
      alignItems="center"
      onClick={props?.onToastClick || noop}
      data-testid="bchat-toast"
    >
      <IconDiv style={{paddingLeft:'10px',paddingRight:'8px'}}>
        <BchatIcon iconType={toastIcon} iconSize={toastIconSize} />
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
