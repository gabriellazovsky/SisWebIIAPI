import express from "express";
import {
  getAllResults,
  getResultById,
} from "../controllers/resultsController.mjs";

const router = express.Router();

router.get("/", getAllResults);
router.get("/:resultId", getResultById);

export default router;