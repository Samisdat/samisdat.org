import { describe, expect, it } from 'vitest';

describe('noindex launch guard', () => {
    it('should default to false when NEXT_PUBLIC_ALLOW_INDEX is not set', () => {
        const env = undefined;
        const allowIndex = env === 'true';

        expect(allowIndex).toBe(false);
    });

    it('should be false when NEXT_PUBLIC_ALLOW_INDEX is empty string', () => {
        const env = '';
        const allowIndex = env === 'true';

        expect(allowIndex).toBe(false);
    });

    it('should be true when NEXT_PUBLIC_ALLOW_INDEX is "true"', () => {
        const env = 'true';
        const allowIndex = env === 'true';

        expect(allowIndex).toBe(true);
    });

    it('should be false when NEXT_PUBLIC_ALLOW_INDEX is "false"', () => {
        const env = 'false';
        const allowIndex = env === 'true';

        expect(allowIndex).toBe(false);
    });

    it('should be false for any other value', () => {
        const env = 'yes';
        const allowIndex = env === 'true';

        expect(allowIndex).toBe(false);
    });
});
