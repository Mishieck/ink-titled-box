import type React from "react";
import { borderCharacters, TitledBox, type BorderStyle } from "../main";
import { Box, Text } from "ink";
import { capitalize } from "./utils";

const borderStyleNames = Object.keys(borderCharacters) as Array<BorderStyle>;

export const Styles: React.FC = () => (
  <Box flexDirection="column" gap={0}>
    {
      borderStyleNames.map(name => (
        <TitledBox
          key={name}
          titles={[capitalize(name)]}
          borderStyle={name}
        >
          <Text>{capitalize(name)} Border</Text>
        </TitledBox>
      ))
    }
  </Box>
);

