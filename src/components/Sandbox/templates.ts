// Server-safe template definitions (cannot import from @codesandbox/sandpack-react on server)
export const REACT_TS_TEMPLATE_FILES = {
    '/styles.css': {
        code: `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

h1 {
  font-size: 1.5rem;
}`,
    },
    '/tsconfig.json': {
        code: `{
  "include": [
    "./**/*"
  ],
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "lib": [ "dom", "es2015" ],
    "jsx": "react-jsx"
  }
}`,
    },
    '/App.tsx': {
        code: `export default function App(): JSX.Element {
  return <h1>Hello world</h1>
}
`,
    },
    '/index.tsx': {
        code: `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
    },
    '/public/index.html': {
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    },
    '/package.json': {
        code: `{"dependencies":{"react":"^19.0.0","react-dom":"^19.0.0","react-scripts":"^4.0.0"},"devDependencies":{"@types/react":"^19.0.0","@types/react-dom":"^19.0.0","typescript":"^4.0.0"},"main":"/index.tsx"}`,
    },
};

export const VANILLA_TS_TEMPLATE_FILES = {
    '/index.ts': {
        code: `console.log("Hello from TypeScript!");`,
    },
    '/package.json': {
        code: `{"dependencies":{},"devDependencies":{"typescript":"^4.0.0"},"main":"/index.ts"}`,
    },
};
