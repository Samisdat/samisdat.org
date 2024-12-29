'use client';

import {FC, useEffect, useState} from "react";

type SunPosition = {
    x: number;
    y: number;
}

const width = 1100;
const height = 350;
const center:SunPosition =
    {x:750, y:220}


export const Sun: FC<{}> = () => {
    const [pos, setPos] = useState<SunPosition>(center);

    const [angle, setAngle] = useState<number>(0);

    useEffect(() => {

        setTimeout(() => {
            setAngle(angle + 0.01);
        }, 60);
    }, [angle]); // Make sure the effect runs only once

    useEffect(() => {

console.log(angle, Math.sin(angle), )

        const x = Math.cos(angle) * width / 2 + center.x
        const y = Math.sin(angle) * height / 2 + center.y

        setPos({
            x,y
        })

    }, [angle]); // Make sure the effect runs only once



    return (
        <circle cx={pos.x} cy={pos.y} r="30"
                style={{
                    fill: "#F0FF5E",
                }}/>

    );
};

