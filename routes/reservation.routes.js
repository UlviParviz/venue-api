import express from "express";

import { isAuthenticatedUser } from "../middlewares/auth.js";
import {
  cancelReservation,
  createReservation,
  getReservationById,
  getUserReservations,
} from "../controllers/reservation.controllers.js";
import {
  checkReservationValidation,
  validateReservation,
} from "../validations/reservation.validation.js";
const router = express.Router();

router.route("/reservations").get(isAuthenticatedUser, getUserReservations);
router
  .route("/reservations")
  .post(
    validateReservation,
    checkReservationValidation,
    isAuthenticatedUser,
    createReservation
  );
router.route("/reservations/:id").get(isAuthenticatedUser, getReservationById);
router
  .route("/reservations/:id")
  .delete(isAuthenticatedUser, cancelReservation);

export default router;
