// Stop hook: block finishing while `pnpm lint` reports errors.
// stop_hook_active is set when Claude continues because of this hook, so a
// failure that cannot be fixed does not loop forever.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8'));
if (input.stop_hook_active) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const result = spawnSync('pnpm', ['lint'], { cwd: root, encoding: 'utf8' });
if (result.status !== 0) {
    process.stderr.write(`pnpm lint failed:\n${result.stdout}${result.stderr}`);
    process.exit(2);
}
