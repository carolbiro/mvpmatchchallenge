import { Request, Response, NextFunction } from 'express';

// middleware to log requests
export const logRequests = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

// middleware to log responses
export const logResponses = (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    res.send = function (body): any{
        console.log(body);
        originalSend.call(this, body);
    };
    next();
}