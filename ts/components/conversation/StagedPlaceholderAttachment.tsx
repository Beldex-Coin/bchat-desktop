import React from 'react';
import { BchatIcon } from '../icon';

interface Props {
  onClick: () => void;
}

export class StagedPlaceholderAttachment extends React.Component<Props> {
  public render() {
    const { onClick } = this.props;

    return (
      <div className="module-staged-placeholder-attachment" role="button" onClick={onClick}>
        {/* <div className="module-staged-placeholder-attachment__plus-icon"> */}
          <BchatIcon iconType="addCirclePlus" iconSize={30}  iconColor='#ACACAC'/>
        {/* </div> */}
      </div>
    );
  }
}
