import express from "express";
import { receiveOpenF1Webhook } from "../controllers/webhookController.mjs";

const router = express.Router();
router.post("/openf1", receiveOpenF1Webhook);

export default router;