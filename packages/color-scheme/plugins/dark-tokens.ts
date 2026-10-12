import type { BuildHookOptions } from "@terrazzo/parser";

type Resolved = ReturnType<NonNullable<BuildHookOptions["resolver"]>["apply"]>;
type OklchValue = { components: (number | "none" | null)[] };

const component = (value: number | "none" | null) =>
  value === "none" || value === null ? 0 : value;

/** `oklch(L% C H)` with trimmed decimals, as accepted by pi and CSS. */
export const toOklchString = (value: OklchValue) => {
  const [l, c, h] = value.components.map(component);
  const round = (n: number, digits: number) => Number(n.toFixed(digits));
  return `oklch(${round(l * 100, 2)}% ${round(c, 4)} ${round(h, 2)})`;
};

/**
 * Resolves the dark permutation and returns a lookup that reports a missing or
 * non-oklch token through the logger instead of throwing. `ok()` is false as
 * soon as one lookup failed, so a plugin can skip emitting a partial file.
 */
export const darkTokens = (
  { resolver, context }: Pick<BuildHookOptions, "resolver" | "context">,
  label: string,
) => {
  const fail = (message: string) =>
    context.logger.error({ group: "plugin", label, message });

  const permutation = (resolver.listPermutations?.() ?? []).find(
    (p) => (p as { mode: string }).mode === "dark",
  );
  const tokens: Resolved | undefined = permutation
    ? resolver.apply(permutation)
    : undefined;
  let failed = false;

  const get = (id: string) => {
    const token = tokens?.[id];
    if (!token) {
      fail(`dark: ${id} is missing in the token file`);
      failed = true;
      return undefined;
    }
    if (token.$type !== "color" || token.$value.colorSpace !== "oklch") {
      fail(`dark: ${id} must be an oklch color`);
      failed = true;
      return undefined;
    }
    return token.$value as OklchValue;
  };

  const ids = () => Object.keys(tokens ?? {});

  return { available: tokens !== undefined, ids, get, ok: () => !failed };
};
