import { styled } from '@linaria/react';

import { BrowserChrome, BrowserChromeBar } from '../BrowserChrome';
import { light } from '../light';
import { metal } from '../Metal';
import { BlogCollectorCardProps } from '../props';
import { Banner, Inner } from '../Shared';
import { Scan } from './QrCode';
import { Shield } from './Shield';

// Hue wash plus a light cone behind the screenshot, painted as background layers of the face itself.
// The cone is the former pseudo-element box (left/right -10%, top -5%, height 75%) as a gradient ellipse.
const FrontInner = styled(Inner)`
    background:
        radial-gradient(60% 37.5% at 50% 32.5%, color-mix(in oklab, var(--hue) 35%, transparent), transparent),
        radial-gradient(
            120% 70% at 50% 25%,
            color-mix(in oklab, var(--hue) 30%, var(--color-surface-subtle)),
            transparent 70%
        ),
        var(--color-surface-emphasis);

    ${light(`
        background:
            radial-gradient(60% 37.5% at 50% 32.5%, color-mix(in oklab, var(--hue) 22%, transparent), transparent),
            radial-gradient(
                120% 70% at 50% 25%,
                color-mix(in oklab, var(--hue) 18%, var(--color-surface-raised)),
                transparent 70%
            ),
            var(--color-surface-emphasis);
    `)}
`;

const NameBanner = styled(Banner)`
    position: absolute;
    left: 5%;
    right: 5%;
    bottom: 52cqw;

    > span {
        padding: 2.6cqw 6cqw 2.2cqw;
        font-size: 8.6cqw;
        font-weight: 800;
        line-height: 1;
        letter-spacing: 0.01em;
    }
`;

const DomainBanner = styled(Banner)`
    --notch: 3cqw;

    position: absolute;

    left: 17%;
    right: 17%;
    bottom: 43.5cqw;

    > span {
        --shift: -8%;

        padding: 1.8cqw 4cqw 1.5cqw;
        font-size: 5cqw;
        font-weight: 700;
        line-height: 1;
        letter-spacing: 0.04em;
        text-transform: none;
    }
`;

type FrontProps = Pick<BlogCollectorCardProps, 'name' | 'domain' | 'no' | 'total' | 'shot' | 'shotLight' | 'hue'>;

export const Front = ({ name, domain, no, total, shot, shotLight, hue }: FrontProps) => {
    return (
        <FrontInner style={{ ['--hue' as string]: hue }}>
            <BrowserChrome>
                <BrowserChromeBar aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>{domain}</span>
                </BrowserChromeBar>
                {/* oxlint-disable-next-line next/no-img-element -- ui-components is framework-agnostic; the shot is a small static file */}
                <img
                    src={shot}
                    alt={`Startseite von ${domain}`}
                    loading="lazy"
                    data-theme-shot={shotLight ? 'dark' : undefined}
                />
                {shotLight && (
                    // oxlint-disable-next-line next/no-img-element -- see above
                    <img
                        src={shotLight}
                        alt={`Startseite von ${domain}`}
                        loading="lazy"
                        data-theme-shot="light"
                    />
                )}
            </BrowserChrome>
            <NameBanner>
                <span className={metal}>{name}</span>
            </NameBanner>
            <DomainBanner>
                <span className={metal}>{domain}</span>
            </DomainBanner>
            <Shield
                no={no}
                total={total}
            />
            <Scan domain={domain} />
        </FrontInner>
    );
};
