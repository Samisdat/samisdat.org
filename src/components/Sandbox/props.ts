import { SandpackFiles } from '@codesandbox/sandpack-react';
import { HTMLAttributes } from 'react';

export interface SandboxProps extends HTMLAttributes<HTMLDivElement> {
    name: string;
    slug: string;
    mdxDir: string;

    files?: SandpackFiles;
    template?: 'static' | 'react-ts' | 'vanilla';

    showOpenInCodeSandbox?: boolean;
    showNavigator?: boolean;
    showLineNumbers?: boolean;
    showInlineErrors?: boolean;
    showRefreshButton?: boolean;
    showRestartButton?: boolean;
    showTabs?: boolean;
    showConsoleButton?: boolean;
    showConsole?: boolean;
    closableTabs?: boolean;
    wrapContent?: boolean;
    resizablePanels?: boolean;
}
