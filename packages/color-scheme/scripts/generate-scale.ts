/**
 * Scale proposal tool (NOT part of the build).
 *
 * Proposes a 50–950 scale per hue from a shared L target curve and a per-hue
 * chroma that tapers towards both ends and stays inside sRGB. Colors that are
 * used in the site today ("anchors") replace the generated value on their step;
 * generated neighbours are interpolated between anchors so L stays monotonic.
 *
 * Usage:
 *   pnpm generate:scale                 print the scale table
 *   pnpm generate:scale --write [file]  write DTCG tokens (default: tokens/primitives.tokens.json)
 *   pnpm generate:scale --migration     print the old name → token id table (Markdown)
 *
 * Committed values are the source of truth; hand-edit the token file afterwards.
 * Note: since Phase 4 the committed file contains hand-tuned steps (contrast
 * fixes, see `$description`); `--write` would overwrite them.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { inGamut, oklch, toGamut } from "culori";
import {
  HUES,
  PRIMITIVES_PATH,
  STEPS,
  type Hue,
  type Oklch,
  type Step,
} from "./shared";

// ---------------------------------------------------------------------------
// Shared curves
// ---------------------------------------------------------------------------

/** Shared L target per step (50 = lightest). */
const L_TARGET: Record<Step, number> = {
  50: 0.975,
  100: 0.945,
  200: 0.895,
  300: 0.83,
  400: 0.75,
  500: 0.67,
  600: 0.58,
  700: 0.49,
  800: 0.4,
  900: 0.31,
  950: 0.23,
};

/** Chroma factor per step relative to the hue's peak chroma. */
const TAPER_ACCENT: Record<Step, number> = {
  50: 0.1,
  100: 0.25,
  200: 0.5,
  300: 0.75,
  400: 0.92,
  500: 1,
  600: 1,
  700: 0.9,
  800: 0.75,
  900: 0.6,
  950: 0.45,
};

/** Brand colors are nearly neutral; chroma only fades out at the light end. */
const TAPER_BRAND: Record<Step, number> = {
  50: 0.25,
  100: 0.35,
  200: 0.5,
  300: 0.7,
  400: 0.85,
  500: 1,
  600: 1,
  700: 1,
  800: 1,
  900: 1,
  950: 1,
};

// ---------------------------------------------------------------------------
// Existing values (anchors)
// ---------------------------------------------------------------------------

type Anchor = {
  /** Old names (CSS variables / derived.ts keys) that resolve to this value. */
  names: string[];
  /** Old expression, for the migration table. */
  expression: string;
  /** Absolute value before gamut mapping. */
  value: Oklch;
  /** Fixed step (brand colors); otherwise assigned by L proximity. */
  step?: Step;
  /** Extra remark for the token description. */
  note?: string;
  /** Role used to pair accents: `dark` is the lighter, `light` the darker one. */
  role?: "dark" | "light";
};

const rel = (
  base: Oklch,
  dl: number,
  cMul = 1,
  dh = 0,
): Oklch => ({ l: base.l + dl, c: base.c * cMul, h: base.h + dh });

const aubergine: Oklch = { l: 0.22, c: 0.05, h: 300 };
const ivory: Oklch = { l: 0.8497, c: 0.037, h: 30 };

type HueConfig = {
  description: string;
  taper: Record<Step, number>;
  anchors: Anchor[];
};

const accent = (
  name: Exclude<Hue, "aubergine" | "ivory">,
  description: string,
  primitive: Oklch,
  exprPrimitive: string,
  light: { dl: number; cMul: number; dh: number; expression: string },
  dark: { cMul?: number; dh?: number; expression?: string; note?: string } = {},
): [Hue, HueConfig] => [
  name,
  {
    description,
    taper: TAPER_ACCENT,
    anchors: [
      {
        names: [
          `${name}-on-dark`,
          ...(name === "pink" ? [] : [`primitive-${name}`]),
        ],
        expression: dark.expression ?? exprPrimitive,
        value: rel(primitive, 0, dark.cMul ?? 1, dark.dh ?? 0),
        role: "dark",
        note: dark.note,
      },
      {
        names: [`${name}-on-light`],
        expression: light.expression,
        value: rel(primitive, light.dl, light.cMul, light.dh),
        role: "light",
      },
    ],
  },
];

const HUE_CONFIG: Record<Hue, HueConfig> = Object.fromEntries([
  [
    "aubergine",
    {
      description:
        "dunkles Aubergine, Markenfarbe; Hintergrund im Dark Mode, Text im Light Mode",
      taper: TAPER_BRAND,
      anchors: [
        {
          names: ["aubergine-deep"],
          expression: "l - 0.07",
          value: rel(aubergine, -0.07),
          step: 950,
        },
        {
          names: ["primitive-aubergine", "aubergine-base"],
          expression: "oklch(22% 0.05 300)",
          value: aubergine,
          step: 900,
        },
        {
          names: ["aubergine-raised"],
          expression: "l + 0.15, c * 1.2",
          value: rel(aubergine, 0.15, 1.2),
          step: 800,
        },
        {
          names: ["aubergine-subtle"],
          expression: "l + 0.22",
          value: rel(aubergine, 0.22),
          step: 700,
        },
        {
          names: ["aubergine-muted"],
          expression: "l + 0.35, c * 0.8",
          value: rel(aubergine, 0.35, 0.8),
          step: 600,
        },
      ],
    },
  ],
  [
    "ivory",
    {
      description:
        "warmes Elfenbein, leicht rosa, Markenfarbe; Text im Dark Mode, Hintergrund im Light Mode",
      taper: TAPER_BRAND,
      anchors: [
        {
          names: ["ivory-bright"],
          expression: "l + 0.05",
          value: rel(ivory, 0.05),
          step: 100,
        },
        {
          names: ["primitive-ivory", "ivory-base"],
          expression: "oklch(84.97% 0.037 30)",
          value: ivory,
          step: 200,
        },
        {
          names: ["ivory-soft"],
          expression: "l - 0.07",
          value: rel(ivory, -0.07),
          step: 300,
        },
        {
          names: ["ivory-subtle"],
          expression: "l - 0.12",
          value: rel(ivory, -0.12),
          step: 400,
        },
        {
          names: ["ivory-muted"],
          expression: "l - 0.20",
          value: rel(ivory, -0.2),
          step: 500,
        },
        {
          names: ["ivory-dim"],
          expression: "l - 0.35",
          value: rel(ivory, -0.35),
          step: 700,
        },
      ],
    },
  ],
  accent(
    "red",
    "warmes Rot mit leichtem Rosa-Stich",
    { l: 0.64, c: 0.22, h: 10 },
    "oklch(64% 0.22 10)",
    { dl: -0.12, cMul: 1.6, dh: -8, expression: "l - 0.12, c * 1.6, h - 8" },
  ),
  accent(
    "orange",
    "sattes, warmes Orange",
    { l: 0.73, c: 0.16, h: 60 },
    "oklch(73% 0.16 60)",
    { dl: -0.15, cMul: 1.4, dh: -5, expression: "l - 0.15, c * 1.4, h - 5" },
  ),
  accent(
    "yellow",
    "leuchtendes Gelb, leicht golden",
    { l: 0.83, c: 0.16, h: 85 },
    "oklch(83% 0.16 85)",
    { dl: -0.1, cMul: 1.8, dh: 0, expression: "l - 0.10, c * 1.8" },
  ),
  accent(
    "green",
    "frisches Grün mit leichtem Blaustich",
    { l: 0.68, c: 0.17, h: 155 },
    "oklch(68% 0.17 155)",
    { dl: -0.15, cMul: 1.5, dh: 0, expression: "l - 0.15, c * 1.5" },
  ),
  accent(
    "teal",
    "Türkis, grüner und gedeckter als Cyan",
    { l: 0.78, c: 0.11, h: 190 },
    "oklch(78% 0.11 190)",
    { dl: -0.15, cMul: 1.4, dh: -10, expression: "l - 0.15, c * 1.4, h - 10" },
  ),
  accent(
    "cyan",
    "klares, kühles Cyan",
    { l: 0.65, c: 0.15, h: 200 },
    "oklch(65% 0.15 200)",
    { dl: -0.15, cMul: 1.4, dh: -10, expression: "l - 0.15, c * 1.4, h - 10" },
  ),
  accent(
    "blue",
    "kräftiges Blau mit Violettstich",
    { l: 0.62, c: 0.19, h: 265 },
    "oklch(62% 0.19 265)",
    { dl: -0.15, cMul: 1.5, dh: 10, expression: "l - 0.15, c * 1.5, h + 10" },
  ),
  accent(
    "purple",
    "kräftiges Violett",
    { l: 0.6, c: 0.22, h: 305 },
    "oklch(60% 0.22 305)",
    { dl: -0.15, cMul: 1.5, dh: 0, expression: "l - 0.15, c * 1.5" },
  ),
  accent(
    "pink",
    "leuchtendes Pink",
    { l: 0.72, c: 0.2, h: 345 },
    "oklch(72% 0.20 345)",
    { dl: -0.08, cMul: 1.5, dh: 0, expression: "l - 0.08, c * 1.5" },
    {
      cMul: 1.4,
      dh: -15,
      expression: "c * 1.4, h - 15",
      note: "Abgeleitet aus dem Roh-Primitive oklch(72% 0.20 345) (c * 1.4, h - 15); das Primitive wurde nie direkt gerendert und entfällt.",
    },
  ),
]) as Record<Hue, HueConfig>;

// ---------------------------------------------------------------------------
// Color math
// ---------------------------------------------------------------------------

const toSrgbGamut = toGamut("rgb", "oklch");
const isInSrgb = inGamut("rgb");

const round = (n: number, digits: number) => {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
};

const fmt = (c: Oklch) =>
  `oklch(${round(c.l, 6)} ${round(c.c, 6)} ${round(c.h, 4)})`;

/** Rounds to token precision; lowers chroma if rounding pushed it out of sRGB. */
function roundInGamut(c: Oklch): Oklch {
  let out = { l: round(c.l, 4), c: round(c.c, 4), h: round(c.h, 2) };
  while (
    out.c > 0 &&
    !isInSrgb({ mode: "oklch", l: out.l, c: out.c, h: out.h })
  ) {
    out = { ...out, c: round(out.c - 0.0001, 4) };
  }
  return out;
}

/** CSS Color 4 gamut mapping into sRGB (culori `toGamut`). */
function mapToSrgb(c: Oklch): { value: Oklch; mapped: boolean } {
  const input = { mode: "oklch" as const, ...c };
  if (isInSrgb(input)) return { value: roundInGamut(c), mapped: false };
  const m = oklch(toSrgbGamut(input));
  return {
    value: roundInGamut({ l: m.l, c: m.c, h: m.h ?? c.h }),
    mapped: true,
  };
}

/**
 * Gamut mapping for generated steps: only chroma is reduced, L and H stay.
 * (The CSS Color 4 algorithm above shifts the hue, which made generated steps
 * drift away from the scale hue. It is kept for anchors, whose old values
 * were mapped that way.)
 */
function reduceChroma(c: Oklch): Oklch {
  let out = { l: round(c.l, 4), c: round(c.c, 4), h: round(c.h, 2) };
  while (
    out.c > 0 &&
    !isInSrgb({ mode: "oklch", l: out.l, c: out.c, h: out.h })
  ) {
    out = { ...out, c: round(out.c - 0.0001, 4) };
  }
  return out;
}

// ---------------------------------------------------------------------------
// Scale construction
// ---------------------------------------------------------------------------

type Entry = {
  hue: Hue;
  step: Step;
  value: Oklch;
  anchor?: Anchor & { mapped: boolean; original: Oklch };
};

/** Picks (dark, light) steps by L proximity to the shared curve. */
function assignAccentSteps(dark: Oklch, light: Oklch): [Step, Step] {
  let best: { cost: number; pair: [Step, Step] } | undefined;
  for (let i = 0; i < STEPS.length; i++) {
    for (let j = i + 1; j < STEPS.length; j++) {
      const cost =
        Math.abs(L_TARGET[STEPS[i]] - dark.l) +
        Math.abs(L_TARGET[STEPS[j]] - light.l);
      if (!best || cost < best.cost) best = { cost, pair: [STEPS[i], STEPS[j]] };
    }
  }
  return best!.pair;
}

function buildHue(hue: Hue): Entry[] {
  const config = HUE_CONFIG[hue];

  const anchors = config.anchors.map((a) => {
    const { value, mapped } = mapToSrgb(a.value);
    return { ...a, value, mapped, original: a.value };
  });

  if (anchors.some((a) => a.role)) {
    const dark = anchors.find((a) => a.role === "dark")!;
    const light = anchors.find((a) => a.role === "light")!;
    [dark.step, light.step] = assignAccentSteps(dark.value, light.value);
  }

  const byStep = new Map<Step, (typeof anchors)[number]>();
  for (const a of anchors) byStep.set(a.step!, a);

  const sortedSteps = [...byStep.keys()].sort((a, b) => a - b);

  // Scale hue and peak chroma come from the lightest accent anchor / base color.
  const reference =
    anchors.find((a) => a.role === "dark") ??
    anchors.find((a) => a.step === 900 || a.step === 200)!;
  const baseHue = reference.original.h;
  const peakChroma = reference.value.c;

  // Virtual end points just beyond the curve, so interpolation covers open ends.
  const top = { t: L_TARGET[50] + 0.02, l: L_TARGET[50] + 0.02 };
  const bottom = { t: L_TARGET[950] - 0.02, l: L_TARGET[950] - 0.02 };

  // Generated steps are interpolated between neighbouring anchors, using the
  // shared curve as the interpolation parameter. This keeps L monotonic.
  const lAt = (step: Step): number => {
    const lower = [...sortedSteps].reverse().find((s) => s < step);
    const upper = sortedSteps.find((s) => s > step);
    const start =
      lower !== undefined
        ? { t: L_TARGET[lower], l: byStep.get(lower)!.value.l }
        : top;
    const end =
      upper !== undefined
        ? { t: L_TARGET[upper], l: byStep.get(upper)!.value.l }
        : bottom;
    const f = (L_TARGET[step] - start.t) / (end.t - start.t);
    return start.l + (end.l - start.l) * f;
  };

  return STEPS.map((step) => {
    const fixed = byStep.get(step);
    if (fixed) {
      return {
        hue,
        step,
        value: fixed.value,
        anchor: fixed,
      };
    }
    const l = lAt(step);
    const raw = { l, c: peakChroma * config.taper[step], h: baseHue };
    return { hue, step, value: reduceChroma(raw) };
  });
}

export function buildAll(): Entry[] {
  return HUES.flatMap(buildHue);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

const id = (e: Entry) => `color.${e.hue}.${e.step}`;

function describe(e: Entry, scaleHue: number): string | undefined {
  const a = e.anchor;
  if (!a) return undefined;
  const parts = [`Bestehender Wert (${a.names.join(", ")}).`];
  const shift = round(a.original.h - scaleHue, 2);
  if (shift !== 0) {
    parts.push(
      `Hue-Verschiebung ${shift > 0 ? "+" : ""}${shift} (${a.original.h} statt ${scaleHue}) aus der bisherigen Ableitung beibehalten.`,
    );
  }
  if (a.mapped) {
    parts.push(
      `Ursprünglich ${fmt(a.original)}, außerhalb von sRGB; per CSS-Color-4-Algorithmus in sRGB gemappt (Hue ${a.value.h}).`,
    );
  }
  if (a.note) parts.push(a.note);
  return parts.join(" ");
}

export function buildTokens(entries: Entry[]) {
  const color: Record<string, Record<string, unknown>> = {};
  for (const hue of HUES) {
    const group: Record<string, unknown> = {
      $description: HUE_CONFIG[hue].description,
    };
    const list = entries.filter((e) => e.hue === hue);
    const ref = list.find((e) => e.anchor?.role === "dark") ??
      list.find((e) => e.anchor && e.step === (hue === "ivory" ? 200 : 900))!;
    const scaleHue = ref.anchor!.original.h;
    for (const e of list) {
      const token: Record<string, unknown> = {
        $value: {
          colorSpace: "oklch",
          components: [e.value.l, e.value.c, e.value.h],
        },
      };
      const description = describe(e, scaleHue);
      if (description) token.$description = description;
      group[String(e.step)] = token;
    }
    color[hue] = group;
  }
  return {
    $schema: "https://www.designtokens.org/schemas/2025.10/format.json",
    color: { $type: "color", ...color },
  };
}

function printTable(entries: Entry[]) {
  for (const hue of HUES) {
    console.log(`\n${hue}`);
    for (const e of entries.filter((x) => x.hue === hue)) {
      const mark = e.anchor ? `  ← ${e.anchor.names.join(", ")}${e.anchor.mapped ? " (gamut-mapped)" : ""}` : "";
      console.log(`  ${String(e.step).padStart(3)}  ${fmt(e.value)}${mark}`);
    }
  }
}

function migrationTable(entries: Entry[]) {
  const rows = [
    "| Alter Name | Alter Ausdruck | Absoluter Wert (OKLCH, vor Gamut-Mapping) | Neues Token | Neuer Wert | Gamut-gemappt |",
    "|---|---|---|---|---|---|",
  ];
  for (const e of entries) {
    const a = e.anchor;
    if (!a) continue;
    for (const name of a.names) {
      rows.push(
        `| \`${name}\` | \`${a.expression}\` | \`${fmt(a.original)}\` | \`${id(e)}\` | \`${fmt(e.value)}\` | ${a.mapped ? "ja" : "nein"} |`,
      );
    }
  }
  return rows.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const entries = buildAll();
  if (args.includes("--migration")) {
    console.log(migrationTable(entries));
  } else if (args.includes("--write")) {
    const target = args[args.indexOf("--write") + 1];
    const path = target && !target.startsWith("--") ? target : fileURLToPath(PRIMITIVES_PATH);
    const json = JSON.stringify(buildTokens(entries), null, 2)
      // Keep color components on one line.
      .replace(/\[\s+([^\]]*?)\s+\]/g, (_, inner: string) =>
        `[${inner.replace(/\s*\n\s*/g, " ")}]`,
      );
    writeFileSync(path, `${json}\n`);
    console.log(`Wrote ${path}`);
  } else {
    printTable(entries);
  }
}
