import express from "express";
const router = express.Router();

import * as racesController from "../controllers/raceController.mjs";

router.get("/", racesController.getAllRaces);
router.post("/", racesController.createRace);

router.get("/:raceId", racesController.getRaceById);
router.put("/:raceId", racesController.updateRace);
router.delete("/:raceId", racesController.deleteRace);

router.get("/:raceId/results", racesController.getRaceResults);

export default router;