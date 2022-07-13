import express from "express";
import morgan from "morgan";
import { initSchemas } from "./db/initQuery";
import { apiRouter } from "./routes/baseRoutes";
import dotenv from "dotenv";
import { dbConnection } from "./db/dbConnection";
import { ConsumerService } from "./services/consumerService";
dotenv.config();



export const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/v1/api",
    apiRouter

);

console.log("Waiting to connect...")
setTimeout(() => {
    console.log("Connecting to db...")
    dbConnection().then(connection => console.log("::: 🚀Connected to Database :::")).catch(error => console.log("Billing startup error:", error));
    app.listen(PORT, () =>
        console.log(`🚀 REST API server ready at ⭐️: http://localhost:${PORT}`)
    );
    initSchemas();
    ConsumerService.receiveCompletedTransaction();

}, 60 * 1000)






