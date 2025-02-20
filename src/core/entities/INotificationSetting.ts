import { UUID } from "crypto";

import { Brand } from "../Types";
import IEntity from "./IEntity";

export default interface INotificationSetting extends IEntity {
    type: NotificationSettingType;

    id: NotificationSettingId;

    name: string;
}

export const allNotificationSettingTypes = [
    'slack',
    'standard-output',
] as const;
export type NotificationSettingType = typeof allNotificationSettingTypes[number];
export const NotificationSettingType = {
    SLACK: allNotificationSettingTypes[0],
    STANDARD_OUTPUT: allNotificationSettingTypes[1],
} as const;

export type NotificationSettingId = Brand<string, "NotificationSettingId">;
export const NotificationSettingId = {
    of(id: UUID): NotificationSettingId {
        return id as NotificationSettingId;
    }
};
