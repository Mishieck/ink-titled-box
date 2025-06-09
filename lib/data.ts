import type { BoxProps } from "ink";
import type { BorderData } from "./border";

export type Size = {
  width: number;
  height: number;
};

export type BorderStyle =
  | 'arrow'
  | 'bold'
  | 'classic'
  | 'double'
  | 'doubleSingle'
  | 'round'
  | 'single'
  | 'singleDouble';

export type BorderCharacterPosition =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'rightCenter'
  | 'bottomRight'
  | 'bottomCenter'
  | 'bottomLeft'
  | 'leftCenter'

export type BorderCharacters = Record<
  BorderCharacterPosition,
  string
>;

export type TitleJustify = NonNullable<BoxProps['justifyContent']>;
export type Widths = { border: number, title: number; }

const arrow: BorderCharacters = {
  topLeft: '↘',
  topCenter: '↓',
  topRight: '↙',
  rightCenter: '←',
  bottomRight: '↖',
  bottomCenter: '↑',
  bottomLeft: '↗',
  leftCenter: '→',
};

const bold: BorderCharacters = {
  topLeft: '┏',
  topCenter: '━',
  topRight: '┓',
  rightCenter: '┃',
  bottomRight: '┛',
  bottomCenter: '━',
  bottomLeft: '┗',
  leftCenter: '┃',
};

const classic: BorderCharacters = {
  topLeft: '+',
  topCenter: '-',
  topRight: '+',
  rightCenter: '|',
  bottomRight: '+',
  bottomCenter: '-',
  bottomLeft: '+',
  leftCenter: '|',
};

const double: BorderCharacters = {
  topLeft: '╔',
  topCenter: '═',
  topRight: '╗',
  rightCenter: '║',
  bottomRight: '╝',
  bottomCenter: '═',
  bottomLeft: '╚',
  leftCenter: '║',
};

const doubleSingle: BorderCharacters = {
  topLeft: '╒',
  topCenter: '═',
  topRight: '╕',
  rightCenter: '│',
  bottomRight: '╛',
  bottomCenter: '═',
  bottomLeft: '╘',
  leftCenter: '│',
};

const round: BorderCharacters = {
  topLeft: '╭',
  topCenter: '─',
  topRight: '╮',
  rightCenter: '│',
  bottomRight: '╯',
  bottomCenter: '─',
  bottomLeft: '╰',
  leftCenter: '│',
};

const single: BorderCharacters = {
  topLeft: '┌',
  topCenter: '─',
  topRight: '┐',
  rightCenter: '│',
  bottomRight: '┘',
  bottomCenter: '─',
  bottomLeft: '└',
  leftCenter: '│',
};

const singleDouble: BorderCharacters = {
  topLeft: '╓',
  topCenter: '─',
  topRight: '╖',
  rightCenter: '║',
  bottomRight: '╜',
  bottomCenter: '─',
  bottomLeft: '╙',
  leftCenter: '║',
};

export const borderCharacters: Record<BorderStyle, BorderCharacters> = {
  arrow,
  bold,
  classic,
  double,
  doubleSingle,
  round,
  single,
  singleDouble
};

export type BorderPosition = 'bottom' | 'left' | 'right' | 'top';
export type Borders = Record<BorderPosition, BorderData>;
export type CrossAxisBorderVisibilities = [start: boolean, end: boolean];

export type TitledBoxOptions =
  & Omit<TitledBoxData, 'titleJustify'>
  & Partial<Pick<TitledBoxData, 'titleJustify'>>;

export type TitledBoxData = {
  size: Size;
  style: BorderStyle;
  titles: Array<string>;
  titleJustify: TitleJustify;
  borders: Borders;
};

