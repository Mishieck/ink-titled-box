import type { TitleStyles } from "../data";
import type { TextProps } from "ink";

export type BorderData = {
  center: string;
  color?: TextProps['color'];
  dimColor?: boolean;
  end?: string;
  isVisible: boolean;
  start?: string;
};

export type TopBorderFragment = {
  isTitle: boolean;
  content: string;
};

export type TopBorder =
  & Pick<BorderData, "color" | "dimColor" | "isVisible">
  & { fragments: Array<TopBorderFragment>; titleStyles?: TitleStyles };
