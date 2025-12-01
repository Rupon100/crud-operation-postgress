import { NextFunction, Request, Response } from "express";


const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} LEMME CCK YOU PASSPORT!`);
    next();
}

export default logger;