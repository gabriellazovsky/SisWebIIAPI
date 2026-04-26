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

router.get("/", getAllRaces);
router.post("/", createRace);
router.get("/:raceId", getRaceById);
router.put("/:raceId", updateRace);
router.delete("/:raceId", deleteRace);
router.get("/:raceId/results", getRaceResults);

export default router;