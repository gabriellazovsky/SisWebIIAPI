import db from "../db/conn.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

const schema = {
  type: "object",
  properties: {
    constructorId: { type: "integer" },
    constructorRef: { type: "string" },
    name: { type: "string" },
    nationality: { type: "string" },
    url: { type: "string", format: "uri" }
  },
  required: ["constructorRef", "name", "nationality"],
  additionalProperties: false
};

export const getAllConstructors = async (req, res) => {
  try {
    const query = {};

    if (req.query.nationality) query.nationality = req.query.nationality;
    if (req.query.constructorRef) query.constructorRef = req.query.constructorRef;

    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }

    const data = await db.collection("Constructors").find(query).toArray();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createConstructor = async (req, res) => {
  try {
    if (!ajv.validate(schema, req.body)) {
      return res.status(400).json({ errors: ajv.errors });
    }

    const result = await db.collection("Constructors").insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getConstructorById = async (req, res) => {
  try {
    const id = parseInt(req.params.constructorId);

    const data = await db.collection("Constructors").findOne({
      constructorId: id
    });

    if (!data) return res.status(404).json({ message: "Not found" });

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateConstructor = async (req, res) => {
  try {
    const id = parseInt(req.params.constructorId);

    const result = await db.collection("Constructors").findOneAndUpdate(
      { constructorId: id },
      { $set: req.body },
      { returnDocument: "after" }
    );

    if (!result.value) return res.status(404).json({ message: "Not found" });

    res.json(result.value);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteConstructor = async (req, res) => {
  try {
    const id = parseInt(req.params.constructorId);

    const result = await db.collection("Constructors").deleteOne({
      constructorId: id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getConstructorResults = async (req, res) => {
  try {
    const id = parseInt(req.params.constructorId);

    const data = await db.collection("ConstructorResults").find({
      constructorId: id
    }).toArray();

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getConstructorStandings = async (req, res) => {
  try {
    const id = parseInt(req.params.constructorId);

    const data = await db.collection("ConstructorStandings").find({
      constructorId: id
    }).toArray();

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};