// import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getShowScrollButton } from '../state/selectors/conversations';

import { BchatIcon } from './icon';

const BchatScrollButtonDiv = styled.div`
  position: absolute;
  z-index: 99;
  right: 26px;
  animation: fadein var(--default-duration);
  bottom: 88px;
`;

export const BchatScrollButton = (props: {
  onClickScrollBottom: () => void;
  unreadCount: number | undefined;
}) => {
  const show = useSelector(getShowScrollButton);

  return (
    <BchatScrollButtonDiv>
      <div className="floated-downArrow ">
        {show && (<>
          <div
            className="floated-downArrow-btn-wrapper"
            role="button"
            onClick={props.onClickScrollBottom}
          >
            <BchatIcon
              iconType="arrow"
              iconSize={18}
              // isHidden={!show}
              iconColor="var(--color-downArrow)"
            />
           
          </div>
           <div className="floated-downArrow-unreadCountBox">{props.unreadCount}</div>
           </>
        )}
      </div>
    </BchatScrollButtonDiv>
  );
};
