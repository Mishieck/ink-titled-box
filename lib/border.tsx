import type { TextProps } from "ink";
import type React from "react";
import { Text } from "ink";

export type BorderProps = {
  content: string;
  color?: TextProps['color'];
  show?: boolean;
  dimColor?: boolean;
};

export const Border: React.FC<BorderProps> = (props) => {
  const { color, content, show, dimColor } = props;
  return show ? <Text color={color} dimColor={dimColor}>{content}</Text> : null;
};
