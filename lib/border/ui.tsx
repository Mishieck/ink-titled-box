import type React from "react";
import { Text } from "ink";
import type { BorderData } from "./data";

export type BorderProps = BorderData;

export const BorderUi: React.FC<BorderProps> = (props) => {
  const { color, start, center, end, isVisible, dimColor } = props;

  return isVisible
    ? <Text color={color} dimColor={dimColor}>{start}{center}{end}</Text>
    : null;
};
