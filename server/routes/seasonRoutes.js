import express from "express";
import {
  getAllSeasons,
  createSeason,
  getSeasonByYear,
  updateSeason,
  deleteSeason
} from "../controllers/seasonController.js";

const router = express.Router();

router.get("/", getAllSeasons);
router.post("/", createSeason);
router.get("/:year", getSeasonByYear);
router.put("/:year", updateSeason);
router.delete("/:year", deleteSeason);

export default router;