/**
 * Generated – do not edit.
 * Source: tokens/*.tokens.json and src/textmate-scopes.ts, built by `pnpm --filter @samisdat/color-scheme build`.
 */

// Structurally compatible with Shiki's `ThemeRegistration`, without depending on shiki.
export type ShikiTheme = {
  name: string;
  fg: string;
  bg: string;
  colors: Record<string, string>;
  tokenColors: {
    scope: string[];
    settings: { foreground: string; fontStyle?: string };
  }[];
};

export const shikiTheme: ShikiTheme = {
  "name": "samisdat",
  "fg": "var(--color-syntax-foreground)",
  "bg": "var(--color-surface-default)",
  "colors": {
    "editor.foreground": "var(--color-syntax-foreground)",
    "editor.background": "var(--color-surface-default)"
  },
  "tokenColors": [
    {
      "scope": [
        "comment",
        "punctuation.definition.comment"
      ],
      "settings": {
        "foreground": "var(--color-syntax-comment)",
        "fontStyle": "italic"
      }
    },
    {
      "scope": [
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
        "entity.other.inherited-class"
      ],
      "settings": {
        "foreground": "var(--color-syntax-keyword)"
      }
    },
    {
      "scope": [
        "string",
        "string.quoted",
        "string.template",
        "punctuation.definition.string",
        "markup.inline.raw"
      ],
      "settings": {
        "foreground": "var(--color-syntax-string)"
      }
    },
    {
      "scope": [
        "string.regexp",
        "constant.character.escape",
        "constant.other.character-class",
        "keyword.operator.quantifier.regexp",
        "keyword.control.anchor.regexp"
      ],
      "settings": {
        "foreground": "var(--color-syntax-string-special)"
      }
    },
    {
      "scope": [
        "constant.numeric",
        "keyword.other.unit"
      ],
      "settings": {
        "foreground": "var(--color-syntax-number)"
      }
    },
    {
      "scope": [
        "constant",
        "constant.language",
        "support.constant",
        "variable.other.constant",
        "variable.language"
      ],
      "settings": {
        "foreground": "var(--color-syntax-constant)"
      }
    },
    {
      "scope": [
        "entity.name.function",
        "support.function",
        "variable.function",
        "entity.name.method",
        "meta.definition.method entity.name.function"
      ],
      "settings": {
        "foreground": "var(--color-syntax-function)"
      }
    },
    {
      "scope": [
        "entity.name.type",
        "entity.name.class",
        "entity.name.namespace",
        "support.class",
        "support.type",
        "meta.type.annotation entity.name.type"
      ],
      "settings": {
        "foreground": "var(--color-syntax-type)"
      }
    },
    {
      "scope": [
        "variable",
        "variable.other",
        "variable.other.readwrite"
      ],
      "settings": {
        "foreground": "var(--color-syntax-variable)"
      }
    },
    {
      "scope": [
        "variable.parameter",
        "meta.function.parameters variable"
      ],
      "settings": {
        "foreground": "var(--color-syntax-parameter)"
      }
    },
    {
      "scope": [
        "variable.other.property",
        "variable.other.object.property",
        "support.variable.property",
        "variable.object.property",
        "meta.object-literal.key",
        "support.type.property-name",
        "support.type.vendored.property-name",
        "entity.name.tag.yaml"
      ],
      "settings": {
        "foreground": "var(--color-syntax-property)"
      }
    },
    {
      "scope": [
        "entity.name.tag",
        "support.class.component",
        "punctuation.definition.tag"
      ],
      "settings": {
        "foreground": "var(--color-syntax-tag)"
      }
    },
    {
      "scope": [
        "entity.other.attribute-name"
      ],
      "settings": {
        "foreground": "var(--color-syntax-tag-attribute)"
      }
    },
    {
      "scope": [
        "keyword.operator",
        "storage.type.function.arrow"
      ],
      "settings": {
        "foreground": "var(--color-syntax-operator)"
      }
    },
    {
      "scope": [
        "punctuation",
        "meta.brace",
        "meta.delimiter",
        "punctuation.definition.template-expression"
      ],
      "settings": {
        "foreground": "var(--color-syntax-punctuation)"
      }
    },
    {
      "scope": [
        "markup.inserted",
        "meta.diff.header.to-file"
      ],
      "settings": {
        "foreground": "var(--color-syntax-diff-plus)"
      }
    },
    {
      "scope": [
        "markup.deleted",
        "meta.diff.header.from-file"
      ],
      "settings": {
        "foreground": "var(--color-syntax-diff-minus)"
      }
    }
  ]
};
