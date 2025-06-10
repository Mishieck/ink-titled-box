import type { BorderData } from "../border";
import type { TitleStyles } from "../data";

export type TopBorderFragment = {
  isTitle: boolean;
  content: string;
};

export type TopBorder =
  & Pick<BorderData, "color" | "dimColor" | "isVisible">
  & { fragments: Array<TopBorderFragment>; titleStyles?: TitleStyles };
