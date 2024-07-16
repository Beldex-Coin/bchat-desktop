import React, { useState } from 'react';
import classNames from 'classnames';
import { useEncryptedFileFetch } from '../../hooks/useEncryptedFileFetch';
import { isEqual } from 'lodash';
import {
  useAvatarPath,
  useConversationUsername,
  useIsClosedGroup,
} from '../../hooks/useParamSelector';
import { AvatarPlaceHolder } from './AvatarPlaceHolder/AvatarPlaceHolder';
import { ClosedGroupAvatar } from './AvatarPlaceHolder/ClosedGroupAvatar';
import { useDisableDrag } from '../../hooks/useDisableDrag';
import styled from 'styled-components';
// import { BchatIcon } from '../icon/BchatIcon';

export enum AvatarSize {
  XS = 28,
  S = 36,
  M = 48,
  L = 60,
  XL = 80,
  HUGE = 300,
}

type Props = {
  forcedAvatarPath?: string | null;
  forcedName?: string;
  pubkey: string;
  size: AvatarSize;
  base64Data?: string; // if this is not empty, it will be used to render the avatar with base64 encoded data
  onAvatarClick?: () => void;
  dataTestId?: string;
};

const Identicon = (props: Props) => {
  const { size, forcedName, pubkey } = props;
  const displayName = useConversationUsername(pubkey);
  const userName = forcedName || displayName || '0';

  return <AvatarPlaceHolder diameter={size} name={userName} pubkey={pubkey} />;
};

const CrownWrapper = styled.div`
  height: 15px;
  width: 15px;
`;

export const CrownIcon = () => {
  return (
    <CrownWrapper>
      <img src="images/bchat/Crown.svg" width={'100%'} height={'100%'}></img>
    </CrownWrapper>
  );
};
export const BNSWrapper = (props: any) => {
  const {  position,isBnsHolder } = props;

  return (
    <>  
    {isBnsHolder?
      <div
      className="module-avatar-verify-wrapper"
      // style={{ width: size + 'px', height: size + 'px' }}
    >
      {props.children}
      <span
        className="module-avatar-verify-wrapper-verify-tag"
        style={{ left: position.left, top: position.top }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M27.7116 16.5635L27.7111 16.5627L26.9045 15.3265C26.9043 15.3262 26.9041 15.3259 26.9039 15.3256C26.7747 15.1262 26.7747 14.8739 26.9039 14.6745C26.9041 14.6742 26.9043 14.6739 26.9045 14.6736L27.7111 13.4373L27.7116 13.4366C28.8025 11.7613 28.0707 9.50721 26.1998 8.79587C26.1991 8.79557 26.1983 8.79528 26.1975 8.79498L24.8205 8.26537L24.8184 8.26454C24.6042 8.18276 24.4525 7.97724 24.4406 7.7408L24.4406 7.74051L24.3661 6.26371L24.3661 6.26344C24.2646 4.263 22.3433 2.87973 20.4165 3.39286L20.4152 3.39321L18.9863 3.77577L18.9829 3.77672C18.7592 3.83747 18.5196 3.76148 18.3709 3.57716L18.3695 3.57541L17.4419 2.43062C17.4415 2.43013 17.4411 2.42964 17.4407 2.42916C16.1854 0.87127 13.8149 0.87127 12.5596 2.42916C12.5592 2.42964 12.5588 2.43013 12.5584 2.43062L11.6308 3.57541L11.6294 3.57716C11.4807 3.76148 11.2411 3.83747 11.0174 3.77671L11.0139 3.77578L9.58511 3.3932L9.58381 3.39286C7.65699 2.87973 5.73573 4.263 5.63424 6.26344L5.63423 6.26371L5.5597 7.74051L5.55969 7.74079C5.54783 7.97724 5.39604 8.18276 5.18192 8.26454L5.17975 8.26537L3.80046 8.79587C1.92959 9.50721 1.1978 11.7613 2.28871 13.4366L2.2892 13.4373L3.09583 14.6736C3.09594 14.6738 3.09605 14.674 3.09616 14.6741C3.22563 14.8737 3.22563 15.1263 3.09616 15.3259C3.09605 15.3261 3.09594 15.3263 3.09583 15.3265L2.2892 16.5627L2.28871 16.5635C1.19781 18.2388 1.92958 20.4928 3.8004 21.2042C3.8012 21.2045 3.802 21.2048 3.8028 21.2051L5.17975 21.7347L5.18192 21.7355C5.39604 21.8173 5.54783 22.0228 5.55969 22.2593L5.5597 22.2596L5.63423 23.7364L5.63424 23.7366C5.73573 25.7371 7.65699 27.1204 9.58381 26.6072L9.58511 26.6069L11.014 26.2243L11.0174 26.2234C11.2411 26.1626 11.4807 26.2386 11.6293 26.4229L11.6308 26.4247L12.5584 27.5695C12.5587 27.5699 12.5591 27.5703 12.5594 27.5707C13.8148 29.1289 16.1855 29.1289 17.4409 27.5707C17.4412 27.5703 17.4416 27.5699 17.4419 27.5695L18.3695 26.4247L18.3709 26.4229C18.5196 26.2386 18.7592 26.1626 18.9829 26.2234L18.9863 26.2243L20.4152 26.6069L20.4165 26.6072C22.3433 27.1204 24.2646 25.7371 24.3661 23.7366L24.3661 23.7364L24.4406 22.2596L24.4406 22.2593C24.4525 22.0228 24.6042 21.8173 24.8184 21.7355L24.8205 21.7347L26.1975 21.2051C26.1983 21.2048 26.1991 21.2045 26.1998 21.2042C28.0707 20.4929 28.8025 18.2388 27.7116 16.5635ZM6.55843 22.2092L6.55839 22.2092L6.55843 22.2092ZM18.989 11.323L18.989 11.323L13.8317 19.2835C13.821 19.2999 13.8048 19.3097 13.7876 19.3122L13.7824 19.3124C13.7812 19.3125 13.7803 19.3125 13.7796 19.3125C13.7784 19.3125 13.7781 19.3125 13.7786 19.3125C13.7606 19.3125 13.7423 19.3047 13.7293 19.2903C13.7292 19.2901 13.729 19.29 13.7289 19.2898L11.017 16.2067C10.9938 16.1804 10.9967 16.1403 11.0224 16.1178L11.0231 16.1171C11.0479 16.0952 11.0871 16.0966 11.1107 16.1234L12.8982 18.1559L13.7704 19.1475L14.4884 18.0392L18.8833 11.2552C18.9014 11.2272 18.9388 11.2167 18.9716 11.2373C18.9994 11.2557 19.0078 11.294 18.989 11.323Z"
            fill="#00BD40"
            stroke="#2A2A3B"
            stroke-width="2"
          />
        </svg>
      </span>
    </div>
    :
    props.children}
    </>

  );
};
const NoImage = (
  props: Pick<Props, 'forcedName' | 'size' | 'pubkey' | 'onAvatarClick'> & {
    isClosedGroup: boolean;
  }
) => {
  const { forcedName, size, pubkey, isClosedGroup } = props;
  // if no image but we have conversations set for the group, renders group members avatars
  if (pubkey && isClosedGroup) {
    return (
      <ClosedGroupAvatar size={size} closedGroupId={pubkey} onAvatarClick={props.onAvatarClick} />
    );
  }

  return <Identicon size={size} forcedName={forcedName} pubkey={pubkey} />;
};

const AvatarImage = (props: {
  avatarPath?: string;
  base64Data?: string;
  name?: string; // display name, profileName or pubkey, whatever is set first
  imageBroken: boolean;
  datatestId?: string;
  handleImageError: () => any;
}) => {
  const { avatarPath, base64Data, name, imageBroken, datatestId, handleImageError } = props;

  const disableDrag = useDisableDrag();

  if ((!avatarPath && !base64Data) || imageBroken) {
    return null;
  }
  const dataToDisplay = base64Data ? `data:image/jpeg;base64,${base64Data}` : avatarPath;

  return (
    <img
      onError={handleImageError}
      onDragStart={disableDrag}
      alt={window.i18n('contactAvatarAlt', [name || 'avatar'])}
      src={dataToDisplay}
      data-testid={datatestId}
    />
  );
};

const AvatarInner = (props: Props) => {
  const { base64Data, size, pubkey, forcedAvatarPath, forcedName, dataTestId } = props;
  const [imageBroken, setImageBroken] = useState(false);

  const isClosedGroupAvatar = useIsClosedGroup(pubkey);

  const avatarPath = useAvatarPath(pubkey);
  const name = useConversationUsername(pubkey);

  // contentType is not important
  const { urlToLoad } = useEncryptedFileFetch(forcedAvatarPath || avatarPath || '', '', true);
  const handleImageError = () => {
    window.log.warn(
      'Avatar: Image failed to load; failing over to placeholder',
      urlToLoad,
      forcedAvatarPath || avatarPath
    );
    setImageBroken(true);
  };

  const hasImage = (base64Data || urlToLoad) && !imageBroken && !isClosedGroupAvatar;

  const isClickable = !!props.onAvatarClick;
  return (
    <div
      className={classNames(
        'module-avatar',
        `module-avatar--${size}`,
        hasImage ? 'module-avatar--with-image' : 'module-avatar--no-image',
        isClickable && 'module-avatar-clickable'
      )}
      onMouseDown={e => {
        if (props.onAvatarClick) {
          e.stopPropagation();
          e.preventDefault();
          props.onAvatarClick?.();
        }
      }}
      role="button"
      data-testid={dataTestId}
    >
      {hasImage ? (
        // tslint:disable-next-line: use-simple-attributes

        <AvatarImage
          avatarPath={urlToLoad}
          base64Data={base64Data}
          imageBroken={imageBroken}
          name={forcedName || name}
          handleImageError={handleImageError}
          datatestId={dataTestId ? `img-${dataTestId}` : undefined}
        />
      ) : (
        <NoImage {...props} isClosedGroup={isClosedGroupAvatar} />
      )}
    </div>
  );
};

export const Avatar = React.memo(AvatarInner, isEqual);
