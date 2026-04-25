const Race = require("../models/Race");

exports.getRaceById = async (req, res) => {
  try {
    const race = await Race.findOne({
      raceId: Number(req.params.raceId)
    });

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
    const updatedRace = await Race.findOneAndUpdate(
      { raceId: Number(req.params.raceId) },
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
    const deletedRace = await Race.findOneAndDelete({
      raceId: Number(req.params.raceId)
    });

    if (!deletedRace) {
      return res.status(404).json({ message: "Race not found" });
    }

    res.json({ message: "Race deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};