import { getDB } from "../../db/conn.mjs";
import { getF1NewsXML } from "../services/f1XmlService.js";

export const getF1News = async (req, res, next) => {
  try {
    const db = getDB();

    const collection = db.collection("f1_news_xml");

    try {
      const xmlData = await getF1NewsXML();

      const document = {
        importedAt: new Date(),
        source: "Formula1 XML Feed",
        data: xmlData
      };

      await collection.insertOne(document);

      return res.status(200).json({
        source: "external_xml_api",
        format: "xml",
        savedToDatabase: true,
        data: document
      });
    } catch (error) {
      console.warn(
        "Formula1 XML API failed. Using DB fallback."
      );

      const cached = await collection
        .find()
        .sort({ importedAt: -1 })
        .limit(1)
        .toArray();

      return res.status(200).json({
        source: "database_fallback",
        format: "xml",
        message:
          "External XML API unavailable. Returning cached data.",
        data: cached[0] || null
      });
    }
  } catch (error) {
    next(error);
  }
};