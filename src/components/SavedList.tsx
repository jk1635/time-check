import React from "react";

import { useRecoilState } from "recoil";

import { savedWorkTimeState } from "../stores/atoms";
import { WeeklySummary } from "../types";

const SavedList = () => {
    const [savedWorkTime, setSavedWorkTime] = useRecoilState(savedWorkTimeState);
    const handleDelete = (targetIndex: number) => {
        setSavedWorkTime(prevData => prevData.filter((_, index) => index !== targetIndex));
    };

    return (
        <>
            {savedWorkTime.map((savedItem: WeeklySummary, targetIndex: number) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="data-wrapper" key={targetIndex}>
                    <pre>{JSON.stringify(savedItem, null, 2)}</pre>
                    <button className="outline-button" onClick={() => handleDelete(targetIndex)}>
                        삭제
                    </button>
                </div>
            ))}
        </>
    );
};

export default SavedList;
