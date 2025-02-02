import { body, param } from 'express-validator';
import { allNotificationSettingTypes, NotificationSettingType } from '../../../core/entities/INotificationSetting';
import { handleError } from '../RouteCommon';

const notificationSettingTypes = allNotificationSettingTypes.filter(settingType => settingType !== NotificationSettingType.STANDARD_OUTPUT);
const validator = {
    get: [
        param('id')
            .notEmpty()
            .isUUID(),
        handleError,
    ],
    add: [
        body('name')
            .notEmpty()
            .isLength({ min: 1, max: 256 }),
        body('type')
            .notEmpty()
            .isIn(notificationSettingTypes),
        body('webhookUrl')
            .if(body('type').equals(NotificationSettingType.SLACK))
            .notEmpty()
            .isURL(),
        handleError,
    ],
    update: [
        body('id')
            .notEmpty()
            .isUUID(),
        body('name')
            .notEmpty()
            .isLength({ min: 1, max: 256 }),
        body('type')
            .notEmpty()
            .isIn(notificationSettingTypes),
        body('webhookUrl')
            .if(body('type').equals(NotificationSettingType.SLACK))
            .notEmpty()
            .isURL(),
        handleError,
    ],
    remove: [
        param('id')
            .notEmpty()
            .isUUID(),
        handleError,
    ],
};

export default validator;