import express from "express";
import "dotenv/config";
import compression from "compression";
import dataBase from "./Database/db.js";
import router from "./Routes/recipeRoute.js";
import cors from 'cors';
import userRouter from './Routes/userRoute.js';

const app = express();

// Enable Gzip compression to reduce bundle and payload sizes
app.use(compression());

app.use(express.json());

// Set static public images directory with caching enabled (1 Day)
app.use(express.static("public", {
  maxAge: '1d',
  etag: true
}));

app.use(
  cors({
    origin: process.env.FRONTENDLINK,
    credentials: true
  })
);

app.get("/", (req, res) => {
  res.send("Server is running smoothly");
});

app.use("/api", router);
app.use("/api", userRouter);

// Global Error Handler for uncaught middleware exceptions
app.use((err, req, res, next) => {
  console.error("Unhandled Error Instance:", err);
  res.status(500).json({ success: false, message: err.message || "An internal error occurred" });
});

dataBase();

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});