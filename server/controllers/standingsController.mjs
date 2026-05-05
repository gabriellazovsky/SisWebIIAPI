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

const getStandings = async ({
  req,
  res,
  collectionName,
  idQueryName,
  idField,
  emptyMessage,
}) => {
  try {
    const query = {};

    const entityId = parseInteger(req.query[idQueryName]);
    const position = parseInteger(req.query.position);

    if (entityId) query[idField] = entityId;
    if (position) query.position = position;
    if (req.query.season) await addSeasonFilter(query, req.query.season);

    const { page, limit, skip } = getPagination(req.query);
    const collection = db.collection(collectionName);

    const [data, total] = await Promise.all([
      collection
        .find(query)
        .sort({ raceId: -1, position: 1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    if (data.length === 0) {
      return res.status(404).json({ status: 404, message: emptyMessage });
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

export const getDriverStandings = async (req, res) => {
  return getStandings({
    req,
    res,
    collectionName: "DriverStandings",
    idQueryName: "driverId",
    idField: "driverId",
    emptyMessage: "No driver standings found",
  });
};

export const getConstructorStandings = async (req, res) => {
  return getStandings({
    req,
    res,
    collectionName: "ConstructorStandings",
    idQueryName: "constructorId",
    idField: "constructorId",
    emptyMessage: "No constructor standings found",
  });
};