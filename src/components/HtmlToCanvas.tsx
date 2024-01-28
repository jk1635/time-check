import React, { useRef, useState } from "react";

import styled from "@emotion/styled";
import html2canvas from "html2canvas";
import { useRecoilState } from "recoil";

import CaptureButton from "./CaptureButton";
import KakaoShareButton from "./KakaoShare";
import KakaoSummaryTable from "./SummaryTable";
import useCloudUploader from "../hooks/useCloudUploader";
import { summaryTableListState } from "../stores/atoms";

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
        <CanvasWrapper>
            <SummaryContainer>
                {summaryTableList.length > 0 && <KakaoSummaryTable ref={tableRef} summaryTableList={summaryTableList} />}
                <ButtonWrapper>
                    <CaptureButton onCapture={captureTable} isLoading={isLoading} />
                    <KakaoShareButton imageCheck={imageCheck} imageUrl={capturedImageURL} />
                </ButtonWrapper>
            </SummaryContainer>
        </CanvasWrapper>
    );
};

const CanvasWrapper = styled.section`
    position: absolute;
    right: 0;
    padding-right: 12px;
`;

const SummaryContainer = styled.div`
    padding: 12px;
    border: 1px solid #eaeef4;
    border-radius: 5px;
    background-color: #ffffff;
    z-index: 10;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
    gap: 5px;
`;

export default HtmlToCanvas;
