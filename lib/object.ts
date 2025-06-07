import type {
  BorderCharacters,
  Borders,
  BorderStyle,
  Size,
  TitledBoxData,
  TitledBoxOptions,
  TitleJustify
} from "./data";
import { borderCharacters } from "./data";

export class TitledBoxApi implements TitledBoxData {
  static characters = borderCharacters;

  style: BorderStyle;
  size: Size;
  titles: Array<string>;
  titleJustify: TitleJustify;

  constructor({ size, style, titles, titleJustify }: TitledBoxOptions) {
    this.size = size;
    this.style = style;
    this.titles = titles;
    this.titleJustify = titleJustify ?? 'space-between';
  }

  get borders(): Borders {
    return {
      bottom: this.bottomBorder,
      left: this.leftBorder,
      right: this.rightBorder,
      top: this.topBorder
    }
  }

  get characters(): BorderCharacters {
    return TitledBoxApi.characters[this.style];
  }

  get bottomBorder(): string {
    if (this.size.width < 2) return '';
    const { bottomLeft, bottomRight, bottomCenter } = this.characters;
    const center = bottomCenter.repeat(this.size.width - 2);
    return `${bottomLeft}${center}${bottomRight}`;
  }

  get leftBorder(): string {
    return this.getVerticalBorder(this.characters.leftCenter);
  }

  get rightBorder(): string {
    return this.getVerticalBorder(this.characters.rightCenter);
  }

  get topBorder(): string {
    const { width } = this.size;

    if (width < 2) return '';
    const { topLeft, topCenter, topRight } = this.characters;
    const centerCharacters = new Array(width - 2).fill(topCenter);

    /* NOTE: It's title positions that are looped over and not titles 
     * themselves. This is because titles that overflow are not assigned
     * positions. This prevents attempts to insert titles into
     * `centerCharacters` out of bounds.
     */
    this
      .titlePositions
      .forEach(
        (position, i) => {
          const paddedTitleLength = this.titles[i]!.length + 2;
          const paddedTitle = ` ${this.titles[i]!} `.split('');
          centerCharacters.splice(position, paddedTitleLength, ...paddedTitle)
        }
      );

    return `${topLeft}${centerCharacters.join('')}${topRight}`;
  }

  get titlePositions(): Array<number> {
    // NOTE: Should take title padding into account

    switch (this.titleJustify) {
      case "flex-start": return [0];
      case "flex-end": return [0];
      case "space-between": return [0];
      case "space-around": return [0];
      case "space-evenly": return [0];
      case "center": return [0];
    }
  }

  getVerticalBorder(character: string): string {
    return this.size.height > 1
      ? new Array(this.size.height - 2).fill(character).join('\n')
      : '';
  }

  toJSON(): TitledBoxData {
    const { borders, size, style, titles, titleJustify } = this;
    return { borders, size, style, titles, titleJustify };
  }
}

