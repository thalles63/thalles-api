import { Router } from "express";
import achievementRoutes from "./api/achievement.routes";
import authRoutes from "./api/auth.routes";
import configRoutes from "./api/config.routes";
import gameRoutes from "./api/game.routes";
import syncRoutes from "./api/sync.routes";

const router = Router();

router.use("/game", gameRoutes);
router.use("/achievements", achievementRoutes);
router.use("/sync", syncRoutes);
router.use("/auth", authRoutes);
router.use("/config", configRoutes);

export default router;
