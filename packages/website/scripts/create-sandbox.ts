#!/usr/bin/env tsx
/**
 * CLI tool to create sandpack boilerplate files for a blog post sandbox.
 *
 * Usage:
 *   pnpm sandbox:create <slug> <name> <template>
 *
 * Example:
 *   pnpm sandbox:create my-post my-demo react-ts
 *
 * This creates: codesandboxes/my-post/my-demo/ with react-ts boilerplate.
 */

import fs from 'fs';
import path from 'path';
import { loadTemplate } from '../src/components/Sandbox/loadTemplates';

type Template = 'react-ts' | 'vanilla-ts';

const VALID_TEMPLATES: Template[] = ['react-ts', 'vanilla-ts'];

function isValidTemplate(template: string): template is Template {
    return VALID_TEMPLATES.includes(template as Template);
}

async function createSandbox(slug: string, name: string, template: Template) {
    const sandboxDir = path.join(process.cwd(), 'codesandboxes');
    const targetDir = path.join(sandboxDir, slug, name);

    console.log(`Creating sandbox: ${slug}/${name} (${template})`);

    // Check if directory already exists
    if (fs.existsSync(targetDir)) {
        console.error(`❌ Directory already exists: ${targetDir}`);
        console.error('   Delete it first or choose a different name.');
        process.exit(1);
    }

    // Load template files
    let boilerplateFiles;
    try {
        boilerplateFiles = loadTemplate(template);
    } catch (err) {
        console.error(`❌ Failed to load template '${template}':`, err);
        process.exit(1);
    }

    if (!boilerplateFiles || Object.keys(boilerplateFiles).length === 0) {
        console.error(`❌ No files found in template '${template}'`);
        process.exit(1);
    }

    // Create target directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Write all template files
    for (const [filePath, fileContent] of Object.entries(boilerplateFiles)) {
        // Remove leading slash from filePath
        const relativePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
        const fullPath = path.join(targetDir, relativePath);

        // Create subdirectories if needed
        const fileDir = path.dirname(fullPath);
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }

        // Write file content
        const code = typeof fileContent === 'string' ? fileContent : fileContent.code;
        fs.writeFileSync(fullPath, code, 'utf-8');
    }

    console.log(`✅ Created ${Object.keys(boilerplateFiles).length} files in: codesandboxes/${slug}/${name}/`);
    console.log(`   You can now reference it in your MDX: <Sandbox name="${name}" />`);
}

// CLI entry point
const args = process.argv.slice(2);

if (args.length !== 3) {
    console.error('Usage: pnpm sandbox:create <slug> <name> <template>');
    console.error('');
    console.error('Arguments:');
    console.error('  slug      - Blog post slug (e.g., "my-post")');
    console.error('  name      - Sandbox name (e.g., "my-demo")');
    console.error('  template  - Template type: react-ts | vanilla-ts');
    console.error('');
    console.error('Example:');
    console.error('  pnpm sandbox:create my-post my-demo react-ts');
    process.exit(1);
}

const [slug, name, template] = args;

if (!isValidTemplate(template)) {
    console.error(`❌ Invalid template: ${template}`);
    console.error(`   Valid templates: ${VALID_TEMPLATES.join(', ')}`);
    process.exit(1);
}

createSandbox(slug, name, template).catch(err => {
    console.error('❌ Failed to create sandbox:', err);
    process.exit(1);
});
