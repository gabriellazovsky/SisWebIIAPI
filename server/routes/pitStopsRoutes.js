import express from "express";
import { getAllPitStops } from "../controllers/pitStopsController.js";

const router = express.Router();

router.get("/", getAllPitStops);

export default router;