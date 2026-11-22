import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';

import type { PlayFunctionContext } from 'storybook/internal/csf';

// Many story pages run side by side in one headless browser; state updates can lag behind the default 1s.
const PATIENT = { timeout: 5000 };

const speedLabel = (canvas: ReturnType<typeof within>) => canvas.getByText(/Speed \(/).textContent;

/**
 * Shared play function for demos that render a PlaybackControl: autoplay in view, pause/play
 * (pointer and keyboard), speed buttons, the slider and reset. Every step asserts the
 * visible change instead of an internal callback.
 */
export const exercisePlayback =
    ({ resetsSpeed = true } = {}) =>
    async ({ canvasElement }: Pick<PlayFunctionContext, 'canvasElement'>) => {
        const canvas = within(canvasElement);
        const toggleButton = (name: RegExp) => canvas.findByRole('button', { name }, PATIENT);

        // The demo autoplays once it intersects the viewport; wait for that before driving it by hand.
        await expect(await toggleButton(/pause/i)).toBeVisible();

        // Pointer: pausing swaps the label.
        await userEvent.click(await toggleButton(/pause/i));
        await expect(await toggleButton(/play/i)).toBeVisible();

        // Keyboard: Enter on the focused toggle resumes.
        (await toggleButton(/play/i)).focus();
        await userEvent.keyboard('{Enter}');
        await expect(await toggleButton(/pause/i)).toBeVisible();

        // Some demos have no speed control.
        const hasSpeed = canvas.queryByRole('slider', { name: 'Speed' }) !== null;
        const initial = hasSpeed ? speedLabel(canvas) : null;
        if (hasSpeed) {
            // Speed buttons and the slider change the label.
            await userEvent.click(canvas.getByRole('button', { name: '[ + ]' }));
            await waitFor(() => expect(speedLabel(canvas)).not.toBe(initial), PATIENT);

            await userEvent.click(canvas.getByRole('button', { name: '[ - ]' }));
            await waitFor(() => expect(speedLabel(canvas)).toBe(initial), PATIENT);

            // user-event does not emulate arrow keys on range inputs, so the slider is driven by a change event.
            const slider = canvas.getByRole('slider', { name: 'Speed' }) as HTMLInputElement;
            await fireEvent.change(slider, { target: { value: slider.max } });
            await waitFor(() => expect(speedLabel(canvas)).not.toBe(initial), PATIENT);
        }

        // Reset stops playback and, where the demo supports it, restores the speed.
        await userEvent.click(canvas.getByRole('button', { name: /reset/i }));
        if (hasSpeed && resetsSpeed) await waitFor(() => expect(speedLabel(canvas)).toBe(initial), PATIENT);
        await expect(await toggleButton(/play/i)).toBeVisible();
    };
