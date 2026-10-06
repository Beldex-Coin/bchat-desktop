import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { getInitials } from '../../../util/getInitials';
import { getTheme } from '../../../state/selectors/theme';
import { getOurPubKeyStrFromCache } from '../../../bchat/utils/User';

type Props = {
  diameter: number;
  name: string;
  pubkey: string;
  isGroup?: boolean;
};

const sha512FromPubkey = async (pubkey: string): Promise<string> => {
  const buf = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(pubkey));

  // tslint:disable: prefer-template restrict-plus-operands
  return Array.prototype.map
    .call(new Uint8Array(buf), (x: any) => ('00' + x.toString(16)).slice(-2))
    .join('');
};

// do not do this on every avatar, just cache the values so we can reuse them accross the app
// key is the pubkey, value is the hash
export const cachedHashes = new Map<string, number>();

export const avatarPlaceholderColors = [
  {
    bgColor: '#9A58CD',
    bodyColor: '#623882',
  },
  {
    bgColor: '#A9D1FD',
    bodyColor: '#3C7ABD',
  },
  {
    bgColor: '#FFE5A6',
    bodyColor: '#BA8555',
  },
  {
    bgColor: '#CE413B',
    bodyColor: '#802A2A',
  },

  // '#FE64A3',
  // '#00B1FF',
  // '#673AB7',
  // '#E91E63',
  // '#9C27B0',
];

const avatarBorderColor = '#00000059';

function useHashBasedOnPubkey(pubkey: string) {
  const [hash, setHash] = useState<number | undefined>(undefined);
  const [loading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const cachedHash = cachedHashes.get(pubkey);

    if (cachedHash) {
      setHash(cachedHash);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    let isInProgress = true;

    if (!pubkey) {
      if (isInProgress) {
        setIsLoading(false);

        setHash(undefined);
      }
      return;
    }
    void sha512FromPubkey(pubkey).then(sha => {
      if (isInProgress) {
        setIsLoading(false);
        // Generate the seed simulate the .hashCode as Java
        if (sha) {
          const hashed = parseInt(sha.substring(0, 12), 16) || 0;
          setHash(hashed);
          cachedHashes.set(pubkey, hashed);

          return;
        }
        setHash(undefined);
      }
    });
    return () => {
      isInProgress = false;
    };
  }, [pubkey]);

  return { loading, hash };
}

/**
 * Dark theme only: initials on a chamfered tile instead of the illustrated placeholder.
 * Our own avatar gets the green variant.
 */
const InitialsAvatar = (props: Props) => {
  const { pubkey, diameter, isGroup, name } = props;
  const isSelf = !!pubkey && pubkey === getOurPubKeyStrFromCache();
  const initials = isGroup && !name ? '' : getInitials(name);

  return (
    <div
      className={classNames('initials-avatar', isSelf && 'initials-avatar--self', isGroup && 'initials-avatar--group')}
      style={{ width: diameter, height: diameter, fontSize: Math.max(10, Math.round(diameter * 0.34)) }}
    >
      <span className="initials-avatar__initials">{initials}</span>
      {isGroup && (
        // Figma "User Account 2" (5296:31137): outline two-person mark, light grey with a dark outline
        <svg className="initials-avatar__group-badge" viewBox="0 0 14.85 11.2" aria-hidden="true">
          <path
            d="M5.155 0C3.843 0 2.811 1.186 2.811 2.598C2.811 4.01 3.843 5.195 5.155 5.195C6.467 5.195 7.499 4.01 7.499 2.598C7.499 1.186 6.467 0 5.155 0ZM5.155 0.625C6.087 0.625 6.874 1.486 6.874 2.598C6.874 3.709 6.087 4.57 5.155 4.57C4.223 4.57 3.436 3.709 3.436 2.598C3.436 1.486 4.223 0.625 5.155 0.625ZM10.624 1.812C9.98 1.812 9.459 2.099 9.128 2.517C8.798 2.935 8.645 3.469 8.645 4C8.645 4.53 8.798 5.064 9.128 5.482C9.459 5.9 9.98 6.187 10.624 6.187C11.734 6.187 12.602 5.185 12.602 4C12.602 2.814 11.734 1.812 10.624 1.812ZM10.624 2.437C11.354 2.437 11.977 3.114 11.977 4C11.977 4.885 11.354 5.562 10.624 5.562C10.156 5.562 9.844 5.381 9.619 5.095C9.394 4.81 9.27 4.407 9.27 4C9.27 3.593 9.394 3.189 9.619 2.904C9.844 2.619 10.156 2.437 10.624 2.437ZM5.155 5.934C2.872 5.934 0.843 7.397 0.121 9.563L0.055 9.761C-0.176 10.454 0.353 11.187 1.083 11.187H9.227C9.957 11.187 10.486 10.454 10.255 9.761L10.189 9.563C9.467 7.397 7.438 5.934 5.155 5.934ZM5.155 6.559C7.171 6.559 8.958 7.847 9.596 9.76L9.662 9.958C9.764 10.264 9.549 10.562 9.227 10.562H1.083C0.761 10.562 0.546 10.264 0.648 9.958L0.714 9.76C1.352 7.848 3.139 6.559 5.155 6.559ZM10.624 6.831C10.367 6.831 10.114 6.854 9.869 6.898C9.757 6.916 9.664 6.993 9.625 7.099C9.586 7.205 9.607 7.324 9.681 7.41C9.754 7.496 9.868 7.535 9.979 7.514C10.189 7.476 10.405 7.456 10.624 7.456C12.225 7.456 13.641 8.478 14.149 9.996L14.202 10.154C14.272 10.364 14.129 10.562 13.908 10.562H11.096C10.983 10.561 10.878 10.62 10.821 10.717C10.764 10.814 10.764 10.935 10.821 11.032C10.878 11.13 10.983 11.189 11.096 11.187H13.908C14.537 11.187 14.994 10.554 14.795 9.957L14.742 9.798C14.15 8.028 12.491 6.831 10.624 6.831Z"
            fill="currentColor"
          />
        </svg>
      )}
    </div>
  );
};

export const AvatarPlaceHolder = (props: Props) => {
  const isDark = useSelector(getTheme) === 'dark';
  if (isDark) {
    return <InitialsAvatar {...props} />;
  }
  return <ClassicAvatarPlaceHolder {...props} />;
};

const ClassicAvatarPlaceHolder = (props: Props) => {
  const {
    pubkey,
    diameter,
    isGroup,
        //  name
  } = props;

  const { hash, loading } = useHashBasedOnPubkey(pubkey);

  // const diameterWithoutBorder = diameter - 2;
  const viewBox = `0 0 ${diameter} ${diameter}`;
  // const r = diameter / 2;
  // const rWithoutBorder = diameterWithoutBorder / 2;

  if (loading || !hash) {
    return (
      <svg viewBox={viewBox}>
        <g id="UrTavla">
          <rect
            rx={10}
            ry={10}
            // r={rWithoutBorder}
            fill="#d2d2d3"
            width={diameter}
            height={diameter}
            // style={{width:'90%',height:'90%'}}
            stroke={avatarBorderColor}
            strokeWidth="1"
          />
        </g>
      </svg>
    );
  }

  // const initials = getInitials(name);

  // const fontSize = Math.floor(initials.length > 1 ? diameter * 0.4 : diameter * 0.5);

  const bgColorIndex = hash % avatarPlaceholderColors.length;

  const avatarColors = avatarPlaceholderColors[bgColorIndex];
  if (isGroup) {
    return (
      <div 
        style={{
          width: { diameter } + 'px',
          height: { diameter } + 'px',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="60" height="60" rx="16" fill={avatarColors.bgColor} />
          <path
            d="M30.3627 32.9066C31.7068 32.9066 32.7996 34.0007 32.7996 35.3448V36.2762C32.7993 40.6943 27.7203 42.7073 23.0001 42.7075C20.5203 42.7075 18.1942 42.1779 16.4502 41.2145C14.3543 40.0586 13.1994 38.305 13.1992 36.2762V35.3448C13.1992 34.0008 14.2922 32.9068 15.6362 32.9066H30.3627ZM44.3623 32.9066C45.7059 32.9069 46.7988 33.9999 46.7992 35.3436V36.2762C46.7989 40.6944 41.7187 42.7075 36.9984 42.7075C35.2642 42.7074 33.6058 42.4469 32.1686 41.9616C33.7611 40.6279 34.902 38.7448 34.9022 36.2762V35.3436C34.902 34.4469 34.6403 33.6108 34.1904 32.9066H44.3623ZM23.5377 19.0547C26.3924 19.0547 28.7069 21.3704 28.7069 24.2252C28.7066 27.0796 26.3922 29.3944 23.5377 29.3944C20.6831 29.3944 18.3688 27.0796 18.3684 24.2252C18.3684 21.3704 20.6829 19.0547 23.5377 19.0547ZM37.7531 19.0547C40.6078 19.0547 42.9223 21.3704 42.9223 24.2252C42.922 27.0796 40.6076 29.3944 37.7531 29.3944C34.8985 29.3944 32.5842 27.0796 32.5838 24.2252C32.5838 21.3704 34.8983 19.0547 37.7531 19.0547Z"
            fill={avatarColors.bodyColor}
          />
        </svg>
      </div>
    );
  }
  return (
    <div
      style={{
        width: { diameter } + 'px',
        height: { diameter } + 'px',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="60" height="60" rx="0" fill={avatarColors.bgColor} />
        <path
          d="M40.5182 33.5H19.4818C17.5616 33.5 16 35.0616 16 36.9818V38.3125C16 41.2109 17.6497 43.7159 20.6439 45.3672C23.1352 46.7435 26.4575 47.5 30 47.5C36.7433 47.5 44 44.6244 44 38.3125V36.9818C44 35.0616 42.4384 33.5 40.5182 33.5Z"
          fill={avatarColors.bodyColor}
        />
        <path
          d="M21.25 21.75C21.25 16.9178 25.1678 13 30 13C34.8322 13 38.75 16.9178 38.75 21.75C38.75 26.5823 34.8322 30.5 30 30.5C25.1678 30.5 21.25 26.5823 21.25 21.75Z"
          fill="url(#paint0_radial_228_1958)"
        />
        <defs>
          <radialGradient
            id="paint0_radial_228_1958"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(30 21.75) rotate(90) scale(8.75 8.75)"
          >
            <stop stopColor="#FFBF91" />
            <stop offset="0.625" stopColor="#FFB077" />
            <stop offset="1" stopColor="#DD9561" />
          </radialGradient>
        </defs>
      </svg>
    </div>
    // <svg viewBox={viewBox}>
    //   <g id="UrTavla">
    //     <rect
    //       rx={0}
    //       ry={0}
    //       width={diameter}
    //       height={diameter}
    //       // r={rWithoutBorder}
    //       fill={bgColor}
    //       stroke={avatarBorderColor}
    //       strokeWidth="0"
    //     />
    //     <text
    //       fontSize={fontSize}
    //       y="50%"
    //       fill="white"
    //       textAnchor="middle"
    //       stroke="white"
    //       strokeWidth={1}
    //       alignmentBaseline="central"
    //       height={fontSize}
    //     >
    //       {initials}
    //     </text>
    //   </g>
    // </svg>
  );
};
