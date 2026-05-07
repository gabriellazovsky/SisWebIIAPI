import express from "express";

import {
  getWeather,
  getRaceControl,
  getTeamRadio,
  getSessions
} from "../controllers/openf1Controller.js";

const router = express.Router();

router.get("/weather", getWeather);
router.get("/race-control", getRaceControl);
router.get("/team-radio", getTeamRadio);
router.get("/sessions",getSessions)

export default router;