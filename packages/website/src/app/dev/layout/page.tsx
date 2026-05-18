import { DemoBox } from '@/components/Demobox';
import { Grid } from '@/components/Grid';
import { Heading } from '@samisdat/ui-components/Heading';
import { Stack } from '@/components/Stack';

export default async function Home() {
    return (
        <>
            <Heading>Lorem Ipsum</Heading>

            <Heading level={2}>Stack: column → row</Heading>
            <Stack
                container
                directionSmall="column"
                directionMedium="row"
            >
                <Stack>
                    <DemoBox>Mobile oben / Tablet links</DemoBox>
                </Stack>
                <Stack>
                    <DemoBox>Mobile unten / Tablet rechts</DemoBox>
                </Stack>
            </Stack>

            <Heading level={2}>Stack: column → row mit Reordering</Heading>
            <Stack
                container
                directionSmall="column"
                directionMedium="row"
            >
                <Stack
                    orderSmall={1}
                    orderMedium={2}
                >
                    <DemoBox>Mobile 1. (oben) / Tablet 2. (rechts)</DemoBox>
                </Stack>
                <Stack
                    orderSmall={2}
                    orderMedium={1}
                >
                    <DemoBox color="red">Mobile 2. (unten) / Tablet 1. (links)</DemoBox>
                </Stack>
            </Stack>

            <Heading level={2}>Stack: column → row → row (3 Items)</Heading>
            <Stack
                container
                directionSmall="column"
                directionMedium="row"
            >
                <Stack>
                    <DemoBox>Item 1</DemoBox>
                </Stack>
                <Stack>
                    <DemoBox>Item 2</DemoBox>
                </Stack>
                <Stack>
                    <DemoBox>Item 3</DemoBox>
                </Stack>
            </Stack>

            <Grid container>
                <Grid small={4}>Lorem</Grid>
                <Grid small={4}>Lorem</Grid>
            </Grid>
        </>
    );
}
