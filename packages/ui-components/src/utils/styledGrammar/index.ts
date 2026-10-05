/**
 * Shiki injection grammars for CSS-in-JS (styled-components / @linaria/react).
 *
 * Source: vscode-styled-components (MIT)
 * Copyright (c) 2016 Graham Clark, Julien Poissonnier, 2018 GitHub, Tobias Zimmermann
 * https://github.com/styled-components/vscode-styled-components/blob/main/LICENSE
 *
 * Load both grammars when creating a Shiki highlighter so that CSS inside
 * styled`` and css`` template literals is highlighted with syntax.* colours:
 *
 *   styled.div`color: red;`          → CSS property + value highlighted
 *   const s = css`font-size: 1rem;`  → same
 */
import type { LanguageRegistration } from "shiki";
import cssStyled from "./css.styled.json";
import styledComponents from "./styled-components.json";

export const styledGrammarLangs: LanguageRegistration[] = [
  cssStyled as unknown as LanguageRegistration,
  styledComponents as unknown as LanguageRegistration,
];
