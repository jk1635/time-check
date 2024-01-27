import React, { useRef, useState } from "react";

import html2canvas from "html2canvas";

import "./HtmlToCanvas.css";
import CaptureButton from "./CaptureButton";
import KakaoShare from "./KakaoShare";
import KakaoSummaryTable from "./SummaryTable";
import useCloudUploader from "../hooks/useCloudUploader";
import { SummaryTable } from "../types";

interface HtmlToCanvasProps {
    summaryTableList: Array<SummaryTable>;
    onCapture: (url: string) => void;
    capturedImageURL?: string;
}

const HtmlToCanvas: React.FC<HtmlToCanvasProps> = ({ summaryTableList, onCapture, capturedImageURL }) => {
    const tableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageCheck, setImageCheck] = useState(false);
    const { uploadCloud } = useCloudUploader();

    const captureTable = async () => {
        setIsLoading(true);

        if (tableRef.current) {
            const canvas = await html2canvas(tableRef.current);
            const blob = await new Promise<Blob | null>(resolve => {
                canvas.toBlob(result => {
                    resolve(result);
                });
            });
            if (blob) {
                const directUploadedURL = await uploadCloud(blob);
                onCapture(directUploadedURL);
            }
        }
        setIsLoading(false);
        setImageCheck(true);
    };

    return (
        <div className="summary-table">
            <div className="html-table">
                {summaryTableList.length > 0 && <KakaoSummaryTable ref={tableRef} summaryTableList={summaryTableList} />}
                <div className="capture-button-wrapper">
                    <CaptureButton onCapture={captureTable} isLoading={isLoading} />
                    <KakaoShare imageCheck={imageCheck} imageUrl={capturedImageURL} />
                </div>
            </div>
        </div>
    );
};

export default HtmlToCanvas;
