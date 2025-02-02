import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import Service from '../../services/JobService';
import validator from './validator';

const app = express();
app.use(helmet());
app.use(cors());
const router = express.Router();
const service = new Service();

router.get('/run/:id', validator.run, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await service.run(req.params['id']);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

export default router;
