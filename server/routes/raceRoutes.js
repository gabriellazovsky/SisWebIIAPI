import express from "express";
import {
  getAllRaces,
  createRace,
  getRaceById,
  updateRace,
  deleteRace,
  getRaceResults
} from "../controllers/raceController.js";

import { 
    getQualifyingByRace 
} from "../controllers/qualifyingController.js";


const router = express.Router();

router.get("/", getAllRaces);
router.post("/", createRace);
router.get("/:raceId", getRaceById);
router.put("/:raceId", updateRace);
router.delete("/:raceId", deleteRace);
router.get("/:raceId/results", getRaceResults);
router.get("/:raceId/qualifying", getQualifyingByRace);

export default router;