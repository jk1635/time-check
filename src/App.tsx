import React, { ChangeEvent, useEffect, useState } from "react";

interface WorkTime {
    start: string;
    end: string;
}

const App: React.FC = () => {
    const days = ["월", "화", "수", "목", "금"];
    const [workTimes, setWorkTimes] = useState<WorkTime[]>(
        JSON.parse(localStorage.getItem("workTimes") || "[]") ||
            Array.from({ length: 5 }, () => ({ start: "", end: "" }))
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
            newTotalWorkTimes[dayIndex] = "0:00";
            setTotalWorkTimes(newTotalWorkTimes);
        }
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
        const workTimeOfDay = workTimes[dayIndex];
        if (!workTimeOfDay) {
            return "00:00";
        }

        let totalWorkTime = totalWorkTimes[dayIndex];
        const restTime = calculateRestTime(
            workTimeOfDay.start,
            workTimeOfDay.end
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
        const [hours, mins] = time.split(":").map(Number);
        return hours * 60 + mins;
    };

    const calculateTotalMinutes = (start: string, end: string) => {
        const [startHour, startMin] = start.split(":").map(Number);
        const [endHour, endMin] = end.split(":").map(Number);

        const startMinutes = startHour * 60 + startMin + 1;
        const endMinutes = endHour * 60 + endMin;

        return endMinutes - startMinutes;
    };

    const [remainingWorkTime, setRemainingWorkTime] = useState<string>("40:00");

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

    const [savedData, setSavedData] = useState<Array<string>>(
        JSON.parse(localStorage.getItem("savedData") || "[]")
    );

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

    const handleSave = () => {
        const data: any = createWorkTimeData();
        setSavedData((prevData) => [data, ...prevData]);
    };

    useEffect(() => {
        localStorage.setItem("savedData", JSON.stringify(savedData));
    }, [savedData]);

    const handleDelete = (index: number) => {
        setSavedData((prevData) => prevData.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: "60rem",
                }}
            >
                <table
                    style={{
                        border: "1px solid gray",
                        borderCollapse: "collapse",
                    }}
                >
                    <tbody>
                        {Array.from({ length: 6 }, (_, i) => (
                            <tr key={i}>
                                {Array.from({ length: 10 }, (_, j) => (
                                    <td
                                        style={{
                                            border: "1px solid gray",
                                            padding: "15px",
                                        }}
                                        key={j}
                                    >
                                        {j === 0 && i > 0 ? days[i - 1] : null}
                                        {j === 1 && i === 0
                                            ? "출근 시간"
                                            : null}
                                        {j === 1 && i > 0 && (
                                            <input
                                                type="text"
                                                defaultValue={
                                                    workTimes[i - 1]
                                                        ? workTimes[i - 1].start
                                                        : ""
                                                }
                                                onChange={(event) =>
                                                    handleTimeChange(
                                                        i - 1,
                                                        "start",
                                                        event
                                                    )
                                                }
                                                style={{
                                                    border: "none",
                                                    width: "8rem",
                                                    height: "100%",
                                                    boxSizing: "border-box",
                                                    fontSize: "24px",
                                                    outline: "none",
                                                }}
                                            />
                                        )}
                                        {j === 2 && i === 0
                                            ? "퇴근 시간"
                                            : null}
                                        {j === 2 && i > 0 && (
                                            <input
                                                type="text"
                                                defaultValue={
                                                    workTimes[i - 1]
                                                        ? workTimes[i - 1].end
                                                        : ""
                                                }
                                                onChange={(event) =>
                                                    handleTimeChange(
                                                        i - 1,
                                                        "end",
                                                        event
                                                    )
                                                }
                                                style={{
                                                    border: "none",
                                                    width: "8rem",
                                                    height: "100%",
                                                    boxSizing: "border-box",
                                                    fontSize: "24px",
                                                    outline: "none",
                                                }}
                                            />
                                        )}
                                        {j === 3 && i === 0 ? "반차" : null}
                                        {j === 3 && i > 0 ? (
                                            <input
                                                type="checkbox"
                                                name={`halfDay-${i}`}
                                                id={`halfDay-${i}`}
                                                checked={halfDays[i - 1]}
                                                onChange={(event) =>
                                                    handleHalfDayChange(
                                                        i - 1,
                                                        event
                                                    )
                                                }
                                                style={{
                                                    transform: "scale(1.5)",
                                                }}
                                            />
                                        ) : null}
                                        {j === 4 && i === 0 ? "연차" : null}
                                        {j === 4 && i > 0 ? (
                                            <input
                                                type="checkbox"
                                                name={`fullDay-${i}`}
                                                id={`fullDay-${i}`}
                                                checked={fullDays[i - 1]}
                                                onChange={(event) =>
                                                    handleFullDayChange(
                                                        i - 1,
                                                        event
                                                    )
                                                }
                                                style={{
                                                    transform: "scale(1.5)",
                                                }}
                                            />
                                        ) : null}
                                        {j === 5 && i === 0
                                            ? "실 근무 시간"
                                            : null}
                                        {j === 5 && i > 0
                                            ? calculateRealWorkTime(i - 1)
                                            : null}
                                        {j === 6 && i === 0
                                            ? "휴게 시간"
                                            : null}
                                        {j === 6 && i > 0
                                            ? calculateRestTime(
                                                  workTimes[i - 1].start,
                                                  workTimes[i - 1].end
                                              )
                                            : null}{" "}
                                        {j === 7 && i === 0
                                            ? "전체 근무 시간"
                                            : null}
                                        {j === 7 && i > 0
                                            ? totalWorkTimes[i - 1]
                                            : null}
                                        {j === 8 && i === 0
                                            ? "잔여 근무 시간"
                                            : null}
                                        {j === 8 && i === 1
                                            ? convertToMinutes(
                                                  remainingWorkTime
                                              ) < 0
                                                ? "근무시간초과"
                                                : remainingWorkTime
                                            : null}
                                        {j === 9 && i === 0
                                            ? "30분 조정"
                                            : null}
                                        {j === 9 && i > 0 ? (
                                            <input
                                                type="checkbox"
                                                name={`halfHour-${i}`}
                                                id={`halfHour-${i}`}
                                                checked={halfHour[i - 1]}
                                                onChange={(event) =>
                                                    handleHalfHourChange(
                                                        i - 1,
                                                        event
                                                    )
                                                }
                                                style={{
                                                    transform: "scale(1.5)",
                                                }}
                                            />
                                        ) : null}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        style={{ padding: "10px" }}
                        onClick={handleClearAllInputs}
                    >
                        내용 지우기
                    </button>
                    <button style={{ padding: "10px" }} onClick={handleSave}>
                        저장
                    </button>
                </div>
            </div>
            {savedData.map((data, index) => (
                <div key={index}>
                    <pre>{data}</pre>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default App;
