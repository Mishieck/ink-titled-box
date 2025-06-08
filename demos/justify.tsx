import type React from "react";
import { TitledBox, type TitleJustify } from "../main";
import { Box, Text } from "ink";

const titleJustifyValues: Array<TitleJustify> = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
  "space-evenly",
];

export const Justify: React.FC = () => (
  <Box width={81} padding={2} flexDirection="column" gap={1}>
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
