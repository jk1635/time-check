import React from "react";

import * as S from "./Circle.styled";

const Circle = () => {
    return (
        <S.CircleContainer>
            <S.Svg width="30" height="30" viewBox="0 0 100 100">
                <S.AnimatedCircle cx="50" cy="50" r="40" />
            </S.Svg>
        </S.CircleContainer>
    );
};

export default Circle;
