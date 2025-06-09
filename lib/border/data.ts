import type { TextProps } from "ink";

export type BorderData = {
  center: string;
  color?: TextProps['color'];
  dimColor?: boolean;
  end?: string;
  isVisible: boolean;
  start?: string;
};
