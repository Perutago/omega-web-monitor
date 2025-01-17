
import INotificationSetting, { NotificationSettingId, NotificationSettingType } from './INotificationSetting';

export default class StandardOutputNotificationSetting implements INotificationSetting {
    public readonly type = NotificationSettingType.STANDARD_OUTPUT;

    constructor(public id: NotificationSettingId, public name: string) {
    }
}
