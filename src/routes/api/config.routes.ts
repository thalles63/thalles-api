import { Router } from "express";
import { ConfigController } from "../../controllers/config/config.controller";

const router = Router();

router.post("/", (req, res) => new ConfigController().save(req, res));

export default router;
