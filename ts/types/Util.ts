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