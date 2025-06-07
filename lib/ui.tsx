import { Box, type DOMElement, measureElement, Text, type BoxProps } from "ink";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { type BorderStyle, type Size, type TitledBoxData, type TitleJustify } from "./data";
import { TitledBoxApi } from "./object";

export type TitledBoxProps = Omit<BoxProps, 'borderStyle' | 'children'> & {
  titles: Array<string>;
  titleJustify?: TitleJustify,
  borderStyle: BorderStyle;
  children: React.ReactElement;
};

export const TitledBox: React.FC<TitledBoxProps> = props => {
  const {
    titles,
    borderStyle,
    children,
    padding,
    width,
    height,
    titleJustify,
    ...boxProps
  } = props;

  const boxRef = useRef<DOMElement>(null);

  const size: Size = {
    height: typeof height === 'number' ? height : 0,
    width: typeof width === 'number' ? width : 0
  };

  const box = useMemo(
    () => new TitledBoxApi({ size, style: borderStyle, titles, titleJustify }),
    []
  );

  const [data, setData] = useState<TitledBoxData>(box);
  const { borders } = data;
  const { bottom, left, right, top } = borders;

  useEffect(
    () => {
      if (!boxRef.current) return
      box.size = measureElement(boxRef.current);
      setData(box.toJSON());
    },
    [boxRef.current]
  );

  return (
    <Box ref={boxRef} flexDirection="column" {...boxProps}>
      <Text>{top}</Text>
      <Box>
        <Box>
          <Text>{left}</Text>
        </Box>
        <Box flexGrow={1} padding={padding}>{children}</Box>
        <Text>{right}</Text>
      </Box>
      <Text>{bottom}</Text>
    </Box>
  );
};

