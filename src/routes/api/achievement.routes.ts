import { Router } from "express";
import { DeleteMultipleAchievementsController } from "../../controllers/achievement/delete-multiple.controller";
import { EditMultipleAchievementsController } from "../../controllers/achievement/edit-multiple.controller";
import { SaveMultipleAchievementsController } from "../../controllers/achievement/save-multiple.controller";

const router = Router();

router.post("/save-multiple", (req, res) => new SaveMultipleAchievementsController().saveMultiple(req, res));
router.post("/delete-multiple", (req, res) => new DeleteMultipleAchievementsController().deleteMultiple(req, res));
router.put("/multiple", (req, res) => new EditMultipleAchievementsController().editMultiple(req, res));

export default router;
