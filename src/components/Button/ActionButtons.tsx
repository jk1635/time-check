import React from "react";

import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

import * as S from "./Button.styled";
import { weekdays } from "../../constants";
import useCreateSummary from "../../hooks/useCreateSummary";
import { initialWorkTimesState, savedWorkTimeState, showKakaoShareState, summaryTableListState, workTimeState } from "../../stores/atoms";
import { saveLocalStorage } from "../../utils/localStorage";

const ActionButtons = () => {
    const { t } = useTranslation();

    const [workTime, setWorkTime] = useRecoilState(workTimeState);
    const [, setSavedWorkTime] = useRecoilState(savedWorkTimeState);
    const [, setSummaryTableList] = useRecoilState(summaryTableListState);
    const [showKakaoShare, setShowKakaoShare] = useRecoilState(showKakaoShareState);

    const workTimeSummary = useCreateSummary();

    const handleShareTable = async () => {
        const headOrder = [...weekdays, "잔여 근무 시간"];

        const mergedData = headOrder.map((title, index) => {
            const workTimeData = workTime[weekdays.indexOf(title)] || {};
            const extraValue = index === headOrder.length - 1;

            return {
                title,
                start: workTimeData.start || "",
                end: workTimeData.end || "",
                real: !extraValue ? workTimeSummary[t(title)] : "00:00",
                remain: extraValue ? workTimeSummary[t(title)] : "40:00",
            };
        });

        setSummaryTableList(mergedData);
        setShowKakaoShare(prevState => !prevState);
    };

    const handleClearInputs = () => {
        setWorkTime(initialWorkTimesState);
        saveLocalStorage("workTime", initialWorkTimesState);
    };

    const handleSave = () => {
        setSavedWorkTime(prevData => [workTimeSummary, ...prevData]);
    };

    return (
        <S.ButtonWrapper>
            <S.OutlineButton onClick={handleShareTable}>{t(showKakaoShare ? "닫기" : "공유")}</S.OutlineButton>
            <S.OutlineButton onClick={handleClearInputs}>{t("초기화")}</S.OutlineButton>
            <S.DefaultButton onClick={handleSave}>{t("저장")}</S.DefaultButton>
        </S.ButtonWrapper>
    );
};

export default ActionButtons;
