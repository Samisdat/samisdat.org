import type { SandpackFiles } from '@codesandbox/sandpack-react';
import fs from 'fs';
import path from 'path';
import { SandboxProps } from './props';
import { REACT_TS_TEMPLATE_FILES, VANILLA_TS_TEMPLATE_FILES } from './templates';

export const createSandpackFiles = async (opts: {
    slug: string;
    name: string;
    template: SandboxProps['template'];
    dir: string;
}): Promise<SandpackFiles> => {
    const { slug, name, template, dir } = opts;

    console.log('create', slug, name, template, dir);

    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        console.log('already exists');
    }

    const boilerplateFiles = template === 'react-ts' ? REACT_TS_TEMPLATE_FILES : VANILLA_TS_TEMPLATE_FILES;

    console.log('boilerplate files count:', Object.keys(boilerplateFiles).length);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!boilerplateFiles) {
        throw new Error('No files found in boilerplate template');
    }

    for (const [filePath, fileContent] of Object.entries(boilerplateFiles)) {
        console.log(filePath, fileContent);
        // Remove leading slash from filePath
        const relativePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
        const fullPath = path.join(dir, relativePath);

        // Create subdirectories if needed (e.g., for /public/index.html)
        const fileDir = path.dirname(fullPath);
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }

        // Write file content
        const code = typeof fileContent === 'string' ? fileContent : (fileContent as any).code;
        fs.writeFileSync(fullPath, code, 'utf-8');

        console.log(`Created: ${relativePath}`);
    }

    console.log(`Boilerplate files created in: ${dir}`);

    const files: SandpackFiles = boilerplateFiles;

    return files;
};
