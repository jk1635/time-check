import styled from "@emotion/styled";

const PopupWrapper = styled.div`
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    width: 300px;
    height: 200px;
    border: 1px solid #eaeef4;
    border-radius: 5px;
    background-color: #ffffff;
    font-size: 14px;
    z-index: 1000;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(234, 238, 244, 0.4);
    z-index: 999;
`;

const CloseComment = styled.div`
    display: flex;
    justify-content: flex-end;

    .material-symbols-outlined {
        cursor: pointer;
        font-size: 18px;
    }
`;

// const CheckboxWrapper = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
// `;
//
// const CloseCheckbox = styled.input`
//     width: 12px;
//     height: 12px;
//     cursor: pointer;
// `;
//
// const CloseLabel = styled.label`
//     font-size: 11px;
// `;

export { PopupWrapper, ModalOverlay, CloseComment };
