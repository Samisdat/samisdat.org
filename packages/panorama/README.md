# @samisdat/wtal-panorama

A React component that displays an animated Wuppertal panorama with realistic astronomical sun and moon movements based on real-time calculations.

## Features

- 🌅 **Realistic Astronomy**: Uses [SunCalc](https://github.com/mourner/suncalc) for accurate sunrise, sunset, and twilight times
- 📍 **Location-Based**: Calculated for Wuppertal, Germany (51.2562°N, 7.1508°E)
- 🌓 **Seasonal Variation**: Automatically adapts to seasons (longer summer days, shorter winter days)
- ⏰ **Time Control**: Adjustable time factor for faster/slower animations
- 🎨 **SVG-Based**: Smooth, scalable vector graphics
- ⚡ **Next.js Ready**: Built for React and Next.js applications

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
- **React State** to animate the sun and moon positions along a defined SVG path
- **TalContext** (Time Acceleration Layer) to control simulation speed
- Automatic transitions between day/night with realistic dawn and dusk phases

### Time Calculations

- Day period: Sunrise to Sunset (variable based on season)
- Night period: Sunset to Sunrise (next day)
- Twilight transitions: Using astronomical dawn/dusk calculations
- Position calculation: Linear interpolation along SVG path based on time progress

## Dependencies

- React >= 18.0.0
- Next.js >= 14.0.0
- SunCalc ^1.9.0

## License

MIT

## Repository

[https://github.com/Samisdat/wtal-panorama](https://github.com/Samisdat/wtal-panorama)
