import db from "../db/conn.js";

import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

const constructorSchema = {
  type: "object",
  properties: {
    constructorId: { type: "integer" },
    constructorRef: { type: "string" },
    name: { type: "string" },
    nationality: { type: "string" },
    url: { type: "string", format: "uri" },
  },
  required: ["constructorRef", "name", "nationality"],
  additionalProperties: false,
};

const constructorUpdateSchema = {
  ...constructorSchema,
  required: [],
};

export const getAllConstructors = async (req, res) => {
  try {
    const query = {};

    if (req.query.nationality) {
      query.nationality = req.query.nationality;
    }

    if (req.query.constructorRef) {
      query.constructorRef = req.query.constructorRef;
    }

    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }

    const constructors = await db
      .collection("Constructors")
      .find(query)
      .toArray();

    if (constructors.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "No constructors found" });
    }

    res.status(200).json(constructors);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

export const createConstructor = async (req, res) => {
  try {
    const valid = ajv.validate(constructorSchema, req.body);

    if (!valid) {
      return res.status(400).json({
        status: 400,
        message: "Invalid",
        errors: ajv.errors,
      });
    }

    const result = await db
      .collection("Constructors")
      .insertOne(req.body);

    res
      .status(201)
      .json({ message: "Constructor created", id: result.insertedId });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getConstructorById = async (req, res) => {
  try {
    const id = parseInt(req.params.constructorId);

    const constructor = await db.collection("Constructors").findOne({
      constructorId: id,
    });

    if (!constructor) {
      return res
        .status(404)
        .json({ status: 404, message: "Constructor not found" });
    }

    res.status(200).json(constructor);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateConstructor = async (req, res) => {
  try {
    const valid = ajv.validate(constructorUpdateSchema, req.body);

    if (!valid) {
      return res.status(400).json({
        status: 400,
        message: "Invalid",
        errors: ajv.errors,
      });
    }

    const id = parseInt(req.params.constructorId);

    const updatedConstructor = await db
      .collection("Constructors")
      .findOneAndUpdate(
        { constructorId: id },
        { $set: req.body },
        { returnDocument: "after" }
      );

    if (!updatedConstructor) {
      return res
        .status(404)
        .json({ status: 404, message: "Constructor not found" });
    }

    res.status(200).json(updatedConstructor);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteConstructor = async (req, res) => {
  try {
    const id = parseInt(req.params.constructorId);

    const result = await db.collection("Constructors").deleteOne({
      constructorId: id,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Constructor not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getConstructorResults = async (req, res) => {
  try {
    const id = parseInt(req.params.constructorId);

    const results = await db
      .collection("ConstructorResults")
      .find({ constructorId: id })
      .toArray();

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getConstructorStandings = async (req, res) => {
  try {
    const id = parseInt(req.params.constructorId);

    const standings = await db
      .collection("ConstructorStandings")
      .find({ constructorId: id })
      .toArray();

    res.status(200).json(standings);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};