import express, { NextFunction, Request, Response } from 'express';
import Service from '../../services/JobSettingService';
import validator from './validator';

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

router.post('/', validator.add, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await service.add(req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.put('/', validator.update, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await service.update(req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', validator.remove, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await service.remove(req.params['id']);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

export default router;
