import Circuit from "../models/Circuit.js";
import Race from "../models/Race.js";

export const getAllCircuits = async (req, res) => {
  try {
    const { circuitRef, name, location, country, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (circuitRef) filter.circuitRef = circuitRef;
    if (location) filter.location = location;
    if (country) filter.country = country;

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const circuits = await Circuit.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(circuits);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createCircuit = async (req, res) => {
  try {
    const newCircuit = new Circuit(req.body);
    const savedCircuit = await newCircuit.save();

    res.status(201).json(savedCircuit);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCircuitById = async (req, res) => {
  try {
    const circuit = await Circuit.findOne({
      circuitId: Number(req.params.circuitId)
    });

    if (!circuit) {
      return res.status(404).json({ message: "Circuit not found" });
    }

    res.json(circuit);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateCircuit = async (req, res) => {
  try {
    const updatedCircuit = await Circuit.findOneAndUpdate(
      { circuitId: Number(req.params.circuitId) },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCircuit) {
      return res.status(404).json({ message: "Circuit not found" });
    }

    res.json(updatedCircuit);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteCircuit = async (req, res) => {
  try {
    const deletedCircuit = await Circuit.findOneAndDelete({
      circuitId: Number(req.params.circuitId)
    });

    if (!deletedCircuit) {
      return res.status(404).json({ message: "Circuit not found" });
    }

    res.json({ message: "Circuit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCircuitRaces = async (req, res) => {
  try {
    const races = await Race.find({
      circuitId: Number(req.params.circuitId)
    });

    if (races.length === 0) {
      return res.status(404).json({ message: "No races found for this circuit" });
    }

    res.json(races);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};