"use client";

import { styled } from "@linaria/react";
import { useState } from "react";

const duration = 0.7;

const MiniPanoWrapper = styled.div`
  background: var(--color-foreground);
  padding: 1px;
  border-radius: 1rem;
  height: 2rem;
  aspect-ratio: 179/59;
  overflow: hidden;
  margin-bottom: 10px;
`;

const MiniPanoSvg = styled.svg`
  border-radius: 1rem;
  --end: 122px; // funny -> even this is px, it is rendered as viewBox units
  .heaven.day {
    fill: #00afeb;
  }
  .heaven.night {
    fill: #0b101e;
    opacity: 1;
    transition: opacity 1s;
  }
  fieldset:has(input:not(:checked)) & .heaven.night {
    opacity: 0;
  }

  .celestialBodies {
    transform: translateX(0%);
    transition: transform ${duration}s;
  }
  fieldset:has(input:checked) & .celestialBodies {
    transform: translateX(var(--end));
  }
  .moon {
    fill: #ededed;
    opacity: 1;
    transition: opacity ${0.8 * duration}s;
  }
  fieldset:has(input:not(:checked)) & .moon {
    opacity: 0;
  }
  .sun {
    fill: #f0ff5e;
    opacity: 1;
    transition: opacity 0.8s;
  }
  fieldset:has(input:checked) & .sun {
    opacity: 0;
  }
`;

export const MiniPano = () => (
  <MiniPanoWrapper>
    <MiniPanoSvg width="100%" height="100%" viewBox="0 0 179 59">
      <rect
        className="heaven day"
        x="-16.336"
        y="-40.292"
        width="216"
        height="124.5"
      />
      <rect
        className="heaven night"
        x="-16.336"
        y="-40.292"
        width="216"
        height="124.5"
      />
      <g className="celestialBodies">
        <circle className="sun" cx="29.255" cy="29.103" r="22.5" />
        <path
          className="moon"
          d="M29.998,6.756c12.074,0.392 21.757,10.318 21.757,22.488c0,12.418 -10.082,22.5 -22.5,22.5c-8.326,-0 -15.602,-4.533 -19.493,-11.262c0.247,0.008 0.495,0.012 0.743,0.012c12.418,-0 22.5,-10.082 22.5,-22.5c0,-4.092 -1.094,-7.93 -3.007,-11.238Z"
        />
      </g>
      <path
        d="M87.496,15.017l6.77,-0.025l0.295,3.283l-7.414,0.128l0.349,-3.386Z"
        style={{ fill: "#601107" }}
      />
      <path
        d="M77.643,19.477l0.03,2.577c-0,-0 0.006,0.127 0.12,0.26c0.989,1.161 4.259,2.43 6.059,3.939c1.862,1.561 5.104,3.23 5.109,5.424c0.007,3.278 -0.08,7.904 -0.08,7.904l4.963,0.162c0,0 -0.26,-4.897 -0.318,-7.742c-0.046,-2.279 2.793,-4.149 5.049,-5.466c2.114,-1.233 5.035,-2.626 6.664,-3.53c0.341,-0.19 0.329,-0.595 0.329,-0.595l0.113,-2.649c-1.827,-0.842 -6.778,-1.738 -9.981,-2.112c-3.213,-0.374 -6.773,-0.412 -9.737,-0.139l-0.467,0.057c-4.7,0.666 -7.853,1.91 -7.853,1.91Z"
        style={{ fill: "#ca3949" }}
      />
      <path
        d="M77.643,19.477l0.03,2.577c-0,-0 6.526,-2.336 13.722,-2.265c8.083,0.08 14.173,2.621 14.173,2.621l0.117,-2.743c0,-0 -6.505,-2.513 -14.247,-2.537c-7.788,-0.024 -13.795,2.347 -13.795,2.347Z"
        style={{ fill: "#ea6467" }}
      />
      <path
        id="hill"
        d="M178.5,58.5c1.825,0.023 -178.5,-0 -178.5,-0c-0,-0 1.208,-2.36 3.501,-3.563c2.012,-1.055 4.687,-0.903 6.736,-1.907c2.104,-1.032 3.66,-3.58 5.886,-4.28c2.226,-0.701 4.98,0.064 7.47,0.076c2.65,0.012 5.681,0.49 8.431,-0.001c2.881,-0.515 5.854,-2.458 8.858,-3.087c2.978,-0.624 6.688,-0.267 9.168,-0.69c1.999,-0.341 3.841,-1.166 5.715,-1.847c2.276,-0.826 5.647,-2.739 7.941,-3.114c1.935,-0.317 3.937,0.865 5.824,0.86c1.867,-0.006 3.634,-0.932 5.501,-0.895c2.09,0.042 4.655,1.252 7.043,1.148c2.723,-0.119 6.944,-1.712 9.296,-1.862c1.644,-0.105 3.18,0.774 4.814,0.963c1.9,0.219 4.482,0.633 6.586,0.353c2.104,-0.28 3.933,-1.99 6.038,-2.034c2.106,-0.044 4.376,1.43 6.595,1.771c2.206,0.339 4.515,-0.076 6.718,0.276c3.382,0.54 9.618,1.994 13.573,2.968c3.428,0.844 7.651,2.369 10.157,2.873c1.583,0.318 3.648,-0.217 4.877,0.15c1.094,0.325 1.581,1.451 2.5,2.047c0.918,0.596 1.858,1.358 3.011,1.529c1.192,0.177 2.758,-0.617 4.137,-0.466c1.51,0.164 3.299,0.928 4.921,1.455c2.105,0.683 5.093,1.918 7.384,3.333c1.548,0.957 4.854,3.463 5.819,3.944Z"
        style={{ fill: "#005b27" }}
      />
    </MiniPanoSvg>
  </MiniPanoWrapper>
);
