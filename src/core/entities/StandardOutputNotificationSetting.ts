import i18n from 'i18n';

import { NotificationSettingId, NotificationSettingType } from './INotificationSetting';
import INotificationSetting from './INotificationSetting';

export default class StandardOutputNotificationSetting implements INotificationSetting {
    public readonly type = NotificationSettingType.STANDARD_OUTPUT;

    public readonly id = NotificationSettingId.of('00000000-0000-0000-0000-000000000000');

    public readonly name = i18n.__('StandardOutput');
}
