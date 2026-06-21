import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config() 
import plantRoutes from "./routes/plantRoutes"
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import adminRoutes from "./routes/adminRoutes";
import { seedAdminAccount } from "./utils/seedAdmin";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || ""

app.use(express.json());
app.use(cors())

app.use("/api/v1/plants", plantRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes)

mongoose
  .connect(MONGO_URL)
  .then(async() => {
    console.log("MongoDB is connected");
    await seedAdminAccount();
    app.listen(PORT, () => {
      console.log(`GreenMart Server is started and port is: ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("sorry cant connect database..!", err)
  })