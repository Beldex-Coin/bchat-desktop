import { useCallback, useEffect } from 'react';
import classNames from 'classnames';

import { AttachmentType } from '../../types/Attachment';
import { isImageTypeSupported, isVideoTypeSupported } from '../../util/GoogleChrome';

// Dark theme: big preview of an image / video that is staged in the composer (Figma 1:49963
// "image view"). The media sits in a glass card in the middle of the conversation, with a close
// square above its top-right corner and previous / next squares on the sides when more than one
// visual attachment is staged. No download button: the file is the user's own, not received.

type Props = {
  attachments: Array<AttachmentType>;
  index: number;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
};

// the Figma squares have their top-right corner cut (Rectangle 913)
const FRAME_PATH = 'M31.8 1.25L37.7 6.6V37.75H1.25V1.25H31.8Z';
const ARROW_LEFT =
  'M11.4113 18.4964L17.0829 12.8248C17.3548 12.5529 17.7173 12.4094 18.0798 12.4094C18.4423 12.4094 18.8048 12.5529 19.0842 12.8248C19.6355 13.3836 19.6355 14.2748 19.0842 14.8336L15.8368 18.081H26.591C27.3689 18.081 28.0033 18.7154 28.0033 19.5008C28.0033 20.2862 27.3689 20.9206 26.591 20.9206H15.8368L19.0842 24.168C19.6355 24.7269 19.6355 25.618 19.0842 26.1769C18.5329 26.7282 17.6342 26.7282 17.0829 26.1769L11.4113 20.5053C10.8525 19.9464 10.8525 19.0553 11.4113 18.4964Z';
const ARROW_RIGHT =
  'M27.5848 20.5034L21.9132 26.175C21.6413 26.4468 21.2788 26.5903 20.9163 26.5903C20.5538 26.5903 20.1913 26.4468 19.9118 26.175C19.3605 25.6161 19.3605 24.725 19.9118 24.1661L23.1592 20.9187L12.4051 20.9187C11.6272 20.9187 10.9928 20.2843 10.9928 19.4989C10.9928 18.7135 11.6272 18.0791 12.4051 18.0791L23.1592 18.0791L19.9118 14.8317C19.3605 14.2729 19.3605 13.3817 19.9118 12.8229C20.4632 12.2716 21.3618 12.2716 21.9132 12.8229L27.5848 18.4945C28.1436 19.0534 28.1436 19.9445 27.5848 20.5034Z';
// close X, drawn in the same 39-unit box as the arrows
const CLOSE_X =
  'M13.6 13.6C14.1 13.1 14.9 13.1 15.4 13.6L19.5 17.7L23.6 13.6C24.1 13.1 24.9 13.1 25.4 13.6C25.9 14.1 25.9 14.9 25.4 15.4L21.3 19.5L25.4 23.6C25.9 24.1 25.9 24.9 25.4 25.4C24.9 25.9 24.1 25.9 23.6 25.4L19.5 21.3L15.4 25.4C14.9 25.9 14.1 25.9 13.6 25.4C13.1 24.9 13.1 24.1 13.6 23.6L17.7 19.5L13.6 15.4C13.1 14.9 13.1 14.1 13.6 13.6Z';

const SquareButton = (props: {
  className: string;
  glyph: string;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    className={classNames('staged-preview__square', props.className)}
    aria-label={props.label}
    title={props.label}
    disabled={props.disabled}
    onClick={e => {
      e.stopPropagation();
      props.onClick();
    }}
  >
    <svg viewBox="0 0 39 39" aria-hidden="true">
      <path className="staged-preview__square-frame" d={FRAME_PATH} />
      <path className="staged-preview__square-glyph" d={props.glyph} />
    </svg>
  </button>
);

export const StagedAttachmentPreview = (props: Props) => {
  const { attachments, index, onChangeIndex, onClose } = props;
  const count = attachments.length;
  const attachment = attachments[index];
  const hasPrevious = index > 0;
  const hasNext = index < count - 1;

  const showPrevious = useCallback(() => {
    if (hasPrevious) {
      onChangeIndex(index - 1);
    }
  }, [hasPrevious, index, onChangeIndex]);
  const showNext = useCallback(() => {
    if (hasNext) {
      onChangeIndex(index + 1);
    }
  }, [hasNext, index, onChangeIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      } else if (event.key === 'ArrowLeft') {
        showPrevious();
      } else if (event.key === 'ArrowRight') {
        showNext();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [onClose, showPrevious, showNext]);

  if (!attachment) {
    return null;
  }

  const { contentType } = attachment;
  const url = attachment.videoUrl || attachment.url;
  let media: JSX.Element | null = null;
  if (isImageTypeSupported(contentType)) {
    media = (
      <img
        className="staged-preview__media"
        alt={window.i18n('imageAttachmentAlt')}
        src={url}
      />
    );
  } else if (isVideoTypeSupported(contentType)) {
    media = (
      <video className="staged-preview__media" controls={true} key={url}>
        <source src={url} />
      </video>
    );
  }

  return (
    <div className="staged-preview" role="dialog" aria-modal="true" onClick={onClose}>
      {count > 1 && (
        <SquareButton
          className="staged-preview__nav staged-preview__nav--previous"
          glyph={ARROW_LEFT}
          label={window.i18n('previous')}
          disabled={!hasPrevious}
          onClick={showPrevious}
        />
      )}
      <div className="staged-preview__stage" onClick={e => e.stopPropagation()}>
        <SquareButton
          className="staged-preview__close"
          glyph={CLOSE_X}
          label={window.i18n('close')}
          onClick={onClose}
        />
        <div className="staged-preview__card">{media}</div>
      </div>
      {count > 1 && (
        <SquareButton
          className="staged-preview__nav staged-preview__nav--next"
          glyph={ARROW_RIGHT}
          label={window.i18n('next')}
          disabled={!hasNext}
          onClick={showNext}
        />
      )}
    </div>
  );
};
