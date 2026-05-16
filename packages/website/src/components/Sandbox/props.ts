import { SandpackFiles } from '@codesandbox/sandpack-react';
import { HTMLAttributes } from 'react';

export interface SandboxProps extends HTMLAttributes<HTMLDivElement> {
    name: string;
    slug: string;
    mdxDir: string;

    files?: SandpackFiles;
    template?: 'react-ts' | 'vanilla';

    visibleFiles: string[];
    activeFile: string;

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
