import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../../services/user.service";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

export class AuthController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const user = await this.userService.validateUser(email, password);
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ token });
    }
}
