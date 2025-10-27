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
import VerifyPadgeIcon from '../icon/VerifyPadgeIcon';
// import { BchatIcon } from '../icon/BchatIcon';

export enum AvatarSize {
  XS = 28,
  S = 36,
  M = 48,
  L = 60,
  XL = 80,
  XXL = 130,
  XXXL = 200,
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
  isGroup?: boolean;
  isBnsHolder?: boolean;
};

export const Identicon = (props: Props) => {
  const { size, forcedName, pubkey, isGroup } = props;
  const displayName = useConversationUsername(pubkey);
  const userName = forcedName || displayName || '0';

  return <AvatarPlaceHolder diameter={size} name={userName} pubkey={pubkey} isGroup={isGroup} />;
};

const CrownWrapper = styled.div`
  // height: 15px;
  // width: 15px;
  height: 18px;
  width: 18px;
  position: absolute;
  top: -12px;
  left: 15px;
`;

export const CrownIcon = () => {
  return (
    <CrownWrapper>
      <img src="images/bchat/Crown.svg" width={'100%'} height={'100%'}></img>
    </CrownWrapper>
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
  const { base64Data, size, pubkey, forcedAvatarPath, forcedName, dataTestId, isBnsHolder } = props;
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
      className={classNames(isBnsHolder && 'module-avatar-verify-wrapper','bns-verify-wrapper')}
      // style={{ width: size + 'px', height: size + 'px' }}
    >
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
        {!!isBnsHolder && (
          <span
            className="module-avatar-verify-wrapper-verify-tag"
            style={{ bottom: -7, right: -7 }}
          >
            <VerifyPadgeIcon />
          </span>
        )}
      </div>
    </div>
  );
};

export const Avatar = React.memo(AvatarInner, isEqual);
