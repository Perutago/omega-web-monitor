import INotificationSetting, { NotificationSettingId, NotificationSettingType } from './INotificationSetting';

export default class SlackNotificationSetting implements INotificationSetting {
    public readonly type = NotificationSettingType.SLACK;

    get key(): string {
        return this.id;
    }

    constructor(public id: NotificationSettingId, public name: string, public webhookUrl: string, public author: string) {
    }
}
