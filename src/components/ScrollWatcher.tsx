import { FC, HTMLAttributes } from "react";
import { css } from '@linaria/core';


const scrollWatcherStyle = css`
  @keyframes scroll-watcher {
    to { scale: 1 1 }
  }
height: 10px;
position: fixed;
top: 0;
z-index: 1000;
background-color: lime;
width: 100%;
scale: 0 1;
animation: scroll-watcher linear;
animation-timeline: scroll();
`;

export const ScrollWatcher: FC<HTMLAttributes<HTMLDivElement>> = () => (
  <div className={scrollWatcherStyle} />
);
