import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";

export const getUsers = (req: Request, res: Response) => {
    const users = userService.getAll();
    res.json(users);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = userService.getById(Number(req.params.id));
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const createUser = (req: Request, res: Response) => {
    const newUser = userService.create(req.body);
    res.status(201).json(newUser);
};
