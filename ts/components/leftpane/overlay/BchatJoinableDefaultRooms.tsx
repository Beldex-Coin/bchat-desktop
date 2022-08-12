import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import {
  joinOpenGroupV2WithUIEvents,
  parseOpenGroupV2,
} from '../../../bchat/apis/open_group_api/opengroupV2/JoinOpenGroupV2';
import { downloadPreviewOpenGroupV2 } from '../../../bchat/apis/open_group_api/opengroupV2/OpenGroupAPIV2';
import { updateDefaultBase64RoomData } from '../../../state/ducks/defaultRooms';
import { StateType } from '../../../state/reducer';
import { Avatar, AvatarSize } from '../../avatar/Avatar';
import { Flex } from '../../basic/Flex';
import { PillContainerHoverable, PillTooltipWrapper } from '../../basic/PillContainer';
import { BchatSpinner } from '../../basic/BchatSpinner';
// import { H3 } from '../../basic/Text';
// tslint:disable: no-void-expression

export type JoinableRoomProps = {
  completeUrl: string;
  name: string;
  roomId: string;
  imageId?: string;
  onClick: (completeUrl: string) => void;
  base64Data?: string;
};

const BchatJoinableRoomAvatar = (props: JoinableRoomProps) => {
  const dispatch = useDispatch();
  useEffect(() => {
    let isCancelled = false;

    try {
      const parsedInfos = parseOpenGroupV2(props.completeUrl);
      if (parsedInfos) {
        if (props.base64Data) {
          return;
        }
        if (isCancelled) {
          return;
        }
        downloadPreviewOpenGroupV2(parsedInfos)
          .then(base64 => {
            if (isCancelled) {
              return;
            }
            const payload = {
              roomId: props.roomId,
              base64Data: base64 || '',
            };
            dispatch(updateDefaultBase64RoomData(payload));
          })
          .catch(e => {
            if (isCancelled) {
              return;
            }
            window?.log?.warn('downloadPreviewOpenGroupV2 failed', e);
            const payload = {
              roomId: props.roomId,
              base64Data: '',
            };
            dispatch(updateDefaultBase64RoomData(payload));
          });
      }
    } catch (e) {
      window?.log?.warn(e);
    }
    return () => {
      isCancelled = true;
    };
  }, [props.imageId, props.completeUrl]);

  return (
    <Avatar
      size={AvatarSize.M}
      base64Data={props.base64Data}
      {...props}
      pubkey=""
      onAvatarClick={() => props.onClick(props.completeUrl)}
    />
  );
};

const StyledRoomName = styled(Flex)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 10px;
  font-size:18px;
  font-weight:bold;
`;

const BchatJoinableRoomName = (props: JoinableRoomProps) => {
  return <StyledRoomName>{props.name}</StyledRoomName>;
};

const BchatJoinableRoomRow = (props: JoinableRoomProps) => {
  return (
    <PillTooltipWrapper>
      <PillContainerHoverable
        onClick={() => {
          props.onClick(props.completeUrl);
        }}
        margin="7px 0px 0 19px"
        padding="5px"
      >
        <BchatJoinableRoomAvatar {...props} />
        <BchatJoinableRoomName {...props} />
      </PillContainerHoverable>
    </PillTooltipWrapper>
  );
};

export const BchatJoinableRooms = (props: { onRoomClicked: () => void }) => {
  const joinableRooms = useSelector((state: StateType) => state.defaultRooms);
  const onRoomClicked = useCallback(
    (loading: boolean) => {
      if (loading) {
        props.onRoomClicked();
      }
    },
    [props.onRoomClicked]
  );

  if (!joinableRooms.inProgress && !joinableRooms.rooms?.length) {
    window?.log?.info('no default joinable rooms yet and not in progress');
    return null;
  }

  const componentToRender = joinableRooms.inProgress ? (
    <BchatSpinner loading={true} />
  ) : (
    joinableRooms.rooms.map(r => {
      return (
        <BchatJoinableRoomRow
          key={r.id}
          completeUrl={r.completeUrl}
          name={r.name}
          roomId={r.id}
          base64Data={r.base64Data}
          onClick={completeUrl => {
            void joinOpenGroupV2WithUIEvents(completeUrl, true, false, onRoomClicked);
          }}
        />
      );
    })
  );

  return (
    <Flex container={true} flexGrow={1} flexDirection="column" width="93%">
      <div  className="module-left-pane-overlay-open-title">
      {window.i18n('orJoinOneOfThese')}
      </div>
      {/* <H3 text={window.i18n('orJoinOneOfThese')} /> */}
      <Flex container={true} flexGrow={1}  justifyContent="center" flexDirection="column">
        {componentToRender}
      </Flex>
    </Flex>
  );
};
