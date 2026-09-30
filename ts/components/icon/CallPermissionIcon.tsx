// "Call male" from the Turn on Voice/Video Call popup (Figma 90:1241): grey person + green
// handset. Two colours, so it is drawn here rather than in Icons.tsx.
const CallPermissionIcon = (props: { iconSize?: number }) => {
  const size = props.iconSize ?? 30;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 22.5 22.5"
      fill="none"
      style={{ maxWidth: 'none', maxHeight: 'none' }}
    >
      <path
        d="M11.25 1.875C9.18457 1.875 7.5 3.55957 7.5 5.625V6.5625C7.5 8.62793 9.18457 10.3125 11.25 10.3125C13.3154 10.3125 15 8.62793 15 6.5625V5.625C15 3.55957 13.3154 1.875 11.25 1.875ZM11.25 2.8125C12.8076 2.8125 14.0625 4.06738 14.0625 5.625V6.5625C14.0625 8.12012 12.8076 9.375 11.25 9.375C9.69238 9.375 8.4375 8.12012 8.4375 6.5625V5.625C8.4375 4.06738 9.69238 2.8125 11.25 2.8125ZM9.22363 12.1875L2.8125 16.7773V19.6875H11.25V18.75H3.75V17.2559L9.52637 13.125H13.0273L14.9951 13.9893L15.3711 13.1299L13.2227 12.1875H9.22363Z"
        fill="#EBEBEB"
      />
      <path
        d="M15.7227 15.7227C18.3154 13.125 21.2549 13.1153 21.3818 13.125H21.5381L22.5 15.8008L19.7607 17.0117L18.6182 15.8692C18.2959 16.0742 17.5391 16.5821 17.0557 17.0606C16.5771 17.5391 16.0742 18.2959 15.8691 18.6182L17.0117 19.7608L15.8008 22.5L13.125 21.5381V21.3819C13.125 21.2598 13.125 18.3155 15.7227 15.7227Z"
        fill="#00BC33"
      />
    </svg>
  );
};

export default CallPermissionIcon;
