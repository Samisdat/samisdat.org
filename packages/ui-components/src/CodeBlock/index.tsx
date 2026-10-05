import { useShikiHighlighter } from "react-shiki";
import { shikiTheme } from "../utils/shikiTheme";

export const CodeBlock = ({
  code,
  language,
}: {
  code: string;
  language: "jsx" | "tsx" | "css" | "json";
}) => {
  const highlightedCode = useShikiHighlighter(code, language, shikiTheme);

  return <figure>{highlightedCode}</figure>;
};
