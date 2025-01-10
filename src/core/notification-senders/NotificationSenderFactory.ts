import SlackNotificationSender from './SlackNotificationSender';
import StandardOutputNotificationSender from './StandardOutputNotificationSender';
import NotificationSetting from '../entities/NotificationSetting';
import SlackNotificationSetting from '../entities/SlackNotificationSetting';
import StandardOutputNotificationSetting from '../entities/StandardOutputNotificationSetting';
import { NotificationSettingType } from '../Types';

export default class NotificationSenderFactory {
    static get(setting: NotificationSetting) {
        if (setting.type === NotificationSettingType.SLACK) {
            return new SlackNotificationSender(setting as SlackNotificationSetting);
        } else if (setting.type === NotificationSettingType.STANDARD_OUTPUT) {
            return new StandardOutputNotificationSender(setting as StandardOutputNotificationSetting);
        } else {
            throw new Error('Invalid notification setting.');
        }
    }
}
