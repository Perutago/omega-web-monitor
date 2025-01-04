import i18n from 'i18n';

import NotificationSetting from './NotificationSetting';

export default class StandardOutputNotificationSetting extends NotificationSetting {
    constructor() {
        super('', i18n.__('StandardOutput'), 'standard-output');
    }
}
