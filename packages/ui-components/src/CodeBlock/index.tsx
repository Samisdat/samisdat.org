import { useShikiHighlighter } from "react-shiki";

import theme from "./samisdat-color-theme.json";

console.log(theme);

export const CodeBlock = ({ code, language }) => {
  const highlightedCode = useShikiHighlighter(code, language, theme);

  return <figure>{highlightedCode}</figure>;
};
