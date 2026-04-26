import db from "../db/conn.js";

export const getAllQualifying = async (req, res) => {
  try {
    const { season, raceId, driverId, constructorId, position, page = 1, limit = 20 } = req.query;

    const query = {};

    if (season) query.season = parseInt(season);
    if (raceId) query.raceId = parseInt(raceId);
    if (driverId) query.driverId = parseInt(driverId);
    if (constructorId) query.constructorId = parseInt(constructorId);
    if (position) query.position = parseInt(position);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const data = await db
      .collection("Qualifying")
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    if (data.length === 0) {
      return res.status(404).json({ status: 404, message: "No qualifying results found" });
    }

    return res.status(200).json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
};

export const getQualifyingById = async (req, res) => {
  try {
    const qualifyId = parseInt(req.params.qualifyId);

    const result = await db.collection("Qualifying").findOne({ qualifyId });

    if (!result) {
      return res.status(404).json({ status: 404, message: "Qualifying result not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
};