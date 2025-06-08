import { Box, type DOMElement, measureElement, type BoxProps } from "ink";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Size, TitledBoxData } from "./data";
import { TitledBoxApi } from "./object";
import { Border } from "./border";
import {
  getOuterBoxProps,
  getInnerBoxProps,
  type TitledBoxProps
} from "./utils";

export const TitledBox: React.FC<TitledBoxProps> = props => {
  const boxRef = useRef<DOMElement>(null);
  const innerBoxProps = getInnerBoxProps(props);

  const {
    titles,
    borderStyle,
    titleJustify,

    borderTop,
    borderLeft,
    borderColor,
    borderRight,
    borderBottom,
    borderDimColor,
    borderTopColor,
    borderLeftColor,
    borderRightColor,
    borderBottomColor,
    borderTopDimColor,
    borderLeftDimColor,
    borderRightDimColor,
    borderBottomDimColor,

    ...outerBoxProps
  } = getOuterBoxProps(props);

  const { height, width } = outerBoxProps;

  const size: Size = {
    height: typeof height === "number" ? height : 0,
    width: typeof width === "number" ? width : 0
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
    <Box ref={boxRef} flexDirection="column" {...outerBoxProps}>
      <Border
        content={top}
        color={borderTopColor ?? borderColor}
        dimColor={borderTopDimColor}
        show={borderTop}
      />
      <Box>
        <Border
          content={left}
          color={borderLeftColor ?? borderColor}
          dimColor={borderLeftDimColor}
          show={borderLeft}
        />
        <Box flexGrow={1} {...innerBoxProps}></Box>
        <Border
          content={right}
          color={borderRightColor ?? borderColor}
          dimColor={borderRightDimColor}
          show={borderRight}
        />
      </Box>
      <Border
        content={bottom}
        color={borderBottomColor ?? borderColor}
        dimColor={borderBottomDimColor}
        show={borderBottom}
      />
    </Box>
  );
};
