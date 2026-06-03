import { useShikiHighlighter } from "react-shiki";
import { getTextMateColorSchema } from "../utils/getTextMateColorSchema";

export const CodeBlock = ({
  code,
  language,
}: {
  code: string;
  language: "jsx" | "tsx" | "css";
}) => {
  const theme = getTextMateColorSchema("dark");

  const highlightedCode = useShikiHighlighter(code, language, theme);

  return <figure>{highlightedCode}</figure>;
};
