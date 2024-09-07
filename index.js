import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/db.connect.js";
import errorMiddleware from "./middlewares/errors.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import venueRoutes from "./routes/venue.routes.js";
import authRoutes from "./routes/auth.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";

dotenv.config({ path: "config/.env" });

// Create an instance of Express
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Database connection
connectDatabase();

// Routes setup
app.get("/", (req, res) => {
  res.send("Hello This is Venue Reservation API");
});

app.use("/api", venueRoutes);
app.use("/api", authRoutes);
app.use("/api", reservationRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Export the app as a handler for Vercel
export default (req, res) => {
  return app(req, res);
};
