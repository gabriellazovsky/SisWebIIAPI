import { create } from "xmlbuilder2";

function cleanMongoData(data) {
  if (Array.isArray(data)) {
    return data.map(cleanMongoData);
  }

  if (data && typeof data === "object") {
    const cleaned = {};

    for (const [key, value] of Object.entries(data)) {
      if (key === "_id") {
        cleaned.id = value.toString();
      } else if (value instanceof Date) {
        cleaned[key] = value.toISOString();
      } else if (value && typeof value === "object") {
        cleaned[key] = cleanMongoData(value);
      } else {
        cleaned[key] = value;
      }
    }

    return cleaned;
  }

  return data;
}

export function sendResponse(req, res, statusCode, data, rootName = "response", itemName = "item") {
  const cleanedData = cleanMongoData(data);

  const acceptHeader = req.headers.accept || "";
  const wantsXml =
    acceptHeader.includes("application/xml") &&
    !acceptHeader.includes("text/html");

  if (wantsXml) {
    const xmlObject = Array.isArray(cleanedData)
      ? { [rootName]: { [itemName]: cleanedData } }
      : { [rootName]: cleanedData };

    const xml = create(xmlObject).end({ prettyPrint: true });

    return res
      .status(statusCode)
      .type("application/xml")
      .send(xml);
  }

  return res.status(statusCode).json(cleanedData);
}