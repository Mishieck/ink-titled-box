import type { BorderData } from "./border";
import type {
  BorderCharacters,
  Borders,
  BorderStyle,
  Size,
  TitledBoxData,
  TitledBoxOptions,
  TitleJustify,
  TitleStyles
} from "./data";
import { borderCharacters } from "./data";
import type { TopBorder, TopBorderFragment } from "./top-border/data";
import { getPositions, subtractEdgeBorders, TITLE_PADDING } from "./utils";

export class TitledBoxApi implements TitledBoxData {
  /** The characters used to build borders borders. */
  static characters = borderCharacters;

  /** The left and right padding of the title. */
  static TITLE_PADDING = TITLE_PADDING;

  /** Top-left and Top-right characters. */
  static TOP_CORNER_LENGTH = 2;

  /** The gap between titles. */
  static TITLE_GAP = 1;

  style: BorderStyle;
  size: Size;
  titles: Array<string>;
  titleJustify: TitleJustify;
  titleStyles?: TitleStyles;
  #borders: Borders;

  constructor(options: TitledBoxOptions) {
    const { borders, size, style, titles, titleJustify, titleStyles } = options;

    this.size = size;
    this.style = style;
    this.titles = titles;
    this.titleJustify = titleJustify ?? 'flex-start';
    this.titleStyles = titleStyles;
    this.#borders = borders;
  }

  /** The borders of the four sides of the box. */
  get borders(): Borders {
    return {
      bottom: this.bottomBorder,
      left: this.leftBorder,
      right: this.rightBorder,
      top: this.topBorder
    }
  }

  /** The number of visible titles. */
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

  /** The titles that are visible. Titles that overflow are hidden. */
  get visibleTitles(): Array<string> {
    return this.titles.slice(0, this.visibleTitleCount);
  }

  get characters(): BorderCharacters {
    return TitledBoxApi.characters[this.style];
  }

  /**
   * The border uses if a border can not be created. One of the causes of this
   * is the border having insufficient length.
   */
  get emptyBorder(): BorderData {
    return { center: '', isVisible: false };
  }

  get bottomBorder(): BorderData {
    const { bottomLeft, bottomRight, bottomCenter } = this.characters;

    const length = subtractEdgeBorders(
      this.size.width,
      [this.#borders.left.isVisible, this.#borders.right.isVisible]
    );

    if (length < 0) return this.emptyBorder;
    const center = bottomCenter.repeat(length);

    return {
      ...this.#borders.bottom,
      center,
      end: this.#borders.right.isVisible ? bottomRight : undefined,
      start: this.#borders.left.isVisible ? bottomLeft : undefined,
    };
  }

  get leftBorder(): BorderData {
    return {
      ...this.#borders.left,
      center: this.getVerticalBorder(this.characters.leftCenter)
    };
  }

  get rightBorder(): BorderData {
    return {
      ...this.#borders.right,
      center: this.getVerticalBorder(this.characters.rightCenter)
    };
  }

  get topBorder(): BorderData {
    const length = subtractEdgeBorders(
      this.size.width,
      [this.#borders.left.isVisible, this.#borders.right.isVisible]
    );

    if (length < 2) return this.emptyBorder;
    const { topLeft, topCenter, topRight } = this.characters;
    const centerCharacters = new Array(length).fill(topCenter);

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

    return {
      ...this.#borders.top,
      center: centerCharacters.join(''),
      end: this.#borders.right.isVisible ? topRight : undefined,
      start: this.#borders.left.isVisible ? topLeft : undefined,
    };
  }

  /** The data for the top border. */
  get topBorderData(): TopBorder {
    const { center, color, dimColor, end, isVisible, start } = this.topBorder;
    let currentPosition = 0;
    const fragments: Array<TopBorderFragment> = [];
    if (start) fragments.push({ content: start, isTitle: false });
    const positions = this.titlePositions;

    positions.forEach((position, i) => {
      if (position > currentPosition) {
        fragments.push(
          { content: center.slice(currentPosition, position), isTitle: false }
        );
      }

      const nextPosition = position + this.visibleTitles[i]!.length + 2;

      fragments.push({
        content: center.slice(position, nextPosition),
        isTitle: true
      });

      currentPosition = nextPosition;
    });

    fragments.push({
      content: center.slice(currentPosition, center.length),
      isTitle: false
    });

    if (end) fragments.push({ content: end, isTitle: false });

    return {
      color,
      dimColor,
      fragments,
      isVisible,
      titleStyles: this.titleStyles
    };
  }

  /**
   * The positions of the titles. The positions are calculated according the
   * `titleJustify` prop. The positions take title padding into account.
   */
  get titlePositions(): Array<number> {
    switch (this.titleJustify) {
      case "flex-start": return this.startTitlePositions;
      case "flex-end": return this.endTitlePositions;
      case "space-between": return this.spaceBetweenTitlePositions;
      case "space-around": return this.spaceAroundTitlePositions;
      case "space-evenly": return this.spaceEvenlyTitlePositions;
      case "center": return this.centerTitlePositions;
    }
  }

  /** The total length of visible padded titles. */
  get totalTitleLength(): number {
    return this
      .visibleTitles
      .reduce(
        (length, title) => length + title.length + TitledBoxApi.TITLE_PADDING,
        0
      );
  }

  /** Title positions for `titleJustify="flex-start"`. */
  get startTitlePositions(): Array<number> {
    const positions: Array<number> = [];
    let position = 0;

    this.visibleTitles.forEach((title, i) => {
      positions.push(position);
      position += title.length + 3; // padding + gap = 3
    });

    return positions;
  }

  /** Title positions for `titleJustify="flex-end"`. */
  get endTitlePositions(): Array<number> {
    const startPositions = this.startTitlePositions;
    if (!startPositions.length) return startPositions;
    const gapLength = startPositions.length - 1;

    const padding = this.size.width - this.totalTitleLength - gapLength -
      TitledBoxApi.TOP_CORNER_LENGTH;

    return startPositions.map(position => position + padding);
  }

  /** Title positions for `titleJustify="space-between"`. */
  get spaceBetweenTitlePositions(): Array<number> {
    return this.getEvenlySpacedTitlePositions(-1);
  }

  /** Title positions for `titleJustify="space-around"`. */
  get spaceAroundTitlePositions(): Array<number> {
    const visibleTitles = this.visibleTitles;
    const edgeSpaceCount = 2;
    const edgeSpaceFraction = edgeSpaceCount;
    const inBetweenSpaceCount = visibleTitles.length - 1;

    // In-between space must be double the edge space
    const inBetweenSpaceFraction = inBetweenSpaceCount * 2;

    const totalSpaceFraction = edgeSpaceFraction + inBetweenSpaceFraction;
    const totalSpaceLength = this.size.width - this.totalTitleLength - 2;

    const edgeSpaceLength = Math.floor(
      ((edgeSpaceFraction / totalSpaceFraction) * totalSpaceLength) /
      edgeSpaceCount
    );

    const inBetweenSpaceLength = Math.floor(
      ((inBetweenSpaceFraction / totalSpaceFraction) * totalSpaceLength) /
      inBetweenSpaceCount
    );

    return this.getSpacedTitlePositions(edgeSpaceLength, inBetweenSpaceLength);
  }

  /** Title positions for `titleJustify="space-evenly"`. */
  get spaceEvenlyTitlePositions(): Array<number> {
    return this.getEvenlySpacedTitlePositions(1, true);
  }

  /**
   * Calculates positions for layout with equal spaces between titles and on the
   * edges.
   *
   * @param spaceCountAdjustment An increment or decrement in the number of
   * spaces.
   * @param [startWidthSpace=false] Whether or not to start with a space.
   */
  getEvenlySpacedTitlePositions(
    spaceCountAdjustment: -1 | 1,
    startWidthSpace = false
  ): Array<number> {
    const visibleTitles = this.visibleTitles;
    const spaceCount = visibleTitles.length + spaceCountAdjustment;
    const totalSpaceLength = this.size.width - this.totalTitleLength - 2;
    const spaceLength = Math.floor(totalSpaceLength / spaceCount);

    return this.getSpacedTitlePositions(
      startWidthSpace ? spaceLength : 0,
      spaceLength
    );
  }

  /** Calculates positions for layouts with spaces between titles. */
  getSpacedTitlePositions(
    edgeSpace: number,
    inBetweenSpace: number
  ): Array<number> {
    const visibleTitles = this.visibleTitles;
    const edgeSpaceCount = 2;
    const inBetweenSpaceCount = visibleTitles.length - 1;
    const totalSpaceLength = this.size.width - this.totalTitleLength - 2;

    const remainderSpace = totalSpaceLength - (edgeSpace * edgeSpaceCount + inBetweenSpace * inBetweenSpaceCount);

    let positions = getPositions(
      visibleTitles,
      edgeSpace,
      inBetweenSpace,
      remainderSpace
    );

    return positions;
  }

  /** Title positions for `titleJustify="center"`. */
  get centerTitlePositions(): Array<number> {
    const startPositions = this.startTitlePositions;
    if (!startPositions.length) return startPositions;
    const gapLength = startPositions.length - 1;

    const padding = this.size.width - this.totalTitleLength - gapLength - TitledBoxApi.TOP_CORNER_LENGTH;

    const halfPadding = Math.floor(padding / 2);
    return startPositions.map(position => position + halfPadding);
  }

  /** Creates a vertical border. */
  getVerticalBorder(character: string): string {
    const length = subtractEdgeBorders(
      this.size.height,
      [this.#borders.bottom.isVisible, this.#borders.top.isVisible]
    );

    return this.size.height > 1
      ? new Array(length).fill(character).join('\n')
      : '';
  }

  /** Creates a JSON object containing `TitledBoxData`. */
  toJSON(): TitledBoxData {
    const { borders, size, style, titles, titleJustify, topBorderData } = this;
    return { borders, size, style, titles, titleJustify, topBorderData };
  }
}

