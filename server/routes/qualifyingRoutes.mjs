import express from "express";
import {
  getAllQualifying,
  getQualifyingById
} from "../controllers/qualifyingController.mjs";

const router = express.Router();

router.get("/", getAllQualifying);
router.get("/:qualifyId", getQualifyingById);

export default router;