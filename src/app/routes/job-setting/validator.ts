import { isValidCron } from 'cron-validator';
import { body, param } from 'express-validator';
import { allJobSettingTypes, JobSettingType } from '../../../core/entities/IJobSetting';
import { handleError } from '../RouteCommon';

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
            .isIn(allJobSettingTypes),
        body('cronTime')
            .notEmpty()
            .custom(value => isValidCron(value)),
        body('url')
            .notEmpty()
            .isURL(),
        body('enabled')
            .notEmpty()
            .isBoolean(),
        body('xpath')
            .if(body('type').equals(JobSettingType.XPATH))
            .notEmpty(),
        body('regex')
            .if(body('type').equals(JobSettingType.REGEX))
            .notEmpty(),
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
            .isIn(allJobSettingTypes),
        body('cronTime')
            .notEmpty()
            .custom(value => isValidCron(value)),
        body('url')
            .notEmpty()
            .isURL(),
        body('enabled')
            .notEmpty()
            .isBoolean(),
        body('xpath')
            .if(body('type').equals(JobSettingType.XPATH))
            .notEmpty(),
        body('regex')
            .if(body('type').equals(JobSettingType.REGEX))
            .notEmpty(),
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