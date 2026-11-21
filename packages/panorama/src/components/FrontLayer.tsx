import { GreenTower } from '@/components/Buildings/GreenTower';
import { BeforeGreenTower } from '@/components/Hills/BeforeGreenTower';

import { Rain } from './Clouds/Rain';
import { ParallaxLayer } from './ParallaxLayer';

/** The nearest layer of the scenery, with the rain in front of everything. */
export const FrontLayer = () => (
    <>
        <ParallaxLayer
            scrollspeed={1}
            depth={7}
            cap={true}
        >
            <GreenTower />
            <BeforeGreenTower />
        </ParallaxLayer>
        <Rain />
    </>
);
