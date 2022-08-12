import React from 'react';
import { useDispatch ,useSelector} from 'react-redux';
import { setOverlayMode } from '../../../state/ducks/section';
// import { SpacerMD } from '../../basic/Text';
import { BchatIconButton } from '../../icon';
// for bchat
import { Avatar, AvatarSize } from './../../avatar/Avatar';
import { getOurNumber } from '../../../state/selectors/user';
import { editProfileModal,} from '../../../state/ducks/modalDialog';
import styled from 'styled-components';




export const OverlayHeader = ({ subtitle, title,hideExit }: { title: string; subtitle: string;hideExit:any}) => {
  const dispatch = useDispatch();
  const ourNumber = useSelector(getOurNumber);

   const Header = styled.div`
   width: 100%;
   display: flex;
   flex-direction: row;
   padding: 10px 0 0 0;
   align-items: baseline;
   font-family:$bchat-font-poppin-semibold;
   padding:10px 10px;
  `

  return (
    <>
    <Header >

    
     {hideExit ?"":
     <div className="exit">
     <BchatIconButton
       iconSize="small"
       iconType="chevron"
       iconRotation={90}
       onClick={() => {
         dispatch(setOverlayMode(undefined));
       }}
     />
   </div>
}
      
      {/* <SpacerMD /> */}
     
      <Avatar
        size={AvatarSize.M}
        onAvatarClick={()=>dispatch(editProfileModal({}))}
        pubkey={ourNumber}
        dataTestId="leftpane-primary-avatar"
      />
    

      <h2 style={{marginLeft:"10px"}}>{title}</h2>
      </Header>
      <h3>
        {subtitle}
        <hr className="green-border" />
      </h3>
      <hr className="white-border" />
    </>
  );
};
