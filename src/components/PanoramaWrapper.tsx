import { css } from "@linaria/core";
import { WtalPanorama } from "@samisdat/wtal-panorama";

const panaoramaStyling = css`
  width: 100%;
  aspect-ratio: 1500/430;
  @keyframes panorama-scroll-watcher {
    0% {
      transform: translatey(0%);
    }

    100% {
      transform: translatey(-100%);
    }
  }
  & #_4100 {
    animation: panorama-scroll-watcher linear;
    animation-timeline: scroll();
  }
`;

export function PanoramaWrapper() {
  return (
    <div className={panaoramaStyling}>
      <WtalPanorama />
    </div>
  );
}
