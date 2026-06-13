import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"])
import authRouter from "./routers/auth.js";
import userRouter from "./routers/user.js";
dotenv.config();
import Chalk from "chalk";
const app = express();
const PORT = 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
   console.log(Chalk.green("Connected to MongoDB successfully"));
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
app.use(cors());
app.use(express.json())
// app.use("/api",authRouter)
app.use("/user", userRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
