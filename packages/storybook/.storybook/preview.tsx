import type { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "@samisdat/ui-components/globalStyle";

import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/source-sans-3";
import "@fontsource-variable/source-code-pro";
import "@fontsource/playwrite-no";

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
    (Story) => {
      // Set CSS variables on the document root for font availability
      const root =
        typeof document !== "undefined" ? document.documentElement : null;
      if (root) {
        root.style.setProperty(
          "--font-serif",
          "'Source Serif 4 Variable', serif",
        );
        root.style.setProperty(
          "--font-sans",
          "'Source Sans 3 Variable', sans-serif",
        );
        root.style.setProperty(
          "--font-code",
          "'Source Code Pro Variable', monospace",
        );
        root.style.setProperty("--font-italic", "'Playwrite NO', cursive");
      }
      return <Story />;
    },
  ],

  parameters: {
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
