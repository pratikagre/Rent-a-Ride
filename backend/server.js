import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import vendorRoute from "./routes/venderRoute.js";

dotenv.config({ path: "./backend/.env" });

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ Allow all origins (simple)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ✅ Test route
app.get("/test", (req, res) => {
  res.send("Backend working");
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/vendor", vendorRoute);

// Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
