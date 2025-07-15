import { Router } from "express";
import { SyncPsnGameController } from "../../controllers/sync/sync-psn.controller";
import { SyncRetroAchievementsController } from "../../controllers/sync/sync-retro-achievements.controller";
import { SyncSteamGameController } from "../../controllers/sync/sync-steam.controller";
import { SyncXboxGameController } from "../../controllers/sync/sync-xbox.controller";
import { authMiddleware } from "../../utils/auth.middleware";

const router = Router();

router.post("/playstation", authMiddleware, (req, res) => new SyncPsnGameController().syncPsn(req, res));
router.post("/xbox", authMiddleware, (req, res) => new SyncXboxGameController().syncXbox(req, res));
router.post("/steam", authMiddleware, (req, res) => new SyncSteamGameController().syncSteam(req, res));
router.post("/retro-achievements", authMiddleware, (req, res) => new SyncRetroAchievementsController().syncRetroAchievements(req, res));

export default router;
