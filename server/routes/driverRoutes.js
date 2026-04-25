import express from "express";
import {
  getAllDrivers,
  createDriver,
  getDriverById,
  updateDriver,
  deleteDriver,
  getDriverResults,
  getDriverStandings,
  getDriverQualifying,
  getDriverLapTimes,
  getDriverPitStops
} from "../controllers/driverController.js";

const router = express.Router();

router.get("/", getAllDrivers);
router.post("/", createDriver);
router.get("/:driverId", getDriverById);
router.put("/:driverId", updateDriver);
router.delete("/:driverId", deleteDriver);
router.get("/:driverId/results", getDriverResults);
router.get("/:driverId/standings", getDriverStandings);
router.get("/:driverId/qualifying", getDriverQualifying);
router.get("/:driverId/lap-times", getDriverLapTimes);
router.get("/:driverId/pit-stops", getDriverPitStops);

export default router;
