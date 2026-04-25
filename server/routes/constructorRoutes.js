import express from "express";
const router = express.Router();

import * as constructorsController from "../controllers/constructorController.mjs";

router.get("/", constructorsController.getAllConstructors);
router.post("/", constructorsController.createConstructor);

router.get("/:constructorId", constructorsController.getConstructorById);
router.put("/:constructorId", constructorsController.updateConstructor);
router.delete("/:constructorId", constructorsController.deleteConstructor);

router.get("/:constructorId/results", constructorsController.getConstructorResults);
router.get("/:constructorId/standings", constructorsController.getConstructorStandings);

export default router;