import db from "../db/conn.mjs";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

const seasonSchema = {
  type: "object",
  properties: {
    year: { type: "integer" },
    url: { type: "string", format: "uri" }
  },
  required: ["year", "url"],
  additionalProperties: false
};

const seasonUpdateSchema = {
  type: "object",
  properties: seasonSchema.properties,
  additionalProperties: false
};

export const getAllSeasons = async (req, res) => {
  try {
    const query = {};

    if (req.query.year) {
      query.year = parseInt(req.query.year);
    }

    const seasons = await db.collection("Seasons").find(query).toArray();

    if (seasons.length === 0) {
      return res.status(404).json({ status: 404, message: "No seasons found" });
    }

    res.status(200).json(seasons);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

export const createSeason = async (req, res) => {
  try {
    const valid = ajv.validate(seasonSchema, req.body);

    if (!valid) {
      return res.status(400).json({
        status: 400,
        message: "Invalid season data",
        errors: ajv.errors
      });
    }

    const result = await db.collection("Seasons").insertOne(req.body);

    return res.status(201).json({ id: result.insertedId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSeasonByYear = async (req, res) => {
  try {
    const year = parseInt(req.params.year);

    const season = await db.collection("Seasons").findOne({ year });

    if (!season) {
      return res.status(404).json({ status: 404, message: "Season not found" });
    }

    res.status(200).json(season);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

export const updateSeason = async (req, res) => {
  try {
    const valid = ajv.validate(seasonUpdateSchema, req.body);

    if (!valid) {
      return res.status(400).json({
        status: 400,
        message: "Invalid season data",
        errors: ajv.errors
      });
    }

    const year = parseInt(req.params.year);

    const updated = await db.collection("Seasons").findOneAndUpdate(
      { year },
      { $set: req.body },
      { returnDocument: "after" }
    );

    if (!updated.value) {
      return res.status(404).json({ status: 404, message: "Season not found" });
    }

    res.status(200).json(updated.value);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

export const deleteSeason = async (req, res) => {
  try {
    const year = parseInt(req.params.year);

    const result = await db.collection("Seasons").deleteOne({ year });

    if (result.deletedCount === 0) {
      return res.status(404).json({ status: 404, message: "Season not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

export const getSeasonRaces = async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const races = await db.collection("Races")
      .find({ year })
      .sort({ round: 1 })
      .toArray();

    if (races.length === 0) {
      return res.status(404).json({ status: 404, message: "No races found for this season" });
    }

    res.status(200).json(races);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};
