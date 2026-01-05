// Server-safe template definitions (cannot import from @codesandbox/sandpack-react on server)
// Note: For local development with react-scripts, files need to be in src/ directory
// For Sandpack display in browser, we use paths without src/ prefix
export const REACT_TS_TEMPLATE_FILES = {
    '/src/App.tsx': {
        code: `export default function App() {
  return <h1>Hello world</h1>
}
`,
    },
    '/src/index.tsx': {
        code: `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
    },
    '/src/styles.css': {
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
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}`,
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
        code: `{
  "name": "sandbox-example",
  "version": "1.0.0",
  "description": "Sandbox example",
  "main": "/index.tsx",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-scripts": "^5.0.1"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^4.0.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,
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
