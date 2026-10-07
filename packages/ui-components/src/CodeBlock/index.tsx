import { styled } from "@linaria/react";
import { useShikiHighlighter } from "react-shiki";
import { shikiTheme, styledGrammarLangs } from "../utils/shikiTheme";

const Figure = styled.figure`
  border: var(--border-width-default) solid var(--color-surface-muted);
  border-radius: var(--border-radius-none);

  & pre {
    background: var(--color-surface-default);
  }
`;

export const CodeBlock = ({
  code,
  language,
}: {
  code: string;
  language: "html" | "css" | "js" | "ts" | "jsx" | "tsx" | "json";
}) => {
  const highlightedCode = useShikiHighlighter(code, language, shikiTheme, {
    customLanguages: styledGrammarLangs,
  });

  return <Figure>{highlightedCode}</Figure>;
};
