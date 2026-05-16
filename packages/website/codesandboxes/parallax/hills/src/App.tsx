import './parallax.css';

import { CSSProperties, ReactNode, useRef } from 'react';
import { useDeviceTiltParallax } from './useDeviceTiltParallax';
import { useParallax } from './useParallax';

const ParallaxLayer = ({ depth, children, mix = 0 }: { depth: number; mix?: number; children: ReactNode }) => (
    <g
        className={`${!mix ? '' : 'colorLayer'} parallax`}
        style={
            {
                ['--depth' as string]: String(depth),
                ['--mix' as string]: `${String(mix * 8)}%`,
            } as CSSProperties
        }
    >
        {children}
    </g>
);

export const App = () => {
    const ref = useRef<HTMLDivElement | null>(null);

    useParallax(ref);

    const { permissionState, requestMotionPermission } = useDeviceTiltParallax(ref, {
        maxAngleDeg: 15,
    });
    return (
        <>
            <div>
                {permissionState !== 'granted' && <button onClick={requestMotionPermission}>Motion aktivieren</button>}

                <div
                    ref={ref}
                    className="card"
                >
                    Tilt me ✨
                </div>
            </div>

            <div
                className={'hills'}
                ref={ref}
            >
                <svg
                    viewBox="0 0 450 600"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                >
                    <defs>
                        <linearGradient
                            id="Linear2"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="matrix(0.253198,-320.672,767.394,0.605923,224.889,236.369)"
                        >
                            <stop
                                offset="0"
                                style={{ stopColor: '#f3e4b7', stopOpacity: 1 }}
                            />
                            <stop
                                offset="0.5"
                                style={{ stopColor: '#a2b49a', stopOpacity: 1 }}
                            />
                            <stop
                                offset="1"
                                style={{ stopColor: '#84a38f', stopOpacity: 1 }}
                            />
                        </linearGradient>
                        <path
                            id="hills"
                            d="M-159,114.517c26.239,3.278 101.379,6.715 195,25.952c58.318,11.982 123.806,48.23 189.112,62.085c65.635,13.924 131.086,5.456 188.888,17.913c112.175,24.174 195.543,53.663 195.543,53.663l-0,283.87l-768.543,0l0,-443.483Z"
                        />
                        <path
                            id="hills-flipped"
                            d="M609.543,114.517c-26.239,3.278 -101.38,6.715 -195,25.952c-58.318,11.982 -123.806,48.23 -189.112,62.085c-65.635,13.924 -131.086,5.456 -188.888,17.913c-112.175,24.174 -195.543,53.663 -195.543,53.663l-0,283.87l768.543,0l-0,-443.483Z"
                        />
                    </defs>
                    <g id="heaven">
                        <rect
                            className={'heaven'}
                            x={0}
                            y={0}
                            width={768}
                            height={768}
                        />
                        <ParallaxLayer depth={-8}>
                            <circle
                                className={'sun'}
                                cx="225"
                                cy="123.496"
                                r="106.191"
                            />
                        </ParallaxLayer>
                    </g>

                    <ParallaxLayer
                        depth={-7}
                        mix={12}
                    >
                        <path d="M609,161.61l-195,-0c-63.013,-0 -90.589,-29.421 -189.038,-30c-95.788,-0.564 -125.975,30 -188.962,30l-195,-0l-0,389.55l768,0l-0,-389.55Z" />
                    </ParallaxLayer>
                    <ParallaxLayer
                        depth={-6}
                        mix={11}
                    >
                        <use
                            href="#hills"
                            x="0"
                            y={0}
                        />
                    </ParallaxLayer>
                    <ParallaxLayer
                        depth={-5}
                        mix={10}
                    >
                        <use
                            href="#hills-flipped"
                            x="0"
                            y={0}
                        />
                    </ParallaxLayer>
                    <ParallaxLayer
                        depth={-4}
                        mix={9}
                    >
                        <use
                            href="#hills"
                            x="0"
                            y={90}
                        />
                    </ParallaxLayer>
                    <ParallaxLayer
                        depth={-3}
                        mix={8}
                    >
                        <use
                            href="#hills-flipped"
                            x="0"
                            y={90}
                        />
                    </ParallaxLayer>
                    <ParallaxLayer
                        depth={-2}
                        mix={7}
                    >
                        <use
                            href="#hills"
                            x="0"
                            y={180}
                        />
                    </ParallaxLayer>
                    <ParallaxLayer
                        depth={-1}
                        mix={6}
                    >
                        <use
                            href="#hills-flipped"
                            x="0"
                            y={180}
                        />
                    </ParallaxLayer>
                    <ParallaxLayer
                        depth={1}
                        mix={5}
                    >
                        <path d="M318.3,407.156l-189.531,0c-0,0 -5.294,-0.235 -5.383,1.946c-0.251,6.184 5.383,6.055 5.383,6.055l189.531,-0c0,-0 3.339,0.44 3.401,-3.995c0.059,-4.263 -3.401,-4.006 -3.401,-4.006Zm3.955,-24.086l-185.263,-0.074c-0,0 -3.183,-0.627 -2.942,7.549c0.217,7.405 2.971,7.114 2.971,7.114l185.786,-0.006c-0,0 2.096,1.109 2.478,-10.884c0.13,-4.072 -3.03,-3.699 -3.03,-3.699Zm1.171,-18.164l-185.262,-0.074c-0,0 -3.183,-0.627 -2.942,7.549c0.217,7.405 2.971,7.114 2.971,7.114l185.785,-0.006c0,0 2.097,1.109 2.479,-10.884c0.13,-4.072 -3.031,-3.699 -3.031,-3.699Z" />
                        <path
                            className={'bankHighlight colorLayer'}
                            d="M313.457,407.723l-186.125,-0.066l0.68,1.175l191.414,-0.028l-5.969,-1.081Zm-175.426,-23.542c-0.081,-0.002 -0.495,-0.012 -0.642,-0.001c-0.845,0.06 -1.87,0.122 -1.722,5.159c0.183,6.2 0.738,3.612 0.738,3.612c0,0 0.073,-6.701 0.368,-7.113c0.097,-0.135 0.303,-0.196 0.718,-0.248l186.987,0.032l-0,-1.426l-186.447,-0.016l0,0.001Zm1.172,-18.164c-0.081,-0.002 -0.495,-0.012 -0.642,-0.001c-0.845,0.06 -1.87,0.122 -1.722,5.159c0.183,6.2 0.738,3.612 0.738,3.612c0,0 0.073,-6.701 0.368,-7.113c0.096,-0.136 0.303,-0.196 0.718,-0.248l186.987,0.032l-0,-1.426l-186.447,-0.016l0,0.001Z"
                        />
                        <path
                            className={'colorLayer'}
                            d="M172.889,364.034c-0.428,-1.233 -2.726,-3.404 -7.244,-2.552c-1.723,0.325 -0.412,2.373 0.27,4.707c0.07,0.239 0,1.302 -0.075,4.455c-0.289,12.069 -0.247,43.701 -0.247,43.701l-20.357,0.016l0.045,33.284l7.883,-0.188l-0.237,-21.825c0,0 11.113,-1.985 11.301,2.076c0.226,4.887 0.14,19.463 0.14,19.463l8.673,0.167l-0.629,-30.686l0.621,-51.355c-0,0 0.121,-0.504 -0.144,-1.263Zm134.18,-0c-0.429,-1.233 -2.726,-3.404 -7.244,-2.552c-1.724,0.325 -0.412,2.373 0.27,4.707c0.069,0.239 -0,1.302 -0.076,4.455c-0.289,12.069 -0.247,43.701 -0.247,43.701l-20.356,0.016l0.045,33.284l7.883,-0.188l-0.237,-21.825c-0,0 11.113,-1.985 11.301,2.076c0.226,4.887 0.139,19.463 0.139,19.463l8.673,0.167l-0.629,-30.686l0.621,-51.355c0,0 0.121,-0.504 -0.143,-1.263Z"
                        />
                        <path
                            className={'bankHighlight colorLayer'}
                            d="M303.953,389.726c0.529,-0 0.958,0.307 0.958,0.685c0,0.379 -0.429,0.686 -0.958,0.686c-0.529,-0 -0.959,-0.307 -0.959,-0.686c0,-0.378 0.43,-0.685 0.959,-0.685Zm-0,-18.257c0.529,0 0.958,0.307 0.958,0.685c0,0.379 -0.429,0.686 -0.958,0.686c-0.529,-0 -0.959,-0.307 -0.959,-0.686c0,-0.378 0.43,-0.685 0.959,-0.685Z"
                        />
                        <path
                            className={'bankHighlight colorLayer'}
                            d="M169.187,389.726c0.529,-0 0.959,0.307 0.959,0.685c-0,0.379 -0.43,0.686 -0.959,0.686c-0.529,-0 -0.958,-0.307 -0.958,-0.686c-0,-0.378 0.429,-0.685 0.958,-0.685Zm0,-18.257c0.529,0 0.959,0.307 0.959,0.685c-0,0.379 -0.43,0.686 -0.959,0.686c-0.529,-0 -0.958,-0.307 -0.958,-0.686c-0,-0.378 0.429,-0.685 0.958,-0.685Z"
                        />
                        <path
                            className={'colorLayer'}
                            d="M609,478.523c0,0 -42.714,3.491 -105,-11.25c-72.527,-17.165 -91.251,-32.422 -279.038,-30c-188.94,2.438 -217.65,18.543 -278.962,30c-62.905,11.755 -105,8.25 -105,8.25l0,103.801l768,-0l0,-100.801Z"
                        />
                    </ParallaxLayer>
                    <ParallaxLayer
                        depth={2}
                        mix={4}
                    >
                        <use
                            href="#hills"
                            x="0"
                            y={270}
                        />
                    </ParallaxLayer>
                    <ParallaxLayer
                        depth={3}
                        mix={3}
                    >
                        <use
                            href="#hills-flipped"
                            x="0"
                            y={270}
                        />
                    </ParallaxLayer>
                    <ParallaxLayer
                        depth={4}
                        mix={2}
                    >
                        <use
                            href="#hills"
                            x="0"
                            y={350}
                        />
                    </ParallaxLayer>
                    <ParallaxLayer
                        depth={5}
                        mix={1}
                    >
                        <use
                            href="#hills-flipped"
                            x="0"
                            y={350}
                        />
                    </ParallaxLayer>
                </svg>
            </div>
        </>
    );
};
