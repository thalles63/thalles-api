import { Router } from "express";
import { GameController } from "../../controllers/game.controller";

const router = Router();
const gameController = new GameController();

router.get("/", (req, res) => gameController.list(req, res));
router.get("/:id", (req, res) => gameController.getById(req, res));
router.post("/", (req, res) => gameController.save(req, res));

export default router;
