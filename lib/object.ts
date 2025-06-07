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
  /** The left and right padding of the title. */
  static TITLE_PADDING = 2;
  static TOP_CORNER_LENGTH = 2; // Top-left and Top-right characters
  static TITLE_GAP = 1;

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

  get visibleTitleCount(): number {
    let count = 0;
    let length = TitledBoxApi.TOP_CORNER_LENGTH;

    while (count < this.titles.length) {
      const title = this.titles[count]!;
      length += title.length + TitledBoxApi.TITLE_PADDING;
      if (count > 0) length += TitledBoxApi.TITLE_GAP;

      if (length < this.size.width) count++;
      else break;
    }

    return count;
  }

  get visibleTitles(): Array<string> {
    return this.titles.slice(0, this.visibleTitleCount);
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
      case "flex-start": return this.startTitlePositions;
      case "flex-end": return this.endTitlePositions;
      case "space-between": return this.spaceBetweenTitlePositions;
      case "space-around": return this.spaceAroundTitlePositions;
      case "space-evenly": return this.spaceEvenlyTitlePositions;
      case "center": return this.centerTitlePositions;
    }
  }

  get totalTitleLength(): number {
    return this
      .visibleTitles
      .reduce(
        (length, title) => length + title.length + TitledBoxApi.TITLE_PADDING,
        0
      );
  }

  get startTitlePositions(): Array<number> {
    const positions: Array<number> = [];
    let position = 0;

    this.visibleTitles.forEach((title, i) => {
      positions.push(position);
      position += title.length + 3; // padding + gap = 3
    });

    return positions;
  }

  get endTitlePositions(): Array<number> {
    const startPositions = this.startTitlePositions;
    if (!startPositions.length) return startPositions;
    const gapLength = startPositions.length - 1;
    const padding = this.size.width - this.totalTitleLength - gapLength - TitledBoxApi.TOP_CORNER_LENGTH;
    return startPositions.map(position => position + padding);
  }

  get spaceBetweenTitlePositions(): Array<number> {
    const visibleTitles = this.visibleTitles;
    const spaceCount = visibleTitles.length - 1;
    const totalSpaceLength = this.size.width - this.totalTitleLength - 2;
    const spaceLength = Math.floor(totalSpaceLength / spaceCount);
    const remainderSpace = totalSpaceLength % spaceLength;
    let positions: Array<number> = [];
    let position = 0;

    visibleTitles.forEach((title, i) => {
      positions.push(position);
      position += title.length + TitledBoxApi.TITLE_PADDING + spaceLength;
    });

    /* If there are spaces that have not been inserted, shift certain titles to
     * the right by the number of spaces remaining. This ensures that the last
     * title is always at the very end of the top border.
     */
    if (remainderSpace) {
      const shiftPosition = Math.ceil(
        (visibleTitles.length - remainderSpace) / 2
      );

      let remainingSpaces = remainderSpace;

      while (remainingSpaces) {
        for (let i = shiftPosition; i < visibleTitles.length; i++)
          positions[i]!++;

        remainingSpaces--;
      }
    }

    return positions;
  }

  get spaceAroundTitlePositions(): Array<number> {
    return [0];
  }

  get spaceEvenlyTitlePositions(): Array<number> {
    return [0];
  }

  get centerTitlePositions(): Array<number> {
    const startPositions = this.startTitlePositions;
    if (!startPositions.length) return startPositions;
    const gapLength = startPositions.length - 1;
    const padding = this.size.width - this.totalTitleLength - gapLength - TitledBoxApi.TOP_CORNER_LENGTH;
    const halfPadding = Math.floor(padding / 2);
    return startPositions.map(position => position + halfPadding);
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

