import { param } from 'express-validator';
import { handleError } from '../RouteCommon';

const validator = {
    get: [
        param('id')
            .notEmpty()
            .isUUID(),
        handleError,
    ],
};

export default validator;