import type React from "react";
import { borderCharacters, TitledBox, type BorderStyle } from "../main";
import { Box, Text } from "ink";
import { capitalize } from "./utils";

const borderStyleNames = Object.keys(borderCharacters) as Array<BorderStyle>;

export const Styles: React.FC = () => (
  <Box width={60} padding={2} flexDirection="column" gap={1}>
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

