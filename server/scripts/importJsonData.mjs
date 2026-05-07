import fs from "fs";
import path from "path";
import db from "../db/conn.mjs";

const jsonFilePath = path.join(process.cwd(), "data", "drivers-example.json");

try {
  const fileContent = fs.readFileSync(jsonFilePath, "utf-8");
  const drivers = JSON.parse(fileContent);

  if (!Array.isArray(drivers)) {
    throw new Error("El JSON debe contener un array de pilotos.");
  }

  await db.collection("Drivers").insertMany(drivers);

  console.log(`${drivers.length} piloto(s) importado(s) correctamente desde JSON.`);
  process.exit(0);
} catch (error) {
  console.error("Error importando JSON:", error.message);
  process.exit(1);
}