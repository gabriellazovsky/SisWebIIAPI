import db from "../db/conn.mjs";

const parseInteger = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const getPagination = (query) => {
  const page = Math.max(parseInteger(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInteger(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const addSeasonFilter = async (query, season) => {
  const year = parseInteger(season);
  if (!year) return;

  const races = await db.collection("Races").find({ year }).toArray();
  query.raceId = { $in: races.map((race) => race.raceId) };
};

export const getAllResults = async (req, res) => {
  try {
    const query = {};

    const raceId = parseInteger(req.query.raceId);
    const driverId = parseInteger(req.query.driverId);
    const constructorId = parseInteger(req.query.constructorId);
    const position = parseInteger(req.query.position);

    if (raceId) query.raceId = raceId;
    if (driverId) query.driverId = driverId;
    if (constructorId) query.constructorId = constructorId;
    if (position) query.position = position;

    if (req.query.season && !raceId) {
      await addSeasonFilter(query, req.query.season);
    }

    const { page, limit, skip } = getPagination(req.query);
    const collection = db.collection("Results");

    const [data, total] = await Promise.all([
      collection
        .find(query)
        .sort({ raceId: -1, positionOrder: 1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    if (data.length === 0) {
      return res.status(404).json({ status: 404, message: "No results found" });
    }

    return res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getResultById = async (req, res) => {
  try {
    const resultId = parseInteger(req.params.resultId);

    if (!resultId) {
      return res.status(400).json({ status: 400, message: "Invalid result id" });
    }

    const result = await db.collection("Results").findOne({ resultId });

    if (!result) {
      return res.status(404).json({ status: 404, message: "Result not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};