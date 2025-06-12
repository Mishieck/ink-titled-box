import type { TitleStyles } from "./data";
import type {
  BorderStyle,
  CrossAxisBorderVisibilities,
  TitleJustify
} from "./data";
import type { BoxProps } from "ink";
import type { TopBorder, TopBorderFragment } from "./top-border/data";
import type { BorderData } from "./border";

export type TitledBoxProps = Omit<BoxProps, 'borderStyle' | 'children'> & {
  titles: Array<string>;
  titleJustify?: TitleJustify,
  titleStyles?: TitleStyles;
  borderStyle: BorderStyle;
  children: React.ReactNode;
};

export type SpacedTitlePositionsData = {
  visibleTitles: Array<string>,
  width: number,
  totalTitleLength: number,
  edgeSpace: number,
  inBetweenSpace: number
};

export const innerBoxPropNames = [
  "children",
  "flexDirection",
  "flexWrap",
  "justifyContent",
  "alignItems",
  "padding",
  "paddingLeft",
  "paddingY",
  "paddingX",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "gap",
  "rowGap",
  "columnGap",
  "display",
] satisfies Array<keyof TitledBoxProps>;

export type OuterBoxPropName = Exclude<keyof TitledBoxProps, InnerBoxPropName>;
export type InnerBoxPropName = (typeof innerBoxPropNames)[number];
export type InnerBoxProps = Pick<TitledBoxProps, InnerBoxPropName>;
export type OuterBoxProps = Omit<TitledBoxProps, InnerBoxPropName>;

export const TITLE_PADDING = 2;
export const TOP_CORNER_LENGTH = 2;

export const getInnerBoxProps = (props: TitledBoxProps): InnerBoxProps => {
  const innerBoxProps = innerBoxPropNames.reduce(
    (innerBoxProps, name) => ({ ...innerBoxProps, [name]: props[name] }),
    {} as Partial<InnerBoxProps>
  );

  if (!innerBoxProps.display) Object.assign(innerBoxProps, { display: 'flex' });
  return innerBoxProps as InnerBoxProps;
};

export const getOuterBoxProps = (props: TitledBoxProps): OuterBoxProps => {
  const outerBoxProps = Object
    .keys(props)
    .filter(isOuterBoxPropName)
    .reduce(
      (outerBoxProps, name) => ({ ...outerBoxProps, [name]: props[name] }),
      {} as Partial<OuterBoxProps>
    );

  const borderFlagNames = [
    "borderBottom",
    "borderLeft",
    "borderRight",
    "borderTop"
  ] as const;

  for (const name of borderFlagNames) {
    if (typeof outerBoxProps[name] === "undefined")
      Object.assign(outerBoxProps, { [name]: true });
  }

  return outerBoxProps as OuterBoxProps;
};

export const isOuterBoxPropName = (name: string): name is OuterBoxPropName =>
  !innerBoxPropNames.includes(name as InnerBoxPropName);

export const shiftPositions = (
  positions: Array<number>,
  shiftCount: number
): Array<number> => {
  const shiftPosition = Math.ceil((positions.length - shiftCount) / 2);
  let remainingSpaces = shiftCount;

  while (remainingSpaces) {
    for (let i = shiftPosition; i < positions.length; i++) positions[i]!++;
    remainingSpaces--;
  }

  return positions;
};

/** The data for the top border. */
export const getTopBorderData = (
  topBorder: BorderData,
  titlePositions: Array<number>,
  visibleTitles: Array<string>,
  titleStyles?: TitleStyles
): TopBorder => {
  const { center, color, dimColor, end, isVisible, start } = topBorder;
  let currentPosition = 0;
  const fragments: Array<TopBorderFragment> = [];
  if (start) fragments.push({ content: start, isTitle: false });
  const positions = titlePositions;

  positions.forEach((position, i) => {
    if (position > currentPosition) {
      fragments.push(
        { content: center.slice(currentPosition, position), isTitle: false }
      );
    }

    const nextPosition = position + visibleTitles[i]!.length + 2;

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
    titleStyles
  };
};

export const getPositions = (
  titles: Array<string>,
  startPosition: number,
  spaceLength: number,
  shiftCount: number
): Array<number> => {
  let positions: Array<number> = [];
  let position = startPosition;

  for (const title of titles) {
    positions.push(position);
    position += title.length + TITLE_PADDING + spaceLength;
  }

  /* If there are spaces that have not been inserted, shift middle titles to
   * the right by the number of spaces remaining. This ensures that the 
   * title distribution is symmetrical at both ends.
   */
  if (shiftCount) positions = shiftPositions(positions, shiftCount);

  return positions;
};

/**
 * Subtracts edge characters lengths from border length. The characters are
 * subtracted if the borders in the cross-axis are visible. If only one is
 * visible `1` is subtracted. If both are visible, `2` is subtracted.
 *
 * @param length The available length.
 * @param visibilities A list of visibility statuses of cross-axis borders.
 */
export const subtractEdgeBorders = (
  length: number,
  visibilities: CrossAxisBorderVisibilities,
): number => {
  for (const isVisible of visibilities) if (isVisible) length--;
  return length;
};

export const getStartTitlePositions = (titles: Array<string>): Array<number> => {
  const positions: Array<number> = [];
  let position = 0;

  titles.forEach((title, i) => {
    positions.push(position);
    position += title.length + 3; // padding + gap = 3
  });

  return positions;
};

export const getEndTitlePositions = (
  startTitlePositions: Array<number>,
  width: number,
  totalTitleLength: number,
): Array<number> => {
  const startPositions = startTitlePositions;
  if (!startPositions.length) return startPositions;
  const gapLength = startPositions.length - 1;
  const padding = width - totalTitleLength - gapLength - TOP_CORNER_LENGTH;
  return startPositions.map(position => position + padding);
};

/** Title positions for `titleJustify="space-around"`. */
export const getSpaceAroundTitlePositions = (
  visibleTitles: Array<string>,
  width: number,
  totalTitleLength: number
): Array<number> => {
  const edgeSpaceCount = 2;
  const edgeSpaceFraction = edgeSpaceCount;
  const inBetweenSpaceCount = visibleTitles.length - 1;

  // In-between space must be double the edge space
  const inBetweenSpaceFraction = inBetweenSpaceCount * 2;

  const totalSpaceFraction = edgeSpaceFraction + inBetweenSpaceFraction;
  const totalSpaceLength = width - totalTitleLength - 2;

  const edgeSpaceLength = Math.floor(
    ((edgeSpaceFraction / totalSpaceFraction) * totalSpaceLength) /
    edgeSpaceCount
  );

  const inBetweenSpaceLength = Math.floor(
    ((inBetweenSpaceFraction / totalSpaceFraction) * totalSpaceLength) /
    inBetweenSpaceCount
  );

  return getSpacedTitlePositions({
    visibleTitles,
    width,
    totalTitleLength,
    edgeSpace: edgeSpaceLength,
    inBetweenSpace: inBetweenSpaceLength
  });
}

/** Calculates positions for layouts with spaces between titles. */
export const getSpacedTitlePositions = (
  data: SpacedTitlePositionsData
): Array<number> => {
  const {
    visibleTitles,
    width,
    totalTitleLength,
    edgeSpace,
    inBetweenSpace
  } = data;

  const edgeSpaceCount = 2;
  const inBetweenSpaceCount = visibleTitles.length - 1;
  const totalSpaceLength = width - totalTitleLength - 2;

  const remainderSpace = totalSpaceLength - (edgeSpace * edgeSpaceCount + inBetweenSpace * inBetweenSpaceCount);

  let positions = getPositions(
    visibleTitles,
    edgeSpace,
    inBetweenSpace,
    remainderSpace
  );

  return positions;
};

/** Title positions for `titleJustify="center"`. */
export const getCenterTitlePositions = (
  startTitlePositions: Array<number>,
  width: number,
  totalTitleLength: number
): Array<number> => {
  const startPositions = startTitlePositions;
  if (!startPositions.length) return startPositions;
  const gapLength = startPositions.length - 1;
  const padding = width - totalTitleLength - gapLength - TOP_CORNER_LENGTH;
  const halfPadding = Math.floor(padding / 2);
  return startPositions.map(position => position + halfPadding);
};
