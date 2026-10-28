import { styled } from "@linaria/react";
import { aubergine, ivory } from "@samisdat/color-scheme/primitives";

const BlackCircle = styled.circle`
    fill: ${aubergine[950]};
`;

const WhiteCircle= styled.circle`
    fill: ${ivory[100]};
`;

export const DiscSvg = ({ initialDur }: { initialDur: number }) => (
    <svg viewBox="0 0 200 200">
      <g>
        <BlackCircle cx="100" cy="100" r="100" />
        <WhiteCircle cx="105" cy="100" r="95" /> 
        <BlackCircle cx="110" cy="100" r="90" />
        <WhiteCircle cx="115" cy="100" r="85" /> 
        <BlackCircle cx="120" cy="100" r="80" /> 
        <WhiteCircle cx="125" cy="100" r="75" /> 
        <BlackCircle cx="130" cy="100" r="70" />
        <WhiteCircle cx="135" cy="100" r="65" /> 
        <BlackCircle cx="140" cy="100" r="60" />
        <WhiteCircle cx="145" cy="100" r="55" /> 
        <BlackCircle cx="150" cy="100" r="50" /> 
        <WhiteCircle cx="155" cy="100" r="45" /> 
        <BlackCircle cx="160" cy="100" r="40" /> 
        <WhiteCircle cx="155" cy="100" r="35" /> 
        <BlackCircle cx="150" cy="100" r="30" /> 
        <WhiteCircle cx="145" cy="100" r="25" /> 
        <BlackCircle cx="140" cy="100" r="20" />
        <WhiteCircle cx="135" cy="100" r="15" /> 
        <BlackCircle cx="130" cy="100" r="10" /> 
        <WhiteCircle cx="125" cy="100" r="5" /> 
        <BlackCircle cx="122.5" cy="100" r="2.5" /> 
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from="0 100 100" 
          to="360 100 100" 
          dur={`${initialDur}s`} 
          repeatCount="indefinite">
        </animateTransform>
      </g>
    </svg>
  );


