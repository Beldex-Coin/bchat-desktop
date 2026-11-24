// Formatting toolbar glyphs (Figma 5773:6239 "Formatting toolbar", 27px frames): drawn in currentColor
// so the button's state (default / hover / active / disabled) sets their colour.
import type { ReactNode } from 'react';

const LINES = 'M11.25 8.699H21V9.799H11.25ZM11.25 13.5H21V14.6H11.25ZM11.25 18.301H21V19.401H11.25Z';

const Svg = ({ size, children }: { size: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 27 27" fill="currentColor" aria-hidden="true">
    {children}
  </svg>
);

export const FormatLinkIcon = ({ size = 36 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M7.718 15.464L10.263 12.918A2.7 2.7 0 0 1 14.082 12.918L14.082 12.918A2.7 2.7 0 0 1 14.082 16.737L11.536 19.282A2.7 2.7 0 0 1 7.718 19.282L7.718 19.282A2.7 2.7 0 0 1 7.718 15.464ZM8.496 16.242A1.6 1.6 0 0 0 8.496 18.504L8.496 18.504A1.6 1.6 0 0 0 10.758 18.504L13.304 15.959A1.6 1.6 0 0 0 13.304 13.696L13.304 13.696A1.6 1.6 0 0 0 11.041 13.696L8.496 16.242ZM12.919 10.263L15.465 7.717A2.7 2.7 0 0 1 19.283 7.717L19.283 7.717A2.7 2.7 0 0 1 19.283 11.536L16.737 14.081A2.7 2.7 0 0 1 12.919 14.081L12.919 14.081A2.7 2.7 0 0 1 12.919 10.263ZM13.697 11.041A1.6 1.6 0 0 0 13.697 13.303L13.697 13.303A1.6 1.6 0 0 0 15.96 13.303L18.505 10.758A1.6 1.6 0 0 0 18.505 8.495L18.505 8.495A1.6 1.6 0 0 0 16.242 8.495L13.697 11.041Z" />
  </Svg>
);

export const FormatNumberedListIcon = ({ size = 36 }: { size?: number }) => (
  <Svg size={size}>
    <path d={LINES} />
    <g fontFamily="'Roboto Mono', monospace" fontWeight={700} fontSize={5.6}>
      <text x={6.2} y={12.1}>1</text>
      <text x={6.2} y={16.9}>2</text>
      <text x={6.2} y={21.7}>3</text>
    </g>
  </Svg>
);

export const FormatBulletedListIcon = ({ size = 36 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M6.4 8.199H8.6V10.399H6.4ZM11.25 8.699H21V9.799H11.25ZM6.4 13H8.6V15.2H6.4ZM11.25 13.5H21V14.6H11.25ZM6.4 17.801H8.6V20.001H6.4ZM11.25 18.301H21V19.401H11.25Z" />
  </Svg>
);

export const FormatQuoteIcon = ({ size = 36 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M7.1 7.5H8.6V19.5H7.1ZM11.25 8.699H20.65V9.799H11.25ZM11.25 13.5H20.65V14.6H11.25ZM11.25 18.301H17.65V19.401H11.25Z" />
  </Svg>
);

export const FormatInlineCodeIcon = ({ size = 36 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M5.78262 15.0307L9.77119 16.7381V15.6411L7.13203 14.6956L6.85205 14.5992L7.13203 14.4982L9.77119 13.5436V12.4466L5.78262 14.1494V15.0307ZM11.7494 18.0737H12.7592L15.38 10.8172H14.3748L11.7494 18.0737ZM17.092 15.6503V16.7381L21.1907 15.0307V14.1448L17.092 12.442V13.5298L19.8688 14.4937L20.1442 14.5854L19.8643 14.6681L17.092 15.6503Z" />
  </Svg>
);

export const FormatCodeBlockIcon = ({ size = 36 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M7.5 6.75L19.5 6.75A1.5 1.5 0 0 1 21 8.25L21 18.75A1.5 1.5 0 0 1 19.5 20.25L7.5 20.25A1.5 1.5 0 0 1 6 18.75L6 8.25A1.5 1.5 0 0 1 7.5 6.75ZM7.5 7.75A0.5 0.5 0 0 0 7 8.25L7 18.75A0.5 0.5 0 0 0 7.5 19.25L19.5 19.25A0.5 0.5 0 0 0 20 18.75L20 8.25A0.5 0.5 0 0 0 19.5 7.75L7.5 7.75Z" />
    <text x={7.75} y={15.4} fontFamily="'Roboto Mono', monospace" fontWeight={500} fontSize={6.4}>
      {'</>'}
    </text>
  </Svg>
);
