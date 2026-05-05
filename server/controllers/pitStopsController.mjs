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

export const getAllPitStops = async (req, res) => {
  try {
    const query = {};

    const raceId = parseInteger(req.query.raceId);
    const driverId = parseInteger(req.query.driverId);

    if (raceId) query.raceId = raceId;
    if (driverId) query.driverId = driverId;

    const { page, limit, skip } = getPagination(req.query);
    const collection = db.collection("PitStops");

    const [data, total] = await Promise.all([
      collection
        .find(query)
        .sort({ raceId: 1, driverId: 1, stop: 1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    if (data.length === 0) {
      return res.status(404).json({ status: 404, message: "No pit stops found" });
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