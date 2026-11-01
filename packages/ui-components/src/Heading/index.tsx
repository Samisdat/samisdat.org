import { styled } from '@linaria/react';
import { ComponentType, FC, HTMLAttributes } from 'react';

// --f-head, --hw, --hls, --hz (h1), --h2z, --h3z, --v-head come from a typography preset (website); the sizes are fluid and set on html (see the website layout)
const fontFamily = `
  font-family: var(--f-head, var(--font-heading));
  font-variation-settings: var(--v-head, normal);
`;

const H1 = styled.h1`
    ${fontFamily}
    color: var(--color-text-emphasis);
    font-size: var(--hz);
    font-weight: var(--hw, 700);
    line-height: 1.05;
    letter-spacing: var(--hls, -0.03em);
`;
const H2 = styled.h2`
    ${fontFamily}
    color: var(--color-text-emphasis);
    font-size: var(--h2z);
    font-weight: var(--hw, 650);
    line-height: 1.15;
    letter-spacing: var(--hls, -0.022em);
`;

const H3 = styled.h3`
    ${fontFamily}
    color: var(--color-text-emphasis);
    font-size: var(--h3z);
    font-weight: var(--hw, 600);
    line-height: 1.25;
    letter-spacing: var(--hls, -0.015em);
`;

const H4 = styled.h4`
    font-size: var(--typo-h4-size);
    ${fontFamily}
`;

const H5 = styled.h5`
    font-size: var(--typo-h5-size);
    ${fontFamily}
`;

const H6 = styled.h6`
    font-size: var(--typo-h6-size);
    ${fontFamily}
`;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
    level?: HeadingLevel;
};

const mapLevelToStyle: {
    [key in HeadingLevel]: ComponentType<HTMLAttributes<HTMLHeadingElement>>;
} = {
    1: H1,
    2: H2,
    3: H3,
    4: H4,
    5: H5,
    6: H6,
};

export const Heading: FC<HeadingProps> = ({ children, level = 2, ...props }) => {
    const StyledTag = mapLevelToStyle[level];
    return <StyledTag {...props}>{children}</StyledTag>;
};
