import type { Preview, Decorator } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { themes } from "storybook/theming";
import { useEffect } from "react";
import "@samisdat/ui-components/style/globalStyle";
import "@samisdat/wtal-panorama/colors.css";
import "./preview.css";

import { PRESET_DATA, presetSizeStyle } from "../../website/src/lib/typography/data";
import { FLUID_ROOT_VARS } from "../../website/src/lib/typography/fluid";
import { DEFAULT_PRESET_ID } from "../../website/src/lib/typography/ids";

import "@fontsource-variable/inter";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/source-code-pro";
import "@fontsource/playwrite-no";

// Decorator to sync docs theme with global theme
const withDocsTheme: Decorator = (Story, context) => {
  useEffect(() => {
    const theme = context.globals.theme;
    const docsTheme = theme === "light" ? themes.light : themes.dark;

    // Update docs container background and text color
    if (typeof document !== "undefined") {
      const sbDocsContainer = document.querySelector(".sbdocs");
      if (sbDocsContainer instanceof HTMLElement) {
        sbDocsContainer.style.backgroundColor = docsTheme.appBg || "";
        sbDocsContainer.style.color = docsTheme.textColor || "";
      }
    }
  }, [context.globals.theme]);

  return <Story />;
};

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        dark: "dark",
        light: "light",
      },
      defaultTheme: "dark",
      attributeName: "data-theme",
    }),
    withDocsTheme,
    (Story) => {
      // Set CSS variables on the document root for font availability
      const root =
        typeof document !== "undefined" ? document.documentElement : null;
      if (root) {
        root.style.setProperty(
          "--font-heading",
          "'Inter Variable', system-ui, -apple-system, sans-serif",
        );
        root.style.setProperty(
          "--font-body",
          "'Inter Tight Variable', system-ui, -apple-system, sans-serif",
        );
        root.style.setProperty(
          "--font-code",
          "'Source Code Pro Variable', monospace",
        );
        root.style.setProperty("--font-italic", "'Playwrite NO', cursive");

        // Fluid sizes as the website layout sets them on html: the progress value plus the default preset's sizes
        const defaultPreset = PRESET_DATA.find(
          (preset) => preset.id === DEFAULT_PRESET_ID,
        )!;
        for (const [name, value] of Object.entries({
          ...FLUID_ROOT_VARS,
          ...presetSizeStyle(defaultPreset),
        })) {
          root.style.setProperty(name, String(value));
        }
      }
      return <Story />;
    },
  ],

  parameters: {
    docs: {
      theme: themes.dark,
    },
    themes: {
      default: "dark",
      list: [
        { name: "Dark", class: "dark", color: "#1a1a1a" },
        { name: "Light", class: "light", color: "#ffffff" },
      ],
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
