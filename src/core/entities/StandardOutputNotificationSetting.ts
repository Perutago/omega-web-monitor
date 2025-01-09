import i18n from 'i18n';

import NotificationSetting from './NotificationSetting';
import { NotificationSettingType } from '../Types';

export default class StandardOutputNotificationSetting extends NotificationSetting {
    constructor() {
        super('', i18n.__('StandardOutput'), NotificationSettingType.STANDARD_OUTPUT);
    }
}
