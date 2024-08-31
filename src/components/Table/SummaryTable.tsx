import React, { forwardRef } from "react";

import { useTranslation } from "react-i18next";

import * as S from "./Table.styled";
import { SummaryTableItem } from "../../types";

interface SummaryTableProps {
    summaryTableList: SummaryTableItem[];
}

const SummaryTable = forwardRef<HTMLTableElement, SummaryTableProps>(({ summaryTableList }, ref) => {
    const { t } = useTranslation();

    const renderSummaryTableRow = () => {
        return summaryTableList.map((data, summaryIndex) => {
            const lastRow = summaryIndex === summaryTableList.length - 1;

            return (
                <S.Tr key={data.title}>
                    <S.Td>{t(data.title)}</S.Td>
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
                    <S.Th>{t("요일")}</S.Th>
                    <S.Th>{t("출근 시간")}</S.Th>
                    <S.Th>{t("퇴근 시간")}</S.Th>
                    <S.Th>{t("실 근무 시간")}</S.Th>
                </S.Tr>
            </S.Thead>
            <S.Tbody>{renderSummaryTableRow()}</S.Tbody>
        </S.Table>
    );
});

export default SummaryTable;
