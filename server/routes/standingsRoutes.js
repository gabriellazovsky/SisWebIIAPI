import express from "express";
import {
  getDriverStandings,
  getConstructorStandings,
} from "../controllers/standingsController.js";

const router = express.Router();

router.get("/drivers", getDriverStandings);
router.get("/constructors", getConstructorStandings);

export default router;