import { styled } from '@linaria/react';

import type { Device } from '../script';

export const Panel = styled.div`
    margin-top: 0.5rem;
    border: 1px solid var(--color-border-default);
    padding: 0.5rem;
    font-family: var(--font-code);
    font-size: 0.875rem;
    color: var(--color-text-default);
    background-color: var(--color-surface-raised);
    display: grid;
    gap: 0.5rem;
`;

export const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
`;

export const Button = styled.button`
    appearance: none;
    font: inherit;
    font-weight: bold;
    color: var(--color-surface-default);
    background-color: var(--color-text-default);
    border: 1px solid var(--color-text-default);
    padding: 0.125rem 0.625rem;
    cursor: pointer;

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }

    &:focus-visible {
        outline: 2px solid var(--color-ink-sapphire);
        outline-offset: 2px;
    }
`;

const Fieldset = styled.fieldset`
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.75rem;
    margin: 0;
    padding: 0;
    border: none;

    & legend {
        float: left;
        padding: 0;
        margin-right: 0.75rem;
    }

    & label {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
    }

    & input:focus-visible {
        outline: 2px solid var(--color-ink-sapphire);
        outline-offset: 2px;
    }
`;

export const Status = styled.span`
    font-weight: bold;
`;

export const Hint = styled.p`
    margin: 0;
    color: var(--color-text-subtle);
`;

export const ToleranceLabel = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;

    & input {
        width: 10rem;
        accent-color: var(--color-ink-sapphire);
    }

    & input:focus-visible {
        outline: 2px solid var(--color-ink-sapphire);
        outline-offset: 2px;
    }
`;

export const Code = styled.pre`
    margin: 0;
    padding: 0.5rem;
    overflow: auto;
    max-height: 16rem;
    white-space: pre;
    font-family: var(--font-code);
    font-size: 0.8125rem;
    color: var(--color-text-default);
    background-color: var(--color-surface-default);
    border: 1px solid var(--color-border-default);

    &:focus-visible {
        outline: 2px solid var(--color-ink-sapphire);
        outline-offset: 2px;
    }
`;

const DEVICES: ReadonlyArray<{ value: Device; label: string }> = [
    { value: 'pad', label: 'Trackpad' },
    { value: 'touch', label: 'Touch' },
    { value: 'mouse', label: 'Maus' },
];

export type DevicePickerProps = {
    value: Device;
    disabled: boolean;
    name: string;
    onChange: (device: Device) => void;
};

export const DevicePicker = ({ value, disabled, name, onChange }: DevicePickerProps) => (
    <Fieldset disabled={disabled}>
        <legend>Gerät</legend>
        {DEVICES.map((d) => (
            <label key={d.value}>
                <input
                    type="radio"
                    name={name}
                    value={d.value}
                    checked={value === d.value}
                    onChange={() => onChange(d.value)}
                />
                {d.label}
            </label>
        ))}
    </Fieldset>
);
