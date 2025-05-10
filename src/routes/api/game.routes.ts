import { Router } from "express";
import { GameController } from "../../controllers/game.controller";

const router = Router();
const gameController = new GameController();

router.get("/", (req, res) => gameController.listGames(req, res));
router.get("/:id", (req, res) => gameController.getGameById(req, res));

export default router;
