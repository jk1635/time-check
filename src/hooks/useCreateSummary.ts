import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { weekdays } from "../constants";
import { workTimeState } from "../stores/atoms";
import { overtimeStatusSelector, realWorkTimeMinutesSelector } from "../stores/selectors";
import { WeeklySummary } from "../types";
import { minutesToTime } from "../utils/timeCalculator";

const useCreateSummary = () => {
    const { t } = useTranslation();

    const [workTime] = useRecoilState(workTimeState);
    const realWorkTimeMinutes = useRecoilValue(realWorkTimeMinutesSelector);
    const overtime = useRecoilValue(overtimeStatusSelector);

    const weeklySummary: WeeklySummary = {};

    workTime.forEach((dayItem, index) => {
        const realWorkTime = minutesToTime(realWorkTimeMinutes[index]);
        const dayStatus = [];

        if (dayItem.halfDay) {
            dayStatus.push(t("반차"));
        }

        if (dayItem.fullDay) {
            dayStatus.push(t("연차"));
        }

        const day = t(weekdays[index]);
        weeklySummary[day] = dayStatus.length ? `${realWorkTime} (${dayStatus.join("/")})` : `${realWorkTime}`;
    });

    weeklySummary[t("잔여 근무 시간")] = overtime;

    return weeklySummary;
};

export default useCreateSummary;
