import INotificationSender from './INotificationSender';
import Notification from './Notification';
import NotificationSetting from '../entities/SlackNotificationSetting';
import { ResultType } from '../Types';

export default class SlackNotificationSender implements INotificationSender {
    constructor(private setting: NotificationSetting) {
    }

    send(notification: Notification): void {
        fetch(this.setting.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                'attachments': [
                    {
                        'color': `${notification.type === ResultType.ERROR ? 'danger' : 'good'}`,
                        'author_name': 'OmegaWebMonitor',
                        'title': `${notification.title}`,
                        'title_link': `${notification.url}`,
                        'text': `${notification.message}`,
                    }
                ]
            }),
        });
    }
}
