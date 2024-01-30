import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const drawCircle = keyframes`
  to {
    stroke-dashoffset: 0;
  }  
`;

const CircleContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 32px;
`;

const Svg = styled.svg`
    display: block;
    margin: 0 auto;
`;

const AnimatedCircle = styled.circle`
    fill: none;
    stroke: red;
    stroke-width: 10;
    stroke-dasharray: 251.2;
    stroke-dashoffset: 251.2;
    animation: ${drawCircle} 2s ease-in-out forwards;
`;

export { CircleContainer, Svg, AnimatedCircle };
