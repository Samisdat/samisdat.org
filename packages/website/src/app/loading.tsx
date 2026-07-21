export default function Loading() {
    return (
        <div
            style={{
                padding: '2rem 0',
            }}
        >
            <div
                style={{
                    width: '60%',
                    height: '2.5rem',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'loading 1.5s infinite',
                    borderRadius: '4px',
                    marginBottom: '1.5rem',
                }}
            />
            <div
                style={{
                    width: '100%',
                    height: '1rem',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'loading 1.5s infinite',
                    borderRadius: '4px',
                    marginBottom: '0.75rem',
                }}
            />
            <div
                style={{
                    width: '100%',
                    height: '1rem',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'loading 1.5s infinite',
                    borderRadius: '4px',
                    marginBottom: '0.75rem',
                }}
            />
            <div
                style={{
                    width: '70%',
                    height: '1rem',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'loading 1.5s infinite',
                    borderRadius: '4px',
                }}
            />
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
