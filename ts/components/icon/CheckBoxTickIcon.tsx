import React from 'react';

const CheckBoxTickIcon = (props: { iconSize: number }) => (
  <svg
    width={props.iconSize}
    height={props.iconSize}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.4 25H16.6C22.6 25 25 22.6 25 16.6V9.4C25 3.4 22.6 1 16.6 1H9.4C3.4 1 1 3.4 1 9.4V16.6C1 22.6 3.4 25 9.4 25Z"
      fill="#108D32"
    />
    <path
      d="M8.39648 12.9999L11.4623 16.0657L17.6048 9.93408"
      stroke="#F0F0F0"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CheckBoxTickIcon;
