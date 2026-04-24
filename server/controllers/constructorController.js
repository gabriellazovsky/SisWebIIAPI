const Race = require("../models/Race");
const Constructor = require("../models/Constructor");
const ConstructorResult = require("../models/ConstructorResults");
const ConstructorStanding = require("../models/ConstructorStandings");

exports.getAllConstructors = async (req, res) => {
  try {
    const { nationality, name, constructorRef, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (nationality) filter.nationality = nationality;
    if (constructorRef) filter.constructorRef = constructorRef;
    if (name) filter.name = { $regex: name, $options: "i" };

    const constructors = await Constructor.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(constructors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.createConstructor = async (req, res) => {
  try {
    const newConstructor = new Constructor(req.body);
    const savedConstructor = await newConstructor.save();

    res.status(201).json(savedConstructor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getConstructorById = async (req, res) => {
  try {
    const constructor = await Constructor.findById(req.params.constructorId);

    if (!constructor) {
      return res.status(404).json({ message: "Constructor not found" });
    }

    res.json(constructor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateConstructor = async (req, res) => {
  try {
    const updatedConstructor = await Constructor.findByIdAndUpdate(
      req.params.constructorId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedConstructor) {
      return res.status(404).json({ message: "Constructor not found" });
    }

    res.json(updatedConstructor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteConstructor = async (req, res) => {
  try {
    const deletedConstructor = await Constructor.findByIdAndDelete(
      req.params.constructorId
    );

    if (!deletedConstructor) {
      return res.status(404).json({ message: "Constructor not found" });
    }

    res.json({ message: "Constructor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getConstructorResults = async (req, res) => {
  try {
    const { raceId, points, status, page = 1, limit = 20 } = req.query;

    const filter = { constructorId: req.params.constructorId };

    if (raceId) filter.raceId = raceId;
    if (points) filter.points = points;
    if (status) filter.status = { $regex: status, $options: "i" };

    const results = await ConstructorResult.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (results.length === 0) {
      return res.status(404).json({ message: "Results not found" });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getConstructorStandings = async (req, res) => {
  try {
    const { season } = req.query;

    let filter = {
      constructorId: req.params.constructorId
    };

    if (season) {
      const races = await Race.find({ year: season }).select("raceId");

      const raceIds = races.map(r => r.raceId);

      filter.raceId = { $in: raceIds };
    }

    const standings = await ConstructorStanding.find(filter);

    if (standings.length === 0) {
      return res.status(404).json({ message: "Standings not found" });
    }

    res.json(standings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};