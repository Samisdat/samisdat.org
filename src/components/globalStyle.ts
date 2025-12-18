import "normalize.css";
import { css } from "@linaria/core";

export const globalStyles = css`
  :global() {
    :root {
      --backgroundColor: #2a1f31;
      --mainTextColor: #d3cbc6;
      --typo-h1-size: 3rem;
      --typo-h2-size: 2.75rem;
      --typo-h3-size: 2.25rem;
      --typo-h4-size: 1.75rem;
      --typo-h5-size: 1.25rem;
      --typo-h6-size: 1rem;
    }

    html {
      font-size: 20px;
      background-color: var(--backgroundColor);
      color: var(--mainTextColor);
      font-family: var(--font-sans);

    }
    body {
      font-family: var(--font-sans);
    letter-spacing: 0.01em;
    }

`;
