import type { Metadata } from 'next';
import './globalStyle';

export const metadata: Metadata = {
    title: 'Panorama',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
