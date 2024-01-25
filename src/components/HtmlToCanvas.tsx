import React, { useRef, useState } from "react";

import html2canvas from "html2canvas";

import KakaoShare from "./KakaoShare";
import "./HtmlToCanvas.css";
import { SummaryTable } from "../types";

interface HtmlToCanvasProps {
    summaryTable: Array<SummaryTable>;
    onCapture: (url: string) => void;
    capturedImageURL?: string;
}

const HtmlToCanvas: React.FC<HtmlToCanvasProps> = ({ summaryTable, onCapture, capturedImageURL }) => {
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [imageCheck, setImageCheck] = useState(false);

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
        setImageCheck(true);
    };

    const renderTableRows = () => {
        return summaryTable.map(data => {
            const lastRow = data.title === "잔여 근무 시간";
            return (
                <tr key={data.title}>
                    <td>{data.title}</td>
                    <td>{lastRow ? "" : data.start || "-"}</td>
                    <td>{lastRow ? "" : data.end || "-"}</td>
                    <td>{lastRow ? data.remain : data.real || "-"}</td>
                </tr>
            );
        });
    };

    return (
        <div className="html-table">
            {summaryTable.length > 0 && (
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th>요일</th>
                            <th>출근 시간</th>
                            <th>퇴근 시간</th>
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
                <KakaoShare imageCheck={imageCheck} imageUrl={capturedImageURL} />
            </div>
        </div>
    );
};

export default HtmlToCanvas;
