import SlackNotificationSender from './SlackNotificationSender';
import StandardOutputNotificationSender from './StandardOutputNotificationSender';
import NotificationSetting from '../entities/NotificationSetting';
import SlackNotificationSetting from '../entities/SlackNotificationSetting';

export default class NotificationSenderFactory {
    static get(setting: NotificationSetting) {
        if (setting.type === 'slack') {
            return new SlackNotificationSender(setting as SlackNotificationSetting);
        } else if (setting.type === 'standard-output') {
            return new StandardOutputNotificationSender();
        } else {
            throw new Error('Invalid notification setting.');
        }
    }
}
