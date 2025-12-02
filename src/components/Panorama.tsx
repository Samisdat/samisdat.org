import { GelberTurm } from '@/components/Buildings/GelberTurm';
import { GreenHouse } from '@/components/Buildings/GreenHouse';
import { GreenTower } from '@/components/Buildings/GreenTower';
import { Clock } from '@/components/Clock/Clock';
import { Heaven } from '@/components/Heaven/Heaven';
import { useTal } from '@/lib/TalContext';
import {ReactElement, RefObject, useRef} from 'react';
import { BeyenburgerDom } from './Buildings/BeyenburgerDom';
import { BlueHouse } from './Buildings/BlueHouse';
import { Elisenturm } from './Buildings/Elisenturm';
import { LilaChurch } from './Buildings/LilaChurch';
import { RedCurch } from './Buildings/RedCurch';
import { Tower1 } from './Buildings/Tower1';
import { Tower2 } from './Buildings/Tower2';
import { University } from './Buildings/University';
import { Vohwinkel } from './Buildings/Vohwinkel';
import { WaterTowerLichtscheid } from './Buildings/WaterTowerLichtscheid';
import { WaterTowerNaechstebreck } from './Buildings/WaterTowerNaechstebreck';
import { Hill010 } from './Hills/Hill010';
import { Hill020 } from './Hills/Hill020';
import { Hill030 } from './Hills/Hill030';
import { Hill040 } from './Hills/Hill040';
import { Hill050 } from './Hills/Hill050';
import { Track } from './Track/Track';

import { styled } from '@linaria/react';

import { SchauspielHaus, SchauspielHausCanopy } from '@/components/Buildings/SchauspielHaus';
import { BeforeGreenTower } from '@/components/Hills/BeforeGreenTower';
import { Hardt } from '@/components/Hills/Hardt';
import { Hill100 } from '@/components/Hills/Hill0100';
import { Hill1110 } from '@/components/Hills/Hill1100';
import { Hill2800 } from '@/components/Hills/Hill2800';
import { Hill2900 } from '@/components/Hills/Hill2900';
import { Hill3200 } from '@/components/Hills/Hill3200';
import { Hill3800 } from '@/components/Hills/Hill3800';
import { Hill4100 } from '@/components/Hills/Hill4100';
import { LilaChurchHill } from '@/components/Hills/LilaChurchHill';
import { VohwinkelBAck } from '@/components/Hills/VohwinkelBack';
import {useParallaxPosition} from "@/components/hook/useParallaxPosition";
import {useParallaxMouse} from "@/components/hook/useParallaxMouse";
import {HTMLDivElement} from "happy-dom";

const PanoramaWrapper = styled.div`
    position: relative;
    background: lime;
    border-bottom: 10px solid red;
    width: 100%;
    aspect-ratio: 1280/500;
    text-align: center;
    overflow: hidden;
`;

const Svg = styled.svg`
    position: absolute;
    left: 50%;
    display: block;
    height: 100%;
    transform: translateX(-50%);
    aspect-ratio: 1700/500;
    fill-rule: evenodd;
    clip-rule: evenodd;
    stroke-linejoin: round;
    stroke-miterlimit: 2;
`;

export const ParallaxLayer = styled.g`
    @keyframes paralax-move {
        from {
            transform: translateY(0);
        }

        to {
            transform: translateY(calc(var(--speed) * 40));
        }
    }
    animation-name: paralax-move;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-duration: 1ms;
    animation-timeline: scroll(root);

    --speed: ${props => props.speed || 0}px;
    --parallaxX: ${props => props.x || 0}px;
`;

export const Panorama = (): ReactElement => {

    const { coords, handleMouseMove, handleMouseLeave } =
        useParallaxPosition();

    const { sunTimes } = useTal();
    const { windowOpacity } = sunTimes;

    return (
        <>
        <PanoramaWrapper
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}

        >
            <Svg
                height="100%"
                viewBox="0 0 1700 500"
                style={{ fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: 2 }}
            >
                <Heaven />
                <ParallaxLayer speed={15}>
                    <WaterTowerLichtscheid />
                    <Hill010 />
                </ParallaxLayer>
                <ParallaxLayer speed={13}>
                    <University />
                    <Hill020 />
                    <Hill040 />
                </ParallaxLayer>
                <ParallaxLayer speed={12}>
                    <WaterTowerNaechstebreck />
                    <Hill030 />
                </ParallaxLayer>
                <ParallaxLayer speed={11}>
                    <Tower2 />
                    <Hill050 />
                </ParallaxLayer>
                <ParallaxLayer speed={10}>
                    <Tower1 />
                    <Hill1110 />
                </ParallaxLayer>
                <ParallaxLayer speed={9}>
                    <Elisenturm />
                    <Hardt />
                </ParallaxLayer>
                <ParallaxLayer speed={8}>
                    <BeyenburgerDom />
                    <Hill2800 />
                </ParallaxLayer>
                <ParallaxLayer speed={7}>
                    <Track />
                </ParallaxLayer>
                <ParallaxLayer speed={6}>
                    <Hill2900 />
                    <RedCurch />
                </ParallaxLayer>
                <ParallaxLayer speed={5}>
                    <LilaChurch />
                    <LilaChurchHill />
                </ParallaxLayer>
                <ParallaxLayer speed={4}>
                    <Hill100 />
                    <GreenHouse />
                    <BlueHouse />
                </ParallaxLayer>
                <ParallaxLayer speed={3}>
                    <SchauspielHaus />
                    <Hill3200 />
                    <SchauspielHausCanopy />
                </ParallaxLayer>
                <ParallaxLayer speed={2}>
                    <VohwinkelBAck />
                    <Vohwinkel />
                    <Hill3800 />
                </ParallaxLayer>
                <ParallaxLayer speed={1} depth={1}>
                    <GreenTower />
                    <BeforeGreenTower />
                </ParallaxLayer>
                <GelberTurm />
                <Hill4100 />
                <Clock />
                {/*

                <ParallaxLayer speed={4}>
                    <Hill2250/>
                </ParallaxLayer>
                <ParallaxLayer speed={4}>
                    <Hill3200 />
                </ParallaxLayer>

                <ParallaxLayer speed={1}>
                    <Vohwinkel />
                    <Hill3800 />
                </ParallaxLayer>
                <ParallaxLayer>
                    <Hill4100 />
                </ParallaxLayer>
                */}
            </Svg>
        </PanoramaWrapper>
            <div>
                {coords.x}/{coords.y}/
            </div>

    </>


);
};
