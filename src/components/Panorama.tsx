import { GelberTurm } from "@/components/Buildings/GelberTurm";
import { GreenHouse } from "@/components/Buildings/GreenHouse";
import { GreenTower } from "@/components/Buildings/GreenTower";
import { Clock } from "@/components/Clock/Clock";
import { Heaven } from "@/components/Heaven/Heaven";
import { useTal } from "@/lib/TalContext";
import { FC, ReactElement, RefObject, useRef } from "react";
import { BeyenburgerDom } from "./Buildings/BeyenburgerDom";
import { BlueHouse } from "./Buildings/BlueHouse";
import { Elisenturm } from "./Buildings/Elisenturm";
import { LilaChurch } from "./Buildings/LilaChurch";
import { RedCurch } from "./Buildings/RedCurch";
import { Tower1 } from "./Buildings/Tower1";
import { Tower2 } from "./Buildings/Tower2";
import { University } from "./Buildings/University";
import { Vohwinkel } from "./Buildings/Vohwinkel";
import { WaterTowerLichtscheid } from "./Buildings/WaterTowerLichtscheid";
import { WaterTowerNaechstebreck } from "./Buildings/WaterTowerNaechstebreck";
import { Hill010 } from "./Hills/Hill010";
import { Hill020 } from "./Hills/Hill020";
import { Hill030 } from "./Hills/Hill030";
import { Hill040 } from "./Hills/Hill040";
import { Hill050 } from "./Hills/Hill050";
import { Track } from "./Track/Track";

import {
  SchauspielHaus,
  SchauspielHausCanopy,
} from "@/components/Buildings/SchauspielHaus";
import { BeforeGreenTower } from "@/components/Hills/BeforeGreenTower";
import { Hardt } from "@/components/Hills/Hardt";
import { Hill100 } from "@/components/Hills/Hill0100";
import { Hill1110 } from "@/components/Hills/Hill1100";
import { Hill2800 } from "@/components/Hills/Hill2800";
import { Hill2900 } from "@/components/Hills/Hill2900";
import { Hill3200 } from "@/components/Hills/Hill3200";
import { Hill3800 } from "@/components/Hills/Hill3800";
import { Hill4100 } from "@/components/Hills/Hill4100";
import { LilaChurchHill } from "@/components/Hills/LilaChurchHill";
import { VohwinkelBack } from "@/components/Hills/VohwinkelBack";
import {
  ParallaxCoords,
  useParallaxPosition,
} from "@/components/hook/useParallaxPosition";
import { HTMLDivElement } from "happy-dom";

import "./panorama.css";

const parallax = (depth: number, coords: ParallaxCoords) => {
  const x = coords.x * depth || 0;
  const y = coords.y * depth || 0;

  console.log(x, y, coords.x);

  return { transform: `translate(${x}px, ${y}px)` };
};

export const Panorama = (): ReactElement => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { coords } = useParallaxPosition(ref);

  const { sunTimes } = useTal();
  const { windowOpacity } = sunTimes;

  const modifier = 3;

  return (
    <>
      <div ref={ref} className={"panorama"}>
        <svg
          height="100%"
          viewBox="0 0 1700 500"
          style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinejoin: "round",
            strokeMiterlimit: 2,
          }}
        >
          <Heaven />
          <g
            className="parallax"
            speed={15}
            style={{ ...parallax(-7 * modifier, coords) }}
          >
            <WaterTowerLichtscheid />
            <Hill010 />
          </g>
          <g
            className="parallax"
            speed={13}
            style={{ ...parallax(-6 * modifier, coords) }}
          >
            <University />
            <Hill020 />
            <Hill040 />
          </g>
          <g
            className="parallax"
            speed={12}
            style={{ ...parallax(-5 * modifier, coords) }}
          >
            <WaterTowerNaechstebreck />
            <Hill030 />
          </g>
          <g
            className="parallax"
            speed={11}
            style={{ ...parallax(-4 * modifier, coords) }}
          >
            <Tower2 />
            <Hill050 />
          </g>
          <g
            className="parallax"
            speed={10}
            style={{ ...parallax(-3 * modifier, coords) }}
          >
            <Tower1 />
            <Hill1110 />
          </g>
          <g
            className="parallax"
            speed={9}
            style={{ ...parallax(-2 * modifier, coords) }}
          >
            <Elisenturm />
            <Hardt />
          </g>
          <g
            className="parallax"
            speed={8}
            style={{ ...parallax(-1 * modifier, coords) }}
          >
            <BeyenburgerDom />
            <Hill2800 />
          </g>

          <g className="parallax" speed={7} style={{ ...parallax(0, coords) }}>
            <Track />
          </g>

          <g
            className="parallax"
            speed={6}
            style={{ ...parallax(1 * modifier, coords) }}
          >
            <Hill2900 />
            <RedCurch />
          </g>
          <g
            className="parallax"
            speed={5}
            style={{ ...parallax(2 * modifier, coords) }}
          >
            <LilaChurch />
            <LilaChurchHill />
          </g>
          <g
            className="parallax"
            speed={4}
            style={{ ...parallax(3 * modifier, coords) }}
          >
            <Hill100 />
            <GreenHouse />
            <BlueHouse />
          </g>
          <g
            className="parallax"
            speed={3}
            style={{ ...parallax(4 * modifier, coords) }}
          >
            <SchauspielHaus />
            <Hill3200 />
            <SchauspielHausCanopy />
          </g>
          <g
            className="parallax"
            speed={2}
            style={{ ...parallax(5 * modifier, coords) }}
          >
            <VohwinkelBack />
            <Vohwinkel />
            <Hill3800 />
          </g>

          <g
            className="parallax"
            speed={1}
            style={{ ...parallax(6 * modifier, coords) }}
          >
            <GreenTower />
            <BeforeGreenTower />
          </g>
          <g
            className="parallax"
            speed={1}
            style={{ ...parallax(7 * modifier, coords) }}
          >
            <GelberTurm />
            <Hill4100 />
            <Clock />
          </g>
        </svg>
      </div>
      <div>
        {coords.x}/{coords.y}/
      </div>
    </>
  );
};
