import React from 'react';

import { RegistrationStages } from './RegistrationStages';
import { BchatToastContainer } from '../BchatToastContainer';
import { BchatTheme } from '../../state/ducks/BchatTheme';
import { Flex } from '../basic/Flex';
import { setSignInByLinking } from '../../util/storage';

export const BchatRegistrationView = () => {
  React.useEffect(() => { 
    void setSignInByLinking(false);
  }, []);
  
  return (
    <div className="bchat-fullscreen">
      <div className="bchat-full-screen-flow bchat-fullscreen">
        <BchatTheme>
          <div className='bchat_conversation-doodle'>
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
            justifyContent="flex-end"
            >
            <img src='images/bchat/loginpage.png' width={"86%"} height={"80%"}></img>
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
