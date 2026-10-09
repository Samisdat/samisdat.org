import type { Meta, StoryObj } from '@storybook/react'

// Per-ref :has() CSS that the remark plugin would inject at build time.
// Required for Stage 1 hover to work in the story.
const PER_REF_CSS = `
  :has([data-ref="anim"]:is(.ref-target:hover,.ref-target:focus-visible,a.ref:hover,a.ref:focus-visible)) [data-ref="anim"] {
    background: var(--scholion-hover-bg);
  }
  :has([data-explains="anim"]:hover) a.ref[data-ref="anim"] {
    outline: var(--scholion-b-outline);
    outline-offset: 2px;
  }
`

function ScholionDemo() {
    return (
        <div
            style={{
                fontFamily: 'var(--font-sans, Georgia, serif)',
                fontSize: '1rem',
                lineHeight: 1.65,
                maxWidth: '40rem',
                padding: '1.5rem',
                color: 'var(--color-text-default)',
                background: 'var(--color-surface-default)',
            }}
        >
            <style>{PER_REF_CSS}</style>
            <pre
                style={{
                    background: 'var(--color-surface-emphasis)',
                    color: 'var(--color-text-default)',
                    borderRadius: 6,
                    padding: '1rem',
                    fontSize: '.82rem',
                    lineHeight: 1.75,
                    fontFamily: 'var(--font-code, monospace)',
                    overflowX: 'auto',
                    marginBottom: '1.5rem',
                }}
            >
                <code>
                    {`<svg viewBox="0 0 200 200">
  <g id="spinner">
    `}
                    <a
                        id="ref-anim"
                        className="ref"
                        data-ref="anim"
                        href="#explain-anim"
                        aria-describedby="desc-anim"
                        aria-label="animateTransform, zur Erklärung"
                        style={{ color: 'var(--color-ink-teal)' }}
                    >
                        {'<animateTransform'}
                    </a>
                    {` attributeName="transform" type="rotate" dur="4s" />
  </g>
</svg>`}
                </code>
            </pre>

            <p id="explain-anim" data-explains="anim" tabIndex={-1}>
                <span id="desc-anim">
                    Das{' '}
                    <span className="ref-target" data-ref="anim">
                        {'<animateTransform>'}
                    </span>{' '}
                    steckt in der Gruppe. Daher wird diese animiert, und alles, was in{' '}
                    <code style={{ fontFamily: 'var(--font-code, monospace)', fontSize: '0.85em' }}>
                        #spinner
                    </code>{' '}
                    liegt, dreht sich mit.
                </span>{' '}
                <a className="backref" href="#ref-anim" aria-label="Zurück zum Code: animateTransform">
                    Zum Code
                </a>
            </p>
        </div>
    )
}

const meta = {
    title: 'Scholion/Stages',
    component: ScholionDemo,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof ScholionDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Stage0Html: Story = {}

export const Stage1HoverOnLemma: Story = {
    parameters: {
        pseudo: { hover: ['.ref-target[data-ref="anim"]'] },
    },
}

export const Stage1HoverOnToken: Story = {
    parameters: {
        pseudo: { hover: ['a.ref[data-ref="anim"]'] },
    },
}
