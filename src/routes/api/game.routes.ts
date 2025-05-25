import { Router } from "express";
import { DeleteGameController } from "../../controllers/game/delete.controller";
import { EditGameController } from "../../controllers/game/edit.controller";
import { FindByIdGameController } from "../../controllers/game/find-by-id.controller";
import { ListGameController } from "../../controllers/game/list.controller";
import { SaveGameController } from "../../controllers/game/save.controller";
import { SearchIgdbController } from "../../controllers/game/search-igdb";
import { authMiddleware } from "../../utils/auth.middleware";

const router = Router();

router.get("/", (req, res) => new ListGameController().list(req, res));
router.get("/search-igdb", authMiddleware, (req, res) => new SearchIgdbController().search(req, res));
router.get("/:id", (req, res) => new FindByIdGameController().findById(req, res));
router.post("/", authMiddleware, (req, res) => new SaveGameController().save(req, res));
router.put("/:id", authMiddleware, (req, res) => new EditGameController().edit(req, res));
router.delete("/:id", authMiddleware, (req, res) => new DeleteGameController().delete(req, res));

export default router;
