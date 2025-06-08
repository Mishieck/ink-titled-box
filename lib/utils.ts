import type { BorderStyle, TitleJustify } from "./data";
import type { BoxProps } from "ink";

export type TitledBoxProps = Omit<BoxProps, 'borderStyle' | 'children'> & {
  titles: Array<string>;
  titleJustify?: TitleJustify,
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
