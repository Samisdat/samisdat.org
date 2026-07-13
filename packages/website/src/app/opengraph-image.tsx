import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'samisdat — Texte über Technologie, Gestaltung und das Dazwischen';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    color: '#e0e0e0',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Skyline silhouette hint */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '120px',
                        background:
                            'linear-gradient(0deg, rgba(15,52,96,0.8) 0%, transparent 100%)',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 700,
                        letterSpacing: '-2px',
                        marginBottom: 24,
                        display: 'flex',
                    }}
                >
                    samisdat
                </div>
                <div
                    style={{
                        fontSize: 28,
                        opacity: 0.75,
                        maxWidth: '600px',
                        textAlign: 'center',
                        display: 'flex',
                    }}
                >
                    Texte über Technologie, Gestaltung und das Dazwischen
                </div>
            </div>
        ),
        { ...size },
    );
}
