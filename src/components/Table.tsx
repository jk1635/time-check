import React from "react";

import { useRecoilState, useRecoilValue } from "recoil";

import TableRows from "./TableRow";
import { tableHeaders } from "../constants";
import useTimeHandlers from "../hooks/useTimeHandlers";
import { workTimeState } from "../stores/atoms";
import { overtimeStatusSelector, realWorkTimeMinutesSelector, remainingWorkTimeMinutesSelector } from "../stores/selectors";

const Table = () => {
    const [workTime, setWorkTime] = useRecoilState(workTimeState);
    const { handleTimeChange, handleDayOffChange } = useTimeHandlers();
    const remainingWorkTimeMinutes = useRecoilValue(remainingWorkTimeMinutesSelector);
    const realWorkTimeMinutes = useRecoilValue(realWorkTimeMinutesSelector);
    const overtime = useRecoilValue(overtimeStatusSelector);

    return (
        <table>
            <thead>
                <tr>
                    {tableHeaders.map(header => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: 5 }, (_row, rowIndex) => (
                    <TableRows
                        key={rowIndex}
                        rowIndex={rowIndex}
                        workTime={workTime}
                        handleTimeChange={handleTimeChange}
                        handleDayOffChange={handleDayOffChange}
                        realWorkTimeMinutes={realWorkTimeMinutes}
                        remainingWorkTimeMinutes={remainingWorkTimeMinutes}
                        overtime={overtime}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default Table;
