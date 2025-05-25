import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";

const router = Router();

router.post("/login", (req, res) => new AuthController().login(req, res));

export default router;
