import styled from "@emotion/styled";

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

export { CanvasWrapper, SummaryContainer, ButtonWrapper };
