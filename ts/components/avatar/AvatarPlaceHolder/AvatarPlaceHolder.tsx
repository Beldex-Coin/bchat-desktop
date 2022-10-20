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

const avatarPlaceholderColors = ['#FF5722', '#2979FB', '#FF6663', '#009688',"#FE64A3",'#00B1FF','#673AB7','#E91E63','#9C27B0'];
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

  const diameterWithoutBorder = diameter - 2;
  const viewBox = `0 0 ${diameter} ${diameter}`;
  // const r = diameter / 2;
  const rWithoutBorder = diameterWithoutBorder / 2;

  if (loading || !hash) {
    // return grey circle
    return (
      <svg viewBox={viewBox}>
        <g id="UrTavla">
        <rect
          rx={10}
          ry={10}
          r={rWithoutBorder}
          fill="#d2d2d3"
          style={{width:'90%',height:'90%'}}
          stroke={avatarBorderColor}
          strokeWidth="1"
        />
          {/* <circle
            cx={r}
            cy={r}
            r={rWithoutBorder}
            fill="#d2d2d3"
            shapeRendering="geometricPrecision"
            stroke={avatarBorderColor}
            strokeWidth="1"
          /> */}
        </g>
      </svg>
    );
  }

  const initials = getInitials(name);

  const fontSize = Math.floor(initials.length > 1 ? diameter * 0.4 : diameter * 0.5);

  const bgColorIndex = hash % avatarPlaceholderColors.length;

  const bgColor = avatarPlaceholderColors[bgColorIndex];
// console.log(bgColor);

  return (
    <svg viewBox={viewBox}>
      <g id="UrTavla">
        {/* <circle
          cx={r}
          cy={r}
          r={rWithoutBorder}
          fill={bgColor}
          shapeRendering="geometricPrecision"
          stroke={avatarBorderColor}
          strokeWidth="1"
        /> */}
        <rect
          rx={10}
          ry={10}
          r={rWithoutBorder}
          fill={bgColor}
          style={{width:'90%',height:"90%"}}
          stroke={avatarBorderColor}
          strokeWidth="1"
        />
        {/* <rect x="50" y="20" rx="20" ry="20" width="150" height="150" style={{fill:'red',stroke:'black',strokeWidth:5,opacity:0.5}} /> */}
        {/* <rect x="120" width="100" height="100" rx="15"  fill='#fff' /> */}
        <text
          fontSize={fontSize}
          x="45%"
          y="45%"
          fill="white"
          textAnchor="middle"
          stroke="white"
          strokeWidth={1}
          alignmentBaseline="central"
          height={fontSize}
        >
          {initials}
        </text>
      </g>
    </svg>
  );
};
