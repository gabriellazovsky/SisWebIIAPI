import db from "../db/conn.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

const circuitSchema = {
  type: "object",
  properties: {
    circuitId: { type: ["integer", "string"] },
    circuitRef: { type: "string" },
    name: { type: "string" },
    location: { type: "string" },
    country: { type: "string" },
    lat: { type: ["number", "string"] },
    lng: { type: ["number", "string"] },
    alt: { type: ["integer", "string", "null"] },
    url: { type: "string", format: "uri" }
  },
  required: ["circuitRef", "name", "location", "country", "lat", "lng"],
  additionalProperties: false
};

const circuitUpdateSchema = {
  ...circuitSchema,
  required: [],
};

export const getAllCircuits = async (req, res) => {
  try {
    const query = {};

    if (req.query.country) query.country = req.query.country;
    if (req.query.location) query.location = req.query.location;
    if (req.query.circuitRef) query.circuitRef = req.query.circuitRef;

    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }

    const circuits = await db.collection("Circuits").find(query).toArray();

    if (circuits.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "No circuits found" });
    }

    res.status(200).json(circuits);
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Server error", error: error.message });
  }
};

export const createCircuit = async (req, res) => {
  try {
    const valid = ajv.validate(circuitSchema, req.body);

    if (!valid) {
      return res.status(400).json({
        status: 400,
        message: "Invalid circuit data",
        errors: ajv.errors,
      });
    }

    const normalized = {
      ...req.body,
      circuitId: req.body.circuitId ? parseInt(req.body.circuitId) : undefined,
      lat: typeof req.body.lat === "string" ? parseFloat(req.body.lat) : req.body.lat,
      lng: typeof req.body.lng === "string" ? parseFloat(req.body.lng) : req.body.lng,
      alt: req.body.alt ? parseInt(req.body.alt) : null,
    };

    const result = await db.collection("Circuits").insertOne(normalized);

    return res.status(201).json({ id: result.insertedId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCircuitById = async (req, res) => {
  try {
    const id = parseInt(req.params.circuitId);

    const circuit = await db.collection("Circuits").findOne({
      circuitId: id,
    });

    if (!circuit) {
      return res
        .status(404)
        .json({ status: 404, message: "Circuit not found" });
    }

    res.status(200).json(circuit);
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Server error", error: error.message });
  }
};

export const updateCircuit = async (req, res) => {
  try {
    const valid = ajv.validate(circuitUpdateSchema, req.body);
    if (!valid) {
      return res.status(400).json({
        status: 400,
        message: "Invalid",
        errors: ajv.errors,
      });
    }

    const id = parseInt(req.params.circuitId);

    const updatedCircuit = await db
      .collection("Circuits")
      .findOneAndUpdate(
        { circuitId: id },
        { $set: req.body },
        { returnDocument: "after" }
      );

    if (!updatedCircuit) {
      return res
        .status(404)
        .json({ status: 404, message: "Circuit not found" });
    }

    res.status(200).json(updatedCircuit);
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Server error", error: error.message });
  }
};

export const deleteCircuit = async (req, res) => {
  try {
    const id = parseInt(req.params.circuitId);

    const result = await db
      .collection("Circuits")
      .deleteOne({ circuitId: id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Circuit not found" });
    }

    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Server error", error: error.message });
  }
};

export const getCircuitRaces = async (req, res) => {
  try {
    const id = parseInt(req.params.circuitId);

    const races = await db
      .collection("Races")
      .find({ circuitId: id })
      .toArray();

    res.status(200).json(races);
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Server error", error: error.message });
  }
};