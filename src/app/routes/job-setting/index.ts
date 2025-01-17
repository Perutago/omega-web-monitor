import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import helmet from 'helmet';

import { allJobSettingTypes, JobSettingType } from '../../../core/entities/IJobSetting';
import Service from '../../services/JobSettingService';

const app = express();
app.use(helmet());
app.use(cors());
const router = express.Router();
const service = new Service();

function handleError(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() });
        return;
    }
    next();
}

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
            .if(body('cronTime').notEmpty())
            .isString(),
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
            .if(body('cronTime').notEmpty())
            .isString(),
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
            .if(body('type').equals('regex'))
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

router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await service.list();
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', validator.get, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await service.get(req.params['id']);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.put('/add', validator.add, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await service.add(req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.post('/update', validator.update, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await service.update(req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.delete('/remove/:id', validator.remove, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await service.remove(req.params['id']);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

export default router;
