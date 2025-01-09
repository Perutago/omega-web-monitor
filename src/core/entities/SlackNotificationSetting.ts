import { NotificationSettingType } from '../Types';
import NotificationSetting from './NotificationSetting';

export default class SlackNotificationSetting extends NotificationSetting {
    constructor(public id: string, public name: string, public webhookUrl: string) {
        super(id, name, NotificationSettingType.SLACK);
    }
}
