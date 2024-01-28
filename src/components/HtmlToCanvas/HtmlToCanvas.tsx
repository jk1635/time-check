import React, { useRef, useState } from "react";

import html2canvas from "html2canvas";
import { useRecoilState } from "recoil";

import * as S from "./HtmlToCanvas.styled";
import useCloudUploader from "../../hooks/useCloudUploader";
import { summaryTableListState } from "../../stores/atoms";
import CaptureButton from "../Button/CaptureButton";
import KakaoShareButton from "../Button/KakaoShareButton";
import SummaryTable from "../Table/SummaryTable";

const HtmlToCanvas = () => {
    const tableRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [imageCheck, setImageCheck] = useState(false);
    const [capturedImageURL, setCapturedImageURL] = useState("");

    const [summaryTableList] = useRecoilState(summaryTableListState);

    const { uploadCloud } = useCloudUploader();

    const handleCapture = (url: string) => {
        setCapturedImageURL(url);
    };

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
                handleCapture(directUploadedURL);
            }
        }
        setIsLoading(false);
        setImageCheck(true);
    };

    return (
        <S.CanvasWrapper>
            <S.SummaryContainer>
                {summaryTableList.length > 0 && <SummaryTable ref={tableRef} summaryTableList={summaryTableList} />}
                <S.ButtonWrapper>
                    <CaptureButton onCapture={captureTable} isLoading={isLoading} />
                    <KakaoShareButton imageCheck={imageCheck} imageUrl={capturedImageURL} />
                </S.ButtonWrapper>
            </S.SummaryContainer>
        </S.CanvasWrapper>
    );
};

export default HtmlToCanvas;
