import React from "react";

import * as S from "./Button.styled";

interface CaptureButtonProps {
    onCapture: () => void;
    isLoading: boolean;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({ onCapture, isLoading }) => {
    return (
        <S.Button className="outline-button" onClick={onCapture}>
            {isLoading ? "생성하는 중" : "1. 이미지 생성"}
        </S.Button>
    );
};

export default CaptureButton;
