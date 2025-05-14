import { Router } from "express";
import { DeleteGameController } from "../../controllers/game/delete.controller";
import { EditGameController } from "../../controllers/game/edit.controller";
import { FindByIdGameController } from "../../controllers/game/find-by-id.controller";
import { ListGameController } from "../../controllers/game/list.controller";
import { SaveGameController } from "../../controllers/game/save.controller";
import { SyncPsnGameController } from "../../controllers/game/sync-psn.controller";
import { SyncXboxGameController } from "../../controllers/game/sync-xbox.controller";

const router = Router();

router.get("/", (req, res) => new ListGameController().list(req, res));
router.get("/:id", (req, res) => new FindByIdGameController().findById(req, res));
router.post("/", (req, res) => new SaveGameController().save(req, res));
router.put("/:id", (req, res) => new EditGameController().edit(req, res));
router.delete("/:id", (req, res) => new DeleteGameController().delete(req, res));
router.post("/sync-playstation", (req, res) => new SyncPsnGameController().syncPsn(req, res));
router.post("/sync-xbox", (req, res) => new SyncXboxGameController().syncXbox(req, res));

export default router;
