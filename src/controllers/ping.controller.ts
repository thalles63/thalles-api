import { Request, Response } from "express";

export const ping = (req: Request, res: Response) => {
    res.status(201).json({});
};
