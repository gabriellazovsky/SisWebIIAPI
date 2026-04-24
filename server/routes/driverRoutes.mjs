import express from "express";
import { ObjectId } from "mongodb"; // Necesario para buscar por el _id nativo de Mongo
import db from "../db/conn.mjs"; // O "../db/conn.mjs" (Asegúrate de que el nombre sea el correcto)

const router = express.Router();

// 1. GET: Obtener todos los pilotos
router.get("/", async (req, res) => {
  try {
    // En Mongo puro usamos db.collection().find().toArray()
    const Drivers = await db.collection("Drivers").find({}).limit(50).toArray();
    res.status(200).json(Drivers);
  } catch (error) {
    console.error("🚨 Error real:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 2. POST: Crear un nuevo piloto
router.post("/", async (req, res) => {
  try {
    const result = await db.collection("Drivers").insertOne(req.body);
    // insertOne devuelve un objeto con el ID insertado
    res.status(201).json({ message: "Piloto creado", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 3. GET: Obtener un piloto por su ID de MongoDB (_id)
router.get("/:id", async (req, res) => {
  try {
    const driver = await db.collection("Drivers").findOne({ _id: new ObjectId(req.params.id) });

    if (!driver) {
      return res.status(404).json({ message: "Piloto no encontrado" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 4. PUT: Actualizar un piloto
router.put("/:id", async (req, res) => {
  try {
    // En Mongo puro usamos findOneAndUpdate
    const updatedDriver = await db.collection("Drivers").findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { returnDocument: "after" } // Esto hace que te devuelva el documento ya actualizado
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Piloto no encontrado" });
    }
    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 5. DELETE: Borrar un piloto
router.delete("/:id", async (req, res) => {
  try {
    const result = await db.collection("Drivers").deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Piloto no encontrado" });
    }
    res.status(200).json({ message: "Piloto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// --- RUTAS RELACIONADAS ---
// (Asumiendo que el ID del piloto en estas colecciones está guardado como "driverId")

router.get("/:id/results", async (req, res) => {
  try {
    // Cambiamos a la colección 'results'
    const results = await db.collection("results").find({ driverId: req.params.id }).toArray();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id/standings", async (req, res) => {
  try {
    const standings = await db.collection("DriverStandings").find({ driverId: req.params.id }).toArray();
    res.status(200).json(standings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;