import classNames from 'classnames';

// The countdown stopwatch (Figma "Timer 1", 1:7848) as two parts so its hand can turn on its own:
// the dial with the crown stays still and, while `spinning`, the hand sweeps round the centre
// (see .countdown-icon in stylesheets/_theme_rules.scss).
const CountdownIcon = (props: { iconSize: number; color: string; spinning?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.iconSize}
    height={props.iconSize}
    viewBox="0 0 17 17"
    fill="none"
    className={classNames('countdown-icon', props.spinning && 'countdown-icon--spinning')}
    aria-hidden="true"
  >
    <path
      d="M8.24951 0.750488C7.83548 0.750488 7.49956 1.0864 7.49956 1.50044V2.25039C7.49565 2.65271 7.81009 2.98667 8.2124 3.00685C8.61407 3.02703 8.9604 2.72562 8.99686 2.32526C11.9596 2.69502 14.2491 5.18379 14.2491 8.25C14.2491 11.572 11.5716 14.2496 8.24951 14.2496C4.92746 14.2496 2.2499 11.572 2.2499 8.25C2.2499 6.63227 2.88593 5.17273 3.92297 4.09402C4.10916 3.90067 4.17881 3.6227 4.1046 3.36425C4.02973 3.10645 3.82337 2.9079 3.56232 2.8441C3.30127 2.77965 3.02654 2.86038 2.84101 3.05437C1.54682 4.40129 0.75 6.23776 0.75 8.25C0.75 12.3832 4.11632 15.7495 8.24951 15.7495C12.3827 15.7495 15.749 12.3832 15.749 8.25C15.749 4.11681 12.3827 0.750488 8.24951 0.750488Z"
      fill={props.color}
    />
    <path
      className="countdown-icon__hand"
      d="M5.24189 4.49308C4.93658 4.49308 4.66251 4.67862 4.54728 4.96115C4.4327 5.24369 4.50106 5.56788 4.71979 5.78011L7.12719 8.18881C7.11091 8.49673 7.22093 8.79879 7.43316 9.02274C7.64538 9.24733 7.94094 9.37428 8.24951 9.37493C8.87056 9.37493 9.37444 8.87105 9.37444 8.25C9.37444 7.62895 8.87056 7.12507 8.24951 7.12507C8.22868 7.12572 8.2085 7.12637 8.18832 7.12768L5.77962 4.72028C5.63835 4.57446 5.44436 4.49243 5.24189 4.49308Z"
      fill={props.color}
    />
  </svg>
);

export default CountdownIcon;
