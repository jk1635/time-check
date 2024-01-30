import React from "react";

import { useRecoilState } from "recoil";

import * as S from "./TimeLogs.styled";
import { savedWorkTimeState } from "../../stores/atoms";
import { WeeklySummary } from "../../types";
import * as BS from "../Button/Button.styled";

const TimeLogs = () => {
    const [savedWorkTime, setSavedWorkTime] = useRecoilState(savedWorkTimeState);

    const handleDelete = (targetIndex: number) => {
        setSavedWorkTime(prevData => prevData.filter((_, index) => index !== targetIndex));
    };

    return (
        <section>
            {savedWorkTime.map((savedItem: WeeklySummary, targetIndex: number) => (
                // eslint-disable-next-line react/no-array-index-key
                <S.TimeLogsWrapper key={targetIndex}>
                    <pre>{JSON.stringify(savedItem, null, 2)}</pre>
                    <BS.OutlineButton onClick={() => handleDelete(targetIndex)}>삭제</BS.OutlineButton>
                </S.TimeLogsWrapper>
            ))}
        </section>
    );
};

export default TimeLogs;
