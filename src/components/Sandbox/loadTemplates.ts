import fs from 'fs';
import path from 'path';

interface SandpackFile {
    code: string;
}

interface TemplateFiles {
    [key: string]: SandpackFile;
}

const readDirectoryRecursive = (dir: string, baseDir: string, prefix: string = ''): TemplateFiles => {
    const files: TemplateFiles = {};
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir, fullPath);
        const sandpackPath = prefix + '/' + relativePath.replace(/\\/g, '/');

        if (entry.isDirectory()) {
            Object.assign(files, readDirectoryRecursive(fullPath, baseDir, prefix));
        } else {
            const code = fs.readFileSync(fullPath, 'utf-8');
            files[sandpackPath] = { code };
        }
    }

    return files;
};

export const loadTemplate = (templateName: string): TemplateFiles => {
    const templatesDir = path.join(process.cwd(), 'src', 'components', 'Sandbox', 'templates', templateName);

    if (!fs.existsSync(templatesDir)) {
        throw new Error(`Template '${templateName}' not found at ${templatesDir}`);
    }

    return readDirectoryRecursive(templatesDir, templatesDir, '');
};
