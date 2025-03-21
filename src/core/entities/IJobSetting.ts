import { UUID } from "crypto";

import { Brand } from "../Types";
import IEntity from "./IEntity";

export default interface IJobSetting extends IEntity {
    type: JobSettingType;

    id: JobSettingId;

    name: string;

    cronTime: string;

    url: string;

    enabled: boolean;
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
