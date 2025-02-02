import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import Service from '../../services/JobResultService';
import validator from './validator';

const app = express();
app.use(helmet());
app.use(cors());
const router = express.Router();
const service = new Service();

router.get('/list', async (_req: Request, res: Response, next: NextFunction) => {
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
