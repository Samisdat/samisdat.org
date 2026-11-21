import { GelberTurm } from '@/components/Buildings/GelberTurm';
import { GreenTower } from '@/components/Buildings/GreenTower';
import { Rain } from '@/components/Clouds/Rain';
import { BeforeGreenTower } from '@/components/Hills/BeforeGreenTower';
import { Hill4100 } from '@/components/Hills/Hill4100';

import { ParallaxLayer } from './ParallaxLayer';

/** The nearest layers of the scenery. The rain falls behind Hill4100, so it does not end in an edge on it. */
export const FrontLayer = () => (
    <>
        <Rain />
        <ParallaxLayer
            scrollspeed={2}
            depth={6}
            cap={true}
        >
            <GelberTurm />
            <Hill4100 />
        </ParallaxLayer>
        <ParallaxLayer
            scrollspeed={1}
            depth={7}
            cap={true}
        >
            <GreenTower />
            <BeforeGreenTower />
        </ParallaxLayer>
    </>
);
