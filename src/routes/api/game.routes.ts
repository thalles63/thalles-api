import { Router } from "express";
import { CountGamesByStatusController } from "../../controllers/game/count-by-status.controller";
import { DeleteGameController } from "../../controllers/game/delete.controller";
import { EditGameController } from "../../controllers/game/edit.controller";
import { FindByIdGameController } from "../../controllers/game/find-by-id.controller";
import { ListGameController } from "../../controllers/game/list.controller";
import { MigrateImagesFromGameController } from "../../controllers/game/migrate-images.controller";
import { SaveGameController } from "../../controllers/game/save.controller";
import { SearchIgdbController } from "../../controllers/game/search-igdb.controller";
import { SearchSteamController } from "../../controllers/game/search-steam.controller";
import { UpdateIgdbInfoController } from "../../controllers/game/update-igdb-info.controller";
import { authMiddleware } from "../../utils/auth.middleware";

const router = Router();

router.get("/search-igdb", authMiddleware, (req, res) => new SearchIgdbController().search(req, res));
router.get("/search-steam", authMiddleware, (req, res) => new SearchSteamController().search(req, res));
router.get("/migrate-images/:id", (req, res) => new MigrateImagesFromGameController().migrate(req, res));
router.get("/:id", (req, res) => new FindByIdGameController().findById(req, res));
router.post("/", authMiddleware, (req, res) => new SaveGameController().save(req, res));
router.post("/list", (req, res) => new ListGameController().list(req, res));
router.post("/count", (req, res) => new CountGamesByStatusController().count(req, res));
router.post("/create-game-with-igdb-info", authMiddleware, (req, res) => new UpdateIgdbInfoController().update(req, res));
router.put("/update-igdb-info/:id", authMiddleware, (req, res) => new UpdateIgdbInfoController().update(req, res));
router.put("/:id", authMiddleware, (req, res) => new EditGameController().edit(req, res));
router.delete("/:id", authMiddleware, (req, res) => new DeleteGameController().delete(req, res));

export default router;
