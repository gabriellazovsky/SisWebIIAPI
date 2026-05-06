import express from "express";
import {
  getCurrentSeason,
  getExternalDriver
} from "../controllers/externalController.mjs";

const router = express.Router();

router.get("/current-season", getCurrentSeason);
router.get("/driver/:driverRef", getExternalDriver);

export default router;

