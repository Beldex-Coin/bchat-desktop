import React from 'react';
// import { BchatIcon } from '../icon';

interface Props {
  onClick: () => void;
  darkMode: boolean;
}

export class StagedPlaceholderAttachment extends React.Component<Props> {
  public render() {
    const { onClick, darkMode } = this.props;

    return (
      <div className="module-staged-placeholder-attachment" role="button" onClick={onClick}>
        {/* <div className="module-staged-placeholder-attachment__plus-icon"> */}
        {/* <BchatIcon iconType="addCirclePlus" iconSize={30}  iconColor='#ACACAC'/> */}
        {/* </div> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <path
            d="M14.998 27.4999C17.4703 27.4999 19.8871 26.7668 21.9427 25.3932C23.9983 24.0197 25.6004 22.0675 26.5465 19.7834C27.4926 17.4993 27.7402 14.986 27.2579 12.5613C26.7755 10.1365 25.585 7.9092 23.8369 6.16105C22.0887 4.41289 19.8614 3.22238 17.4367 2.74007C15.0119 2.25775 12.4986 2.50529 10.2145 3.45139C7.93043 4.39748 5.97819 5.99964 4.60468 8.05525C3.23116 10.1109 2.49805 12.5276 2.49805 14.9999C2.50761 18.3121 3.82764 21.486 6.16978 23.8282C8.51191 26.1703 11.6858 27.4903 14.998 27.4999Z"
            fill={darkMode ? '#F0F0F0' : '#F8F8F8'}
            stroke={darkMode ? '#F0F0F0' : '#F8F8F8'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.9993 9.24988C15.4135 9.24988 15.7493 9.58566 15.7493 9.99988V14.25H19.998C20.4123 14.25 20.748 14.5857 20.748 15C20.748 15.4142 20.4123 15.75 19.998 15.75H15.7493V19.9999C15.7493 20.4141 15.4135 20.7499 14.9993 20.7499C14.5851 20.7499 14.2493 20.4141 14.2493 19.9999V15.75H9.99805C9.58383 15.75 9.24805 15.4142 9.24805 15C9.24805 14.5857 9.58383 14.25 9.99805 14.25H14.2493V9.99988C14.2493 9.58566 14.5851 9.24988 14.9993 9.24988Z"
            fill={darkMode ? '#131313' : '#ACACAC'}
          />
        </svg>
      </div>
    );
  }
}
