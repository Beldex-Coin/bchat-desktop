import React from 'react';

type Props = {
  loading: boolean;
};

export const BchatSpinner = (props: Props) => {
  const { loading } = props;

  return loading ? (
    <div className="bchat-loader" data-testid="loading-spinner">
      <img src={'images/bchat/Load_animation.gif'}  style={{width:20,height:40}}/>
      {/* <div />
      <div />
      <div />
      <div /> */}
    </div>
  
  ) : null;
};
