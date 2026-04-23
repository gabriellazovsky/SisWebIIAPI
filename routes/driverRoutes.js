const express = require("express");
const router = express.Router();

const Driver = require("../models/Driver");
const Result = require("../models/Result");
const Standings = require("../models/Standings");
const Qualifying = require("../models/Qualifying");
const Times = require("../models/Times");
const Stops = require("../models/Stops");

router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    const savedDriver = await newDriver.save();

    res.status(201).json(savedDriver);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:driverId", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.driverId);
    if (!driver) {
      return res.status(404).json({ message: "Pilot not found" });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/:driverId", async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.driverId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(updatedDriver);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/:driverId", async (req, res) => {
  try {
    const deletedDriver = await Driver.findByIdAndDelete(req.params.driverId);

    if (!deletedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:driverId/results", async (req, res) => {
  try {
    const results = await Result.find({ driverId: req.params.driverId });
    if (results.length === 0) {
      return res.status(404).json({ message: "Results not found" });
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:driverId/standings", async (req, res) => {
  try {
    const standings = await Standings.find({ driverId: req.params.driverId });
    if (standings.length === 0) {
      return res.status(404).json({ message: "Standings not found" });
    }
    res.json(standings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:driverId/qualifying", async (req, res) => {
  try {
    const qualifying = await Qualifying.find({ driverId: req.params.driverId });
    if (qualifying.length === 0) {
      return res.status(404).json({ message: "Qualifying not found" });
    }
    res.json(qualifying);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:driverId/lap-times", async (req, res) => {
  try {
    const times = await Times.find({ driverId: req.params.driverId });
    if (times.length === 0) {
      return res.status(404).json({ message: "Lap times not found" });
    }
    res.json(times);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:driverId/pit-stops", async (req, res) => {
  try {
    const stops = await Stops.find({ driverId: req.params.driverId });
    if (stops.length === 0) {
      return res.status(404).json({ message: "Pit stops not found" });
    }
    res.json(stops);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;