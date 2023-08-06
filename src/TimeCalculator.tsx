import React, { useEffect, useState } from "react";

const TimeCalculator: React.FC = () => {
    const [startTime, setStartTime] = useState("09:30");
    const [endTime, setEndTime] = useState("18:30");
    const [remainingTime, setRemainingTime] = useState("");
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isStarted) {
            intervalId = setInterval(() => {
                const now = new Date();
                const currentDate = now.toISOString().split("T")[0];
                const start = new Date(`${currentDate}T${startTime}`);
                const end = new Date(`${currentDate}T${endTime}`);
                if (now >= start && now <= end) {
                    const remainingInSeconds = Math.floor(
                        (end.getTime() - now.getTime()) / 1000
                    );
                    const hours = Math.floor(remainingInSeconds / 3600);
                    const minutes = Math.floor(
                        (remainingInSeconds % 3600) / 60
                    );
                    const seconds = remainingInSeconds % 60;
                    setRemainingTime(
                        `${hours} 시간 ${minutes} 분 ${seconds} 초`
                    );
                } else {
                    setRemainingTime("퇴근!");
                }
            }, 1000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [startTime, endTime, isStarted]);

    return (
        <div className="App">
            <span>나도 알고 싶은 나의 퇴근 시간</span>
            <div>
                <label>출근 시간 : </label>
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </div>
            <div>
                <label>퇴근 시간 : </label>
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </div>
            <button onClick={() => setIsStarted(true)}>Start</button>
            <div>
                <span>남은 시간</span>
                <p>{remainingTime}</p>
            </div>
        </div>
    );
};

export default TimeCalculator;
