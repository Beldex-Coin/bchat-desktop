/**
 * @prettier
 */
import React from 'react';

interface Props {
  label: string;
}

export class EmptyState extends React.Component<Props> {
  public render() {
    const { label } = this.props;
    // console.log('label',label);
    

    return <div className="module-empty-state">
      {/* {label==="No media"? */}
      <div>
    <img src={'images/bchat/no_media.svg'}  style={{width:"70%",height:"60%"}}/>
    <p style={{textAlign:'center'}}>{label}</p>
    </div>
    {/* :label } */}
    </div>;
  }
}
