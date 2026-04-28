import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "mongodb+srv://gabriellazovsky_db_user:Up3V4wD5N96q1l9f@cluster0.mk0717o.mongodb.net/";

const client = new MongoClient(connectionString);

let conn;
try {
    conn = await client.connect();
} catch(e) {
    console.error(e);
}

let db = conn.db("ProjectDatabase");

export default db;