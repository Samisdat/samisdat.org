import { notFound } from 'next/navigation';

import {
    DemoAnimationsCompare,
    DemoAnimationsCssJs,
    DemoAnimationsJsAttributes,
    DemoAnimationsMorphCoffee,
    DemoAnimationsMorphThumb,
    DemoAnimationsMorphUgly,
    DemoAnimationsSvg,
} from '@/components/Markdown/ClientAnimations';
import { Heading } from '@samisdat/ui-components/Heading';
import { Stack } from '@samisdat/ui-components/Stack';

export default function Home() {
    if (process.env.NODE_ENV === 'production') {
        return notFound();
    }
    return (
        <>
            <Heading>Animation</Heading>
            <DemoAnimationsMorphCoffee />
            <DemoAnimationsMorphThumb />
            <DemoAnimationsMorphUgly />
            <DemoAnimationsCompare />
            <Heading>SVG Animation</Heading>
            <DemoAnimationsSvg />
            <Heading>Animation per Javascript</Heading>
            <DemoAnimationsJsAttributes />
            <Heading>Animation per CSS</Heading>
            <DemoAnimationsCssJs />
        </>
    );
}
