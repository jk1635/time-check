import React from "react";

interface CaptureButtonProps {
    onCapture: () => void;
    isLoading: boolean;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({ onCapture, isLoading }) => {
    return (
        <button className="outline-button" onClick={onCapture}>
            {isLoading ? "생성하는 중" : "1. 이미지 생성"}
        </button>
    );
};
export default CaptureButton;
