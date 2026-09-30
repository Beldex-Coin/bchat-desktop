// "News 1" from the Recovery Phrase card (Figma 194:2222): grey page + green text lines.
// Two colours, so it is drawn here rather than in Icons.tsx.
const RecoveryPhraseIcon = (props: { iconSize?: number }) => {
  const size = props.iconSize ?? 77;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 58 58" fill="none">
      <path
        d="M7.25 4.83301V50.7497H53.1667V16.9163H50.75V48.333H45.9167V4.83301H7.25ZM9.66667 7.24967H43.5V48.333H9.66667V7.24967Z"
        fill="#ACACAC"
      />
      <path d="M14.5 19.3327V16.916H38.6667V19.3327H14.5Z" fill="#00BC33" />
      <path d="M14.5 28.9993V26.5827H24.1667V28.9993H14.5Z" fill="#00BC33" />
      <path d="M29 28.9993V26.5827H38.6667V28.9993H29Z" fill="#00BC33" />
      <path d="M14.5 38.666V36.2493H24.1667V38.666H14.5Z" fill="#00BC33" />
      <path d="M29 38.666V36.2493H38.6667V38.666H29Z" fill="#00BC33" />
    </svg>
  );
};

export default RecoveryPhraseIcon;
