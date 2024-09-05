import Reservation from "../models/reservation.model.js";
import Venue from "../models/venue.model.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create a new reservation =>  /api/reservations  POST
export const createReservation = catchAsyncErrors(async (req, res, next) => {
  const { venueId, date, time, numberOfPeople } = req.body;

  const userId = req.user._id;

  // Check if the venueId exists in the Venue model
  const venue = await Venue.findById(venueId);
  if (!venue) {
    return next(new ErrorHandler("Venue does not exist.", 404));
  }

  const existingReservation = await Reservation.findOne({
    venueId,
    date,
    time,
  });
  if (existingReservation) {
    return next(
      new ErrorHandler(
        "This venue is already booked for the selected date and time.",
        400
      )
    );
  }

  const newReservation = new Reservation({
    userId,
    venueId,
    date,
    time,
    numberOfPeople,
  });

  await newReservation.save();
  res.status(201).json(newReservation);
});

// Get all reservations for a specific user =>  /api/reservations GET
export const getUserReservations = catchAsyncErrors(async (req, res, next) => {
  const reservations = await Reservation.find({ userId: req.user._id });

  if (!reservations) {
    return next(new ErrorHandler("No reservations found for this user", 404));
  }

  res.status(200).json(reservations);
});

// Get a reservation details by ID =>  /api/reservations/:id GET
export const getReservationById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const reservation = await Reservation.findById(id)
    .populate("venueId")
    .populate("userId");

  if (!reservation) {
    return next(new ErrorHandler("Reservation not found", 404));
  } else if (
    reservation.userId._id.toString() !== req.user._id.toString() &&
    !req.user.role === "admin"
  ) {
    return next(new ErrorHandler("Access denied", 403));
  }

  res.status(200).json(reservation);
});

// Delete a reservation by ID =>  /api/reservations/:id DELETE
export const cancelReservation = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const reservation = await Reservation.findById(id);

  if (!reservation) {
    return next(new ErrorHandler("Reservation not found", 404));
  }

  if (
    reservation.userId._id.toString() !== req.user._id.toString() &&
    !req.user.role === "admin"
  ) {
    return next(new ErrorHandler("Access denied", 403));
  }

  await reservation.deleteOne();
  res.status(200).json({ message: "Reservation cancelled successfully" });
});
