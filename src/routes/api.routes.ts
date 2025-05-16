import { Router } from "express";
import gameRoutes from "./api/game.routes";
import syncRoutes from "./api/sync.routes";

const router = Router();

router.use("/game", gameRoutes);
router.use("/sync", syncRoutes);

export default router;
