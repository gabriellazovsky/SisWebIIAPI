import express from "express";
import {
  getAllConstructors,
  createConstructor,
  getConstructorById,
  updateConstructor,
  deleteConstructor,
  getConstructorResults,
  getConstructorStandings
} from "../controllers/constructorController.js";

const router = express.Router();

router.get("/", getAllConstructors);
router.post("/", createConstructor);
router.get("/:constructorId", getConstructorById);
router.put("/:constructorId", updateConstructor);
router.delete("/:constructorId", deleteConstructor);
router.get("/:constructorId/results", getConstructorResults);
router.get("/:constructorId/standings", getConstructorStandings);

export default router;