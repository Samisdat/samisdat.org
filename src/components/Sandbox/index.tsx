'use client';
/*
 */

import { SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';
import { styled } from '@linaria/react';
import { FC } from 'react';

import { nightOwl } from '@codesandbox/sandpack-themes';
import { SandboxProps } from './props';

const SandboxStyling = styled.div``;

// https://github.com/codesandbox/sandpack/blob/main/sandpack-react/src/templates/runtime/react-typescript.ts

export const Sandbox: FC<SandboxProps> = ({
    files,
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
    console.log(files);

    // Get CodeSandbox API token from environment
    const apiToken = process.env.NEXT_PUBLIC_CODESANDBOX_API_TOKEN;

    // Build custom setup only if API token is available
    const customSetup = apiToken
        ? {
              exportOptions: {
                  apiToken,
                  privacy: 'public' as const,
                  openInNewWindow: true,
              },
          }
        : undefined;

    return (
        <SandboxStyling {...props}>
            Hei
            <SandpackProvider
                theme={nightOwl}
                files={files}
                options={{
                    visibleFiles: ['/src/App.tsx', '/src/index.tsx'],
                    activeFile: '/index.tsx',
                }}
                customSetup={customSetup}
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
