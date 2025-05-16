import { Router } from "express";
import { SyncPsnGameController } from "../../controllers/sync/sync-psn.controller";
import { SyncSteamGameController } from "../../controllers/sync/sync-steam.controller";
import { SyncXboxGameController } from "../../controllers/sync/sync-xbox.controller";

const router = Router();

router.post("/playstation", (req, res) => new SyncPsnGameController().syncPsn(req, res));
router.post("/xbox", (req, res) => new SyncXboxGameController().syncXbox(req, res));
router.post("/steam", (req, res) => new SyncSteamGameController().syncSteam(req, res));

export default router;
