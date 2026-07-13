/**
 * Generate a static OG image (1200×630) from the panorama SVG.
 *
 * Run: node --experimental-modules scripts/generate-og-image.mjs
 * Output: packages/website/src/app/opengraph-image.png
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, '..');
const repoRoot = resolve(pkgRoot, '..', '..');

const sharp = require(resolve(repoRoot, 'node_modules/.pnpm/sharp@0.34.5/node_modules/sharp'));

const WIDTH = 1200;
const HEIGHT = 630;

// Sky gradient + simplified silhouette + branding as self-contained SVG
const panoramaSvgRaw = readFileSync(resolve(repoRoot, 'packages/panorama/assets/panorama.svg'), 'utf8');

// Extract just the path data within an artistically composed OG frame
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a1628"/>
      <stop offset="40%" stop-color="#152238"/>
      <stop offset="100%" stop-color="#1a3a5c"/>
    </linearGradient>
    <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a2d1a"/>
      <stop offset="100%" stop-color="#0d1a0d"/>
    </linearGradient>
  </defs>

  <!-- Sky background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#sky)"/>

  <!-- Stars -->
  <circle cx="150" cy="80" r="1.2" fill="#ffffff" opacity="0.6"/>
  <circle cx="320" cy="120" r="0.8" fill="#ffffff" opacity="0.4"/>
  <circle cx="580" cy="60" r="1.0" fill="#ffffff" opacity="0.5"/>
  <circle cx="750" cy="140" r="1.3" fill="#ffffff" opacity="0.3"/>
  <circle cx="900" cy="90" r="0.9" fill="#ffffff" opacity="0.5"/>
  <circle cx="1050" cy="50" r="1.1" fill="#ffffff" opacity="0.4"/>
  <circle cx="1120" cy="130" r="0.7" fill="#ffffff" opacity="0.6"/>
  <circle cx="200" cy="180" r="0.8" fill="#ffffff" opacity="0.3"/>
  <circle cx="450" cy="160" r="1.0" fill="#ffffff" opacity="0.4"/>
  <circle cx="680" cy="200" r="0.6" fill="#ffffff" opacity="0.3"/>

  <!-- Moon -->
  <circle cx="980" cy="120" r="28" fill="#e8e4d4" opacity="0.9"/>
  <circle cx="990" cy="115" r="24" fill="url(#sky)" opacity="0.7"/>

  <!-- Distant hills silhouette -->
  <path d="M0,480 Q100,420 200,440 Q350,390 500,410 Q600,380 700,400 Q800,370 900,390 Q1000,360 1100,380 Q1150,370 1200,385 L1200,630 L0,630 Z"
        fill="#0f1f0f" opacity="0.7"/>

  <!-- Main hill silhouette with buildings -->
  <path d="M0,520 Q50,490 120,500 L130,460 L138,460 L138,500
        Q200,485 280,495 L285,450 L290,450 L290,430 L294,430 L294,450 L299,450 L299,495
        Q350,480 420,490 L425,440 L430,435 L435,440 L435,490
        Q500,478 580,485 L583,420 L587,415 L591,420 L591,485
        Q650,475 720,480 L722,445 L726,440 L730,445 L730,480
        Q800,470 880,478 L882,430 L886,425 L890,430 L890,478
        Q940,472 1000,476 L1003,440 L1008,435 L1013,440 L1013,476
        Q1060,470 1120,475 L1123,450 L1127,445 L1131,450 L1131,475
        Q1160,472 1200,476 L1200,630 L0,630 Z"
        fill="#0a1a0a"/>

  <!-- Schwebebahn track line -->
  <line x1="0" y1="498" x2="1200" y2="488" stroke="#2a4a3a" stroke-width="2" opacity="0.6"/>
  <line x1="0" y1="501" x2="1200" y2="491" stroke="#1a3a2a" stroke-width="1.5" opacity="0.4"/>

  <!-- Building windows (warm lights) -->
  <rect x="131" y="465" width="3" height="4" fill="#ffd080" opacity="0.7"/>
  <rect x="134" y="472" width="3" height="4" fill="#ffd080" opacity="0.5"/>
  <rect x="287" y="438" width="3" height="5" fill="#ffd080" opacity="0.6"/>
  <rect x="291" y="445" width="3" height="4" fill="#ffd080" opacity="0.4"/>
  <rect x="584" y="430" width="3" height="5" fill="#ffd080" opacity="0.7"/>
  <rect x="584" y="440" width="3" height="4" fill="#ffd080" opacity="0.5"/>
  <rect x="724" y="452" width="3" height="4" fill="#ffd080" opacity="0.6"/>
  <rect x="884" y="435" width="3" height="5" fill="#ffd080" opacity="0.5"/>
  <rect x="1005" y="445" width="3" height="4" fill="#ffd080" opacity="0.6"/>
  <rect x="1125" y="455" width="3" height="4" fill="#ffd080" opacity="0.5"/>

  <!-- Site title -->
  <text x="600" y="290" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="84" font-weight="400" letter-spacing="-2"
        fill="#e8e4d4">samisdat</text>

  <!-- Tagline -->
  <text x="600" y="345" text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="22" font-weight="300"
        fill="#a0b8c8" opacity="0.85">Texte über Technologie, Gestaltung und das Dazwischen</text>
</svg>`;

const outputPath = resolve(repoRoot, 'packages/website/src/app/opengraph-image.png');

await sharp(Buffer.from(ogSvg))
    .png({ quality: 90 })
    .toFile(outputPath);

console.log(`✓ OG image generated: ${outputPath}`);

// Also generate twitter-image (same dimensions for summary_large_image)
const twitterPath = resolve(repoRoot, 'packages/website/src/app/twitter-image.png');
await sharp(Buffer.from(ogSvg))
    .png({ quality: 90 })
    .toFile(twitterPath);

console.log(`✓ Twitter image generated: ${twitterPath}`);
