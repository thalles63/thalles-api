import { Router } from "express";
import { DeleteMultipleAchievementsController } from "../../controllers/achievement/delete-multiple.controller";
import { EditMultipleAchievementsController } from "../../controllers/achievement/edit-multiple.controller";
import { EditGameController } from "../../controllers/game/edit.controller";
import { FindByIdGameController } from "../../controllers/game/find-by-id.controller";
import { ListGameController } from "../../controllers/game/list.controller";
import { SaveGameController } from "../../controllers/game/save.controller";
import { SearchIgdbController } from "../../controllers/game/search-igdb";

const router = Router();

router.get("/", (req, res) => new ListGameController().list(req, res));
router.get("/search-igdb", (req, res) => new SearchIgdbController().search(req, res));
router.get("/:id", (req, res) => new FindByIdGameController().findById(req, res));
router.post("/", (req, res) => new SaveGameController().save(req, res));
router.put("/:id", (req, res) => new EditGameController().edit(req, res));
router.post("/achievements/delete-multiple", (req, res) => new DeleteMultipleAchievementsController().deleteMultiple(req, res));
router.put("/achievements/multiple", (req, res) => new EditMultipleAchievementsController().editMultiple(req, res));
// router.delete("/:id", (req, res) => new DeleteGameController().delete(req, res));

export default router;
