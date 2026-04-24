const express = require("express");
const router = express.Router();

const racesController = require("../controllers/raceController");

router.get("/", racesController.getAllRaces);
router.post("/", racesController.createRace);

router.get("/:raceId", racesController.getRaceById);
router.put("/:raceId", racesController.updateRace);
router.delete("/:raceId", racesController.deleteRace);

router.get("/:raceId/results", racesController.getRaceResults);

module.exports = router;