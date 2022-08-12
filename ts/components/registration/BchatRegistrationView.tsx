import React from 'react';
// import { AccentText } from './AccentText';

import { RegistrationStages } from './RegistrationStages';
// import { BchatIcon } from '../icon';
import { BchatToastContainer } from '../BchatToastContainer';
import { BchatTheme } from '../../state/ducks/BchatTheme';
import { Flex } from '../basic/Flex';
import { setSignInByLinking } from '../../util/storage';

export const BchatRegistrationView = () => {
  React.useEffect(() => { 
    void setSignInByLinking(false);
  }, []);
  console.log('window.Events.getThemeSetting()',window.Events.getThemeSetting());
  
  return (
    <div className="bchat-fullscreen">
      <div className="bchat-full-screen-flow bchat-fullscreen">
        <BchatTheme>
          <div style={{background:`url(images/bchat/${window.Events.getThemeSetting()==="light"?"doodle_dark":"doodle_white"}.svg)`,width:"100%",height:"100%"}}>
          <Flex
            flexDirection="row"
            container={true}
            height="100%"
            width='100%'
          >
            <Flex 
            className="bchat-content-left"
            alignItems="center"
            flexDirection="row"
            container={true}
            height="100%"
            width='40%'
            justifyContent="center"
            >
              <div className="bchat-content-logo" 
              style={{backgroundImage:"url(images/bchat/BChat_black_logo.gif)",width:400,height:370}} />
           </Flex>
          
           <Flex
            className="bchat-content"
            alignItems="center"
            flexDirection="column"
            container={true}
            height="100%"
            width='60%'
          >
            <Flex container={true} margin="auto" alignItems="center" flexDirection="column">
              <BchatToastContainer />
              {/* <BchatIcon iconSize={150} iconType="brand" /> */}

              {/* <AccentText /> */}
              <RegistrationStages />
            </Flex>
          </Flex>
          </Flex>
          </div>
        </BchatTheme>
      </div>
    </div>
  );
};
