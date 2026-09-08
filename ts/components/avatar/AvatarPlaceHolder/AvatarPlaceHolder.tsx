import  { useEffect, useState } from 'react';
import { getInitials } from '../../../util/getInitials';

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

// NOIR identity plates — dark panels with a hairline border and a display-face
// initial. Only the letter color varies by identity; the ground stays black.
export const avatarPlaceholderColors = [
  {
    bgColor: '#181818',
    gradColor: '#0E0E0E',
    letterColor: '#F4F4F4',
    borderColor: '#2A2A2A',
  },
  {
    bgColor: '#122413',
    gradColor: '#0A0A0A',
    letterColor: '#1BB51E',
    borderColor: '#1F3A20',
  },
  {
    bgColor: '#202020',
    gradColor: '#101010',
    letterColor: '#B8B8B8',
    borderColor: '#2A2A2A',
  },
  {
    bgColor: '#161D16',
    gradColor: '#0C0C0C',
    letterColor: '#8FD891',
    borderColor: '#243024',
  },
];

const avatarBorderColor = '#2A2A2A';

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

// 60x60 plate with the signature chamfer cut from the top-right corner.
const CHAMFER = 12;
const platePath = `M0 0 H${60 - CHAMFER} L60 ${CHAMFER} V60 H0 Z`;

export const AvatarPlaceHolder = (props: Props) => {
  const { pubkey, diameter, isGroup, name } = props;

  const { hash, loading } = useHashBasedOnPubkey(pubkey);

  const viewBox = `0 0 ${diameter} ${diameter}`;

  if (loading || !hash) {
    return (
      <svg viewBox={viewBox}>
        <g id="UrTavla">
          <rect
            fill="#141414"
            width={diameter}
            height={diameter}
            stroke={avatarBorderColor}
            strokeWidth="1"
          />
        </g>
      </svg>
    );
  }

  const bgColorIndex = hash % avatarPlaceholderColors.length;

  const avatarColors = avatarPlaceholderColors[bgColorIndex];
  const gradId = `noirPlate_${bgColorIndex}`;

  const initial = (getInitials(name) || (pubkey ? pubkey.substring(2, 3) : '?')).toUpperCase();

  if (isGroup) {
    return (
      <div
        style={{
          width: diameter + 'px',
          height: diameter + 'px',
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
          <defs>
            <linearGradient id={`${gradId}_g`} x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor={avatarColors.bgColor} />
              <stop offset="1" stopColor={avatarColors.gradColor} />
            </linearGradient>
          </defs>
          <path d={platePath} fill={`url(#${gradId}_g)`} />
          <path d={platePath} fill="none" stroke={avatarColors.borderColor} strokeWidth="1.5" />
          <path
            d="M30.3627 32.9066C31.7068 32.9066 32.7996 34.0007 32.7996 35.3448V36.2762C32.7993 40.6943 27.7203 42.7073 23.0001 42.7075C20.5203 42.7075 18.1942 42.1779 16.4502 41.2145C14.3543 40.0586 13.1994 38.305 13.1992 36.2762V35.3448C13.1992 34.0008 14.2922 32.9068 15.6362 32.9066H30.3627ZM44.3623 32.9066C45.7059 32.9069 46.7988 33.9999 46.7992 35.3436V36.2762C46.7989 40.6944 41.7187 42.7075 36.9984 42.7075C35.2642 42.7074 33.6058 42.4469 32.1686 41.9616C33.7611 40.6279 34.902 38.7448 34.9022 36.2762V35.3436C34.902 34.4469 34.6403 33.6108 34.1904 32.9066H44.3623ZM23.5377 19.0547C26.3924 19.0547 28.7069 21.3704 28.7069 24.2252C28.7066 27.0796 26.3922 29.3944 23.5377 29.3944C20.6831 29.3944 18.3688 27.0796 18.3684 24.2252C18.3684 21.3704 20.6829 19.0547 23.5377 19.0547ZM37.7531 19.0547C40.6078 19.0547 42.9223 21.3704 42.9223 24.2252C42.922 27.0796 40.6076 29.3944 37.7531 29.3944C34.8985 29.3944 32.5842 27.0796 32.5838 24.2252C32.5838 21.3704 34.8983 19.0547 37.7531 19.0547Z"
            fill={avatarColors.letterColor}
            opacity="0.9"
          />
        </svg>
      </div>
    );
  }
  return (
    <div
      style={{
        width: diameter + 'px',
        height: diameter + 'px',
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
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor={avatarColors.bgColor} />
            <stop offset="1" stopColor={avatarColors.gradColor} />
          </linearGradient>
        </defs>
        <path d={platePath} fill={`url(#${gradId})`} />
        <path d={platePath} fill="none" stroke={avatarColors.borderColor} strokeWidth="1.5" />
        <text
          x="50%"
          y="53%"
          fill={avatarColors.letterColor}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Michroma', 'Poppins', sans-serif"
          fontSize="22"
        >
          {initial}
        </text>
      </svg>
    </div>
  );
};
