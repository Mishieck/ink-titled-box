import { Text } from "ink";
import type { TopBorder } from "./data";
import type { TitleStyles } from "../data";

export type TopBorderProps = TopBorder;
export type StyledTitleProps = { content: string; styles: TitleStyles };
export type StyledTitleEdgeProps = { children: string };

export const TopBorderUi: React.FC<TopBorderProps> = props => {
  const { fragments, color, dimColor, isVisible, titleStyles } = props;

  return isVisible ? (
    <Text color={color} dimColor={dimColor}>
      {
        fragments.map(
          ({ isTitle, content }, i) => isTitle && titleStyles
            ? (
              <StyledTitle
                key={i}
                content={content.trim()}
                styles={titleStyles}
              />
            )
            : <Text key={i}>{content}</Text>
        )
      }
    </Text>
  )
    : null;
};

export const StyledTitle: React.FC<StyledTitleProps> = ({ content, styles }) => (
  <>
    <StyledTitleEdge>{styles.start}</StyledTitleEdge>
    <Text inverse>{content}</Text>
    <StyledTitleEdge>{styles.end}</StyledTitleEdge>
  </>
);

export const StyledTitleEdge: React.FC<StyledTitleEdgeProps> = ({ children }) => (
  <Text inverse={children === " "}>{children}</Text>
);
