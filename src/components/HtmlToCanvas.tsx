import React, { useRef, useState } from "react";

import html2canvas from "html2canvas";

import KakaoShare from "./KakaoShare";
import "./HtmlToCanvas.css";
import { SummaryData } from "../types";

interface HtmlToCanvasProps {
    savedData: Array<SummaryData>;
    onCapture: (url: string) => void;
    capturedImageURL?: string;
}

const HtmlToCanvas: React.FC<HtmlToCanvasProps> = ({ savedData, onCapture, capturedImageURL }) => {
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const uploadCloud = async (blob: Blob): Promise<string> => {
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", `${process.env.REACT_APP_CLOUD_PRESETS}`);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return data.secure_url;
    };

    const captureTable = async () => {
        setLoading(true);

        if (tableRef.current) {
            const canvas = await html2canvas(tableRef.current);
            // eslint-disable-next-line no-promise-executor-return
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve));

            if (blob) {
                const uploadedURL = await uploadCloud(blob);
                onCapture(uploadedURL);
            }
        }

        setLoading(false);
    };

    const renderTableRows = () => {
        return savedData.map(data => (
            <tr key={data.day}>
                <td>{data.day}</td>
                <td>{data.start || "-"}</td>
                <td>{data.end || "-"}</td>
                <td>{data.total}</td>
            </tr>
        ));
    };

    return (
        <div className="html-table">
            {savedData.length > 0 && (
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th>요일</th>
                            <th>시작 시간</th>
                            <th>종료 시간</th>
                            <th>실 근무 시간</th>
                        </tr>
                    </thead>
                    <tbody>{renderTableRows()}</tbody>
                </table>
            )}
            <div className="capture-button-wrapper">
                <button className="outline-button" onClick={captureTable}>
                    {loading ? "생성하는 중" : "1. 이미지 생성"}
                </button>
                <KakaoShare imageUrl={capturedImageURL} />
            </div>
        </div>
    );
};

export default HtmlToCanvas;
