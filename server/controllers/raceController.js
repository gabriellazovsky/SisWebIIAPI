import db from "../db/conn.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

const raceSchema = {
  type: "object",
  properties: {
    raceId: { type: "integer" },
    year: { type: "integer" },
    round: { type: "integer" },
    circuitId: { type: "integer" },
    name: { type: "string" },
    date: { type: "string" },
    time: { type: "string" },
    url: { type: "string", format: "uri" }
  },
  required: ["year", "round", "circuitId", "name", "date"],
  additionalProperties: false
};

const raceUpdateSchema = {
  ...raceSchema,
  required: []
};

export const getAllRaces = async (req, res) => {
  try {
    const query = {};

    if (req.query.season) query.year = parseInt(req.query.season);
    if (req.query.round) query.round = parseInt(req.query.round);
    if (req.query.circuitId) query.circuitId = parseInt(req.query.circuitId);

    const races = await db.collection("Races").find(query).toArray();

    if (races.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No races found"
      });
    }

    res.status(200).json(races);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message
    });
  }
};

export const createRace = async (req, res) => {
  try {
    const body = {
      ...req.body,
      raceId: req.body.raceId ? parseInt(req.body.raceId) : undefined,
      year: req.body.year ? parseInt(req.body.year) : undefined,
      round: req.body.round ? parseInt(req.body.round) : undefined,
      circuitId: req.body.circuitId ? parseInt(req.body.circuitId) : undefined,
    };

    const result = await db.collection("Races").insertOne(body);

    return res.status(201).json({ id: result.insertedId });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const getRaceById = async (req, res) => {
  try {
    const id = parseInt(req.params.raceId);

    const race = await db.collection("Races").findOne({ raceId: id });

    if (!race) {
      return res.status(404).json({
        status: 404,
        message: "Race not found"
      });
    }

    res.status(200).json(race);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message
    });
  }
};

export const updateRace = async (req, res) => {
  try {
    const valid = ajv.validate(raceUpdateSchema, req.body);
    if (!valid) {
      return res.status(400).json({
        status: 400,
        message: "Invalid race update",
        errors: ajv.errors
      });
    }

    const id = parseInt(req.params.raceId);

    const updated = await db.collection("Races").findOneAndUpdate(
      { raceId: id },
      { $set: req.body },
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.status(404).json({
        status: 404,
        message: "Race not found"
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message
    });
  }
};

export const deleteRace = async (req, res) => {
  try {
    const id = parseInt(req.params.raceId);

    const result = await db.collection("Races").deleteOne({ raceId: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: "Race not found"
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message
    });
  }
};

export const getRaceResults = async (req, res) => {
  try {
    const id = parseInt(req.params.raceId);

    const results = await db.collection("Results").find({ raceId: id }).toArray();

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message
    });
  }
};