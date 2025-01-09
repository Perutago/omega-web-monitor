import NotificationSetting from '../entities/StandardOutputNotificationSetting';
import INotificationSender from './INotificationSender';
import Notification from './Notification';

export default class StandardOutputNotificationSender implements INotificationSender {
    constructor(private setting: NotificationSetting) {
    }

    send(notification: Notification): void {
        console.log(`${notification.title}\n${notification.message}`);
    }
}
