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
import { Hill100 } from './Hills/Hill100';
import { Hill110 } from './Hills/Hill110';
import { Hill120 } from './Hills/Hill120';
import { Hill130 } from './Hills/Hill130';
import { Before } from './Track/Before';
import { Behind } from './Track/Behind';
import { Track } from './Track/Track';

import { styled } from '@linaria/react';

const Svg = styled.svg`
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
            transform: translateY(-100%);
        }
    }
    animation-name: paralax-move;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-duration: 1ms;
    animation-timeline: scroll(root);
    animation-range: 0 ${props => props.speed || 500}px;
`;

export const Panorama = (): ReactElement => {
    const { sunTimes } = useTal();
    const { windowOpacity } = sunTimes;

    return (
        <Svg
            width="100%"
            height="100%"
            viewBox="0 0 1500 430"
            role="img"
            aria-label="Animiertes Wuppertal Stadtpanorama mit Tag-Nacht-Zyklus"
            style={{}}
        >
            <g id="Layer8">
                <Heaven />
                <g>
                    <WaterTowerLichtscheid />
                    <Hill010 />
                </g>
                <g>
                    <University />
                    <Hill020 />
                    <Hill040 />
                </g>
                <g>
                    <WaterTowerNaechstebreck />
                    <Hill030 />
                </g>
                <g>
                    <Hill050 />
                    <Tower1 />
                </g>
                <g>
                    <Tower2 />
                    <Hill060 />
                </g>
                <g>
                    <Tower3 />
                    <Hill070 />
                </g>
                <g>
                    <Wupper />
                    <Behind />
                    <Cars />
                    <Track />
                    <Before />
                    <Townhall />
                    <Oligsmuehle />
                    <AlterMarkt />
                </g>
                <Layer speed={300}>
                    <BeyenburgerDom />
                    <Hill080 />
                </Layer>
                <Layer speed={280}>
                    <Vohwinkel />
                    <Hill090 />
                    <RedCurch />
                </Layer>
                <Layer speed={260}>
                    <SchauspielHaus />
                    <Hill100 />
                    <BlueHouse />
                    <GreenHouse />
                </Layer>
                <Layer speed={240}>
                    <LilaCurch />
                    <Hill110 />
                </Layer>
                <Layer speed={220}>
                    <Hill120 />
                    <GreenTower />
                </Layer>
                <Layer speed={200}>
                    <GelberTurm />
                    <Hill130 />
                </Layer>
            </g>
            <Layer speed={200}>
                <Clock />
            </Layer>
            <style>{`
            .illumination {
                fill: #ffcb77;
                opacity: ${windowOpacity};
                transition: opacity 0.5s ease-in-out;
            }
        `}</style>
        </Svg>
    );
};
