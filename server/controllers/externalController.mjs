import db from "../db/conn.mjs";

export const getCurrentSeason = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const races = await db.collection("Races")
      .find({ year: currentYear })
      .sort({ round: 1 })
      .toArray();

    return res.status(200).json({
      source: "cached",
      races: races
    });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

export const getExternalDriver = async (req, res) => {
  try {
    const driverRef = req.params.driverRef;
    const driver = await db.collection("Drivers").findOne({ driverRef });

    if (!driver) {
      return res.status(404).json({ status: 404, message: "Driver not found" });
    }

    return res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

