// PostToolUse hook (Edit|Write|MultiEdit): format, then lint the file Claude just changed.
// Formatting uses oxfmt (same as the Neovim setup) and is skipped without .oxfmtrc.json.
// Exit code 2 returns stderr to the model as feedback, so it can fix the
// violation (complexity, file length, ...) while it is still editing.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8'));
const file = input.tool_input?.file_path;
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

if (!file || !/\.(?:[cm]?[jt]sx?)$/.test(file)) process.exit(0);

const rel = relative(root, file);
if (rel.startsWith('..')) process.exit(0);

if (existsSync(join(root, '.oxfmtrc.json'))) {
    const format = spawnSync('pnpm', ['exec', 'oxfmt', rel], { cwd: root, encoding: 'utf8' });
    if (format.status !== 0) {
        process.stderr.write(`oxfmt failed for ${rel}:\n${format.stdout}${format.stderr}`);
        process.exit(2);
    }
}

const result = spawnSync('pnpm', ['exec', 'oxlint', rel], { cwd: root, encoding: 'utf8' });
if (result.status !== 0) {
    process.stderr.write(`oxlint failed for ${rel}:\n${result.stdout}${result.stderr}`);
    process.exit(2);
}
