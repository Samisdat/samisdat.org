import { GelberTurm } from '@/components/Buildings/GelberTurm';
import { GreenHouse } from '@/components/Buildings/GreenHouse';
import { GreenTower } from '@/components/Buildings/GreenTower';
import { Clock } from '@/components/Clock/Clock';
import { Heaven } from '@/components/Heaven/Heaven';
import { useTal } from '@/lib/TalContext';
import { ReactElement, useRef } from 'react';
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
import { VohwinkelBack } from '@/components/Hills/VohwinkelBack';
import { ParallaxCoords, mouseParallax } from '@/components/hook/mouseParallax';

import './panorama.css';
import { ParallaxLayer } from './ParallaxLayer';

export const Panorama = (): ReactElement => {
    const ref = useRef<HTMLDivElement | null>(null);

    mouseParallax(ref);

    const { sunTimes } = useTal();
    const { windowOpacity } = sunTimes;

    const modifier = 3;

    return (
        <>
            <div
                ref={ref}
                className={'panorama'}
            >
                <svg
                    height="100%"
                    viewBox="0 0 1700 500"
                    style={{
                        fillRule: 'evenodd',
                        clipRule: 'evenodd',
                        strokeLinejoin: 'round',
                        strokeMiterlimit: 2,
                    }}
                >
                    <Heaven />
                    <ParallaxLayer
                        speed={15}
                        depth={-7}
                    >
                        <WaterTowerLichtscheid />
                        <Hill010 />
                    </ParallaxLayer>
                    <ParallaxLayer
                        speed={13}
                        depth={-6}
                    >
                        <University />
                        <Hill020 />
                        <Hill040 />
                    </ParallaxLayer>
                    <ParallaxLayer
                        speed={12}
                        depth={-5}
                    >
                        <WaterTowerNaechstebreck />
                        <Hill030 />
                    </ParallaxLayer>
                    <ParallaxLayer
                        speed={11}
                        depth={-4}
                    >
                        <Tower2 />
                        <Hill050 />
                    </ParallaxLayer>
                    <ParallaxLayer
                        speed={10}
                        depth={-3}
                    >
                        <Tower1 />
                        <Hill1110 />
                    </ParallaxLayer>
                    <ParallaxLayer
                        speed={9}
                        depth={-2}
                    >
                        <Elisenturm />
                        <Hardt />
                    </ParallaxLayer>
                    <ParallaxLayer
                        speed={8}
                        depth={-1}
                    >
                        <BeyenburgerDom />
                        <Hill2800 />
                    </ParallaxLayer>

                    <ParallaxLayer
                        speed={7}
                        depth={0}
                    >
                        <Track />
                    </ParallaxLayer>

                    <ParallaxLayer
                        speed={6}
                        depth={1}
                    >
                        <Hill2900 />
                        <RedCurch />
                    </ParallaxLayer>
                    <ParallaxLayer
                        speed={5}
                        depth={2}
                    >
                        <LilaChurch />
                        <LilaChurchHill />
                    </ParallaxLayer>
                    <ParallaxLayer
                        speed={4}
                        depth={3}
                    >
                        <Hill100 />
                        <GreenHouse />
                        <BlueHouse />
                    </ParallaxLayer>
                    <ParallaxLayer
                        speed={3}
                        depth={4}
                    >
                        <SchauspielHaus />
                        <Hill3200 />
                        <SchauspielHausCanopy />
                    </ParallaxLayer>
                    <ParallaxLayer
                        speed={2}
                        depth={5}
                    >
                        <VohwinkelBack />
                        <Vohwinkel />
                        <Hill3800 />
                    </ParallaxLayer>

                    <ParallaxLayer
                        speed={1}
                        depth={6}
                    >
                        <GreenTower />
                        <BeforeGreenTower />
                    </ParallaxLayer>
                    <ParallaxLayer
                        speed={1}
                        depth={7}
                    >
                        <GelberTurm />
                        <Hill4100 />
                    </ParallaxLayer>
                    <Clock />
                </svg>
            </div>
        </>
    );
};
