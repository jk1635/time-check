import React, { forwardRef } from "react";

import { SummaryTable } from "../types";

interface KakaoSummaryTableProps {
    summaryTableList: Array<SummaryTable>;
}

const KakaoSummaryTable = forwardRef<HTMLTableElement, KakaoSummaryTableProps>(({ summaryTableList }, ref) => {
    const renderTableRow = () => {
        return summaryTableList.map(data => {
            const lastRow = data.title === "잔여 근무 시간";
            return (
                <tr key={data.title}>
                    <td>{data.title}</td>
                    <td>{lastRow ? "" : data.start || "-"}</td>
                    <td>{lastRow ? "" : data.end || "-"}</td>
                    <td>{lastRow ? data.remain : data.real || "-"}</td>
                </tr>
            );
        });
    };
    return (
        <table ref={ref}>
            <thead>
                <tr>
                    <th>요일</th>
                    <th>출근 시간</th>
                    <th>퇴근 시간</th>
                    <th>실 근무 시간</th>
                </tr>
            </thead>
            <tbody>{renderTableRow()}</tbody>
        </table>
    );
});

export default KakaoSummaryTable;
