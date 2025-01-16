import NotificationSetting from '../entities/SlackNotificationSetting';
import { ResultType } from '../Types';
import INotificationSender from './INotificationSender';
import Notification from './Notification';

export default class SlackNotificationSender implements INotificationSender {
    constructor(private setting: NotificationSetting) {
    }

    async send(notification: Notification): Promise<void> {
        await fetch(this.setting.webhookUrl, {
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
