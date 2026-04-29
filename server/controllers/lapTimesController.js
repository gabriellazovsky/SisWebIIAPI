import db from "../db/conn.js";

const parseInteger = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const getPagination = (query) => {
  const page = Math.max(parseInteger(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInteger(query.limit) || 50, 1), 200);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getAllLapTimes = async (req, res) => {
  try {
    const query = {};

    const raceId = parseInteger(req.query.raceId);
    const driverId = parseInteger(req.query.driverId);
    const lap = parseInteger(req.query.lap);

    if (raceId) query.raceId = raceId;
    if (driverId) query.driverId = driverId;
    if (lap) query.lap = lap;

    const { page, limit, skip } = getPagination(req.query);
    const collection = db.collection("LapTimes");

    const [data, total] = await Promise.all([
      collection
        .find(query)
        .sort({ raceId: 1, driverId: 1, lap: 1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    if (data.length === 0) {
      return res.status(404).json({ status: 404, message: "No lap times found" });
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