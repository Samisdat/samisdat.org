import { css } from '@linaria/core';

import {Cars} from "@/components/Cars";
import {BridgeZoo} from "@/components/Buildings/BridgeZoo";
import {SchauspielHaus} from "@/components/Buildings/SchauspielHaus";
import {Townhall} from "@/components/Buildings/Townhall";
import {Oligsmuehle} from "@/components/Buildings/Oligsmuehle";
import {AlterMarkt} from "@/components/Buildings/AlterMarkt";
import {Wupper} from "@/components/Buildings/Wupper";
import {Hill2200} from "@/components/Hills/Hill2200";

const trackCss = css`
    fill: #f6a590;
`;

export const Track = () => (
    <g id="Layer29">
        <Wupper/>
        <AlterMarkt/>
        <Oligsmuehle/>
        <BridgeZoo/>
        <Cars/>
        <path
            className={trackCss}
            data-id="2100-track"
            d="M0,305.215l0,5.353l1700,0.333l0,-4.798l-1700,-0.888Z"
        />
            <Hill2200/>
        <BridgeZoo beforeTrack={true}/>
        <SchauspielHaus/>
        <Townhall/>
        <Oligsmuehle/>
        <AlterMarkt beforeTrack={true}/>
    </g>
    );
