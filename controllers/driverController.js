const Driver = require('../models/Driver');

// GET /api/drivers
const getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find();

    res.status(200).json(drivers);
  } catch (error) {
    next(error);
  }
};

// GET /api/drivers/:driverId
const getDriverById = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({
      driverId: Number(req.params.driverId)
    });

    if (!driver) {
      return res.status(404).json({
        error: 'Driver not found'
      });
    }

    res.status(200).json(driver);
  } catch (error) {
    next(error);
  }
};

// POST /api/drivers
const createDriver = async (req, res, next) => {
  try {
    const newDriver = await Driver.create(req.body);

    res.status(201).json(newDriver);
  } catch (error) {
    next(error);
  }
};

// PUT /api/drivers/:driverId
const updateDriver = async (req, res, next) => {
  try {
    const updatedDriver = await Driver.findOneAndUpdate(
      { driverId: Number(req.params.driverId) },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedDriver) {
      return res.status(404).json({
        error: 'Driver not found'
      });
    }

    res.status(200).json(updatedDriver);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/drivers/:driverId
const deleteDriver = async (req, res, next) => {
  try {
    const deletedDriver = await Driver.findOneAndDelete({
      driverId: Number(req.params.driverId)
    });

    if (!deletedDriver) {
      return res.status(404).json({
        error: 'Driver not found'
      });
    }

    res.status(200).json({
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
};