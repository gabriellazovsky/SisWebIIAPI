import express from "express";

import { getF1News } from "../controllers/f1XmlController.js";

const router = express.Router();

router.get("/", getF1News);

export default router;