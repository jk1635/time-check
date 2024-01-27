import React from "react";

import { useRecoilState } from "recoil";

import { showKakaoShareState } from "../stores/atoms";

interface ActionButtonsProps {
    onShareTable: () => void;
    onClearInputs: () => void;
    onSave: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onShareTable, onClearInputs, onSave }) => {
    const [showKakaoShare, setShowKakaoShare] = useRecoilState(showKakaoShareState);
    return (
        <div className="button-wrapper">
            <button className="outline-button" onClick={onShareTable}>
                {showKakaoShare ? "닫기" : "공유"}
            </button>
            <button className="outline-button" onClick={onClearInputs}>
                초기화
            </button>
            <button className="default-button" onClick={onSave}>
                저장
            </button>
        </div>
    );
};

export default ActionButtons;
