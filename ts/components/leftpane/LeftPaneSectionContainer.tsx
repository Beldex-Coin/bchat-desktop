import styled from 'styled-components';

export const LeftPaneSectionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction:row;
  align-items: center;
  border-right: var(--border-bchat);
  overflow-y: hidden;
  background-color:#128B17;
  padding:6px 0; 

  .icon-box .bchat-icon-button
  {
    padding: 10px;
    margin: 3px 24px;
    border-radius: 20px;
  }
  .icon-box svg:hover
  {
    color:#159B24;
  }
  .isSelected-icon-box {
    padding: 10px;
    margin: 3px 24px;
    border-radius: 34px;
    background-color: white;
    
  }
  .icon-box .bchat-icon-button:hover 
  {
    background-color: white;
    color:#159B24;
    border-radius: 34px;

  }

  .module-avatar {
    height: 80px;
    display: flex;
    align-items: center;
  }

  // this is not ideal but it seems that nth-0last-child does not work
  #onion-path-indicator-led-id {
    margin: auto auto 0px auto;
    opacity: 1;
  }
`;
