import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import lottie, { AnimationItem } from 'lottie-web';

// Lottie animations shipped in images/animations (exported from the motion designs, see the mobile
// reference video). Dark theme only - callers decide when to show one.
export type LottieName =
  | 'BNS_Tick'
  | 'Badge_popup'
  | 'Block_person'
  | 'Confetti_BNS'
  | 'Correct_PIN'
  | 'Delete_Bin'
  | 'Incorrect_PIN'
  | 'Joined_Confetti'
  | 'Loading_animation'
  | 'No_Media'
  | 'No_PIN'
  | 'No_document'
  | 'Typing_indicator'
  | 'empty_chat';

// The exports draw their glows as opaque white -> black radial gradients (an After Effects add /
// screen layer flattened to normal). On the dark UI that reads as a white disc, so the glow is
// tinted with the icon's own colour and drawn as screen light. The typing indicator's bubble is a
// white -> black gradient too; the app draws its own bubble, so only the dots are kept.
const GLOW_TINT: Partial<Record<LottieName, [number, number, number]>> = {
  Badge_popup: [0, 0.737, 0.2],
  Correct_PIN: [0, 0.737, 0.2],
  No_PIN: [0, 0.737, 0.2],
  Incorrect_PIN: [1, 0.243, 0.243],
  Block_person: [1, 0.243, 0.243],
};

// The verified rosette sits on the avatar with a dark cut-out edge and a dark check (the check is
// a hole in the rosette). The export only has the green shape, so a dark copy of the outline,
// slightly stroked, is drawn underneath it.
const BADGE_BACKING = [0.102, 0.102, 0.102, 1];
const addBadgeBacking = (layer: any) => {
  const group = (layer.shapes || []).find((shape: any) => shape.ty === 'gr');
  const outline = group?.it?.find((item: any) => item.ty === 'sh');
  if (!outline) {
    return;
  }
  const transform = group.it.find((item: any) => item.ty === 'tr');
  layer.shapes.push({
    ty: 'gr',
    nm: 'backing',
    it: [
      { ...JSON.parse(JSON.stringify(outline)), nm: 'backing path' },
      { ty: 'fl', nm: 'backing fill', c: { a: 0, k: BADGE_BACKING }, o: { a: 0, k: 100 }, r: 1, bm: 0 },
      {
        ty: 'st',
        nm: 'backing edge',
        c: { a: 0, k: BADGE_BACKING },
        o: { a: 0, k: 100 },
        w: { a: 0, k: 2.75 },
        lc: 2,
        lj: 2,
        bm: 0,
      },
      JSON.parse(JSON.stringify(transform)),
    ],
  });
};

const prepare = (name: LottieName, source: any) => {
  const data = JSON.parse(JSON.stringify(source));
  const tint = GLOW_TINT[name];
  const tintGradients = (node: any): boolean => {
    let found = false;
    const walk = (o: any) => {
      if (!o || typeof o !== 'object') {
        return;
      }
      if (Array.isArray(o)) {
        o.forEach(walk);
        return;
      }
      if (o.ty === 'gf' || o.ty === 'gs') {
        found = true;
        const stops = o.g?.k?.k;
        if (tint && Array.isArray(stops) && stops[1] === 1 && stops[2] === 1 && stops[3] === 1) {
          stops[1] = tint[0] * 0.45;
          stops[2] = tint[1] * 0.45;
          stops[3] = tint[2] * 0.45;
        }
      }
      Object.values(o).forEach(walk);
    };
    walk(node);
    return found;
  };
  (data.layers || []).forEach((layer: any) => {
    if (name === 'Typing_indicator' && layer.nm === 'Bubble') {
      layer.hd = true;
      return;
    }
    if (name === 'BNS_Tick' && layer.nm === 'badge') {
      addBadgeBacking(layer);
      return;
    }
    if (tintGradients(layer.shapes)) {
      layer.bm = 3; // screen
    }
  });
  return data;
};

const cache = new Map<LottieName, any>();
const animationData = (name: LottieName) => {
  if (!cache.has(name)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    cache.set(name, prepare(name, require(`../../../images/animations/${name}.json`)));
  }
  // lottie writes into the data it is given - hand each player its own copy
  return JSON.parse(JSON.stringify(cache.get(name)));
};

type Props = {
  name: LottieName;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
  // 'cover' fills the box and crops (full-screen confetti); default keeps the whole artboard
  fit?: 'contain' | 'cover';
};

export const LottieAnimation = (props: Props) => {
  const { name, loop = true, autoplay = true, className, style, onComplete, fit = 'contain' } = props;
  const box = useRef<HTMLDivElement>(null);
  const done = useRef(onComplete);
  done.current = onComplete;

  useEffect(() => {
    if (!box.current) {
      return undefined;
    }
    let anim: AnimationItem | undefined;
    try {
      anim = lottie.loadAnimation({
        container: box.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData: animationData(name),
        rendererSettings: { preserveAspectRatio: fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet' },
      });
      anim.addEventListener('complete', () => done.current?.());
    } catch (e) {
      window?.log?.warn(`lottie ${name} could not start`, e);
    }
    return () => anim?.destroy();
  }, [name, loop, autoplay, fit]);

  return (
    <div
      ref={box}
      className={classNames('lottie-animation', `lottie-animation--${name}`, className)}
      style={style}
      aria-hidden="true"
    />
  );
};

/** dark theme check usable outside hooks / in class components */
export const isDarkTheme = () => document.documentElement.getAttribute('data-theme') === 'dark';
