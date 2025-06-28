import IJobSetting, { JobSettingId, JobSettingType } from './IJobSetting';
import { NotificationSettingId } from './INotificationSetting';

export default class RegexJobSetting implements IJobSetting {
    public readonly type = JobSettingType.REGEX;

    constructor(
        public id: JobSettingId,
        public name: string,
        public cronTime: string,
        public url: string,
        public enabled: boolean,
        public notificationSettingIds: NotificationSettingId[],
        public regex: string
    ) { }
}
