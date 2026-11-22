/**
 * Builds the star extract for the panorama: `pnpm generate:stars`.
 *
 * Source: HYG v4.4 (CC BY-SA 4.0), pinned by URL and SHA-256. The extract is a
 * derivative and stays under CC BY-SA 4.0, see public/stars/LICENSE.txt.
 * Output: public/stars/stars.json, rows [raDeg, decDeg, mag, colourIndex],
 * brightest first (the index is the deterministic seed for the twinkle).
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const SOURCE_URL = 'https://codeberg.org/astronexus/hyg/media/branch/main/data/hyg/CURRENT/hyg_v44.csv.gz';
const SOURCE_SHA256 = '00b349893b9a53106dd488d8371e8d2fa586043e500bb3cdb8bff3931682197d';

/** Faintest star in the extract. Tune here, then regenerate. */
const MAGNITUDE_LIMIT = 4.5;
/** Fallback for stars without a colour index (white). */
const DEFAULT_COLOUR_INDEX = 0.5;

const OUT_DIR = new URL('../public/stars/', import.meta.url);

type Star = [ra: number, dec: number, mag: number, ci: number];

const round = (value: number, digits: number) => Number(value.toFixed(digits));

const splitCsvLine = (line: string): string[] => {
    const fields: string[] = [];
    let current = '';
    let quoted = false;

    for (const char of line) {
        if (char === '"') {
            quoted = !quoted;
        } else if (char === ',' && !quoted) {
            fields.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    fields.push(current);

    return fields;
};

const parseStars = (csv: string): Star[] => {
    const [header, ...lines] = csv.split('\n');
    const columns = splitCsvLine(header);
    const col = (name: string) => columns.indexOf(name);
    const [iId, iRa, iDec, iMag, iCi] = ['id', 'ra', 'dec', 'mag', 'ci'].map(col);

    const stars: Star[] = [];
    for (const line of lines) {
        if (!line) continue;
        const row = splitCsvLine(line);
        const mag = Number(row[iMag]);
        // id 0 is the Sun
        if (row[iId] === '0' || !Number.isFinite(mag) || mag > MAGNITUDE_LIMIT) continue;

        const ci = row[iCi] === '' ? DEFAULT_COLOUR_INDEX : Number(row[iCi]);
        // HYG gives right ascension in hours
        stars.push([round(Number(row[iRa]) * 15, 3), round(Number(row[iDec]), 3), round(mag, 2), round(ci, 2)]);
    }

    return stars.sort((a, b) => a[2] - b[2]);
};

const main = async () => {
    const response = await fetch(SOURCE_URL);
    if (!response.ok) {
        console.error(`Download failed: ${response.status} ${SOURCE_URL}`);
        process.exit(1);
    }

    const archive = Buffer.from(await response.arrayBuffer());
    const sha256 = createHash('sha256').update(archive).digest('hex');
    if (sha256 !== SOURCE_SHA256) {
        console.error(`Checksum mismatch: expected ${SOURCE_SHA256}, got ${sha256}`);
        process.exit(1);
    }

    const stars = parseStars(gunzipSync(archive).toString('utf8'));

    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(new URL('stars.json', OUT_DIR), JSON.stringify(stars));
    console.log(`${stars.length} stars with magnitude <= ${MAGNITUDE_LIMIT}`);
};

main().catch(error => {
    console.error(error);
    process.exit(1);
});
