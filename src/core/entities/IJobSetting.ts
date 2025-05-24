import { UUID } from "crypto";

import { Brand } from "../Types";
import { NotificationSettingId } from "./INotificationSetting";

export default interface IJobSetting {
    type: JobSettingType;

    id: JobSettingId;

    name: string;

    cronTime: string;

    url: string;

    enabled: boolean;

    notificationSettingIds: NotificationSettingId[];
}

export const allJobSettingTypes = [
    'xpath',
    'regex',
] as const;
export type JobSettingType = typeof allJobSettingTypes[number];
export const JobSettingType = {
    XPATH: allJobSettingTypes[0],
    REGEX: allJobSettingTypes[1],
} as const;

export type JobSettingId = Brand<string, "JobSettingId">;
export const JobSettingId = {
    of(id: UUID): JobSettingId {
        return id as JobSettingId;
    }
};
