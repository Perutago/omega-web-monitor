import { param } from 'express-validator';
import { handleError } from '../RouteCommon';

const validator = {
    run: [
        param('id')
            .notEmpty()
            .isUUID(),
        handleError,
    ],
};

export default validator;
