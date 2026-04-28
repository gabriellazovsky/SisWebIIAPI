import express from "express";
import { getAllLapTimes } from "../controllers/lapTimesController.js";

const router = express.Router();

router.get("/", getAllLapTimes);

export default router;