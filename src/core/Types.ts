export const allNotificationSettingTypes = ['slack', 'standard-output'] as const;
export type NotificationSettingType = typeof allNotificationSettingTypes[number];
export const NotificationSettingType = {
    SLACK: allNotificationSettingTypes[0],
    STANDARD_OUTPUT: allNotificationSettingTypes[1],
} as const;

export const allJobSettingTypes = ['xpath', 'regex'] as const;
export type JobSettingType = typeof allJobSettingTypes[number];
export const JobSettingType = {
    XPATH: allJobSettingTypes[0],
    REGEX: allJobSettingTypes[1],
} as const;

export const allResultTypes = ['error', 'warning', 'info', 'success'] as const;
export type ResultType = typeof allResultTypes[number];
export const ResultType = {
    ERROR: allResultTypes[0],
    WARNING: allResultTypes[1],
    INFO: allResultTypes[2],
    SUCCESS: allResultTypes[3],
} as const;
