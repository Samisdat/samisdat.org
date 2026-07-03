import {
    DemoAnimationsCompare,
    DemoAnimationsCssJs,
    DemoAnimationsJsAttributes,
    DemoAnimationsMorphCoffee,
    DemoAnimationsMorphThumb,
    DemoAnimationsMorphUgly,
    DemoAnimationsSvg,
} from '@/components/Markdown/ClientAnimations';
import { DemoBox } from '@samisdat/ui-components/DemoBox';
import { Heading } from '@samisdat/ui-components/Heading';
import { Stack } from '@samisdat/ui-components/Stack';

export default function Home() {
    return (
        <>
            <Heading>Animation</Heading>
            <DemoAnimationsMorphCoffee />
            <DemoAnimationsMorphThumb />
            Wenn man zwei verschiedenen Formen nicht als jeweils genau ein Pfad darstellen kann oder will, dann kann
            kann man es nicht morphen. Wenn die Anzahl der Punkte in den Pfaden unterschiedlich ist, dann gibt es keine
            Animation. Es wird einfach von einem zum anderen Pfad gewitched Wenn die Reihenfolge der Punkte nicht
            konsitent ist, dann passieren komische Dinge
            <Stack
                container
                directionSmall="column"
                directionMedium="row"
            >
                <Stack>
                    <DemoAnimationsMorphUgly />
                </Stack>
                <Stack>
                    <DemoBox>Mobile unten / Tablet rechts</DemoBox>
                </Stack>
            </Stack>
            foo
            <Stack
                container
                directionSmall="column"
                directionMedium="row"
            >
                <Stack>
                    <DemoAnimationsCompare />
                </Stack>
                <Stack>
                    <DemoBox>Mobile unten / Tablet rechts</DemoBox>
                </Stack>
            </Stack>
            <Heading>SVG Animation</Heading>
            <Stack
                container
                directionSmall="column"
                directionMedium="row"
            >
                <Stack>
                    <DemoAnimationsSvg />
                </Stack>
                <Stack>
                    <DemoBox>Mobile unten / Tablet rechts</DemoBox>
                </Stack>
            </Stack>
            <Heading>Animation per Javascript</Heading>
            <Stack
                container
                directionSmall="column"
                directionMedium="row"
            >
                <Stack>
                    <DemoAnimationsJsAttributes />
                </Stack>
                <Stack>
                    <DemoBox>Mobile unten / Tablet rechts</DemoBox>
                </Stack>
            </Stack>
            <Heading>Animation per CSS</Heading>
            <Stack
                container
                directionSmall="column"
                directionMedium="row"
            >
                <Stack>
                    <DemoAnimationsCssJs />
                </Stack>
                <Stack>
                    <DemoBox>Mobile unten / Tablet rechts</DemoBox>
                </Stack>
            </Stack>
        </>
    );
}
