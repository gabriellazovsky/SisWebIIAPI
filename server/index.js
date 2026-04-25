import express from "express";
import cors from "cors";
import "./loadEnvironment.js";
import driverRoutes from "./routes/driverRoutes.js";
//import constructorRoutes from "./routes/constructorRoutes.js"
//import raceRoutes from "./routes/raceRoutes.js"
//import circuitRoutes from "./routes/circuitRoutes.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/drivers", driverRoutes);
//app.use("/constructors", constructorRoutes);
//app.use("/races", raceRoutes);
//app.use("/circuits", circuitRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).send("An unexpected error occured.")
})

app.listen(PORT, () => {
  console.log(`Server is running on port: 5050`);
});

export default app;