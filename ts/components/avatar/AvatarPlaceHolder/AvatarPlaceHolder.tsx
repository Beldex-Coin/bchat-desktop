import React, { useEffect, useState } from 'react';
import { getInitials } from '../../../util/getInitials';

type Props = {
  diameter: number;
  name: string;
  pubkey: string;
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
const cachedHashes = new Map<string, number>();

const avatarPlaceholderColors = [
  {
    bgColor: '#4AAC67',
    bodyColor: '#2C7040',
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
  const { pubkey, diameter, name } = props;

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

  const initials = getInitials(name);

  const fontSize = Math.floor(initials.length > 1 ? diameter * 0.4 : diameter * 0.5);

  const bgColorIndex = hash % avatarPlaceholderColors.length;

  const avatarColors = avatarPlaceholderColors[bgColorIndex];
  console.log(avatarColors.bgColor, fontSize);

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
