import React from "react";

import styled from "@emotion/styled";
import { useRecoilState } from "recoil";

import * as S from "./Button.styled";
import { savedWorkTimeState } from "../stores/atoms";
import { WeeklySummary } from "../types";

const SavedList = () => {
    const [savedWorkTime, setSavedWorkTime] = useRecoilState(savedWorkTimeState);
    const handleDelete = (targetIndex: number) => {
        setSavedWorkTime(prevData => prevData.filter((_, index) => index !== targetIndex));
    };

    return (
        <section>
            {savedWorkTime.map((savedItem: WeeklySummary, targetIndex: number) => (
                // eslint-disable-next-line react/no-array-index-key
                <SavedDataWrapper key={targetIndex}>
                    <pre>{JSON.stringify(savedItem, null, 2)}</pre>
                    <S.Button className="outline-button" onClick={() => handleDelete(targetIndex)}>
                        삭제
                    </S.Button>
                </SavedDataWrapper>
            ))}
        </section>
    );
};

const SavedDataWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    padding: 12px;
    width: 300px;
    border: 1px solid #eaeef4;
    border-radius: 5px;
`;

export default SavedList;
