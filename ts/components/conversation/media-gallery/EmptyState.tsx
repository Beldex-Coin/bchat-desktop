/**
 * @prettier
 */
import React from 'react';
import { LottieAnimation } from '../../basic/LottieAnimation';
import { isNewDesign } from '../../../theme/newDesign';

interface Props {
  label: string;
  // dark: which empty animation to play (images/animations/No_Media.json / No_document.json)
  type?: 'media' | 'documents';
}

export class EmptyState extends React.Component<Props> {
  public render() {
    const { label } = this.props;
    return <div className="module-empty-state">
      <div className='parent'>
        {isNewDesign() ? (
          <LottieAnimation
            name={this.props.type === 'documents' ? 'No_document' : 'No_Media'}
            className="noMediaImg noMediaImg--animated"
          />
        ) : (
          <div className='noMediaImg'>
          </div>
        )}
        <p style={{ textAlign: 'center' }}>{label}</p>
      </div>
    </div>;
  }
}
