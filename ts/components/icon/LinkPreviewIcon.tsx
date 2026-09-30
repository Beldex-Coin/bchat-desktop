// "Link 4" from the Enable Link Previews popup (Figma 192:1896): grey chain halves + green bar.
// Two colours, so it is drawn here rather than in Icons.tsx.
const LinkPreviewIcon = (props: { iconSize?: number }) => {
  const size = props.iconSize ?? 32;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ maxWidth: 'none', maxHeight: 'none' }}
    >
      <path
        d="M16.5521 2.00488C15.1562 2.00488 13.7604 2.53093 12.6979 3.59342L10 6.29134L10.7083 6.99967L13.4063 4.30176C15.1458 2.56217 17.9531 2.56217 19.6979 4.30176C21.4375 6.04655 21.4375 8.85384 19.6979 10.5934L17 13.2913L17.7083 13.9997L20.4062 11.3018C22.526 9.17676 22.526 5.71842 20.4062 3.59342C19.3437 2.53093 17.9479 2.00488 16.5521 2.00488ZM6.29167 9.99967L3.59375 12.6976C1.47396 14.8226 1.47396 18.2809 3.59375 20.4059C5.71875 22.5257 9.17708 22.5257 11.3021 20.4059L14 17.708L13.2917 16.9997L10.5937 19.6976C8.85417 21.4372 6.04687 21.4372 4.30208 19.6976C2.5625 17.9528 2.5625 15.1455 4.30208 13.4059L7 10.708L6.29167 9.99967Z"
        fill="#EBEBEB"
      />
      <path
        d="M8.00586 15.2861L15.2871 8.00488L15.9954 8.71322L8.71419 15.9945L8.00586 15.2861Z"
        fill="#00BC33"
      />
    </svg>
  );
};

export default LinkPreviewIcon;
