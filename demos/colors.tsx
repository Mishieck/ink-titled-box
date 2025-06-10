import type React from "react";
import { TitledBox } from "../main";
import { Box, Text } from "ink";

export const Colors: React.FC = () => (
  <Box width={80} padding={2} flexDirection="column" gap={1}>
    <TitledBox
      titles={["Blue"]}
      borderStyle="single"
      borderColor="blue"
    >
      <Text>Content</Text>
    </TitledBox>
    <TitledBox
      titles={["Red with title styles"]}
      borderStyle="single"
      titleStyles={{ start: " ", end: " " }}
      borderColor="redBright"
    >
      <Text>Content</Text>
    </TitledBox>
  </Box>
);
