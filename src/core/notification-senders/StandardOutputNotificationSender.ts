import NotificationSetting from '../entities/StandardOutputNotificationSetting';
import INotificationSender from './INotificationSender';
import Notification from './Notification';

export default class StandardOutputNotificationSender implements INotificationSender {
    constructor(private setting: NotificationSetting) {
    }

    async send(notification: Notification): Promise<void> {
        console.log(`${notification.title}\n${notification.message}`);
        return Promise.resolve();
    }
}
