import express from "express";
import {
  getAllCircuits,
  createCircuit,
  getCircuitById,
  updateCircuit,
  deleteCircuit,
  getCircuitRaces
} from "../controllers/circuitController.mjs";

const router = express.Router();

router.get("/", getAllCircuits);
router.post("/", createCircuit);
router.get("/:circuitId", getCircuitById);
router.put("/:circuitId", updateCircuit);
router.delete("/:circuitId", deleteCircuit);
router.get("/:circuitId/races", getCircuitRaces);

export default router;