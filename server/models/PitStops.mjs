import express from "express";
import db from "../db/conn.mjs"; // Asegúrate de que el nombre coincida con tu archivo
import { ObjectId } from "mongodb"; // ObjectId lo usaremos más adelante para buscar por ID

// 1. Inicializamos el Router (Esto te faltaba)
const router = express.Router();

// ¡Adiós al DriverSchema! Ya no lo necesitamos.

// 2. Creamos nuestra primera ruta (GET /driverRoutes)
router.get("/", async (req, res) => {
  try {
    // Apuntamos a la colección 'drivers'
    const collection = db.collection("pit_stops");

    // Buscamos los datos. Agrego un .limit(50) temporal para que no sature tu navegador cuando cargues los 1000 documentos
    const results = await collection.find({}).limit(50).toArray();

    res.status(200).json(results);
  } catch (err) {
    console.error("Error al buscar pilotos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 3. Exportamos el router
export default router;