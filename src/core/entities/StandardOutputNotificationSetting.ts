
import INotificationSetting, { NotificationSettingId, NotificationSettingType } from './INotificationSetting';

export default class StandardOutputNotificationSetting implements INotificationSetting {
    public readonly type = NotificationSettingType.STANDARD_OUTPUT;

    get key(): string {
        return this.id;
    }

    constructor(public id: NotificationSettingId, public name: string) {
    }
}
