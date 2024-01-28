import React from "react";

import { useRecoilState } from "recoil";

import * as S from "./Button.styled";
import { weekdays } from "../../constants";
import useCreateSummary from "../../hooks/useCreateSummary";
import { initialWorkTimesState, savedWorkTimeState, showKakaoShareState, summaryTableListState, workTimeState } from "../../stores/atoms";
import { saveLocalStorage } from "../../utils/localStorage";

const ActionButtons = () => {
    const [workTime, setWorkTime] = useRecoilState(workTimeState);
    const [, setSavedWorkTime] = useRecoilState(savedWorkTimeState);
    const [, setSummaryTableList] = useRecoilState(summaryTableListState);
    const [showKakaoShare, setShowKakaoShare] = useRecoilState(showKakaoShareState);

    const workTimeSummary = useCreateSummary();

    const handleShareTable = async () => {
        const summaryData = workTimeSummary();
        const headOrder = [...weekdays, "잔여 근무 시간"];

        const mergedData = headOrder.map(title => {
            const workTimeData = workTime[weekdays.indexOf(title)] || {};
            return {
                title,
                start: workTimeData.start || "",
                end: workTimeData.end || "",
                real: title !== "잔여 근무 시간" ? summaryData[title] : "00:00",
                remain: title === "잔여 근무 시간" ? summaryData[title] : "40:00",
            };
        });

        setSummaryTableList(mergedData);
        setShowKakaoShare(prevState => !prevState);
    };

    const handleClearInputs = () => {
        setWorkTime(initialWorkTimesState);
        saveLocalStorage("workTime", initialWorkTimesState);
        window.location.reload();
    };

    const handleSave = () => {
        const summaryData = workTimeSummary();
        setSavedWorkTime(prevData => [summaryData, ...prevData]);
    };

    return (
        <S.ButtonWrapper>
            <S.OutlineButton onClick={handleShareTable}>{showKakaoShare ? "닫기" : "공유"}</S.OutlineButton>
            <S.OutlineButton onClick={handleClearInputs}>초기화</S.OutlineButton>
            <S.DefaultButton onClick={handleSave}>저장</S.DefaultButton>
        </S.ButtonWrapper>
    );
};

export default ActionButtons;
