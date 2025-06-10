import type React from "react";
import { TitledBox, type TitleStyles } from "../main";
import { Box, Text } from "ink";
import { capitalize } from "./utils";

const titleStyles: Record<string, TitleStyles> = {
  rectangle: { start: ' ', end: ' ' },
  pill: { start: '', end: '' },
  hexagon: { start: '', end: '' },
};

export const TitleStylesUi: React.FC = () => (
  <Box width={80} padding={2} flexDirection="column" gap={1}>
    {
      Object.entries(titleStyles).map(([name, styles]) => (
        <TitledBox
          key={name}
          titles={[capitalize(name)]}
          borderStyle="single"
          titleStyles={styles}
        >
          <Text>Content</Text>
        </TitledBox>
      ))
    }
  </Box>
);
