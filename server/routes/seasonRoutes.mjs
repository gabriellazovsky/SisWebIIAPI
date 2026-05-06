import express from "express";
import {
  getAllSeasons,
  createSeason,
  getSeasonByYear,
  updateSeason,
  deleteSeason,
  getSeasonRaces
} from "../controllers/seasonController.mjs";

const router = express.Router();

router.get("/", getAllSeasons);
router.post("/", createSeason);
router.get("/:year", getSeasonByYear);
router.get("/:year/races", getSeasonRaces);
router.put("/:year", updateSeason);
router.delete("/:year", deleteSeason);

export default router;