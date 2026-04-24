const Race = require("../models/Race");
const Result = require("../models/Result");

exports.getAllRaces = async (req, res) => {
  try {
    const { season, round, circuitId, name, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (season) filter.year = season;
    if (round) filter.round = round;
    if (circuitId) filter.circuitId = circuitId;
    if (name) filter.name = { $regex: name, $options: "i" };

    const races = await Race.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(races);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.createRace = async (req, res) => {
  try {
    const newRace = new Race(req.body);
    const savedRace = await newRace.save();
    res.status(201).json(savedRace);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getRaceById = async (req, res) => {
  try {
    const race = await Race.findById(req.params.raceId);
    if (!race) {
      return res.status(404).json({ message: "Race not found" });
    }
    res.json(race);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateRace = async (req, res) => {
  try {
    const updatedRace = await Race.findByIdAndUpdate(
      req.params.raceId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRace) {
      return res.status(404).json({ message: "Race not found" });
    }
    res.json(updatedRace);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteRace = async (req, res) => {
  try {
    const deletedRace = await Race.findByIdAndDelete(req.params.raceId);
    if (!deletedRace) {
      return res.status(404).json({ message: "Race not found" });
    }
    res.json({ message: "Race deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getRaceResults = async (req, res) => {
  try {
    const results = await Result.find({ raceId: req.params.raceId });
    if (results.length === 0) {
      return res.status(404).json({ message: "Results not found" });
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};