import { GelberTurm } from '@/components/Buildings/GelberTurm';
import { GreenHouse } from '@/components/Buildings/GreenHouse';
import { GreenTower } from '@/components/Buildings/GreenTower';
import { Clock } from '@/components/Clock/Clock';
import { Heaven } from '@/components/Heaven/Heaven';
import { useTal } from '@/lib/TalContext';
import { ReactElement } from 'react';
import { AlterMarkt } from './Buildings/AlterMarkt';
import { BeyenburgerDom } from './Buildings/BeyenburgerDom';
import { BlueHouse } from './Buildings/BlueHouse';
import { LilaCurch } from './Buildings/LilaChurch';
import { Oligsmuehle } from './Buildings/Oligsmuehle';
import { RedCurch } from './Buildings/RedCurch';
import { SchauspielHaus } from './Buildings/SchauspielHaus';
import { Tower1 } from './Buildings/Tower1';
import { Tower2 } from './Buildings/Tower2';
import { Tower3 } from './Buildings/Tower3';
import { Townhall } from './Buildings/Townhall';
import { University } from './Buildings/University';
import { Vohwinkel } from './Buildings/Vohwinkel';
import { WaterTowerLichtscheid } from './Buildings/WaterTowerLichtscheid';
import { WaterTowerNaechstebreck } from './Buildings/WaterTowerNaechstebreck';
import { Wupper } from './Buildings/Wupper';
import { Cars } from './Cars';
import { Hill010 } from './Hills/Hill010';
import { Hill020 } from './Hills/Hill020';
import { Hill030 } from './Hills/Hill030';
import { Hill040 } from './Hills/Hill040';
import { Hill050 } from './Hills/Hill050';
import { Hill060 } from './Hills/Hill060';
import { Hill070 } from './Hills/Hill070';
import { Hill080 } from './Hills/Hill080';
import { Hill090 } from './Hills/Hill090';
import { Hill100 } from './Hills/Hill3300';
import { Hill110 } from './Hills/Hill110';
import { Hill120 } from './Hills/Hill120';
import { Hill130 } from './Hills/Hill3200';
import { Before } from './Track/Before';
import { Behind } from './Track/Behind';
import { Track } from './Track/Track';

import { styled } from '@linaria/react';
import {PanoramaRaw} from "@/components/PanoramaRaw";

const PanoramaWrapper = styled.div`
    position: relative;
    background: lime;
    width: 100%;
    aspect-ratio: 1260/500;
    text-align: center;
    overflow: hidden;
`;

const Svg = styled.svg`
    position: absolute;
    left: 50%;
    display: block;
    height: 100%;
    transform: translateX(-50%);
    aspect-ratio: 1500/430;
    fill-rule: evenodd;
    clip-rule: evenodd;
    stroke-linejoin: round;
    stroke-miterlimit: 2;
`;

const Layer = styled.g`
    @keyframes paralax-move {
        from {
            transform: translateY(0);
        }

        to {
            transform: translateY(calc(var(--speed) * 50));
        }
    }
    animation-name: paralax-move;
    animation-timing-function: ease-out;
    animation-fill-mode: both;
    animation-duration: 1ms;
    animation-timeline: scroll(root);
`;

export const Panorama = (): ReactElement => {
    const { sunTimes } = useTal();
    const { windowOpacity } = sunTimes;

    // 1360
    return (
        <PanoramaWrapper>
            <PanoramaRaw/>
            {/*
            <Svg
                height="100%"
                viewBox="0 0 1500 430"
            >
                <g id="Layer8">
                    <Layer
                        speed={460}
                        style={{ '--speed': '13px' }}
                    >
                        <Heaven />
                    </Layer>
                    <Layer
                        speed={440}
                        style={{ '--speed': '12px' }}
                    >
                        <WaterTowerLichtscheid />
                        <Hill010 />
                    </Layer>
                    <Layer
                        speed={420}
                        style={{ '--speed': '11px' }}
                    >
                        <University />
                        <Hill020 />
                        <Hill040 />
                    </Layer>
                    <Layer
                        speed={400}
                        style={{ '--speed': '10px' }}
                    >
                        <WaterTowerNaechstebreck />
                        <Hill030 />
                    </Layer>
                    <Layer
                        speed={380}
                        style={{ '--speed': '9px' }}
                    >
                        <Hill050 />
                        <Tower1 />
                        <Tower2 />
                    </Layer>
                    <Layer
                        speed={360}
                        style={{ '--speed': '8px' }}
                    >
                        <Hill060 />
                    </Layer>
                    <Layer
                        speed={340}
                        style={{ '--speed': '7px' }}
                    >
                        <Tower3 />
                        <Hill070 />
                    </Layer>
                    <Layer
                        speed={320}
                        style={{ '--speed': '6px' }}
                    >
                        <Wupper />
                        <Behind />
                        <Cars />
                        <Track />
                        <Before />
                        <Townhall />
                        <Oligsmuehle />
                        <AlterMarkt />
                    </Layer>
                    <Layer
                        speed={300}
                        style={{ '--speed': '5px' }}
                    >
                        <BeyenburgerDom />
                        <Hill080 />
                    </Layer>
                    <Layer
                        speed={280}
                        style={{ '--speed': '4px' }}
                    >
                        <Vohwinkel />
                        <Hill090 />
                        <RedCurch />
                    </Layer>
                    <Layer
                        speed={260}
                        style={{ '--speed': '3px' }}
                    >
                        <SchauspielHaus />
                        <Hill100 />
                        <BlueHouse />
                        <GreenHouse />
                    </Layer>
                    <Layer
                        speed={240}
                        style={{ '--speed': '2px' }}
                    >
                        <LilaCurch />
                        <Hill110 />
                    </Layer>
                    <Layer
                        speed={220}
                        style={{ '--speed': '1px' }}
                    >
                        <Hill120 />
                        <GreenTower />
                    </Layer>
                    <Layer
                        speed={0}
                        style={{ '--speed': '0px' }}
                    >
                        <GelberTurm />
                        <Hill130 />
                    </Layer>
                </g>
                <Layer speed={200}>
                    <Clock />
                </Layer>
            </Svg>*/}
        </PanoramaWrapper>
    );
};
