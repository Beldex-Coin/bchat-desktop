import classNames from 'classnames';
import { BchatButton, BchatButtonColor, BchatButtonType } from '../basic/BchatButton';
import { BchatSpinner } from '../basic/BchatSpinner';
import { BchatIcon, BchatIconType } from '../icon';

// Dark-theme confirm card (Figma 71:15512 "clear_data", 1:38280 clear-data choice, 1:28188 "Clear all data",
// 1:29337 "Delete entire account"): icon well + title + mono message, then an outlined button
// and a red one side by side. Hidden outside dark mode by the stylesheet (.confirm-card).
type Props = {
  icon: BchatIconType;
  iconColor?: string;
  /** px; the Figma wells hold icons of different sizes (warning 28, eraser 31-33) */
  iconSize?: number;
  evenOdd?: boolean;
  title: string;
  message: string;
  secondaryText: string;
  onSecondary: () => void;
  dangerText: string;
  onDanger: () => void;
  loading?: boolean;
  className?: string;
};

export const ConfirmCard = (props: Props) => {
  const { icon, iconColor = '#EBEBEB', iconSize = 28, evenOdd, loading } = props;
  return (
    <div className={classNames('confirm-card', props.className)} role="dialog">
      <div className="confirm-card__row">
        <span className="confirm-card__icon" aria-hidden="true">
          <BchatIcon
            iconType={icon}
            iconSize={iconSize}
            iconColor={iconColor}
            fillRule={evenOdd ? 'evenodd' : undefined}
            clipRule={evenOdd ? 'evenodd' : undefined}
          />
        </span>
        <div className="confirm-card__text">
          <p className="confirm-card__title">{props.title}</p>
          <p className="confirm-card__message">{props.message}</p>
        </div>
      </div>
      <div className="confirm-card__actions">
        <BchatButton
          text={props.secondaryText}
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Secondary}
          onClick={props.onSecondary}
          disabled={loading}
        />
        <BchatButton
          text={props.dangerText}
          buttonType={BchatButtonType.Brand}
          buttonColor={BchatButtonColor.Danger}
          onClick={props.onDanger}
          disabled={loading}
        />
      </div>
      {loading && (
        <div className="confirm-card__loading">
          <BchatSpinner loading={true} />
        </div>
      )}
    </div>
  );
};
