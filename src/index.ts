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


dbConnection().then(connection => console.log("::: 🚀Connected to Database :::"));


app.listen(PORT, () =>
    console.log(`🚀 REST API server ready at ⭐️: http://localhost:${PORT}`)
);

initSchemas();
ConsumerService.receiveCompletedTransaction();
