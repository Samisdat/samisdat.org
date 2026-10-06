# @samisdat/wtal-panorama

A React component that displays an animated Wuppertal panorama with realistic astronomical sun and moon movements based on real-time calculations.

## Features

- 🌅 **Realistic Astronomy**: Uses [SunCalc](https://github.com/mourner/suncalc) and [astronomy-engine](https://github.com/cosinekitty/astronomy) for accurate celestial positions
- 📍 **Location-Based**: Calculated for Wuppertal, Germany (51.2562°N, 7.1508°E)
- 🌓 **Seasonal Variation**: Automatically adapts to seasons (longer summer days, shorter winter days)
- ⏰ **Time Control**: Adjustable time factor for faster/slower animations
- 🎨 **SVG-Based**: Smooth, scalable vector graphics
- ⚡ **Next.js Ready**: Built for React 19 and Next.js 16

## Installation

```bash
npm install @samisdat/wtal-panorama
```

## Usage

### Basic Usage

```tsx
import { WtalPanorama } from '@samisdat/wtal-panorama';

export default function App() {
  return (
    <div>
      <WtalPanorama />
    </div>
  );
}
```

### Advanced Usage (with TalProvider)

If you want to use the panorama with custom controls or access to the time context:

```tsx
import { TalProvider, Panorama } from '@samisdat/wtal-panorama';

export default function App() {
  return (
    <TalProvider>
      <Panorama />
      {/* Add your custom controls here */}
    </TalProvider>
  );
}
```

## How It Works

The panorama uses:
- **SunCalc** to calculate precise sunrise and sunset times for Wuppertal
- **astronomy-engine** for accurate moon position and phase calculations
- **React State** to animate the sun and moon positions along a defined SVG path
- **TalContext** (Time Acceleration Layer) to control simulation speed
- Automatic transitions between day/night with realistic dawn and dusk phases

### Time Calculations

- Day period: Sunrise to Sunset (variable based on season)
- Night period: Sunset to Sunrise (next day)
- Twilight transitions: Using astronomical dawn/dusk calculations
- Position calculation: Linear interpolation along SVG path based on time progress

## Colors

All 43 panorama colors are available as a typed TypeScript object and as standalone CSS custom properties.

### TypeScript

```ts
import { panoramaColors } from '@samisdat/wtal-panorama/colors';
// panoramaColors["deep-pine"] === "oklch(0.32 0.11 150)"
```

Use the values directly in Linaria/CSS-in-JS so build-time evaluation embeds literal color strings — no runtime CSS variable lookup required:

```tsx
import { panoramaColors } from '@samisdat/wtal-panorama/colors';
import { styled } from '@linaria/react';

const Svg = styled.svg`
  background: ${panoramaColors["deep-pine"]};
`;
```

### CSS custom properties

```css
@import '@samisdat/wtal-panorama/colors.css';
/* defines --panorama-deep-pine, --panorama-river-blue, … on :root */
```

The stylesheet `style.css` already contains these custom properties and the panorama component styles.

### Updating colors

Edit `tokens/colors.tokens.json` (DTCG format), then run:

```bash
pnpm build:colors
```

This regenerates `src/generated/colors.ts`, `dist/colors.css`, and the `:root` block in `panorama.css`.

## Dependencies

- React >= 19.2.3
- astronomy-engine ^2.1.1

## License

MIT

## Repository

[https://github.com/Samisdat/samisdat.org](https://github.com/Samisdat/samisdat.org/tree/main/packages/panorama)
