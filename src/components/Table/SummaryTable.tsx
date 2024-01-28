import React, { forwardRef } from "react";

import * as S from "./Table.styled";
import { SummaryTableItem } from "../../types";

interface SummaryTableProps {
    summaryTableList: SummaryTableItem[];
}

const SummaryTable = forwardRef<HTMLTableElement, SummaryTableProps>(({ summaryTableList }, ref) => {
    const renderSummaryTableRow = () => {
        return summaryTableList.map(data => {
            const lastRow = data.title === "잔여 근무 시간";
            return (
                <S.Tr key={data.title}>
                    <S.Td>{data.title}</S.Td>
                    <S.Td>{lastRow ? "" : data.start || "-"}</S.Td>
                    <S.Td>{lastRow ? "" : data.end || "-"}</S.Td>
                    <S.Td>{lastRow ? data.remain : data.real || "-"}</S.Td>
                </S.Tr>
            );
        });
    };

    return (
        <S.Table ref={ref}>
            <S.Thead>
                <S.Tr>
                    <S.Th>요일</S.Th>
                    <S.Th>출근 시간</S.Th>
                    <S.Th>퇴근 시간</S.Th>
                    <S.Th>실 근무 시간</S.Th>
                </S.Tr>
            </S.Thead>
            <S.Tbody>{renderSummaryTableRow()}</S.Tbody>
        </S.Table>
    );
});

export default SummaryTable;
