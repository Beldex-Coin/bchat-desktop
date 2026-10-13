// import React from 'react';
import { LottieAnimation } from './LottieAnimation';

type Props = {
  loading: boolean;
};

export const BchatSpinner = (props: Props) => {
  const { loading } = props;
  return loading ? (
    <div className="bchat-loader" data-testid="loading-spinner">
      <div>
        {/* the BChat bubbles loading animation (images/animations/Loading_animation.json) */}
        <LottieAnimation name="Loading_animation" style={{ width: '150px', height: '150px' }} />
      </div>
    </div>
  ) : null;
};
