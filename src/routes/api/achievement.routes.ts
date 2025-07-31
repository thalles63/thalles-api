import { Router } from "express";
import { DeleteMultipleAchievementsController } from "../../controllers/achievement/delete-multiple.controller";
import { EditMultipleAchievementsController } from "../../controllers/achievement/edit-multiple.controller";
import { SaveFromSteamController } from "../../controllers/achievement/save-from-steam.controller";
import { SaveMultipleAchievementsController } from "../../controllers/achievement/save-multiple.controller";
import { SyncAllAchievementsWithPsnController } from "../../controllers/achievement/sync-with-psn.controller";
import { authMiddleware } from "../../utils/auth.middleware";

const router = Router();

router.post("/save-multiple", authMiddleware, (req, res) => new SaveMultipleAchievementsController().saveMultiple(req, res));
router.post("/delete-multiple", authMiddleware, (req, res) => new DeleteMultipleAchievementsController().deleteMultiple(req, res));
router.put("/multiple", authMiddleware, (req, res) => new EditMultipleAchievementsController().editMultiple(req, res));
router.post("/save-from-steam", authMiddleware, (req, res) => new SaveFromSteamController().save(req, res));
router.post("/sync-all-with-psn", authMiddleware, (req, res) => new SyncAllAchievementsWithPsnController().save(req, res));

export default router;
