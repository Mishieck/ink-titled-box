import type React from "react";
import { TitledBox } from "../main";
import { Box, Text } from "ink";

export const TextOnly: React.FC = () => (
  <Box>
    <TitledBox titles={["text"]} borderStyle="single">
      <Text>A demo to see if the text is going to push the border.</Text>
    </TitledBox>
  </Box>
);

