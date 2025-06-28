import express, { NextFunction, Request, Response } from 'express';
import Service from '../../services/JobService';
import validator from './validator';

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
