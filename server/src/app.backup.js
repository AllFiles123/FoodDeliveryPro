import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { connectDatabase } from "./database/database.js";

import authRoutes from "./routes/auth.routes.js";
import { createUserTable, createPasswordResetTable } from "./models/user.model.js";


const app = express();


app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());



app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    app: "Food Delivery Pro API",
    version: "1.0.0",
    status: "Running",
  });

});



app.get("/api/health", (req, res) => {

  res.status(200).json({
    success: true,
    message: "Server is healthy.",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });

});



// Auth Routes
app.use(
  "/api/auth",
  authRoutes
);



app.use((req, res) => {

  res.status(404).json({
    success:false,
    message:"Route not found.",
  });

});



app.use((err, req, res, next) => {

  console.error(err);

  res.status(err.status || 500).json({
    success:false,
    message:err.message || "Internal Server Error",
  });

});



await connectDatabase();

createUserTable();
createPasswordResetTable();


export default app;
