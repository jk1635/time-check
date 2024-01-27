import React from "react";

import styled from "@emotion/styled";
import { useRecoilState } from "recoil";

import * as S from "./Button.styled";
import { showKakaoShareState } from "../stores/atoms";

interface ActionButtonsProps {
    onShareTable: () => void;
    onClearInputs: () => void;
    onSave: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onShareTable, onClearInputs, onSave }) => {
    const [showKakaoShare, setShowKakaoShare] = useRecoilState(showKakaoShareState);
    return (
        <ButtonWrapper>
            <S.Button className="outline-button" onClick={onShareTable}>
                {showKakaoShare ? "닫기" : "공유"}
            </S.Button>
            <S.Button className="outline-button" onClick={onClearInputs}>
                초기화
            </S.Button>
            <S.Button className="default-button" onClick={onSave}>
                저장
            </S.Button>
        </ButtonWrapper>
    );
};

const ButtonWrapper = styled.section`
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    margin-bottom: 24px;
    gap: 5px;
`;

export default ActionButtons;
