
export const Checkerboard = () =>  (
        <>
                <defs>
                    <pattern
                        id="checkerboard"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect
                            width="10"
                            height="10"
                            fill="#e8e8e8"
                        />
                        <rect
                            width="5"
                            height="5"
                            fill="#cfcfcf"
                        />
                        <rect
                            x="5"
                            y="5"
                            width="5"
                            height="5"
                            fill="#cfcfcf"
                        />
                    </pattern>
                </defs>
            <rect
                x="0"
                y="0"
                width="200"
                height="30"
                fill="url(#checkerboard-css)"
            />
        </>

    );


