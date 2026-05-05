import {
  getWeatherFromOpenF1,
  getRaceControlFromOpenF1,
  getTeamRadioFromOpenF1
} from "../services/openf1Service.js";

import { getWithFallback } from "../services/openf1FallbackService.js";

export const getWeather = async (req, res, next) => {
  try {
    const { session_key, driver_number } = req.query;

    if (!session_key) {
      return res.status(400).json({
        error: "session_key is required"
      });
    }
    
    const result = await getWithFallback({
      openf1Function: getWeatherFromOpenF1,
      mongoCollection: "weather",
      query: req.query,
      uniqueKeyBuilder: (item) => ({
        session_key: item.session_key,
        date: item.date
      })
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getWeather controller:", error);
    next(error);
  }
};

export const getRaceControl = async (req, res, next) => {
  try {
    const { session_key, driver_number } = req.query;

    if (!session_key) {
      return res.status(400).json({
        error: "session_key is required"
      });
    }
    const result = await getWithFallback({
      openf1Function: getRaceControlFromOpenF1,
      mongoCollection: "raceControl",
      query: req.query,
      uniqueKeyBuilder: (item) => ({
        session_key: item.session_key,
        date: item.date,
        message: item.message
      })
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getRaceControl controller:", error);
    next(error);
  }
};

export const getTeamRadio = async (req, res, next) => {
  try {
    const { session_key, driver_number } = req.query;

    if (!session_key) {
      return res.status(400).json({
        error: "session_key is required"
      });
    }
    const result = await getWithFallback({
      openf1Function: getTeamRadioFromOpenF1,
      mongoCollection: "teamRadio",
      query: {
        session_key: Number(session_key),
        ...(driver_number && { driver_number: Number(driver_number) })
      },
      uniqueKeyBuilder: (item) => ({
        session_key: item.session_key,
        driver_number: item.driver_number,
        date: item.date
      })
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getTeamRadio controller:", error.message);
    next(error);
  }
};