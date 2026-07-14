export default function Loading() {
    return (
        <div
            style={{
                padding: '2rem 0',
            }}
        >
            <div
                style={{
                    width: '70%',
                    height: '3rem',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'loading 1.5s infinite',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                }}
            />
            <div
                style={{
                    width: '30%',
                    height: '0.875rem',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'loading 1.5s infinite',
                    borderRadius: '4px',
                    marginBottom: '2rem',
                }}
            />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '4rem',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'loading 1.5s infinite',
                        borderRadius: '4px',
                    }}
                />
                <div
                    style={{
                        width: '100%',
                        height: '4rem',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'loading 1.5s infinite',
                        borderRadius: '4px',
                    }}
                />
                <div
                    style={{
                        width: '85%',
                        height: '3rem',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'loading 1.5s infinite',
                        borderRadius: '4px',
                    }}
                />
            </div>
            <style>{`
                @keyframes loading {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }
            `}</style>
        </div>
    );
}
