import { Grid } from '@/components/Grid';
import { Heading } from '@/components/Heading';
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
                style={{ gap: '1rem', marginBottom: '2rem' }}
            >
                <Stack style={{ padding: '1rem', backgroundColor: '#f0f0f0', flex: 1 }}>
                    Mobile oben / Tablet links
                </Stack>
                <Stack style={{ padding: '1rem', backgroundColor: '#e0e0e0', flex: 1 }}>
                    Mobile unten / Tablet rechts
                </Stack>
            </Stack>

            <Heading level={2}>Stack: column → row mit Reordering</Heading>
            <Stack
                container
                directionSmall="column"
                directionMedium="row"
                style={{ gap: '1rem', marginBottom: '2rem' }}
            >
                <Stack
                    orderSmall={1}
                    orderMedium={2}
                    style={{ padding: '1rem', backgroundColor: '#e8f4f8', flex: 1 }}
                >
                    Mobile 1. (oben) / Tablet 2. (rechts)
                </Stack>
                <Stack
                    orderSmall={2}
                    orderMedium={1}
                    style={{ padding: '1rem', backgroundColor: '#f4e8f8', flex: 1 }}
                >
                    Mobile 2. (unten) / Tablet 1. (links)
                </Stack>
            </Stack>

            <Heading level={2}>Stack: column → row → row (3 Items)</Heading>
            <Stack
                container
                directionSmall="column"
                directionMedium="row"
                style={{ gap: '1rem', marginBottom: '2rem' }}
            >
                <Stack style={{ padding: '1rem', backgroundColor: '#f8e8e8', flex: 1 }}>Item 1</Stack>
                <Stack style={{ padding: '1rem', backgroundColor: '#e8f8e8', flex: 1 }}>Item 2</Stack>
                <Stack style={{ padding: '1rem', backgroundColor: '#e8e8f8', flex: 1 }}>Item 3</Stack>
            </Stack>

            <Grid container>
                <Grid small={4}>Lorem</Grid>
                <Grid small={4}>Lorem</Grid>
            </Grid>
        </>
    );
}
