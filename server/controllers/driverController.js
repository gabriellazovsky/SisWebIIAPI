import db from "../db/conn.js";

export const getAllDrivers = async (req, res) => {
  try {
    const query = {};
    if (req.query.nationality) {
      query.nationality = req.query.nationality;
    }
 
    const drivers = await db.collection("Drivers").find(query).toArray();
 
    if (drivers.length === 0) {
      return res.status(404).json({ status: 404, message: "No drivers found" });
    }
 
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", error: error.message });
  }
};

export const createDriver = async (req, res) => {
  try {
    const result = await db.collection("Drivers").insertOne(req.body);
    res.status(201).json({ message: "Driver created", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", error: error.message });
  }
};

export const getDriverById = async (req, res) => {
  try {
    const { idNum, idString } = parseDriverId(req.params.driverId);

    const driver = await db.collection("Drivers").findOne({
      $or: [{ driverId: idNum }, { driverId: idString }],
    });

    if (!driver) {
      return res.status(404).json({ status: 404, message: "Driver not found" });
    }

    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", error: error.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const { idNum, idString } = parseDriverId(req.params.driverId);

    const updatedDriver = await db.collection("Drivers").findOneAndUpdate(
      { $or: [{ driverId: idNum }, { driverId: idString }] },
      { $set: req.body },
      { returnDocument: "after" }
    );

    if (!updatedDriver) {
      return res.status(404).json({ status: 404, message: "Driver not found" });
    }

    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", error: error.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const { idNum, idString } = parseDriverId(req.params.driverId);

    const result = await db.collection("Drivers").deleteOne({
      $or: [{ driverId: idNum }, { driverId: idString }],
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ status: 404, message: "Driver not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", error: error.message });
  }
};

export const getDriverResults = async (req, res) => {
  try {
    const { idNum, idString } = parseDriverId(req.params.driverId);
    const query = { $or: [{ driverId: idNum }, { driverId: idString }] };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      db.collection("Results").find(query).sort({ raceId: -1 }).skip(skip).limit(limit).toArray(),
      db.collection("Results").countDocuments(query),
    ]);

    res.status(200).json({
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", error: error.message });
  }
};

export const getDriverStandings = async (req, res) => {
  try {
    const { idNum, idString } = parseDriverId(req.params.driverId);

    const standings = await db
      .collection("DriverStandings")
      .find({ $or: [{ driverId: idNum }, { driverId: idString }] })
      .toArray();

    res.status(200).json(standings);
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", error: error.message });
  }
};

export const getDriverQualifying = async (req, res) => {
  try {
    const { idNum, idString } = parseDriverId(req.params.driverId);

    const qualifying = await db
      .collection("Qualifying")
      .find({ $or: [{ driverId: idNum }, { driverId: idString }] })
      .toArray();

    res.status(200).json(qualifying);
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", error: error.message });
  }
};

export const getDriverLapTimes = async (req, res) => {
  try {
    const { idNum, idString } = parseDriverId(req.params.driverId);

    const query = { $or: [{ driverId: idNum }, { driverId: idString }] };
    if (req.query.raceId) {
      query.raceId = parseInt(req.query.raceId);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const skip = (page - 1) * limit;

    const [lapTimes, total] = await Promise.all([
      db.collection("LapTimes").find(query).sort({ lap: 1 }).skip(skip).limit(limit).toArray(),
      db.collection("LapTimes").countDocuments(query),
    ]);

    res.status(200).json({
      data: lapTimes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", error: error.message });
  }
};

export const getDriverPitStops = async (req, res) => {
  try {
    const { idNum, idString } = parseDriverId(req.params.driverId);

    const query = { $or: [{ driverId: idNum }, { driverId: idString }] };
    if (req.query.raceId) {
      query.raceId = parseInt(req.query.raceId);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [pitStops, total] = await Promise.all([
      db.collection("PitStops").find(query).sort({ lap: 1 }).skip(skip).limit(limit).toArray(),
      db.collection("PitStops").countDocuments(query),
    ]);

    res.status(200).json({
      data: pitStops,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", error: error.message });
  }
};

function parseDriverId(rawId) {
  return {
    idNum: parseInt(rawId, 10),
    idString: rawId,
  };
}