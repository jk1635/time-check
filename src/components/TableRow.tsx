import React, { ChangeEvent } from "react";

import Checkbox from "./Checkbox";
import * as S from "./Table.styled";
import TextInput from "./TextInput";
import { weekdays } from "../constants";
import { DayOffChange, TimeChange, WorkTime } from "../types";
import { calculateRestTime, minutesToTime } from "../utils/timeCalculator";

interface TableRowProps {
    rowIndex: number;
    workTime: WorkTime[];
    handleTimeChange: (type: TimeChange, index: number, e: ChangeEvent<HTMLInputElement>) => void;
    handleDayOffChange: (type: DayOffChange, index: number, e: ChangeEvent<HTMLInputElement>) => void;
    realWorkTimeMinutes: number[];
    remainingWorkTimeMinutes: number;
    overtime: string;
}

const TableRow: React.FC<TableRowProps> = ({
    rowIndex,
    workTime,
    handleTimeChange,
    handleDayOffChange,
    realWorkTimeMinutes,
    remainingWorkTimeMinutes,
    overtime,
}) => {
    const renderTextInput = (type: TimeChange) => (
        <TextInput type={type} defaultValue={workTime[rowIndex]?.[type] || ""} onChange={e => handleTimeChange(type, rowIndex, e)} />
    );

    const renderCheckbox = (type: DayOffChange) => (
        <Checkbox type={type} checked={workTime[rowIndex]?.[type]} onChange={e => handleDayOffChange(type, rowIndex, e)} />
    );

    return (
        <S.Tr>
            <S.Td>{weekdays[rowIndex]}</S.Td>
            <S.Td>{renderTextInput("start")}</S.Td>
            <S.Td>{renderTextInput("end")}</S.Td>
            <S.Td>{renderCheckbox("halfDay")}</S.Td>
            <S.Td>{renderCheckbox("fullDay")}</S.Td>
            <S.Td>{minutesToTime(realWorkTimeMinutes[rowIndex])}</S.Td>
            <S.Td>{calculateRestTime({ start: workTime[rowIndex]?.start, end: workTime[rowIndex]?.end })}</S.Td>
            <S.Td>{workTime[rowIndex]?.total}</S.Td>
            <S.Td>{rowIndex === 0 && <span style={{ color: remainingWorkTimeMinutes < 0 ? "#EF4444" : "#37516A" }}>{overtime}</span>}</S.Td>
        </S.Tr>
    );
};

export default TableRow;
