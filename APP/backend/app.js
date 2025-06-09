import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import { dbConnection } from "./database/dbConnection.js";
import usuariosRouter from "./routes/usuariosRoute.js";
import veterinariosRouter from "./routes/veterinariosRoute.js";
import gatosRoute from "./routes/gatosRoute.js";

dotenv.config({ path: "./config/config.env" });

const app = express(); 

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/usuarios", usuariosRouter);
app.use("/veterinarios", veterinariosRouter);
app.use("/gatos", gatosRoute);

app.get("/", (req, res, next)=>{return res.status(200).json({
  sucesso: true
})})

dbConnection();

app.use(errorMiddleware);

export default app;
