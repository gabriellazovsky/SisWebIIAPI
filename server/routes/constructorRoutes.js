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

router.get("/", constructorsController.getAllConstructors);
router.post("/", constructorsController.createConstructor);
router.get("/:constructorId", constructorsController.getConstructorById);
router.put("/:constructorId", constructorsController.updateConstructor);
router.delete("/:constructorId", constructorsController.deleteConstructor);
router.get("/:constructorId/results", constructorsController.getConstructorResults);
router.get("/:constructorId/standings", constructorsController.getConstructorStandings);

export default router;