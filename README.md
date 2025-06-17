# ink-titled-box

A component for using titled borders in [Ink](
https://github.com/vadimdemedes/ink). It is an extension of the `Box` component
of Ink.

## Installation

The library uses the peer dependencies `react` and `ink`.

### NPM

```sh
npm i @mishieck/ink-titled-box
```

### Bun

```sh
bun add @mishieck/ink-titled-box
```

## Features

### Border Styles

![Border Styles](https://github.com/user-attachments/assets/6b255c42-114c-4cfb-bf6f-86ce6b97b787)

> Note: Arrow borders do not work with the titles.

### Positions

![Positions](https://github.com/user-attachments/assets/ee045f02-416d-4c6f-8b22-f07d04cbe6c7)

### Title Styles

![Title Styles](https://github.com/user-attachments/assets/2adcb300-8626-4013-8d08-a272a0faaa1a)

### Colors

![Image](https://github.com/user-attachments/assets/1a5a6836-f20d-4b77-8445-ac09b97bcd33)

## Props

### borderStyle

This is the same as that in Ink, except it is required.

### titles

An array of titles for the border.

### titleStyles

The styles of titles as shown in [Title Styles](#title-styles). Without styles,
the titles have a transparent background and padded on both ends with a space.
The value is an object with the following properties:

- `start`: the character before the title. 
- `end`: the character after the title.

The library provides some title styles through the export `titleStyles`. You can
create your own in addition to those. You can use the provided styles as
follows:

```tsx
import React from "react";
import {TitledBox, titleStyles} from "@mishieck/ink-titled-box";

const Demo: React.FC = () => (
    <TitledBox
        borderStyle="single"
        titles={["Demo"]}
        titleStyles={titleStyles.rectangle}
    />
);
```

> Note: apart from `titleStyles.rectangle`, all other styles use 
> [Nerd Fonts](https://www.nerdfonts.com). So, if you do not have Nerd Fonts
> installed, you will not get the expected results.
