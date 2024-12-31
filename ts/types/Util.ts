import { Emoji } from '@emoji-mart/data';
import { LocalizerKeys } from './LocalizerKeys';


export type RenderTextCallbackType = (options: {
  text: string;
  key: number;
  isGroup: boolean;
}) => JSX.Element;

export type LocalizerType = (key: LocalizerKeys, values?: Array<string>) => string;

export class RecentReactions {
  public items: Array<string> = [];
  public limit: number = 6;

  constructor(items: Array<string>) {
    this.items = items;
  }

  public size(): number {
    return this.items.length;
  }

  public push(item: string): void {
    if (this.size() === this.limit) {
      this.items.pop();
    }
    this.items.unshift(item);
  }

  public pop(): string | undefined {
    return this.items.pop();
  }

  public swap(index: number): void {
    const temp = this.items.splice(index, 1);
    this.push(temp[0]);
  }
}
// Types for EmojiMart 5 are currently broken these are a temporary fixes
export interface FixedPickerProps {
  autoFocus?: boolean | undefined;
  title?: string | undefined;
  theme?: 'auto' | 'light' | 'dark' | undefined;
  perLine?: number | undefined;
  stickySearch?: boolean | undefined;
  searchPosition?: 'sticky' | 'static' | 'none' | undefined;
  emojiButtonSize?: number | undefined;
  emojiButtonRadius?: number | undefined;
  emojiButtonColors?: string | undefined;
  maxFrequentRows?: number | undefined;
  icons?: 'auto' | 'outline' | 'solid';
  set?: FixedBaseEmoji | undefined;
  emoji?: string | undefined;
  navPosition?: 'bottom' | 'top' | 'none' | undefined;
  showPreview?: boolean | undefined;
  previewEmoji?: boolean | undefined;
  noResultsEmoji?: string | undefined;
  previewPosition?: 'bottom' | 'top' | 'none' | undefined;
  skinTonePosition?: 'preview' | 'search' | 'none';
  onEmojiSelect?: (emoji: any) => void;
  onClickOutside?: (...args: Array<any>) => void;
  onAddCustomEmoji?: (...args: Array<any>) => void;
  getImageURL?: () => void;
  getSpritesheetURL?: () => void;
  // Below here I'm currently unsure of usage
  // i18n?: PartialI18n | undefined;
  // style?: React.CSSProperties | undefined;
  // color?: string | undefined;
  // skin?: EmojiSkin | undefined;
  // defaultSkin?: EmojiSkin | undefined;
  // backgroundImageFn?: BackgroundImageFn | undefined;
  // sheetSize?: EmojiSheetSize | undefined;
  // emojisToShowFilter?(emoji: EmojiData): boolean;
  // showSkinTones?: boolean | undefined;
  // emojiTooltip?: boolean | undefined;
  // include?: CategoryName[] | undefined;
  // exclude?: CategoryName[] | undefined;
  // recent?: string[] | undefined;
  // /** NOTE: custom emoji are copied into a singleton object on every new mount */
  // custom?: CustomEmoji[] | undefined;
  // skinEmoji?: string | undefined;
  // notFound?(): React.Component;
  // notFoundEmoji?: string | undefined;
  // enableFrequentEmojiSort?: boolean | undefined;
  // useButton?: boolean | undefined;
}

export interface FixedBaseEmoji extends Emoji {
  search?: string;
  // props from emoji panel click event
  native?: string;
  aliases?: Array<string>;
  shortcodes?: string;
  unified?: string;
}
