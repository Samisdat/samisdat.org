const duration = "80s";
const start = 100;
const stop = 1400;

export const Cars = () => (
  <>
    <rect className={"carCss"} x={start} y={"309"}>
      <animate
        attributeName="x"
        values={`${start};${stop};${start}`}
        dur={duration}
        repeatCount="indefinite"
      />
    </rect>
    <rect className={"carCss"} x={1330} y={"309"}>
      <animate
        attributeName="x"
        values={`${stop};${start};${stop}`}
        dur={duration}
        repeatCount="indefinite"
      />
    </rect>
  </>
);
