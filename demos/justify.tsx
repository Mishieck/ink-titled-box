import type React from "react";
import { TitledBox, type TitleJustify } from "../main";
import { Box, Text } from "ink";

const titleJustifyValues: Array<TitleJustify> = [
  "flex-start",
  "flex-end",
  "space-between",
  "space-around",
  "space-evenly",
  "center"
];

export const Justify: React.FC = () => (
  <Box flexDirection="column" gap={0}>
    {
      titleJustifyValues.map(name => (
        <TitledBox
          key={name}
          titles={['Left', 'Center', 'Right']}
          titleJustify={name}
          borderStyle='single'
        >
          <Text>{name}</Text>
        </TitledBox>
      ))
    }
  </Box>
);

const capitalize = (str: string) => `${str[0]?.toUpperCase()}${str.slice(1)}`;
