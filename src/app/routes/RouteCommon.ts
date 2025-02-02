import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export function handleError(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() });
        return;
    }
    next();
}