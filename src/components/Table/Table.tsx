import React from "react";

import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import Checkbox from "./Checkbox";
import * as S from "./Table.styled";
import TextInput from "./TextInput";
import { tableHeaders, weekdays } from "../../constants";
import useTimeHandlers from "../../hooks/useTimeHandlers";
import { workTimeState } from "../../stores/atoms";
import { overtimeStatusSelector, realWorkTimeMinutesSelector, remainingWorkTimeMinutesSelector } from "../../stores/selectors";
import { DayOffChange, TimeChange } from "../../types";
import { calculateRestTime, minutesToTime } from "../../utils/timeCalculator";

const Table = () => {
    const { t } = useTranslation();

    const [workTime] = useRecoilState(workTimeState);
    const remainingWorkTimeMinutes = useRecoilValue(remainingWorkTimeMinutesSelector);
    const realWorkTimeMinutes = useRecoilValue(realWorkTimeMinutesSelector);
    const overtime = useRecoilValue(overtimeStatusSelector);

    const { handleTimeChange, handleDayOffChange } = useTimeHandlers();

    return (
        <S.TableWrapper>
            <S.Table>
                <S.Thead>
                    <S.Tr>
                        {tableHeaders.map(header => (
                            <S.Th key={header}>{t(header)}</S.Th>
                        ))}
                    </S.Tr>
                </S.Thead>
                <S.Tbody>
                    {Array.from({ length: 5 }, (_row, rowIndex) => {
                        const renderTextInput = (type: TimeChange) => (
                            <TextInput type={type} value={workTime[rowIndex]?.[type]} onChange={e => handleTimeChange(type, rowIndex, e)} />
                        );
                        const renderCheckbox = (type: DayOffChange) => (
                            <Checkbox
                                type={type}
                                checked={workTime[rowIndex]?.[type]}
                                onChange={e => handleDayOffChange(type, rowIndex, e)}
                            />
                        );
                        return (
                            <S.Tr>
                                <S.Td>{t(weekdays[rowIndex])}</S.Td>
                                <S.Td>{renderTextInput("start")}</S.Td>
                                <S.Td>{renderTextInput("end")}</S.Td>
                                <S.Td>{renderCheckbox("halfDay")}</S.Td>
                                <S.Td>{renderCheckbox("fullDay")}</S.Td>
                                <S.Td>{minutesToTime(realWorkTimeMinutes[rowIndex])}</S.Td>
                                <S.Td>{calculateRestTime({ start: workTime[rowIndex]?.start, end: workTime[rowIndex]?.end })}</S.Td>
                                <S.Td>{workTime[rowIndex]?.total}</S.Td>
                                <S.Td>
                                    {rowIndex === 0 && (
                                        <span style={{ color: remainingWorkTimeMinutes < 0 ? "#EF4444" : "#37516A" }}>{overtime}</span>
                                    )}
                                </S.Td>
                            </S.Tr>
                        );
                    })}
                </S.Tbody>
            </S.Table>
        </S.TableWrapper>
    );
};

export default Table;
