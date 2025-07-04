// lib/data.ts
var arrow = {
  topLeft: "↘",
  topCenter: "↓",
  topRight: "↙",
  rightCenter: "←",
  bottomRight: "↖",
  bottomCenter: "↑",
  bottomLeft: "↗",
  leftCenter: "→"
};
var bold = {
  topLeft: "┏",
  topCenter: "━",
  topRight: "┓",
  rightCenter: "┃",
  bottomRight: "┛",
  bottomCenter: "━",
  bottomLeft: "┗",
  leftCenter: "┃"
};
var classic = {
  topLeft: "+",
  topCenter: "-",
  topRight: "+",
  rightCenter: "|",
  bottomRight: "+",
  bottomCenter: "-",
  bottomLeft: "+",
  leftCenter: "|"
};
var double = {
  topLeft: "╔",
  topCenter: "═",
  topRight: "╗",
  rightCenter: "║",
  bottomRight: "╝",
  bottomCenter: "═",
  bottomLeft: "╚",
  leftCenter: "║"
};
var doubleSingle = {
  topLeft: "╒",
  topCenter: "═",
  topRight: "╕",
  rightCenter: "│",
  bottomRight: "╛",
  bottomCenter: "═",
  bottomLeft: "╘",
  leftCenter: "│"
};
var round = {
  topLeft: "╭",
  topCenter: "─",
  topRight: "╮",
  rightCenter: "│",
  bottomRight: "╯",
  bottomCenter: "─",
  bottomLeft: "╰",
  leftCenter: "│"
};
var single = {
  topLeft: "┌",
  topCenter: "─",
  topRight: "┐",
  rightCenter: "│",
  bottomRight: "┘",
  bottomCenter: "─",
  bottomLeft: "└",
  leftCenter: "│"
};
var singleDouble = {
  topLeft: "╓",
  topCenter: "─",
  topRight: "╖",
  rightCenter: "║",
  bottomRight: "╜",
  bottomCenter: "─",
  bottomLeft: "╙",
  leftCenter: "║"
};
var borderCharacters = {
  arrow,
  bold,
  classic,
  double,
  doubleSingle,
  round,
  single,
  singleDouble
};
var titleStyles = {
  rectangle: { start: " ", end: " " },
  pill: { start: "", end: "" },
  hexagon: { start: "", end: "" }
};
// lib/utils.ts
var innerBoxPropNames = [
  "children",
  "flexDirection",
  "flexWrap",
  "justifyContent",
  "alignItems",
  "borderTop",
  "borderLeft",
  "borderColor",
  "borderRight",
  "borderBottom",
  "borderDimColor",
  "borderTopColor",
  "borderLeftColor",
  "borderRightColor",
  "borderBottomColor",
  "borderTopDimColor",
  "borderLeftDimColor",
  "borderRightDimColor",
  "borderBottomDimColor",
  "padding",
  "paddingLeft",
  "paddingY",
  "paddingX",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "gap",
  "rowGap",
  "columnGap",
  "display"
];
var TITLE_PADDING = 2;
var TOP_CORNER_LENGTH = 2;
var getInnerBoxProps = (props) => {
  const innerBoxProps = innerBoxPropNames.reduce((innerBoxProps2, name) => ({ ...innerBoxProps2, [name]: props[name] }), {});
  if (!innerBoxProps.display)
    Object.assign(innerBoxProps, { display: "flex" });
  return setBorderFlags(innerBoxProps);
};
var borderFlagNames = [
  "borderBottom",
  "borderLeft",
  "borderRight",
  "borderTop"
];
var getOuterBoxProps = (props) => {
  const outerBoxProps = Object.keys(props).filter(isOuterBoxPropName).reduce((outerBoxProps2, name) => ({ ...outerBoxProps2, [name]: props[name] }), {});
  return setBorderFlags(outerBoxProps);
};
var isOuterBoxPropName = (name) => !innerBoxPropNames.includes(name) || borderFlagNames.includes(name);
var setBorderFlags = (record) => {
  for (const name of borderFlagNames) {
    if (typeof record[name] === "undefined")
      record[name] = true;
  }
  return record;
};
var shiftPositions = (positions, shiftCount) => {
  const shiftPosition = Math.ceil((positions.length - shiftCount) / 2);
  let remainingSpaces = shiftCount;
  while (remainingSpaces) {
    for (let i = shiftPosition;i < positions.length; i++)
      positions[i]++;
    remainingSpaces--;
  }
  return positions;
};
var getTopBorderData = (topBorder, titlePositions, visibleTitles, titleStyles2) => {
  const { center, color, dimColor, end, isVisible, start } = topBorder;
  let currentPosition = 0;
  const fragments = [];
  if (start)
    fragments.push({ content: start, isTitle: false });
  const positions = titlePositions;
  positions.forEach((position, i) => {
    if (position > currentPosition) {
      fragments.push({ content: center.slice(currentPosition, position), isTitle: false });
    }
    const nextPosition = position + visibleTitles[i].length + 2;
    fragments.push({
      content: center.slice(position, nextPosition),
      isTitle: true
    });
    currentPosition = nextPosition;
  });
  fragments.push({
    content: center.slice(currentPosition, center.length),
    isTitle: false
  });
  if (end)
    fragments.push({ content: end, isTitle: false });
  return {
    color,
    dimColor,
    fragments,
    isVisible,
    titleStyles: titleStyles2
  };
};
var getPositions = (titles, startPosition, spaceLength, shiftCount) => {
  let positions = [];
  let position = startPosition;
  for (const title of titles) {
    positions.push(position);
    position += title.length + TITLE_PADDING + spaceLength;
  }
  if (shiftCount)
    positions = shiftPositions(positions, shiftCount);
  return positions;
};
var subtractEdgeBorders = (length, visibilities) => {
  for (const isVisible of visibilities)
    if (isVisible)
      length--;
  return length;
};
var getStartTitlePositions = (titles) => {
  const positions = [];
  let position = 0;
  titles.forEach((title, i) => {
    positions.push(position);
    position += title.length + 3;
  });
  return positions;
};
var getEndTitlePositions = (startTitlePositions, width, totalTitleLength) => {
  const startPositions = startTitlePositions;
  if (!startPositions.length)
    return startPositions;
  const gapLength = startPositions.length - 1;
  const padding = width - totalTitleLength - gapLength - TOP_CORNER_LENGTH;
  return startPositions.map((position) => position + padding);
};
var getSpaceAroundTitlePositions = (visibleTitles, width, totalTitleLength) => {
  const edgeSpaceCount = 2;
  const edgeSpaceFraction = edgeSpaceCount;
  const inBetweenSpaceCount = visibleTitles.length - 1;
  const inBetweenSpaceFraction = inBetweenSpaceCount * 2;
  const totalSpaceFraction = edgeSpaceFraction + inBetweenSpaceFraction;
  const totalSpaceLength = width - totalTitleLength - 2;
  const edgeSpaceLength = Math.floor(edgeSpaceFraction / totalSpaceFraction * totalSpaceLength / edgeSpaceCount);
  const inBetweenSpaceLength = Math.floor(inBetweenSpaceFraction / totalSpaceFraction * totalSpaceLength / inBetweenSpaceCount);
  return getSpacedTitlePositions({
    visibleTitles,
    width,
    totalTitleLength,
    edgeSpace: edgeSpaceLength,
    inBetweenSpace: inBetweenSpaceLength
  });
};
var getSpacedTitlePositions = (data) => {
  const {
    visibleTitles,
    width,
    totalTitleLength,
    edgeSpace,
    inBetweenSpace
  } = data;
  const edgeSpaceCount = 2;
  const inBetweenSpaceCount = visibleTitles.length - 1;
  const totalSpaceLength = width - totalTitleLength - 2;
  const remainderSpace = totalSpaceLength - (edgeSpace * edgeSpaceCount + inBetweenSpace * inBetweenSpaceCount);
  let positions = getPositions(visibleTitles, edgeSpace, inBetweenSpace, remainderSpace);
  return positions;
};
var getCenterTitlePositions = (startTitlePositions, width, totalTitleLength) => {
  const startPositions = startTitlePositions;
  if (!startPositions.length)
    return startPositions;
  const gapLength = startPositions.length - 1;
  const padding = width - totalTitleLength - gapLength - TOP_CORNER_LENGTH;
  const halfPadding = Math.floor(padding / 2);
  return startPositions.map((position) => position + halfPadding);
};

// lib/object.ts
class TitledBoxApi {
  static characters = borderCharacters;
  static TITLE_PADDING = TITLE_PADDING;
  static TOP_CORNER_LENGTH = TOP_CORNER_LENGTH;
  static TITLE_GAP = 1;
  style;
  size;
  titles;
  titleJustify;
  titleStyles;
  #topBorder;
  borderVisibility;
  constructor(options) {
    const {
      borderVisibility,
      topBorder,
      size,
      style,
      titles,
      titleJustify,
      titleStyles: titleStyles2
    } = options;
    this.size = size;
    this.style = style;
    this.titles = titles;
    this.titleJustify = titleJustify ?? "flex-start";
    this.titleStyles = titleStyles2;
    this.borderVisibility = borderVisibility;
    this.#topBorder = topBorder;
  }
  get visibleTitleCount() {
    let count = 0;
    let length = TitledBoxApi.TOP_CORNER_LENGTH;
    while (count < this.titles.length) {
      const title = this.titles[count];
      length += title.length + TitledBoxApi.TITLE_PADDING;
      if (count > 0)
        length += TitledBoxApi.TITLE_GAP;
      if (length < this.size.width)
        count++;
      else
        break;
    }
    return count;
  }
  get visibleTitles() {
    return this.titles.slice(0, this.visibleTitleCount);
  }
  get characters() {
    return TitledBoxApi.characters[this.style];
  }
  get emptyBorder() {
    return { center: "", isVisible: false };
  }
  get topBorder() {
    const length = subtractEdgeBorders(this.size.width, [this.borderVisibility.left, this.borderVisibility.right]);
    if (length < 2)
      return this.emptyBorder;
    const { topLeft, topCenter, topRight } = this.characters;
    const centerCharacters = new Array(length).fill(topCenter);
    this.titlePositions.forEach((position, i) => {
      const paddedTitleLength = this.titles[i].length + 2;
      const paddedTitle = ` ${this.titles[i]} `.split("");
      centerCharacters.splice(position, paddedTitleLength, ...paddedTitle);
    });
    return {
      ...this.#topBorder,
      center: centerCharacters.join(""),
      end: this.borderVisibility.right ? topRight : undefined,
      start: this.borderVisibility.left ? topLeft : undefined
    };
  }
  get topBorderData() {
    return getTopBorderData(this.topBorder, this.titlePositions, this.visibleTitles, this.titleStyles);
  }
  get titlePositions() {
    switch (this.titleJustify) {
      case "flex-start":
        return this.startTitlePositions;
      case "flex-end":
        return this.endTitlePositions;
      case "space-between":
        return this.spaceBetweenTitlePositions;
      case "space-around":
        return this.spaceAroundTitlePositions;
      case "space-evenly":
        return this.spaceEvenlyTitlePositions;
      case "center":
        return this.centerTitlePositions;
    }
  }
  get totalTitleLength() {
    return this.visibleTitles.reduce((length, title) => length + title.length + TitledBoxApi.TITLE_PADDING, 0);
  }
  get startTitlePositions() {
    return getStartTitlePositions(this.visibleTitles);
  }
  get endTitlePositions() {
    return getEndTitlePositions(this.startTitlePositions, this.size.width, this.totalTitleLength);
  }
  get spaceBetweenTitlePositions() {
    return this.getEvenlySpacedTitlePositions(-1);
  }
  get spaceAroundTitlePositions() {
    return getSpaceAroundTitlePositions(this.visibleTitles, this.size.width, this.totalTitleLength);
  }
  get spaceEvenlyTitlePositions() {
    return this.getEvenlySpacedTitlePositions(1, true);
  }
  getEvenlySpacedTitlePositions(spaceCountAdjustment, startWidthSpace = false) {
    const visibleTitles = this.visibleTitles;
    const spaceCount = visibleTitles.length + spaceCountAdjustment;
    const totalSpaceLength = this.size.width - this.totalTitleLength - 2;
    const spaceLength = Math.floor(totalSpaceLength / spaceCount);
    return getSpacedTitlePositions({
      visibleTitles,
      width: this.size.width,
      totalTitleLength: this.totalTitleLength,
      edgeSpace: startWidthSpace ? spaceLength : 0,
      inBetweenSpace: spaceLength
    });
  }
  get centerTitlePositions() {
    return getCenterTitlePositions(this.startTitlePositions, this.size.width, this.totalTitleLength);
  }
  toJSON() {
    const {
      size,
      style,
      titles,
      titleJustify,
      topBorderData,
      borderVisibility
    } = this;
    return {
      size,
      style,
      titles,
      titleJustify,
      topBorderData,
      borderVisibility
    };
  }
}
// lib/top-border/ui.tsx
import { Text } from "ink";
import { jsxDEV, Fragment } from "react/jsx-dev-runtime";
var TopBorderUi = (props) => {
  const { fragments, color, dimColor, isVisible, titleStyles: titleStyles2 } = props;
  return isVisible ? /* @__PURE__ */ jsxDEV(Text, {
    color,
    dimColor,
    children: fragments.map(({ isTitle, content }, i) => isTitle && titleStyles2 ? /* @__PURE__ */ jsxDEV(StyledTitle, {
      content: content.trim(),
      styles: titleStyles2
    }, i, false, undefined, this) : /* @__PURE__ */ jsxDEV(Text, {
      children: content
    }, i, false, undefined, this))
  }, undefined, false, undefined, this) : null;
};
var StyledTitle = ({ content, styles }) => /* @__PURE__ */ jsxDEV(Fragment, {
  children: [
    /* @__PURE__ */ jsxDEV(StyledTitleEdge, {
      children: styles.start
    }, undefined, false, undefined, this),
    /* @__PURE__ */ jsxDEV(Text, {
      inverse: true,
      children: content
    }, undefined, false, undefined, this),
    /* @__PURE__ */ jsxDEV(StyledTitleEdge, {
      children: styles.end
    }, undefined, false, undefined, this)
  ]
}, undefined, true, undefined, this);
var StyledTitleEdge = ({ children }) => /* @__PURE__ */ jsxDEV(Text, {
  inverse: children === " ",
  children
}, undefined, false, undefined, this);
// lib/ui.tsx
import { Box, measureElement } from "ink";
import { useEffect, useMemo, useRef, useState } from "react";
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
var TitledBox = (props) => {
  const boxRef = useRef(null);
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
    borderBottomDimColor
  } = innerBoxProps;
  const {
    titles,
    borderStyle,
    titleJustify,
    titleStyles: titleStyles2,
    ...outerBoxProps
  } = getOuterBoxProps(props);
  const { height, width } = outerBoxProps;
  const size = {
    height: typeof height === "number" ? height : 0,
    width: typeof width === "number" ? width : 0
  };
  const box = useMemo(() => new TitledBoxApi({
    borderVisibility: {
      top: borderTop,
      right: borderRight,
      bottom: borderBottom,
      left: borderLeft
    },
    size,
    style: borderStyle,
    titles,
    topBorder: {
      center: "",
      color: borderBottomColor ?? borderColor,
      dimColor: borderBottomDimColor ?? borderDimColor,
      isVisible: borderBottom
    },
    titleJustify,
    titleStyles: titleStyles2
  }), []);
  const [data2, setData] = useState(box);
  const { topBorderData } = data2;
  useEffect(() => {
    if (!boxRef.current)
      return;
    box.size = measureElement(boxRef.current);
    setData(box.toJSON());
  }, [boxRef.current]);
  return /* @__PURE__ */ jsxDEV2(Box, {
    ref: boxRef,
    flexDirection: "column",
    ...outerBoxProps,
    children: [
      /* @__PURE__ */ jsxDEV2(TopBorderUi, {
        ...topBorderData
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV2(Box, {
        borderStyle,
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
        flexGrow: 1,
        ...innerBoxProps,
        borderTop: false
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
export {
  titleStyles,
  subtractEdgeBorders,
  shiftPositions,
  setBorderFlags,
  isOuterBoxPropName,
  innerBoxPropNames,
  getTopBorderData,
  getStartTitlePositions,
  getSpacedTitlePositions,
  getSpaceAroundTitlePositions,
  getPositions,
  getOuterBoxProps,
  getInnerBoxProps,
  getEndTitlePositions,
  getCenterTitlePositions,
  borderCharacters,
  TopBorderUi,
  TitledBoxApi,
  TitledBox,
  TOP_CORNER_LENGTH,
  TITLE_PADDING,
  StyledTitleEdge,
  StyledTitle
};
