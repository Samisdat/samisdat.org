import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DemoGhostRecorder } from '../GhostRecorderDemo';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const render = () => {
    const host = document.createElement('div');
    const root = createRoot(host);
    act(() => root.render(<DemoGhostRecorder />));

    return { host, unmount: () => act(() => root.unmount()) };
};

describe('DemoGhostRecorder', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('renders nothing outside development (tests, production builds)', () => {
        for (const mode of ['test', 'production']) {
            vi.stubEnv('NODE_ENV', mode);
            const { host, unmount } = render();

            expect(host.innerHTML).toBe('');
            unmount();
        }
    });

    it('shows the recorder while developing', () => {
        vi.stubEnv('NODE_ENV', 'development');
        const { host, unmount } = render();

        expect(host.textContent).toContain('Aufnehmen');
        unmount();
    });
});
