/**
 * Translation table: tree-sitter capture (the vocabulary of `syntax.*`) to
 * TextMate scopes. This is the ONLY translation between the two worlds; the
 * Shiki theme is generated from it (plugins/plugin-shiki.ts).
 *
 * Token id of a capture: `syntax.<capture with "." replaced by "-">`, because
 * DTCG does not allow a token (`tag`) to be a group (`tag.attribute`) at once.
 * CSS variable: `--color-syntax-<same name>`.
 *
 * TextMate picks the most specific matching selector, so broad scopes
 * (`keyword.operator`) can safely coexist with narrower ones assigned to
 * another capture (`keyword.operator.expression`).
 *
 * Adding a capture: add the entry here, add `syntax.<name>` to every mode file
 * in tokens/, run `pnpm lint:tokens`. The build fails when the two sides differ.
 */
export type Capture = {
  /** Neovim tree-sitter capture name, without the leading "@". */
  capture: string;
  scopes: string[];
};

export const captures = [
  {
    capture: "comment",
    scopes: ["comment", "punctuation.definition.comment"],
  },
  {
    capture: "keyword",
    scopes: [
      "keyword",
      "keyword.control",
      "keyword.operator.new",
      "keyword.operator.expression",
      "keyword.operator.delete",
      "keyword.operator.instanceof",
      "keyword.operator.typeof",
      "keyword.other",
      "storage",
      "storage.type",
      "storage.modifier",
      "entity.other.inherited-class",
    ],
  },
  {
    capture: "string",
    scopes: [
      "string",
      "string.quoted",
      "string.template",
      "punctuation.definition.string",
      "markup.inline.raw",
    ],
  },
  {
    // Regular expressions and escape sequences.
    capture: "string.special",
    scopes: [
      "string.regexp",
      "constant.character.escape",
      "constant.other.character-class",
      "keyword.operator.quantifier.regexp",
      "keyword.control.anchor.regexp",
    ],
  },
  {
    capture: "number",
    scopes: ["constant.numeric", "keyword.other.unit"],
  },
  {
    // Includes booleans, null/undefined and `this`/`super`.
    capture: "constant",
    scopes: [
      "constant",
      "constant.language",
      "support.constant",
      "variable.other.constant",
      "variable.language",
    ],
  },
  {
    capture: "function",
    scopes: [
      "entity.name.function",
      "support.function",
      "variable.function",
      "entity.name.method",
      "meta.definition.method entity.name.function",
    ],
  },
  {
    capture: "type",
    scopes: [
      "entity.name.type",
      "entity.name.class",
      "entity.name.namespace",
      "support.class",
      "support.type",
      "meta.type.annotation entity.name.type",
    ],
  },
  {
    capture: "variable",
    scopes: ["variable", "variable.other", "variable.other.readwrite"],
  },
  {
    capture: "parameter",
    scopes: ["variable.parameter", "meta.function.parameters variable"],
  },
  {
    capture: "property",
    scopes: [
      "variable.other.property",
      "variable.other.object.property",
      "support.variable.property",
      "variable.object.property",
      "meta.object-literal.key",
      "support.type.property-name",
      "support.type.vendored.property-name",
      "entity.name.tag.yaml",
    ],
  },
  {
    capture: "tag",
    scopes: [
      "entity.name.tag",
      "support.class.component",
      "punctuation.definition.tag",
    ],
  },
  {
    capture: "tag.attribute",
    scopes: ["entity.other.attribute-name"],
  },
  {
    capture: "operator",
    scopes: ["keyword.operator", "storage.type.function.arrow"],
  },
  {
    capture: "punctuation",
    scopes: [
      "punctuation",
      "meta.brace",
      "meta.delimiter",
      "punctuation.definition.template-expression",
    ],
  },
  {
    capture: "diff.plus",
    scopes: ["markup.inserted", "meta.diff.header.to-file"],
  },
  {
    capture: "diff.minus",
    scopes: ["markup.deleted", "meta.diff.header.from-file"],
  },
] as const satisfies readonly Capture[];

/** `tag.attribute` -> `tag-attribute` (token name below `syntax.`). */
export const captureName = (capture: string) => capture.replaceAll(".", "-");
