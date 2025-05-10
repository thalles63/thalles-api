import { Router } from "express";
import gameRoutes from "./api/game.routes";

const router = Router();

router.use("/game", gameRoutes);

export default router;
