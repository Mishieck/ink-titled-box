import { render, Text } from "ink";
import { Styles } from "./demos/styles";
import { Justify } from "./demos/justify";
import { Visibility } from "./demos/visiblity";
import { TitleStylesUi } from "./demos/title-styles";
import { Colors } from "./demos/colors";
import { TextOnly } from "./demos/text";

const demos = {
  colors: Colors,
  justify: Justify,
  styles: Styles,
  visibility: Visibility,
  text: TextOnly,
  'title-styles': TitleStylesUi
};

const demo = process.argv[2];

const possibleArguments = Object
  .keys(demos)
  .map(name => `'${name}'`).join(', ');

const MissingArg: React.FC = () => (
  <Text color='red'>
    Demo argument not specified. Possible arguments are: {possibleArguments}
  </Text>
);

const InvalidArg: React.FC = () => (
  <Text color='red'>
    Argument '{demo}' is not valid! Correct argument should have one of the
    following values: {possibleArguments}.
  </Text>
);

const selectComponent = (demo?: string) => {
  if (typeof demo === 'undefined') return MissingArg;
  if (demo in demos) return demos[demo as keyof typeof demos];
  return InvalidArg;
};

const Component = selectComponent(demo);
render(<Component />);
