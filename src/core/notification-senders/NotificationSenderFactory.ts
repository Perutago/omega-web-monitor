import SlackNotificationSender from './SlackNotificationSender';
import StandardOutputNotificationSender from './StandardOutputNotificationSender';
import NotificationSetting from '../entities/NotificationSetting';
import SlackNotificationSetting from '../entities/SlackNotificationSetting';
import StandardOutputNotificationSetting from '../entities/StandardOutputNotificationSetting';

export default class NotificationSenderFactory {
    static get(setting: NotificationSetting) {
        if (setting instanceof SlackNotificationSetting) {
            return new SlackNotificationSender(setting);
        } else if (setting instanceof StandardOutputNotificationSetting) {
            return new StandardOutputNotificationSender(setting);
        } else {
            throw new Error('Invalid notification setting.');
        }
    }
}
