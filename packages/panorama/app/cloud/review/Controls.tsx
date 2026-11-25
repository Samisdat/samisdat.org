import { BUMP_KINDS, BumpCloudType } from '@/components/Clouds/bumpCloud';

export interface Settings {
    type: BumpCloudType;
    count: number;
    start: number;
    light: number;
    night: number;
    colours: Record<ColourKey, string>;
}

type ColourKey = '--d-b' | '--d-s' | '--n-b' | '--n-s';

export const DEFAULT_SETTINGS: Settings = {
    type: 'cumulus',
    count: 100,
    start: 1,
    light: 0,
    night: 0,
    colours: {
        '--d-b': '#d7d7d7',
        '--d-s': '#a7bed0',
        '--n-b': 'oklch(0.33 0.05 266)',
        '--n-s': 'oklch(0.23 0.06 272)',
    },
};

const COLOUR_LABELS: Record<ColourKey, string> = {
    '--d-b': 'day body',
    '--d-s': 'day shade',
    '--n-b': 'night body',
    '--n-s': 'night shade',
};

const TYPES = Object.keys(BUMP_KINDS) as BumpCloudType[];

interface ControlsProps {
    settings: Settings;
    onChange: (settings: Settings) => void;
}

/** What the grid shows: which type, how many from which seed, the light, and the day and night tones. */
export const Controls = ({ settings, onChange }: ControlsProps) => {
    const set = <Key extends keyof Settings>(key: Key, value: Settings[Key]) => onChange({ ...settings, [key]: value });

    return (
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'end' }}>
            <label>
                type{' '}
                <select
                    value={settings.type}
                    onChange={event => set('type', event.target.value as BumpCloudType)}
                >
                    {TYPES.map(name => (
                        <option key={name}>{name}</option>
                    ))}
                </select>
            </label>
            <label>
                count{' '}
                <input
                    type="number"
                    min={1}
                    max={200}
                    value={settings.count}
                    onChange={event => set('count', Number(event.target.value))}
                />
            </label>
            <label>
                first seed{' '}
                <input
                    type="number"
                    value={settings.start}
                    onChange={event => set('start', Number(event.target.value))}
                />
            </label>
            <label>
                light {settings.light}{' '}
                <input
                    type="range"
                    min={-2}
                    max={2}
                    step={1}
                    value={settings.light}
                    onChange={event => set('light', Number(event.target.value))}
                />
            </label>
            <label>
                night {settings.night.toFixed(2)}{' '}
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={settings.night}
                    onChange={event => set('night', Number(event.target.value))}
                />
            </label>
            {(Object.keys(settings.colours) as ColourKey[]).map(key => (
                <label key={key}>
                    {COLOUR_LABELS[key]}{' '}
                    <input
                        value={settings.colours[key]}
                        onChange={event => set('colours', { ...settings.colours, [key]: event.target.value })}
                    />
                </label>
            ))}
        </section>
    );
};
