import styled from "@emotion/styled";

const Button = styled.button`
    padding: 0px 15px;
    width: auto;
    min-width: 80px;
    height: 40px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;

    &.default-button {
        border: none;
        color: #ffffff;
        background-color: #0a2c4c;
    }

    &.outline-button {
        border: 1px solid #d7e4e6;
        background-color: transparent;
    }
`;

export { Button };
