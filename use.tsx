import { render, Text } from "ink";
import { TitledBox } from "./dist/main";

render(
  <TitledBox borderStyle="single" titles={['test']}>
    <Text>TitledBox</Text>
  </TitledBox>
);
