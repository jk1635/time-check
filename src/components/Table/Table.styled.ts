import styled from "@emotion/styled";

const TableWrapper = styled.section`
    margin-top: 2px;
    min-width: 300px;
    overflow-x: scroll;
`;

const Table = styled.table`
    width: 100%;
    border-top: 1px solid #eaeef4;
    border-bottom: 1px solid #eaeef4;
    border-collapse: collapse;
    color: #37516a;
    font-size: 12px;
    font-weight: 400;
`;

const Thead = styled.thead`
    color: #37516a;
`;

const Tr = styled.tr`
    height: 52px;
`;

const Th = styled.th`
    display: table-cell;
    padding: 0px 8px;
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;
`;

const Tbody = styled.tbody`
    color: #37516a;

    tr:nth-of-type(odd) {
        background-color: #f6fafd;
    }
`;

const Td = styled.td`
    display: table-cell;
    padding: 0px 8px;
    height: 52px;
    border-top: 1px solid #eaeef4;
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;

    .text-input {
        border: none;
        outline: none;
        background-color: transparent;
        font-weight: bold;
        &::placeholder {
            color: #d7e4e6;
        }
    }

    .checkbox-input {
        width: 16px;
        height: 16px;
        cursor: pointer;
    }
`;

export { TableWrapper, Table, Thead, Tr, Th, Tbody, Td };
