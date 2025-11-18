import { css } from '@linaria/core';

export const globalStyles = css`
  :global() {
    :root {
      --backgroundColor: #2a1f31;
      --mainTextColor: #d3cbc6;
    }

    html {
      font-size: 20px;
      background-color: var(--backgroundColor);
      color: var(--mainTextColor);
      font-family: sans-serif;

    }
    body {
      letter-spacing: 0.01em;
    }

`;
