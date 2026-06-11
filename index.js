import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"])
import authRouter from "./routers/auth.js";
dotenv.config();
import Chalk from "chalk";
const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
   console.log(Chalk.green("Connected to MongoDB successfully"));
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
app.use("/api/auth", authRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
