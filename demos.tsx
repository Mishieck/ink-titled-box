import { render, Text } from "ink";
import { Styles } from "./demos/styles";

const demos = {
  styles: Styles,
  justify: () => <></>,
};

const demo = process.argv[2];

const MissingArg: React.FC = () => (
  <Text color='red'>Demo argument not specified.</Text>
);

const InvalidArg: React.FC = () => (
  <Text color='red'>
    Argument '{demo}' is not valid! Correct argument should have one of the
    following values: {Object.keys(demos).map(name => `'${name}'`).join(', ')}.
  </Text>
);

const selectComponent = (demo?: string) => {
  if (typeof demo === 'undefined') return MissingArg;
  if (demo in demos) return demos[demo as keyof typeof demos];
  return InvalidArg;
};

const Component = selectComponent(demo);
render(<Component />);
