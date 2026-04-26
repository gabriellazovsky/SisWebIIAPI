import express from "express";
import express from "express";
import {
  getAllCircuits,
  createCircuit,
  getCircuitById,
  updateCircuit,
  deleteCircuit,
  getCircuitRaces
} from "../controllers/circuitController.js";

const router = express.Router();

router.get("/", circuitController.getAllCircuits);
router.post("/", circuitController.createCircuit);
router.get("/:circuitId", circuitController.getCircuitById);
router.put("/:circuitId", circuitController.updateCircuit);
router.delete("/:circuitId", circuitController.deleteCircuit);
router.get("/:circuitId/races", circuitController.getCircuitRaces);

export default router;