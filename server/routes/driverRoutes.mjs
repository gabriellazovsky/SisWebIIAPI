import express from "express";
import db from "../db/conn.mjs"; // Asegúrate de que esta es tu ruta correcta a la DB

const router = express.Router();

// 1. GET: Obtener todos los pilotos
router.get("/", async (req, res) => {
  try {
    const drivers = await db.collection("Drivers").find({}).limit(50).toArray();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 2. POST: Crear un nuevo piloto
router.post("/", async (req, res) => {
  try {
    const result = await db.collection("Drivers").insertOne(req.body);
    res.status(201).json({ message: "Piloto creado", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 3. GET: Obtener un piloto por su driverId
router.get("/:id", async (req, res) => {
  try {
    const idString = req.params.id;
    const idNum = parseInt(req.params.id);

    const driver = await db.collection("Drivers").findOne({
      $or: [{ driverId: idNum }, { driverId: idString }]
    });

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
    const idString = req.params.id;
    const idNum = parseInt(req.params.id);

    const updatedDriver = await db.collection("Drivers").findOneAndUpdate(
        { $or: [{ driverId: idNum }, { driverId: idString }] },
        { $set: req.body },
        { returnDocument: "after" }
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
    const idString = req.params.id;
    const idNum = parseInt(req.params.id);

    const result = await db.collection("Drivers").deleteOne({
      $or: [{ driverId: idNum }, { driverId: idString }]
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Piloto no encontrado" });
    }
    res.status(200).json({ message: "Piloto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// --- RUTAS RELACIONADAS ---

// 6. GET: Resultados de un piloto
router.get("/:id/results", async (req, res) => {
  try {
    const idString = req.params.id;
    const idNum = parseInt(req.params.id);

    const results = await db.collection("Results").find({
      $or: [{ driverId: idNum }, { driverId: idString }]
    }).toArray();

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 7. GET: Standings (Clasificaciones) de un piloto
router.get("/:id/standings", async (req, res) => {
  try {
    const idString = req.params.id;
    const idNum = parseInt(req.params.id);

    const standings = await db.collection("DriverStandings").find({
      $or: [{ driverId: idNum }, { driverId: idString }]
    }).toArray();

    res.status(200).json(standings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;