import { Request, Response } from 'express';
import { ResultType } from '../../core/Types';

export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export const errorHandler = (err: Error, req: Request, res: Response): void => {
    console.error(err.stack);

    if (err instanceof HttpError) {
        res.status(err.status).json({
            error: {
                message: err.message,
            },
        });
        return;
    }

    res.status(500).render(ResultType.ERROR, { error: err });
};
