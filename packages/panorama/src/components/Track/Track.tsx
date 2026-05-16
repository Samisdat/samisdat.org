import { AlterMarkt } from '@/components/Buildings/AlterMarkt';
import { BridgeZoo } from '@/components/Buildings/BridgeZoo';
import { Oligsmuehle } from '@/components/Buildings/Oligsmuehle';
import { Townhall } from '@/components/Buildings/Townhall';
import { Wupper } from '@/components/Buildings/Wupper';
import { Cars } from '@/components/Cars';
import { Hill2200 } from '@/components/Hills/Hill2200';

export const Track = () => (
    <g id="Layer29">
        <Wupper />
        <AlterMarkt />
        <Oligsmuehle />
        <BridgeZoo />
        <Cars />
        <path
            className={'track'}
            data-id="2100-track"
            d="M0,305.215l0,5.353l1700,0.333l0,-4.798l-1700,-0.888Z"
        />
        <Hill2200 />
        <BridgeZoo beforeTrack={true} />
        <Townhall />
        <Oligsmuehle />
        <AlterMarkt beforeTrack={true} />
    </g>
);
