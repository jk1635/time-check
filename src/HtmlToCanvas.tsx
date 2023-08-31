import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import KakaoShareList from "./KakaoShareList";

export interface DayData {
    day: string;
    start?: string;
    end?: string;
    total: string;
}

interface HtmlToCanvasProps {
    savedData: Array<DayData>;
    onCapture: (url: string) => void;
    capturedImageURL?: string;
}

const HtmlToCanvas: React.FC<HtmlToCanvasProps> = ({
    savedData,
    onCapture,
    capturedImageURL,
}) => {
    const tableRef = useRef(null);
    const [imageURL, setImageURL] = useState<string>();
    const [loading, setLoading] = useState(false);

    const captureTable = async () => {
        setLoading(true); // 로딩 시작

        if (tableRef.current) {
            const canvas = await html2canvas(tableRef.current);
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve)
            );

            if (!blob) return;

            const formData = new FormData();
            formData.append("file", blob);
            formData.append(
                "upload_preset",
                `${process.env.REACT_APP_CLOUD_PRESETS}`
            );

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            setImageURL(data.secure_url);
            onCapture(data.secure_url);
        }
        setLoading(false);
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
                    <tbody>
                        {savedData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.day}</td>
                                <td>{data.start || "-"}</td>
                                <td>{data.end || "-"}</td>
                                <td>{data.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="capture-button-wrapper">
                {loading ? (
                    <button className="outline-button" onClick={captureTable}>
                        생성하는 중
                    </button>
                ) : (
                    <button className="outline-button" onClick={captureTable}>
                        1. 이미지 생성
                    </button>
                )}
                <KakaoShareList imageUrl={capturedImageURL} />
            </div>
        </div>
    );
};

export default HtmlToCanvas;
