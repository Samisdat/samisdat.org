import {ReactElement} from 'react';
import { styled } from '@linaria/react';
import {Heaven} from "@/components/Heaven/Heaven";
import {Track} from "@/components/Track/Track";
import {BlueHouse} from "@/components/Buildings/BlueHouse";
import {Hill3200} from "@/components/Hills/Hill3200";
import {Hill3300} from "@/components/Hills/Hill3300";
import {GreenHouse} from "@/components/Buildings/GreenHouse";
import {WaterTowerLichtscheid} from "@/components/Buildings/WaterTowerLichtscheid";
import {Vohwinkel} from "@/components/Buildings/Vohwinkel";
import {University} from "@/components/Buildings/University";
import {GelberTurm} from "@/components/Buildings/GelberTurm";
import {GreenTower} from "@/components/Buildings/GreenTower";
import {BeyenburgerDom} from "@/components/Buildings/BeyenburgerDom";
import {WaterTowerNaechstebreck} from "@/components/Buildings/WaterTowerNaechstebreck";
import {RedCurch} from "@/components/Buildings/RedCurch";
import {LilaChurch} from "@/components/Buildings/LilaChurch";
import {Tower3} from "@/components/Buildings/Tower3";
import {Tower2} from "@/components/Buildings/Tower2";
import {Tower1} from "@/components/Buildings/Tower1";
import {Hill010} from "@/components/Hills/Hill010";
import {Hill020} from "@/components/Hills/Hill020";
import {Hill040} from "@/components/Hills/Hill040";
import {Hill030} from "@/components/Hills/Hill030";
import {Hill050} from "@/components/Hills/Hill050";
import {Hill1110} from "@/components/Hills/Hill1100";
import {Hill2800} from "@/components/Hills/Hill2800";
import {Hill1310} from "@/components/Hills/Hill1300";
import {Hill2900} from "@/components/Hills/Hill2900";
import {Hill4100} from "@/components/Hills/Hill4100";
import {Hill3800} from "@/components/Hills/Hill3800";

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

export const PanoramaRaw = (): ReactElement => {

    return (
        <Svg height="100%" viewBox="0 0 1700 500"
             style={{fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: 2}}>
            <Heaven  />
            <g>
                <WaterTowerLichtscheid/>
                <Hill010/>
            </g>
            <g>
                <University/>
                <Hill020/>
                <Hill040/>
            </g>
            <g>
                <WaterTowerNaechstebreck/>
                <Hill030/>
            </g>
            <g>
                <Tower2/>
                <Hill050/>
            </g>
            <g>
                <Tower1/>
                <Hill1110/>
            </g>
            <g>
                <Tower3/>
                <Hill1310/>
            </g>
            <g>
                <BeyenburgerDom/>
                <Hill2800/>
            </g>
            <Track/>
            <g>
                <Hill2900/>
                <Vohwinkel/>
                <RedCurch/>
            </g>
            <g>
                <Hill3200/>
                <LilaChurch/>
            </g>

                <Tower3 />
                <Hill3300/>
            <g>
                <GreenHouse/>
                <Hill3200/>
            </g>
            <BlueHouse/>
            <g>
                <GreenTower/>
                <Hill3800/>
            </g>
            <g>
                <GelberTurm/>
                <Hill4100/>
            </g>
            </Svg>);
    ;
};
