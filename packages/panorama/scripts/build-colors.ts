import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

type OklchComponents = [number, number, number];
type ColorToken = {
    $type: "color";
    $value: { colorSpace: "oklch"; components: OklchComponents };
};
type TokensFile = Record<string, ColorToken | string>;

function toOklch([l, c, h]: OklchComponents): string {
    return `oklch(${l} ${c} ${h})`;
}

const tokens = JSON.parse(
    readFileSync(join(root, "tokens/colors.tokens.json"), "utf8"),
) as TokensFile;

const entries = (
    Object.entries(tokens).filter(
        ([k, v]) => !k.startsWith("$") && typeof v === "object",
    ) as [string, ColorToken][]
).map(([name, token]) => ({ name, value: toOklch(token.$value.components) }));

// src/generated/colors.ts
const colorLines = entries.map(({ name, value }) => `    "${name}": "${value}",`);
const varLines = entries.map(({ name }) => `    "${name}": "var(--panorama-${name})",`);
const tsContent = `// Generated — do not edit. Run \`pnpm build:colors\` to regenerate.

export type PanoramaColorName = keyof typeof panoramaColors;

export const panoramaColors = {
${colorLines.join("\n")}
} as const;

export const panoramaCssVars = {
${varLines.join("\n")}
} as const;
`;
mkdirSync(join(root, "src/generated"), { recursive: true });
writeFileSync(join(root, "src/generated/colors.ts"), tsContent);

// dist/colors.css
const cssVars = entries.map(
    ({ name, value }) => `    --panorama-${name}: ${value};`,
);
const cssContent = `/* Generated — do not edit. Run \`pnpm build:colors\` to regenerate. */
:root {
${cssVars.join("\n")}
}
`;
mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/colors.css"), cssContent);

// Update :root block in panorama.css
const panoramaCssPath = join(root, "src/components/panorama.css");
const panoramaCss = readFileSync(panoramaCssPath, "utf8");
const rootBlock = `:root {\n${cssVars.join("\n")}\n}`;
const updated = panoramaCss.replace(/:root \{[\s\S]*?\}/, rootBlock);
writeFileSync(panoramaCssPath, updated);

console.log(`panorama: generated ${entries.length} colors`);
