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

  const bgColor = avatarPlaceholderColors[bgColorIndex];
// console.log(bgColor);

  return (
    <svg viewBox={viewBox}>
      <g id="UrTavla">
        <rect
          rx={0}
          ry={0}
          width={diameter}
          height={diameter}
          // r={rWithoutBorder}
          fill={bgColor}
          stroke={avatarBorderColor}
          strokeWidth="0"
        />
        <text
          fontSize={fontSize}
          x="50%"
          y="50%"
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
