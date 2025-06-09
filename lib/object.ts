import type { BorderData } from "./border";
import type {
  BorderCharacters,
  Borders,
  BorderStyle,
  CrossAxisBorderVisibilities,
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

  static shiftPositions(positions: Array<number>, shiftCount: number): Array<number> {
    const shiftPosition = Math.ceil(
      (positions.length - shiftCount) / 2
    );

    let remainingSpaces = shiftCount;

    while (remainingSpaces) {
      for (let i = shiftPosition; i < positions.length; i++) positions[i]!++;
      remainingSpaces--;
    }

    return positions;
  }

  static getPositions(titles: Array<string>, startPosition: number, spaceLength: number, shiftCount: number): Array<number> {
    let positions: Array<number> = [];
    let position = startPosition;

    for (const title of titles) {
      positions.push(position);
      position += title.length + TitledBoxApi.TITLE_PADDING + spaceLength;
    }

    /* If there are spaces that have not been inserted, shift middle titles to
     * the right by the number of spaces remaining. This ensures that the 
     * title distribution is symmetrical at both ends.
     */
    if (shiftCount)
      positions = this.shiftPositions(positions, shiftCount);

    return positions;
  }

  /**
   * Subtracts edge characters lengths from border length. The characters are
   * subtracted if the borders in the cross-axis are visible. If only one is
   * visible `1` is subtracted. If both are visible, `2` is subtracted.
   *
   * @param length The available length.
   * @param visibilities A list of visibility statuses of cross-axis borders.
   */
  static subtractEdgeBorders(
    length: number,
    visibilities: CrossAxisBorderVisibilities,
  ): number {
    for (const isVisible of visibilities) if (isVisible) length--;
    return length;
  }

  style: BorderStyle;
  size: Size;
  titles: Array<string>;
  titleJustify: TitleJustify;
  #borders: Borders;

  constructor(options: TitledBoxOptions) {
    const { size, style, titles, titleJustify, borders } = options;

    this.size = size;
    this.style = style;
    this.titles = titles;
    this.titleJustify = titleJustify ?? 'flex-start';
    this.#borders = borders;
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

  get emptyBorder(): BorderData {
    return { center: '', isVisible: false };
  }

  get bottomBorder(): BorderData {
    const { bottomLeft, bottomRight, bottomCenter } = this.characters;

    const length = TitledBoxApi.subtractEdgeBorders(
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
    const length = TitledBoxApi.subtractEdgeBorders(
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

    const padding = this.size.width - this.totalTitleLength - gapLength -
      TitledBoxApi.TOP_CORNER_LENGTH;

    return startPositions.map(position => position + padding);
  }

  get spaceBetweenTitlePositions(): Array<number> {
    return this.getEvenlySpacedTitlePositions(-1);
  }

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

  get spaceEvenlyTitlePositions(): Array<number> {
    return this.getEvenlySpacedTitlePositions(1, true);
  }

  /**
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

  getSpacedTitlePositions(edgeSpace: number, inBetweenSpace: number): Array<number> {
    const visibleTitles = this.visibleTitles;
    const edgeSpaceCount = 2;
    const inBetweenSpaceCount = visibleTitles.length - 1;
    const totalSpaceLength = this.size.width - this.totalTitleLength - 2;

    const remainderSpace = totalSpaceLength - (edgeSpace * edgeSpaceCount + inBetweenSpace * inBetweenSpaceCount);

    let positions = TitledBoxApi.getPositions(
      visibleTitles,
      edgeSpace,
      inBetweenSpace,
      remainderSpace
    );

    return positions;
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
    const length = TitledBoxApi.subtractEdgeBorders(
      this.size.height,
      [this.#borders.bottom.isVisible, this.#borders.top.isVisible]
    );

    return this.size.height > 1
      ? new Array(length).fill(character).join('\n')
      : '';
  }

  toJSON(): TitledBoxData {
    const { borders, size, style, titles, titleJustify } = this;
    return { borders, size, style, titles, titleJustify };
  }
}

