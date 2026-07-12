import { beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getSandpackFiles } from '../getSandpackFiles';

// Mock fs
vi.mock('fs');

describe('getSandpackFiles', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('security checks', () => {
        it('rejects slug with path traversal (..) attack', async () => {
            await expect(
                getSandpackFiles({
                    slug: '../../../etc',
                    name: 'sandbox',
                    template: 'react',
                }),
            ).rejects.toThrow('Invalid slug or name');
        });

        it('rejects name with path traversal (..) attack', async () => {
            await expect(
                getSandpackFiles({
                    slug: 'valid-slug',
                    name: '../../../passwd',
                    template: 'react',
                }),
            ).rejects.toThrow('Invalid slug or name');
        });

        it('rejects absolute path in slug', async () => {
            await expect(
                getSandpackFiles({
                    slug: '/etc/passwd',
                    name: 'sandbox',
                    template: 'react',
                }),
            ).rejects.toThrow('Invalid slug or name');
        });

        it('rejects absolute path in name', async () => {
            await expect(
                getSandpackFiles({
                    slug: 'valid-slug',
                    name: '/etc/passwd',
                    template: 'react',
                }),
            ).rejects.toThrow('Invalid slug or name');
        });
    });

    describe('file system traversal', () => {
        it('reads files from nested directory structure', async () => {
            const baseDir = path.join(process.cwd(), 'codesandboxes', 'test-post', 'demo');

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);

            // Mock directory structure:
            // demo/
            //   index.html
            //   src/
            //     App.tsx
            //     utils/
            //       helper.ts
            vi.mocked(fs.readdirSync).mockImplementation((dir: any) => {
                if (dir === baseDir) {
                    return [
                        { name: 'index.html', isDirectory: () => false, isFile: () => true },
                        { name: 'src', isDirectory: () => true, isFile: () => false },
                    ] as any;
                }
                if (dir === path.join(baseDir, 'src')) {
                    return [
                        { name: 'App.tsx', isDirectory: () => false, isFile: () => true },
                        { name: 'utils', isDirectory: () => true, isFile: () => false },
                    ] as any;
                }
                if (dir === path.join(baseDir, 'src', 'utils')) {
                    return [{ name: 'helper.ts', isDirectory: () => false, isFile: () => true }] as any;
                }
                return [] as any;
            });

            vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
                if (filePath.includes('index.html')) return '<html>test</html>';
                if (filePath.includes('App.tsx')) return 'const App = () => {};';
                if (filePath.includes('helper.ts')) return 'export const helper = () => {};';
                return '';
            });

            const files = await getSandpackFiles({
                slug: 'test-post',
                name: 'demo',
                template: 'react',
            });

            expect(files).toMatchObject({
                '/index.html': '<html>test</html>',
                '/src/App.tsx': 'const App = () => {};',
                '/src/utils/helper.ts': 'export const helper = () => {};',
            });
        });

        it('excludes node_modules directory', async () => {
            const baseDir = path.join(process.cwd(), 'codesandboxes', 'test-post', 'demo');

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);

            vi.mocked(fs.readdirSync).mockImplementation((dir: any) => {
                if (dir === baseDir) {
                    return [
                        { name: 'index.html', isDirectory: () => false, isFile: () => true },
                        { name: 'node_modules', isDirectory: () => true, isFile: () => false },
                    ] as any;
                }
                return [] as any;
            });

            vi.mocked(fs.readFileSync).mockReturnValue('<html>test</html>');

            const files = await getSandpackFiles({
                slug: 'test-post',
                name: 'demo',
                template: 'react',
            });

            expect(Object.keys(files)).toEqual(['/index.html']);
            expect(files).not.toHaveProperty('/node_modules');
        });

        it('excludes all EXCLUDED_DIRS (.git, build, dist, .next, coverage, .cache)', async () => {
            const baseDir = path.join(process.cwd(), 'codesandboxes', 'test-post', 'demo');

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);

            vi.mocked(fs.readdirSync).mockImplementation((dir: any) => {
                if (dir === baseDir) {
                    return [
                        { name: 'src', isDirectory: () => true, isFile: () => false },
                        { name: '.git', isDirectory: () => true, isFile: () => false },
                        { name: 'build', isDirectory: () => true, isFile: () => false },
                        { name: 'dist', isDirectory: () => true, isFile: () => false },
                        { name: '.next', isDirectory: () => true, isFile: () => false },
                        { name: 'coverage', isDirectory: () => true, isFile: () => false },
                        { name: '.cache', isDirectory: () => true, isFile: () => false },
                    ] as any;
                }
                if (dir === path.join(baseDir, 'src')) {
                    return [{ name: 'index.ts', isDirectory: () => false, isFile: () => true }] as any;
                }
                return [] as any;
            });

            vi.mocked(fs.readFileSync).mockReturnValue('export const test = 1;');

            const files = await getSandpackFiles({
                slug: 'test-post',
                name: 'demo',
                template: 'react',
            });

            expect(Object.keys(files)).toEqual(['/src/index.ts']);
        });

        it('excludes EXCLUDED_FILES (lock files, .DS_Store, .env)', async () => {
            const baseDir = path.join(process.cwd(), 'codesandboxes', 'test-post', 'demo');

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);

            vi.mocked(fs.readdirSync).mockImplementation((dir: any) => {
                if (dir === baseDir) {
                    return [
                        { name: 'index.ts', isDirectory: () => false, isFile: () => true },
                        { name: 'package-lock.json', isDirectory: () => false, isFile: () => true },
                        { name: 'yarn.lock', isDirectory: () => false, isFile: () => true },
                        { name: 'pnpm-lock.yaml', isDirectory: () => false, isFile: () => true },
                        { name: '.DS_Store', isDirectory: () => false, isFile: () => true },
                        { name: '.gitignore', isDirectory: () => false, isFile: () => true },
                        { name: '.env', isDirectory: () => false, isFile: () => true },
                        { name: '.env.local', isDirectory: () => false, isFile: () => true },
                    ] as any;
                }
                return [] as any;
            });

            vi.mocked(fs.readFileSync).mockReturnValue('export const test = 1;');

            const files = await getSandpackFiles({
                slug: 'test-post',
                name: 'demo',
                template: 'react',
            });

            expect(Object.keys(files)).toEqual(['/index.ts']);
        });

        it('throws error with helpful message when directory does not exist', async () => {
            const baseDir = path.join(process.cwd(), 'codesandboxes', 'test-post', 'demo');

            // Directory doesn't exist
            vi.mocked(fs.existsSync).mockReturnValue(false);

            await expect(
                getSandpackFiles({
                    slug: 'test-post',
                    name: 'demo',
                    template: 'react',
                }),
            ).rejects.toThrow(/Sandbox files not found/);

            await expect(
                getSandpackFiles({
                    slug: 'test-post',
                    name: 'demo',
                    template: 'react',
                }),
            ).rejects.toThrow(/pnpm sandbox:create/);
        });

        it('normalizes Windows backslashes to forward slashes in file paths', async () => {
            const baseDir = path.join(process.cwd(), 'codesandboxes', 'test-post', 'demo');

            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);

            vi.mocked(fs.readdirSync).mockImplementation((dir: any) => {
                if (dir === baseDir) {
                    return [{ name: 'src', isDirectory: () => true, isFile: () => false }] as any;
                }
                if (dir === path.join(baseDir, 'src')) {
                    return [{ name: 'App.tsx', isDirectory: () => false, isFile: () => true }] as any;
                }
                return [] as any;
            });

            vi.mocked(fs.readFileSync).mockReturnValue('const App = () => {};');

            const files = await getSandpackFiles({
                slug: 'test-post',
                name: 'demo',
                template: 'react',
            });

            // Path should always use forward slashes, never backslashes
            expect(Object.keys(files)).toEqual(['/src/App.tsx']);
            expect(Object.keys(files).some((key) => key.includes('\\'))).toBe(false);
        });
    });
});
