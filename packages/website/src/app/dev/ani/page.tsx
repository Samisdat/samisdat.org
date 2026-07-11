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
import { Typo } from '@samisdat/ui-components/Typo';

export default function Home() {
    return (
        <>
            <Heading>Animation</Heading>
            <DemoAnimationsMorphCoffee />
            <DemoAnimationsMorphThumb />
            <Typo>
                Wenn man zwei verschiedenen Formen nicht als jeweils genau ein Pfad darstellen kann oder will, dann kann
                kann man es nicht morphen. Wenn die Anzahl der Punkte in den Pfaden unterschiedlich ist, dann gibt es
                keine Animation. Es wird einfach von einem zum anderen Pfad gewitched Wenn die Reihenfolge der Punkte
                nicht konsitent ist, dann passieren komische Dinge
            </Typo>
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
            <Typo>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, semper sit amet blandit nec,
                luctus vitae nisl. Mauris vulputate, dolor eget mollis elementum, erat lectus fringilla ligula, ac
                egestas dolor arcu elementum orci. Sed sit amet nunc lacus. Quisque sollicitudin rhoncus viverra.
                Praesent fringilla malesuada est non volutpat. Aenean in ultrices arcu, vel pulvinar lacus. Nam in velit
                ut augue laoreet luctus sit amet eu mi. Aliquam orci odio, mattis nec dolor sit amet, vulputate rutrum
                augue. Maecenas tincidunt augue a rhoncus pharetra. Vestibulum ante nibh, gravida at sagittis a, posuere
                at nisl. Nullam hendrerit, nunc quis porta varius, eros felis ullamcorper risus, sit amet volutpat dui
                ligula in erat. Vestibulum ac ultrices ipsum. Sed eu enim in mi volutpat congue malesuada ut tellus.
                Vestibulum bibendum diam sed massa varius, eget accumsan nisi sollicitudin.
            </Typo>
            <Typo>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, semper sit amet blandit nec,
                luctus vitae nisl. Mauris vulputate, dolor eget mollis elementum, erat lectus fringilla ligula, ac
                egestas dolor arcu elementum orci. Sed sit amet nunc lacus. Quisque sollicitudin rhoncus viverra.
                Praesent fringilla malesuada est non volutpat. Aenean in ultrices arcu, vel pulvinar lacus. Nam in velit
                ut augue laoreet luctus sit amet eu mi. Aliquam orci odio, mattis nec dolor sit amet, vulputate rutrum
                augue. Maecenas tincidunt augue a rhoncus pharetra. Vestibulum ante nibh, gravida at sagittis a, posuere
                at nisl. Nullam hendrerit, nunc quis porta varius, eros felis ullamcorper risus, sit amet volutpat dui
                ligula in erat. Vestibulum ac ultrices ipsum. Sed eu enim in mi volutpat congue malesuada ut tellus.
                Vestibulum bibendum diam sed massa varius, eget accumsan nisi sollicitudin.
            </Typo>
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
            <Typo>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, semper sit amet blandit nec,
                luctus vitae nisl. Mauris vulputate, dolor eget mollis elementum, erat lectus fringilla ligula, ac
                egestas dolor arcu elementum orci. Sed sit amet nunc lacus. Quisque sollicitudin rhoncus viverra.
                Praesent fringilla malesuada est non volutpat. Aenean in ultrices arcu, vel pulvinar lacus. Nam in velit
                ut augue laoreet luctus sit amet eu mi. Aliquam orci odio, mattis nec dolor sit amet, vulputate rutrum
                augue. Maecenas tincidunt augue a rhoncus pharetra. Vestibulum ante nibh, gravida at sagittis a, posuere
                at nisl. Nullam hendrerit, nunc quis porta varius, eros felis ullamcorper risus, sit amet volutpat dui
                ligula in erat. Vestibulum ac ultrices ipsum. Sed eu enim in mi volutpat congue malesuada ut tellus.
                Vestibulum bibendum diam sed massa varius, eget accumsan nisi sollicitudin.
            </Typo>
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
            <Typo>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, semper sit amet blandit nec,
                luctus vitae nisl. Mauris vulputate, dolor eget mollis elementum, erat lectus fringilla ligula, ac
                egestas dolor arcu elementum orci. Sed sit amet nunc lacus. Quisque sollicitudin rhoncus viverra.
                Praesent fringilla malesuada est non volutpat. Aenean in ultrices arcu, vel pulvinar lacus. Nam in velit
                ut augue laoreet luctus sit amet eu mi. Aliquam orci odio, mattis nec dolor sit amet, vulputate rutrum
                augue. Maecenas tincidunt augue a rhoncus pharetra. Vestibulum ante nibh, gravida at sagittis a, posuere
                at nisl. Nullam hendrerit, nunc quis porta varius, eros felis ullamcorper risus, sit amet volutpat dui
                ligula in erat. Vestibulum ac ultrices ipsum. Sed eu enim in mi volutpat congue malesuada ut tellus.
                Vestibulum bibendum diam sed massa varius, eget accumsan nisi sollicitudin.
            </Typo>
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
            <Typo>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, semper sit amet blandit nec,
                luctus vitae nisl. Mauris vulputate, dolor eget mollis elementum, erat lectus fringilla ligula, ac
                egestas dolor arcu elementum orci. Sed sit amet nunc lacus. Quisque sollicitudin rhoncus viverra.
                Praesent fringilla malesuada est non volutpat. Aenean in ultrices arcu, vel pulvinar lacus. Nam in velit
                ut augue laoreet luctus sit amet eu mi. Aliquam orci odio, mattis nec dolor sit amet, vulputate rutrum
                augue. Maecenas tincidunt augue a rhoncus pharetra. Vestibulum ante nibh, gravida at sagittis a, posuere
                at nisl. Nullam hendrerit, nunc quis porta varius, eros felis ullamcorper risus, sit amet volutpat dui
                ligula in erat. Vestibulum ac ultrices ipsum. Sed eu enim in mi volutpat congue malesuada ut tellus.
                Vestibulum bibendum diam sed massa varius, eget accumsan nisi sollicitudin.
            </Typo>
            <Typo>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, semper sit amet blandit nec,
                luctus vitae nisl. Mauris vulputate, dolor eget mollis elementum, erat lectus fringilla ligula, ac
                egestas dolor arcu elementum orci. Sed sit amet nunc lacus. Quisque sollicitudin rhoncus viverra.
                Praesent fringilla malesuada est non volutpat. Aenean in ultrices arcu, vel pulvinar lacus. Nam in velit
                ut augue laoreet luctus sit amet eu mi. Aliquam orci odio, mattis nec dolor sit amet, vulputate rutrum
                augue. Maecenas tincidunt augue a rhoncus pharetra. Vestibulum ante nibh, gravida at sagittis a, posuere
                at nisl. Nullam hendrerit, nunc quis porta varius, eros felis ullamcorper risus, sit amet volutpat dui
                ligula in erat. Vestibulum ac ultrices ipsum. Sed eu enim in mi volutpat congue malesuada ut tellus.
                Vestibulum bibendum diam sed massa varius, eget accumsan nisi sollicitudin.
            </Typo>
            <Typo>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, semper sit amet blandit nec,
                luctus vitae nisl. Mauris vulputate, dolor eget mollis elementum, erat lectus fringilla ligula, ac
                egestas dolor arcu elementum orci. Sed sit amet nunc lacus. Quisque sollicitudin rhoncus viverra.
                Praesent fringilla malesuada est non volutpat. Aenean in ultrices arcu, vel pulvinar lacus. Nam in velit
                ut augue laoreet luctus sit amet eu mi. Aliquam orci odio, mattis nec dolor sit amet, vulputate rutrum
                augue. Maecenas tincidunt augue a rhoncus pharetra. Vestibulum ante nibh, gravida at sagittis a, posuere
                at nisl. Nullam hendrerit, nunc quis porta varius, eros felis ullamcorper risus, sit amet volutpat dui
                ligula in erat. Vestibulum ac ultrices ipsum. Sed eu enim in mi volutpat congue malesuada ut tellus.
                Vestibulum bibendum diam sed massa varius, eget accumsan nisi sollicitudin.
            </Typo>
            <Typo>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, semper sit amet blandit nec,
                luctus vitae nisl. Mauris vulputate, dolor eget mollis elementum, erat lectus fringilla ligula, ac
                egestas dolor arcu elementum orci. Sed sit amet nunc lacus. Quisque sollicitudin rhoncus viverra.
                Praesent fringilla malesuada est non volutpat. Aenean in ultrices arcu, vel pulvinar lacus. Nam in velit
                ut augue laoreet luctus sit amet eu mi. Aliquam orci odio, mattis nec dolor sit amet, vulputate rutrum
                augue. Maecenas tincidunt augue a rhoncus pharetra. Vestibulum ante nibh, gravida at sagittis a, posuere
                at nisl. Nullam hendrerit, nunc quis porta varius, eros felis ullamcorper risus, sit amet volutpat dui
                ligula in erat. Vestibulum ac ultrices ipsum. Sed eu enim in mi volutpat congue malesuada ut tellus.
                Vestibulum bibendum diam sed massa varius, eget accumsan nisi sollicitudin.
            </Typo>
            <Typo>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, semper sit amet blandit nec,
                luctus vitae nisl. Mauris vulputate, dolor eget mollis elementum, erat lectus fringilla ligula, ac
                egestas dolor arcu elementum orci. Sed sit amet nunc lacus. Quisque sollicitudin rhoncus viverra.
                Praesent fringilla malesuada est non volutpat. Aenean in ultrices arcu, vel pulvinar lacus. Nam in velit
                ut augue laoreet luctus sit amet eu mi. Aliquam orci odio, mattis nec dolor sit amet, vulputate rutrum
                augue. Maecenas tincidunt augue a rhoncus pharetra. Vestibulum ante nibh, gravida at sagittis a, posuere
                at nisl. Nullam hendrerit, nunc quis porta varius, eros felis ullamcorper risus, sit amet volutpat dui
                ligula in erat. Vestibulum ac ultrices ipsum. Sed eu enim in mi volutpat congue malesuada ut tellus.
                Vestibulum bibendum diam sed massa varius, eget accumsan nisi sollicitudin.
            </Typo>
            <Typo>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, semper sit amet blandit nec,
                luctus vitae nisl. Mauris vulputate, dolor eget mollis elementum, erat lectus fringilla ligula, ac
                egestas dolor arcu elementum orci. Sed sit amet nunc lacus. Quisque sollicitudin rhoncus viverra.
                Praesent fringilla malesuada est non volutpat. Aenean in ultrices arcu, vel pulvinar lacus. Nam in velit
                ut augue laoreet luctus sit amet eu mi. Aliquam orci odio, mattis nec dolor sit amet, vulputate rutrum
                augue. Maecenas tincidunt augue a rhoncus pharetra. Vestibulum ante nibh, gravida at sagittis a, posuere
                at nisl. Nullam hendrerit, nunc quis porta varius, eros felis ullamcorper risus, sit amet volutpat dui
                ligula in erat. Vestibulum ac ultrices ipsum. Sed eu enim in mi volutpat congue malesuada ut tellus.
                Vestibulum bibendum diam sed massa varius, eget accumsan nisi sollicitudin.
            </Typo>
        </>
    );
}
