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

    return (
        <SandboxStyling {...props}>
            Hei
            <SandpackProvider
                template={template}
                theme={nightOwl}
                files={files}
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
