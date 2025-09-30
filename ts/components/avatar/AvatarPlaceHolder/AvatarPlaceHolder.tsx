import React, { useEffect, useState } from 'react';
// import { getInitials } from '../../../util/getInitials';

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

export const AvatarPlaceHolder = (props: Props) => {
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
