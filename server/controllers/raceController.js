import db from "../db/conn.js";

export const getAllRaces = async (req, res) => {
  try {
    const query = {};

    if (req.query.season) query.year = parseInt(req.query.season);
    if (req.query.round) query.round = parseInt(req.query.round);
    if (req.query.circuitId) query.circuitId = parseInt(req.query.circuitId);

    const data = await db.collection("Races").find(query).toArray();

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createRace = async (req, res) => {
  try {
    const result = await db.collection("Races").insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getRaceById = async (req, res) => {
  try {
    const id = parseInt(req.params.raceId);

    const data = await db.collection("Races").findOne({ raceId: id });

    if (!data) return res.status(404).json({ message: "Not found" });

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateRace = async (req, res) => {
  try {
    const id = parseInt(req.params.raceId);

    const result = await db.collection("Races").findOneAndUpdate(
      { raceId: id },
      { $set: req.body },
      { returnDocument: "after" }
    );

    if (!result.value) return res.status(404).json({ message: "Not found" });

    res.json(result.value);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteRace = async (req, res) => {
  try {
    const id = parseInt(req.params.raceId);

    const result = await db.collection("Races").deleteOne({ raceId: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getRaceResults = async (req, res) => {
  try {
    const id = parseInt(req.params.raceId);

    const data = await db.collection("Results").find({
      raceId: id
    }).toArray();

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};