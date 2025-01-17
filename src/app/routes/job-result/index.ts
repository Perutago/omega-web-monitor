import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import helmet from 'helmet';

import Service from '../../services/JobResultService';

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

export default router;
