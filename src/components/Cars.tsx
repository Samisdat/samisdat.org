"use client";

import { useState, useEffect } from "react";
import { Car } from "./Car";

export const Cars = () => {
  const [x1, setX1] = useState(250);
  const [x2, setX2] = useState(1200);

  const width = 81.778;

  useEffect(() => {

    setTimeout(() => {
      let nextX1 = x1 + 1;
      let nextX2 = x2 - 1;

      if (nextX1 > 1500) {
        nextX1 = -width;
      }
      if (nextX2 < -width) {
        nextX2 = 1500;
      }

      setX1(nextX1);
      setX2(nextX2);
    }, 10);
  }, [x1, x2]); // Make sure the effect runs only once

  return (
    <>
      <Car x={x1} width={width} />
      <Car x={x2} width={width} />
    </>
  );
};
