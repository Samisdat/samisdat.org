import path from 'path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { loadTemplate } from '../loadTemplates';

const packageRoot = path.resolve(__dirname, '../../../..');

describe('loadTemplate', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('reads a template recursively into sandpack paths with leading slash', () => {
        vi.spyOn(process, 'cwd').mockReturnValue(packageRoot);

        const files = loadTemplate('react-ts');

        expect(Object.keys(files)).toEqual(expect.arrayContaining(['/package.json', '/src/App.tsx', '/public/index.html']));
        expect(files['/src/App.tsx'].code).toContain('export');
    });

    it('throws for an unknown template', () => {
        vi.spyOn(process, 'cwd').mockReturnValue(packageRoot);

        expect(() => loadTemplate('does-not-exist')).toThrow("Template 'does-not-exist' not found");
    });
});
