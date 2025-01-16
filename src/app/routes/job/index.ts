import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import helmet from 'helmet';

import JobResultRepository from '../../../core/repositories/CsvJobResultRepository';
import JobSettingRepository from '../../../core/repositories/JsonJobSettingRepository';
import NotificationSettingRepository from '../../../core/repositories/JsonNotificationSettingRepository';
import Service from '../../services/JobService';

const app = express();
app.use(helmet());
app.use(cors());
const router = express.Router();
const service = new Service(JobResultRepository, JobSettingRepository, NotificationSettingRepository);

function handleError(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() });
        return;
    }
    next();
}

const validator = {
    run: [
        param('id')
            .notEmpty()
            .isUUID(),
        handleError,
    ],
};

router.get('/run/:id', validator.run, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await service.run(req.params['id']);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

export default router;
