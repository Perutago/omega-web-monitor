import Notification from './Notification';

export default interface INotificationSender {
    send(notification: Notification): void;
}
