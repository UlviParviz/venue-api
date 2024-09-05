import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDatabase } from "./config/db.connect.js";
import errorMiddleware from "./middlewares/errors.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught expection");
  process.exit(1);
});

dotenv.config({ path: "config/.env" });

// Connecting to database
connectDatabase();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Import all routes
import venueRoutes from "./routes/venue.routes.js";
import authRoutes from "./routes/auth.routes.js";

app.use("/api", venueRoutes);
app.use("/api", authRoutes);

// Using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT: ${process.env.PORT}.`);
});

//Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
