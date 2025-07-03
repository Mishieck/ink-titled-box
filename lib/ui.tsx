import { Box, type DOMElement, measureElement } from "ink";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Size, TitledBoxData } from "./data";
import { TitledBoxApi } from "./object";
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
  } = innerBoxProps;

  const {
    titles,
    borderStyle,
    titleJustify,
    titleStyles,
    ...outerBoxProps
  } = getOuterBoxProps(props);

  const { height, width } = outerBoxProps;

  const size: Size = {
    height: typeof height === "number" ? height : 0,
    width: typeof width === "number" ? width : 0
  };

  const box = useMemo(
    () => new TitledBoxApi({
      borderVisibility: {
        top: borderTop!,
        right: borderRight!,
        bottom: borderBottom!,
        left: borderLeft!,
      },
      size,
      style: borderStyle,
      titles,
      topBorder: {
        center: '',
        color: borderBottomColor ?? borderColor,
        dimColor: borderBottomDimColor ?? borderDimColor,
        isVisible: borderBottom!
      },
      titleJustify,
      titleStyles
    }),
    []
  );

  const [data, setData] = useState<TitledBoxData>(box);
  const { topBorderData } = data;

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
      <Box
        borderStyle={borderStyle}
        borderLeft={borderLeft}
        borderColor={borderColor}
        borderRight={borderRight}
        borderBottom={borderBottom}
        borderDimColor={borderDimColor}
        borderTopColor={borderTopColor}
        borderLeftColor={borderLeftColor}
        borderRightColor={borderRightColor}
        borderBottomColor={borderBottomColor}
        borderTopDimColor={borderTopDimColor}
        borderLeftDimColor={borderLeftDimColor}
        borderRightDimColor={borderRightDimColor}
        borderBottomDimColor={borderBottomDimColor}
        flexGrow={1}
        {...innerBoxProps}
        borderTop={false}
      ></Box>
    </Box>
  );
};
