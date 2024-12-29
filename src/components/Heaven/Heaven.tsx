
import { FC } from "react";
import {Sun} from "@/components/Heaven/Sun";

export const Heaven: FC<{}> = () => {
    return (
        <>
            <path
                id="_0000"

                d="M-3.651,-22.701l2.195,428.425l1505.5,-7.715l-2.195,-428.424l-1505.5,7.714Z"
                style={{
                    fill: "#00a7ff",
                }}
            />
            <Sun/>
        </>
    );
};

