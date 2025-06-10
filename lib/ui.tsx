import { Box, type DOMElement, measureElement } from "ink";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Borders, Size, TitledBoxData } from "./data";
import { TitledBoxApi } from "./object";
import { BorderUi } from "./border";
import {
  getOuterBoxProps,
  getInnerBoxProps,
  type TitledBoxProps
} from "./utils";
import { TopBorderUi } from "./top-border/ui";

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

    titleStyles,
    ...outerBoxProps
  } = getOuterBoxProps(props);

  const initialBorders: Borders = {
    bottom: {
      center: '',
      color: borderBottomColor ?? borderColor,
      dimColor: borderBottomDimColor ?? borderDimColor,
      isVisible: borderBottom!
    },
    left: {
      center: '',
      color: borderLeftColor ?? borderColor,
      dimColor: borderLeftDimColor ?? borderDimColor,
      isVisible: borderLeft!
    },
    right: {
      center: '',
      color: borderRightColor ?? borderColor,
      dimColor: borderRightDimColor ?? borderDimColor,
      isVisible: borderRight!
    },
    top: {
      center: '',
      color: borderTopColor ?? borderColor,
      dimColor: borderTopDimColor ?? borderDimColor,
      isVisible: borderTop!
    },
  };

  const { height, width } = outerBoxProps;

  const size: Size = {
    height: typeof height === "number" ? height : 0,
    width: typeof width === "number" ? width : 0
  };

  const box = useMemo(
    () => new TitledBoxApi({
      borders: initialBorders,
      size,
      style: borderStyle,
      titles,
      titleJustify,
      titleStyles
    }),
    []
  );

  const [data, setData] = useState<TitledBoxData>(box);
  const { borders, topBorderData } = data;

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
      <TopBorderUi {...topBorderData} />
      <Box>
        <BorderUi {...borders.left} />
        <Box flexGrow={1} {...innerBoxProps}></Box>
        <BorderUi {...borders.right} />
      </Box>
      <BorderUi {...borders.bottom} />
    </Box>
  );
};
