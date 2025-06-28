import IJobSetting, { JobSettingId, JobSettingType } from './IJobSetting';
import { NotificationSettingId } from './INotificationSetting';

export default class XpathJobSetting implements IJobSetting {
    public readonly type = JobSettingType.XPATH;

    constructor(
        public id: JobSettingId,
        public name: string,
        public cronTime: string,
        public url: string,
        public enabled: boolean,
        public notificationSettingIds: NotificationSettingId[],
        public xpath: string
    ) { }
}
