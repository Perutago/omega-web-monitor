import NotificationSetting, { NotificationSettingType } from '../entities/INotificationSetting';
import SlackNotificationSetting from '../entities/SlackNotificationSetting';
import StandardOutputNotificationSetting from '../entities/StandardOutputNotificationSetting';
import INotificationSender from './INotificationSender';
import SlackNotificationSender from './SlackNotificationSender';
import StandardOutputNotificationSender from './StandardOutputNotificationSender';

export default class NotificationSenderFactory {
    static get(setting: NotificationSetting): INotificationSender {
        if (setting.type === NotificationSettingType.SLACK) {
            return new SlackNotificationSender(setting as SlackNotificationSetting);
        } else if (setting.type === NotificationSettingType.STANDARD_OUTPUT) {
            return new StandardOutputNotificationSender(setting as StandardOutputNotificationSetting);
        } else {
            throw new Error('Invalid notification setting.');
        }
    }
}
