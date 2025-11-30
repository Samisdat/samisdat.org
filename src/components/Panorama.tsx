import { GelberTurm } from '@/components/Buildings/GelberTurm';
import { GreenHouse } from '@/components/Buildings/GreenHouse';
import { GreenTower } from '@/components/Buildings/GreenTower';
import { Clock } from '@/components/Clock/Clock';
import { Heaven } from '@/components/Heaven/Heaven';
import { useTal } from '@/lib/TalContext';
import { ReactElement } from 'react';
import { BeyenburgerDom } from './Buildings/BeyenburgerDom';
import { BlueHouse } from './Buildings/BlueHouse';
import { LilaChurch } from './Buildings/LilaChurch';
import { RedCurch } from './Buildings/RedCurch';
import { Tower1 } from './Buildings/Tower1';
import { Tower2 } from './Buildings/Tower2';
import { Tower3 } from './Buildings/Tower3';
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

import { Hill1110 } from '@/components/Hills/Hill1100';
import { Hill1310 } from '@/components/Hills/Hill1300';
import { Hill2800 } from '@/components/Hills/Hill2800';
import { Hill2900 } from '@/components/Hills/Hill2900';
import { Hill3200 } from '@/components/Hills/Hill3200';
import { Hill3300 } from '@/components/Hills/Hill3300';
import { Hill3800 } from '@/components/Hills/Hill3800';
import { Hill4100 } from '@/components/Hills/Hill4100';
import { PanoramaRaw } from '@/components/PanoramaRaw';

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

const Layer = styled.g`
    @keyframes paralax-move {
        from {
            transform: translateY(0);
        }

        to {
            transform: translateY(calc(var(--speed) * 25));
        }
    }
    animation-name: paralax-move;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-duration: 1ms;
    animation-timeline: scroll(root);

    --speed: ${props => props.speed || 0}px;
`;

export const Panorama = (): ReactElement => {
    const { sunTimes } = useTal();
    const { windowOpacity } = sunTimes;

    return (
        <PanoramaWrapper>
            <PanoramaRaw />
            <Svg
                height="100%"
                viewBox="0 0 1700 500"
                style={{ fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: 2 }}
            >
                <Heaven />
                <Layer speed={13}>
                    <WaterTowerLichtscheid />
                    <Hill010 />
                </Layer>
                <Layer speed={12}>
                    <University />
                    <Hill020 />
                    <Hill040 />
                </Layer>
                <Layer speed={11}>
                    <WaterTowerNaechstebreck />
                    <Hill030 />
                </Layer>
                <Layer speed={10}>
                    <Tower2 />
                    <Hill050 />
                </Layer>
                <Layer speed={9}>
                    <Tower1 />
                    <Hill1110 />
                </Layer>
                <Layer speed={8}>
                    <Tower3 />
                    <Hill1310 />
                </Layer>
                <Layer speed={7}>
                    <BeyenburgerDom />
                    <Hill2800 />
                </Layer>
                <Layer speed={6}>
                    <Track />
                </Layer>
                <Layer speed={5}>
                    <Hill2900 />
                    <Vohwinkel />
                    <RedCurch />
                </Layer>
                <Layer speed={4}>
                    <Hill3200 />
                    <LilaChurch />
                </Layer>
                <Layer speed={3}>
                    <Tower3 />
                    <Hill3300 />
                </Layer>
                <Layer speed={2}>
                    <GreenHouse />
                    <Hill3200 />
                </Layer>
                <BlueHouse />
                <Layer speed={1}>
                    <GreenTower />
                    <Hill3800 />
                </Layer>
                <Layer>
                    <GelberTurm />
                    <Hill4100 />
                    <Clock />
                </Layer>
            </Svg>
        </PanoramaWrapper>
    );
};
