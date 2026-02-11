// import React from 'react';

const StopIcon = (props: { iconSize: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.iconSize}
      height={props.iconSize}
      viewBox="0 0 34 34"
      fill="none"
    >
      <path
        d="M34 17C34 7.61266 26.3873 0 17 0C7.61266 0 0 7.61266 0 17C0 26.3873 7.61266 34 17 34C26.3873 34 34 26.3873 34 17Z"
        fill="#2F8FFF"
      />
      <path
        d="M14.975 23.75H19.025C22.4 23.75 23.75 22.4 23.75 19.025V14.975C23.75 11.6 22.4 10.25 19.025 10.25H14.975C11.6 10.25 10.25 11.6 10.25 14.975V19.025C10.25 22.4 11.6 23.75 14.975 23.75Z"
        fill="#F0F0F0"
      />
    </svg>
  );
};

export default StopIcon;
