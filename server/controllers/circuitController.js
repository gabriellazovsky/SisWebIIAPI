import db from "../db/conn.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

const circuitSchema = {
  type: "object",
  properties: {
    circuitId: { type: "integer" },
    circuitRef: { type: "string" },
    name: { type: "string" },
    location: { type: "string" },
    country: { type: "string" },
    lat: { type: "number" },
    lng: { type: "number" },
    alt: { type: ["integer", "null"] },
    url: { type: "string", format: "uri" }
  },
  required: ["circuitRef", "name", "location", "country", "lat", "lng"],
  additionalProperties: false
};

const updateSchema = { ...circuitSchema, required: [] };

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
      return res.status(404).json({ status: 404, message: "No circuits found" });
    }

    res.status(200).json(circuits);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

export const createCircuit = async (req, res) => {
  try {
    if (!ajv.validate(circuitSchema, req.body)) {
      return res.status(400).json({ errors: ajv.errors });
    }

    const result = await db.collection("Circuits").insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCircuitById = async (req, res) => {
  try {
    const id = parseInt(req.params.circuitId);

    const circuit = await db.collection("Circuits").findOne({
      circuitId: id
    });

    if (!circuit) {
      return res.status(404).json({ message: "Circuit not found" });
    }

    res.json(circuit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCircuit = async (req, res) => {
  try {
    if (!ajv.validate(updateSchema, req.body)) {
      return res.status(400).json({ errors: ajv.errors });
    }

    const id = parseInt(req.params.circuitId);

    const result = await db.collection("Circuits").findOneAndUpdate(
      { circuitId: id },
      { $set: req.body },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Circuit not found" });
    }

    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCircuit = async (req, res) => {
  try {
    const id = parseInt(req.params.circuitId);

    const result = await db.collection("Circuits").deleteOne({ circuitId: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Circuit not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCircuitRaces = async (req, res) => {
  try {
    const id = parseInt(req.params.circuitId);

    const races = await db.collection("Races").find({ circuitId: id }).toArray();

    res.json(races);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};