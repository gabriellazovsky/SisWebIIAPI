import { getDB } from "../db/conn.mjs";

export const receiveOpenF1Webhook = async (req, res, next) => {
  try {
    const db = getDB();
    const collection = db.collection("openf1_webhook_events");

    const event = {
      receivedAt: new Date(),
      source: "openf1_webhook",
      payload: req.body
    };

    await collection.insertOne(event);

    res.status(200).json({
      message: "OpenF1 webhook received successfully",
      saved: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};