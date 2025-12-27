/*
 */

import {
    Sandpack,
    SandpackCodeEditor,
    SandpackFileExplorer,
    SandpackLayout,
    SandpackPreview,
    SandpackProvider,
} from '@codesandbox/sandpack-react';
import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';

import { nightOwl } from '@codesandbox/sandpack-themes';

const SandboxStyling = styled.div``;

// https://github.com/codesandbox/sandpack/blob/main/sandpack-react/src/templates/runtime/react-typescript.ts

export interface SandboxProps extends HTMLAttributes<HTMLDivElement> {
    template?: 'static' | 'react-ts';
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

export const Sandbox: FC<SandboxProps> = ({
    template = 'react-ts',
    showOpenInCodeSandbox = true,
    showNavigator = false,
    showLineNumbers = true,
    showInlineErrors = true,
    showRefreshButton = true,
    showRestartButton = true,
    showTabs = true,
    closableTabs = false,
    wrapContent = true,
    ...props
}) => {
    return (
        <SandboxStyling {...props}>
            Hei
            <SandpackProvider
                template={template}
                theme={nightOwl}
                files={{
                    '/App.tsx': {
                        code: `export default function App(): JSX.Element {
  return <h1>Hell   o world</h1>
}
`,
                    },

                    '/foo.tsx': {
                        code: `export default function App(): JSX.Element {
  return <h1>Hell   o world</h1>
}
`,
                    },
                }}
            >
                <SandpackLayout>
                    <SandpackCodeEditor
                        showTabs={showTabs}
                        showLineNumbers={showLineNumbers}
                        showInlineErrors={showInlineErrors}
                        wrapContent={wrapContent}
                        closableTabs={closableTabs}
                    />
                    <SandpackPreview
                        showNavigator={showNavigator}
                        showRefreshButton={showRefreshButton}
                        showRestartButton={showRestartButton}
                        showOpenInCodeSandbox={showOpenInCodeSandbox}
                    />
                </SandpackLayout>
            </SandpackProvider>
        </SandboxStyling>
    );
};
