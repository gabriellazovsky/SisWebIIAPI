import express from "express";
const router = express.Router();

import * as circuitController from "../controllers/circuitController.js";

router.get("/", circuitController.getAllCircuits);
router.post("/", circuitController.createCircuit);

router.get("/:circuitId", circuitController.getCircuitById);
router.put("/:circuitId", circuitController.updateCircuit);
router.delete("/:circuitId", circuitController.deleteCircuit);

router.get("/:circuitId/races", circuitController.getCircuitRaces);

export default router;