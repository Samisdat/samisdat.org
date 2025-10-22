export const Cars = () => {
    const duration = '80s';
    const start = 100;
    const stop = 1400;

    return (
        <>
            <rect
                x={start}
                y="274"
                width={'82'}
                height="12"
                strokeWidth="3"
                style={{ fill: '#00AFEB', stroke: '#000051' }}
            >
                <animate
                    attributeName="x"
                    values={`${start};${stop};${start}`}
                    dur={duration}
                    repeatCount="indefinite"
                />
            </rect>
            <rect
                x={1330}
                y="274"
                width={'82'}
                height="12"
                strokeWidth="3"
                style={{ fill: '#00AFEB', stroke: '#000051' }}
            >
                <animate
                    attributeName="x"
                    values={`${stop};${start};${stop}`}
                    dur={duration}
                    repeatCount="indefinite"
                />
            </rect>
        </>
    );
};
