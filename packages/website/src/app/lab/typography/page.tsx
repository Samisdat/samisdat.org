import { TypeSpecimen } from '@/components/TypeSpecimen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Typography',
    robots: { index: false, follow: false },
};

export default async function TypographyLab({ searchParams }: { searchParams: Promise<{ preset?: string }> }) {
    const { preset } = await searchParams;

    return (
        <TypeSpecimen
            initial={preset}
            syncUrl
        />
    );
}
