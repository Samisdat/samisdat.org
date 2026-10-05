import { useShikiHighlighter } from "react-shiki";
import { shikiTheme, styledGrammarLangs } from "../utils/shikiTheme";

export const CodeBlock = ({
  code,
  language,
}: {
  code: string;
  language: "jsx" | "tsx" | "css" | "json";
}) => {
  const highlightedCode = useShikiHighlighter(code, language, shikiTheme, {
    customLanguages: styledGrammarLangs,
  });

  return <figure>{highlightedCode}</figure>;
};
