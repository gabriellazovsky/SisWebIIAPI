import { MongoClient } from "mongodb";
import fs from "fs";
import csv from "csv-parser";

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

const DATABASE_NAME = "f1_api";

const importCSV = async (filePath, collectionName) => {
  const db = client.db(DATABASE_NAME);

  const collection = db.collection(collectionName);

  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          await collection.deleteMany({});

          await collection.insertMany(results);

          console.log(`Imported ${results.length} documents into ${collectionName}`);

          resolve();
        } catch (error) {
          reject(error);
        }
      });
  });
};

const seedDatabase = async () => {
  try {
    await client.connect();

    console.log("MongoDB connected");

    await importCSV("./data/drivers.csv", "drivers");

    await importCSV("./data/races.csv", "races");

    await importCSV("./data/circuits.csv", "circuits");

    await importCSV("./data/results.csv", "results");

    console.log("Database seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seedDatabase();
