import React from 'react';

import { AttachmentType, getExtensionForDisplay } from '../../types/Attachment';
import { BchatIcon } from '../icon';

interface Props {
  attachment: AttachmentType;
  onClose: (attachment: AttachmentType) => void;
}

export class StagedGenericAttachment extends React.Component<Props> {
  public render() {
    const { attachment, onClose } = this.props;
    const { fileName, contentType } = attachment;
    const extension = getExtensionForDisplay({ contentType, fileName });

    return (
      <div className="module-staged-generic-attachment">
        <div
          className="module-image__close-button"
          role="button"
          onClick={() => {
            if (onClose) {
              onClose(attachment);
            }
          }}
        >
          <BchatIcon iconType={'xWithCircle'} iconSize={16} iconColor="#fff" />
        </div>
        <div className="module-staged-generic-attachment__icon">
          {extension ? (
            <div className="module-staged-generic-attachment__icon__extension">{extension}</div>
          ) : null}
        </div>
        <div className="module-staged-generic-attachment__filename">{fileName}</div>
      </div>
    );
  }
}
