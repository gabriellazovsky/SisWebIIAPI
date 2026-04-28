import express from "express";
import cors from "cors";
import "./loadEnvironment.js";
import driverRoutes from "./routes/driverRoutes.js";
import constructorRoutes from "./routes/constructorRoutes.js"
import raceRoutes from "./routes/raceRoutes.js"
import circuitRoutes from "./routes/circuitRoutes.js"
import seasonRoutes from "./routes/seasonRoutes.js"
import qualifyingRoutes from "./routes/qualifyingRoutes.js"
import resultsRoutes from "./routes/resultsRoutes.js";
import standingsRoutes from "./routes/standingsRoutes.js";
import lapTimesRoutes from "./routes/lapTimesRoutes.js";
import pitStopsRoutes from "./routes/pitStopsRoutes.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/drivers", driverRoutes);
app.use("/constructors", constructorRoutes);
app.use("/races", raceRoutes);
app.use("/circuits", circuitRoutes);
app.use("/seasons", seasonRoutes);
app.use("/qualifying", qualifyingRoutes)
app.use("/results", resultsRoutes);
app.use("/standings", standingsRoutes);
app.use("/lap-times", lapTimesRoutes);
app.use("/pit-stops", pitStopsRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).send("An unexpected error occured.")
})

app.listen(PORT, () => {
  console.log(`Server is running on port: 5050`);
});

export default app;