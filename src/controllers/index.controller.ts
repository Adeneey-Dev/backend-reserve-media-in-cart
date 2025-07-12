import { Request, Response } from 'express';

export const home = (req: Request, res: Response) => {
    res.json({
        message: 'Welcome to Flashboord backend!',
        status: 'success',
    });
};
