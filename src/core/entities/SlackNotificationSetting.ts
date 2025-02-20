import INotificationSetting, { NotificationSettingId, NotificationSettingType } from './INotificationSetting';

export default class SlackNotificationSetting implements INotificationSetting {
    public readonly type = NotificationSettingType.SLACK;

    constructor(public id: NotificationSettingId, public name: string, public webhookUrl: string, public author: string) {
    }
}
