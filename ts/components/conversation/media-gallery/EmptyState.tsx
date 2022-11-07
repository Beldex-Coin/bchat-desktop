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

    return <div className="module-empty-state">
      {/* {label==="No media have been sent in this chat"? */}
      <div>
    {/* <img src={'images/bchat/no_media.svg'}  style={{width:"70%",height:"60%"}}/> */}
    <div className='noMediaImg'>

    </div>
    <p style={{textAlign:'center'}}>{label}</p>
    </div>
    {/* :label } */}
    </div>;
  }
}
