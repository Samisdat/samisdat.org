import { memo } from 'react';

import { GreenHouse } from '@/components/Buildings/GreenHouse';
import { SchauspielHaus, SchauspielHausCanopy } from '@/components/Buildings/SchauspielHaus';
import { Hardt } from '@/components/Hills/Hardt';
import { Hill100 } from '@/components/Hills/Hill0100';
import { Hill1110 } from '@/components/Hills/Hill1100';
import { Hill2800 } from '@/components/Hills/Hill2800';
import { Hill2900 } from '@/components/Hills/Hill2900';
import { Hill3200 } from '@/components/Hills/Hill3200';
import { Hill3800 } from '@/components/Hills/Hill3800';
import { LilaChurchHill } from '@/components/Hills/LilaChurchHill';
import { VohwinkelBack } from '@/components/Hills/VohwinkelBack';

import { BeyenburgerDom } from './Buildings/BeyenburgerDom';
import { BlueHouse } from './Buildings/BlueHouse';
import { Elisenturm } from './Buildings/Elisenturm';
import { LilaChurch } from './Buildings/LilaChurch';
import { RedChurch } from './Buildings/RedChurch';
import { Tower1 } from './Buildings/Tower1';
import { Tower2 } from './Buildings/Tower2';
import { University } from './Buildings/University';
import { Vohwinkel } from './Buildings/Vohwinkel';
import { WaterTowerLichtscheid } from './Buildings/WaterTowerLichtscheid';
import { WaterTowerNaechstebreck } from './Buildings/WaterTowerNaechstebreck';
import { FrontLayer } from './FrontLayer';
import { Hill010 } from './Hills/Hill010';
import { Hill020 } from './Hills/Hill020';
import { Hill030 } from './Hills/Hill030';
import { Hill040 } from './Hills/Hill040';
import { Hill050 } from './Hills/Hill050';
import { ParallaxLayer } from './ParallaxLayer';
import { Track } from './Track/Track';

/** The far hills and buildings, up to the Beyenburger Dom. */
const Far = () => (
    <>
        <ParallaxLayer
            scrollspeed={15}
            depth={-7}
        >
            <WaterTowerLichtscheid />
            <Hill010 />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={14}
            depth={-6}
        >
            <University />
            <Hill020 />
            <Hill040 />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={13}
            depth={-5}
        >
            <WaterTowerNaechstebreck />
            <Hill030 />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={12}
            depth={-4}
        >
            <Tower2 />
            <Hill050 />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={11}
            depth={-3}
        >
            <Tower1 />
            <Hill1110 />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={10}
            depth={-2}
        >
            <Elisenturm />
            <Hardt />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={9}
            depth={-1}
        >
            <BeyenburgerDom />
            <Hill2800 />
        </ParallaxLayer>
    </>
);

/** The near hills and buildings, from the Schwebebahn to the front. */
const Near = () => (
    <>
        <ParallaxLayer
            scrollspeed={8}
            depth={0}
        >
            <Track />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={7}
            depth={1}
        >
            <Hill2900 />
            <RedChurch />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={6}
            depth={2}
        >
            <LilaChurch />
            <LilaChurchHill />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={5}
            depth={3}
        >
            <Hill100 />
            <GreenHouse />
            <BlueHouse />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={4}
            depth={4}
        >
            <SchauspielHaus />
            <Hill3200 />
            <SchauspielHausCanopy />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={3}
            depth={5}
        >
            <VohwinkelBack />
            <Vohwinkel />
            <Hill3800 />
        </ParallaxLayer>
        <FrontLayer />
    </>
);

/**
 * The city below the sky: hills and buildings, back to front. It does not change with the time (the windows light up
 * through the --twilight property), so it is drawn once and not again on every tick of the clock.
 */
export const Landscape = memo(function Landscape() {
    return (
        <>
            <Far />
            <Near />
        </>
    );
});
