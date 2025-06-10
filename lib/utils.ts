import type { TitleStyles } from "./data";
import type {
  BorderStyle,
  CrossAxisBorderVisibilities,
  TitleJustify
} from "./data";
import type { BoxProps } from "ink";

export type TitledBoxProps = Omit<BoxProps, 'borderStyle' | 'children'> & {
  titles: Array<string>;
  titleJustify?: TitleJustify,
  titleStyles?: TitleStyles;
  borderStyle: BorderStyle;
  children: React.ReactNode;
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
