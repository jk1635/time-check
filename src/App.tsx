import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import Popup from "./Popup";

interface WorkTime {
    start: string;
    end: string;
}

const App: React.FC = () => {
    const days = ["월", "화", "수", "목", "금"];

    const [workTimes, setWorkTimes] = useState<WorkTime[]>(
        JSON.parse(localStorage.getItem("workTimes") || "[]").length
            ? JSON.parse(localStorage.getItem("workTimes")!)
            : Array.from({ length: 5 }, () => ({ start: "", end: "" }))
    );
    const [totalWorkTimes, setTotalWorkTimes] = useState<string[]>(
        JSON.parse(localStorage.getItem("totalWorkTimes") || "[]") ||
            Array.from({ length: 5 }, () => "00:00")
    );
    const [halfDays, setHalfDays] = useState<boolean[]>(
        JSON.parse(localStorage.getItem("halfDays") || "[]") ||
            Array.from({ length: 5 }, () => false)
    );
    const [fullDays, setFullDays] = useState<boolean[]>(
        JSON.parse(localStorage.getItem("fullDays") || "[]") ||
            Array.from({ length: 5 }, () => false)
    );
    const [halfHour, setHalfHour] = useState<boolean[]>(
        JSON.parse(localStorage.getItem("halfHour") || "[]") ||
            Array.from({ length: 5 }, () => false)
    );

    const [remainingWorkTime, setRemainingWorkTime] = useState<string>("40:00");
    const [savedData, setSavedData] = useState<Array<string>>(
        JSON.parse(localStorage.getItem("savedData") || "[]")
    );

    useEffect(() => {
        let totalRealWorkTimeMins = 0;

        for (let i = 0; i < 5; i++) {
            totalRealWorkTimeMins += convertToMinutes(calculateRealWorkTime(i));
        }

        const remainingWorkTimeMins =
            convertToMinutes("40:00") - totalRealWorkTimeMins;
        const hours = Math.floor(remainingWorkTimeMins / 60);
        const mins = remainingWorkTimeMins % 60;

        setRemainingWorkTime(
            `${hours.toString().padStart(2, "0")}:${mins
                .toString()
                .padStart(2, "0")}`
        );
    }, [totalWorkTimes, halfDays, fullDays, halfHour, workTimes]);

    useEffect(() => {
        localStorage.setItem("workTimes", JSON.stringify(workTimes));
        localStorage.setItem("totalWorkTimes", JSON.stringify(totalWorkTimes));
        localStorage.setItem("halfDays", JSON.stringify(halfDays));
        localStorage.setItem("fullDays", JSON.stringify(fullDays));
        localStorage.setItem("halfHour", JSON.stringify(halfHour));
    }, [workTimes, totalWorkTimes, halfDays, fullDays, halfHour]);

    useEffect(() => {
        localStorage.setItem("savedData", JSON.stringify(savedData));
    }, [savedData]);

    const handleHalfDayChange = (
        dayIndex: number,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const newHalfDays = [...halfDays];
        newHalfDays[dayIndex] = event.target.checked;
        setHalfDays(newHalfDays);
        localStorage.setItem("halfDays", JSON.stringify(newHalfDays));
    };

    const handleFullDayChange = (
        dayIndex: number,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const newFullDays = [...fullDays];
        newFullDays[dayIndex] = event.target.checked;
        setFullDays(newFullDays);
        localStorage.setItem("fullDays", JSON.stringify(newFullDays));
    };

    const handleHalfHourChange = (
        dayIndex: number,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const newHalfHour = [...halfHour];
        newHalfHour[dayIndex] = event.target.checked;
        setHalfHour(newHalfHour);
        localStorage.setItem("halfHour", JSON.stringify(newHalfHour));
    };

    const handleTimeChange = (
        dayIndex: number,
        type: keyof WorkTime,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        let time = event.target.value;
        const isValidTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);

        if (!isValidTime || time === "") {
            time = "0:00";
        }

        const newWorkTimes = [...workTimes];
        newWorkTimes[dayIndex][type] = time;
        setWorkTimes(newWorkTimes);

        if (
            newWorkTimes[dayIndex].start !== "0:00" &&
            newWorkTimes[dayIndex].end !== "0:00"
        ) {
            const newTotalWorkTimes = [...totalWorkTimes];
            newTotalWorkTimes[dayIndex] = calculateTotalWorkTime(
                newWorkTimes[dayIndex].start,
                newWorkTimes[dayIndex].end
            );
            setTotalWorkTimes(newTotalWorkTimes);
        } else {
            const newTotalWorkTimes = [...totalWorkTimes];
            newTotalWorkTimes[dayIndex] = "00:00";
            setTotalWorkTimes(newTotalWorkTimes);
        }
    };

    const handleClearAllInputs = () => {
        const initialWorkTimes = Array.from({ length: 5 }, () => ({
            start: "",
            end: "",
        }));
        const initialTotalWorkTimes = Array.from({ length: 5 }, () => "00:00");
        const initialHalfDays = Array.from({ length: 5 }, () => false);
        const initialFullDays = Array.from({ length: 5 }, () => false);
        const initialHalfHour = Array.from({ length: 5 }, () => false);

        setWorkTimes(initialWorkTimes);
        setTotalWorkTimes(initialTotalWorkTimes);
        setHalfDays(initialHalfDays);
        setFullDays(initialFullDays);
        setHalfHour(initialHalfHour);
        setRemainingWorkTime("40:00");

        localStorage.setItem("workTimes", JSON.stringify(initialWorkTimes));
        localStorage.setItem(
            "totalWorkTimes",
            JSON.stringify(initialTotalWorkTimes)
        );
        localStorage.setItem("halfDays", JSON.stringify(initialHalfDays));
        localStorage.setItem("fullDays", JSON.stringify(initialFullDays));
        localStorage.setItem("halfHour", JSON.stringify(initialHalfHour));
        window.location.reload();
    };

    const handleSave = () => {
        const data: any = createWorkTimeData();
        setSavedData((prevData) => [data, ...prevData]);
    };

    const handleDelete = (index: number) => {
        setSavedData((prevData) => prevData.filter((_, i) => i !== index));
    };

    const calculateRestTime = (start: string, end: string) => {
        const totalMins = calculateTotalMinutes(start, end);

        if (totalMins >= 720) {
            return "1:30";
        } else if (totalMins >= 480) {
            return "1:00";
        } else if (totalMins >= 240) {
            return "0:30";
        } else {
            return "0:00";
        }
    };

    const calculateTotalWorkTime = (start: string, end: string) => {
        const totalMins = calculateTotalMinutes(start, end);

        const hours = Math.floor(totalMins / 60);
        const mins = totalMins % 60;

        return `${hours.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}`;
    };

    const calculateRealWorkTime = (dayIndex: number) => {
        let totalWorkTime = totalWorkTimes[dayIndex];
        const restTime = calculateRestTime(
            workTimes[dayIndex]?.start || "0:00",
            workTimes[dayIndex]?.end || "0:00"
        );

        if (halfDays[dayIndex]) {
            totalWorkTime = addTime(totalWorkTime, "04:00");
        }

        if (fullDays[dayIndex]) {
            totalWorkTime = addTime(totalWorkTime, "08:00");
        }

        if (halfHour[dayIndex]) {
            totalWorkTime = addTime(totalWorkTime, "00:30");
        }

        const totalWorkTimeMins = convertToMinutes(totalWorkTime);
        const restTimeMins = convertToMinutes(restTime);

        const realWorkTimeMins = totalWorkTimeMins - restTimeMins;

        const hours = Math.floor(realWorkTimeMins / 60);
        const mins = realWorkTimeMins % 60;

        return `${hours.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}`;
    };

    const addTime = (time1: string, time2: string) => {
        const time1Mins = convertToMinutes(time1);
        const time2Mins = convertToMinutes(time2);

        const totalTimeMins = time1Mins + time2Mins;

        const hours = Math.floor(totalTimeMins / 60);
        const mins = totalTimeMins % 60;

        return `${hours.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}`;
    };

    const convertToMinutes = (time: string) => {
        if (!time) return 0;
        const [hours, mins] = time.split(":").map(Number);
        return hours * 60 + mins;
    };

    const calculateTotalMinutes = (start: string, end: string) => {
        if (!start || !end) return 0;

        const [startHour, startMin] = start.split(":").map(Number);
        const [endHour, endMin] = end.split(":").map(Number);

        const startMinutes = startHour * 60 + startMin + 1;
        const endMinutes = endHour * 60 + endMin;

        return endMinutes - startMinutes;
    };

    const createWorkTimeData = () => {
        const data: any = days.reduce((acc, day, index) => {
            let dayData = `${calculateRealWorkTime(index)}`;
            if (halfDays[index]) {
                dayData += " (반차)";
            }
            if (fullDays[index]) {
                dayData += " (연차)";
            }
            if (halfHour[index]) {
                dayData += " (조정)";
            }
            return {
                ...acc,
                [day]: dayData,
            };
        }, {});

        data["잔여 근무 시간"] =
            convertToMinutes(remainingWorkTime) < 0
                ? "근무시간초과"
                : remainingWorkTime;

        return JSON.stringify(data, null, 2);
    };

    return (
        <div className="container">
            <Popup />
            <div className="info">
                <a
                    href={`sample.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="material-symbols-outlined">info</span>
                </a>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            {Array.from({ length: 10 }, (_, j) => (
                                <th key={j}>
                                    {j === 0 ? "요일" : null}
                                    {j === 1 ? "출근 시간" : null}
                                    {j === 2 ? "퇴근 시간" : null}
                                    {j === 3 ? "반차" : null}
                                    {j === 4 ? "연차" : null}
                                    {j === 5 ? "실 근무 시간" : null}
                                    {j === 6 ? "휴게 시간" : null}
                                    {j === 7 ? "전체 근무 시간" : null}
                                    {j === 8 ? "잔여 근무 시간" : null}
                                    {j === 9 ? "+30분" : null}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }, (_, i) => (
                            <tr key={i}>
                                {Array.from({ length: 10 }, (_, j) => (
                                    <td key={j}>
                                        {j === 0 ? days[i] : null}
                                        {j === 1 && (
                                            <input
                                                type="text"
                                                className="text-input"
                                                placeholder="출근시간"
                                                defaultValue={
                                                    workTimes[i]
                                                        ? workTimes[i].start
                                                        : ""
                                                }
                                                onChange={(event) =>
                                                    handleTimeChange(
                                                        i,
                                                        "start",
                                                        event
                                                    )
                                                }
                                            />
                                        )}
                                        {j === 2 && (
                                            <input
                                                type="text"
                                                className="text-input"
                                                placeholder="퇴근시간"
                                                defaultValue={
                                                    workTimes[i]
                                                        ? workTimes[i].end
                                                        : ""
                                                }
                                                onChange={(event) =>
                                                    handleTimeChange(
                                                        i,
                                                        "end",
                                                        event
                                                    )
                                                }
                                            />
                                        )}
                                        {j === 3 ? (
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name={`halfDay-${i}`}
                                                id={`halfDay-${i}`}
                                                checked={halfDays[i]}
                                                onChange={(event) =>
                                                    handleHalfDayChange(
                                                        i,
                                                        event
                                                    )
                                                }
                                            />
                                        ) : null}
                                        {j === 4 ? (
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name={`fullDay-${i}`}
                                                id={`fullDay-${i}`}
                                                checked={fullDays[i]}
                                                onChange={(event) =>
                                                    handleFullDayChange(
                                                        i,
                                                        event
                                                    )
                                                }
                                            />
                                        ) : null}
                                        {j === 5
                                            ? calculateRealWorkTime(i)
                                            : null}
                                        {j === 6
                                            ? calculateRestTime(
                                                  workTimes[i].start,
                                                  workTimes[i].end
                                              )
                                            : null}
                                        {j === 7 ? totalWorkTimes[i] : null}
                                        {j === 8 && i === 0
                                            ? convertToMinutes(
                                                  remainingWorkTime
                                              ) < 0
                                                ? "근무시간초과"
                                                : remainingWorkTime
                                            : null}
                                        {j === 9 ? (
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name={`halfHour-${i}`}
                                                id={`halfHour-${i}`}
                                                checked={halfHour[i]}
                                                onChange={(event) =>
                                                    handleHalfHourChange(
                                                        i,
                                                        event
                                                    )
                                                }
                                            />
                                        ) : null}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="button-wrapper">
                    <button
                        className="outline-button"
                        onClick={handleClearAllInputs}
                    >
                        초기화
                    </button>
                    <button className="default-button" onClick={handleSave}>
                        저장
                    </button>
                </div>
            </div>
            {savedData.map((data, index) => (
                <div className="data-wrapper" key={index}>
                    <pre>{data}</pre>
                    <button
                        className="outline-button"
                        onClick={() => handleDelete(index)}
                    >
                        삭제
                    </button>
                </div>
            ))}
        </div>
    );
};

export default App;
