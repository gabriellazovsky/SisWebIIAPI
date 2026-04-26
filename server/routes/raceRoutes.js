import express from "express";
import {
  getAllRaces,
  createRace,
  getRaceById,
  updateRace,
  deleteRace,
  getRaceResults
} from "../controllers/raceController.js";

const router = express.Router();

router.get("/", racesController.getAllRaces);
router.post("/", racesController.createRace);
router.get("/:raceId", racesController.getRaceById);
router.put("/:raceId", racesController.updateRace);
router.delete("/:raceId", racesController.deleteRace);
router.get("/:raceId/results", racesController.getRaceResults);

export default router;