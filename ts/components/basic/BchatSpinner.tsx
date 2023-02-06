import React from 'react';

type Props = {
  loading: boolean;
};

export const BchatSpinner = (props: Props) => {
  const { loading } = props;

  return loading ? (
    <div className="bchat-loader" data-testid="loading-spinner">
      <div>
      <img src={'images/bchat/Load_animation.gif'}  style={{width:'150px',height:'150px',display:'flex',}}/>
      </div>
    </div>
  
  ) : null;
};
