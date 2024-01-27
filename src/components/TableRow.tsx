import React, { ChangeEvent } from "react";

import Checkbox from "./Checkbox";
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
        <tr>
            <td>{weekdays[rowIndex]}</td>
            <td>{renderTextInput("start")}</td>
            <td>{renderTextInput("end")}</td>
            <td>{renderCheckbox("halfDay")}</td>
            <td>{renderCheckbox("fullDay")}</td>
            <td>{minutesToTime(realWorkTimeMinutes[rowIndex])}</td>
            <td>{calculateRestTime({ start: workTime[rowIndex]?.start, end: workTime[rowIndex]?.end })}</td>
            <td>{workTime[rowIndex]?.total}</td>
            <td>{rowIndex === 0 && <span style={{ color: remainingWorkTimeMinutes < 0 ? "#EF4444" : "#37516A" }}>{overtime}</span>}</td>
        </tr>
    );
};

export default TableRow;
