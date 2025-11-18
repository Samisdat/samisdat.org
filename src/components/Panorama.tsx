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

export const Panorama = (): ReactElement => {
    const { sunTimes } = useTal();
    const { windowOpacity } = sunTimes;

    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 1500 430"
            role="img"
            aria-label="Animiertes Wuppertal Stadtpanorama mit Tag-Nacht-Zyklus"
            style={{
                fillRule: 'evenodd',
                clipRule: 'evenodd',
                strokeLinejoin: 'round',
                strokeMiterlimit: 2,
            }}
        >
            <g id="Layer8">
                <Heaven />
                <WaterTowerLichtscheid />
                <Hill010 />
                <University />
                <Hill020 />
                <WaterTowerNaechstebreck />
                <Hill030 />
                <Hill040 />
                <Hill050 />
                <Tower1 />
                <Tower2 />
                <Hill060 />
                <Tower3 />
                <Hill070 />
                <g id="Layer29">
                    <Wupper />
                    <Behind />
                    <Cars />
                    <Track />
                    <Before />
                    <Townhall />
                    <Oligsmuehle />
                    <AlterMarkt />
                </g>
                <BeyenburgerDom />
                <Hill080 />

                <Hill090 />
                <RedCurch />
                <LilaCurch />
                <Hill100 />
                <SchauspielHaus />
                <BlueHouse />
                <GreenHouse />

                <Hill110 />
                <GelberTurm />
                <GreenTower />
                <Vohwinkel />

                <Hill120 />
                <Hill130 />
            </g>
            <Clock />
            <style>{`
            .illumination {
                fill: #ffcb77;
                opacity: ${windowOpacity};
                transition: opacity 0.5s ease-in-out;
            }
        `}</style>
        </svg>
    );
};
