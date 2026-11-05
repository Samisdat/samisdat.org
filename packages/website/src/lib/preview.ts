import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Preview links for unpublished posts: /preview/<slug>/<token>.
 *
 * The token is an HMAC of the slug with the secret `PREVIEW_SECRET`, so
 * every link opens exactly one post. Another slug needs another token, and
 * changing the secret revokes all links at once. Without a secret every
 * token is invalid and the preview route answers 404.
 */

const TOKEN_LENGTH = 32;

export const getPreviewSecret = (): string | undefined => process.env.PREVIEW_SECRET || undefined;

export const createPreviewToken = (slug: string, secret: string): string =>
    createHmac('sha256', secret).update(slug).digest('base64url').slice(0, TOKEN_LENGTH);

export const isValidPreviewToken = (slug: string, token: string, secret = getPreviewSecret()): boolean => {
    if (!secret) {
        return false;
    }

    const expected = Buffer.from(createPreviewToken(slug, secret));
    const actual = Buffer.from(token);

    return expected.length === actual.length && timingSafeEqual(expected, actual);
};
