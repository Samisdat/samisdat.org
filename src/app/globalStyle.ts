// globalStyles.ts
import { css } from '@linaria/core';

export const globalStyles = css`
  :global() {
    html, body {
            
        border: 100px solid black;

    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    a {
      color: rebeccapurple;
      text-decoration: none;
    }
      a::after{
          content: 'find be';
      }

    a:hover {
      text-decoration: underline;
    }
  }
`;
