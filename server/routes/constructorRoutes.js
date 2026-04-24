const express = require("express");
const router = express.Router();

const constructorsController = require("../controllers/constructorController");

router.get("/", constructorsController.getAllConstructors);
router.post("/", constructorsController.createConstructor);

router.get("/:constructorId", constructorsController.getConstructorById);
router.put("/:constructorId", constructorsController.updateConstructor);
router.delete("/:constructorId", constructorsController.deleteConstructor);

router.get("/:constructorId/results", constructorsController.getConstructorResults);
router.get("/:constructorId/standings", constructorsController.getConstructorStandings);

module.exports = router;