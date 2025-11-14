// globalStyles.ts
import { css } from "@linaria/core";

export const globalStyles = css`
  :global() {
    :root {
      --typo-h1-size: 3rem;
      --typo-h2-size: 2.75rem;
      --typo-h3-size: 2.25rem;
      --typo-h4-size: 1.75rem;
      --typo-h5-size: 1.25rem;
      --typo-h6-size: 1rem;
    }

    html {
      font-size: 20px;
    }
    html,
    body {
      border: 50px solid black;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    a {
      color: rebeccapurple;
      text-decoration: none;
    }
    a::after {
      content: "find be";
    }

    a:hover {
      text-decoration: underline;
    }
  }
`;
