import INotificationSender from './INotificationSender';
import Notification from './Notification';

export default class StandardOutputNotificationSender implements INotificationSender {
    send(notification: Notification) {
        console.log(`${notification.title}\n${notification.message}`);
    }
}
