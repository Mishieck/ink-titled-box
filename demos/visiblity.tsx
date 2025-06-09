import type React from "react";
import { TitledBox, type BorderPosition, type TitleJustify } from "../main";
import { Box, Text } from "ink";
import { capitalize } from "./utils";

const borderPositions: Array<BorderPosition> =
  ['bottom', 'left', 'right', 'top'];

type BorderFlags = Partial<
  Record<`border${Capitalize<BorderPosition>}`, boolean>
>;

export const Visibility: React.FC = () => (
  <Box width={81} padding={2} flexDirection="column" gap={1}>
    {
      borderPositions.map(position => (
        <TitledBox
          key={position}
          titles={['Left', 'Center', 'Right']}
          borderStyle="single"
          {...createBorderFlags(position)}
        >
          <Text>Without {position} border</Text>
        </TitledBox>
      ))
    }
  </Box>
);

const createBorderFlags = (missingBorder: BorderPosition): BorderFlags => ({
  [`border${capitalize(missingBorder)}`]: false
});
