import { body, validationResult } from "express-validator";

export const validateReservation = [
  body("userId").optional(),
  body("venueId")
    .isMongoId()
    .withMessage("Venue ID should be a valid MongoDB ObjectId")
    .notEmpty()
    .withMessage("Please provide venue ID"),
  body("date")
    .isISO8601()
    .withMessage("Date should be a valid ISO 8601 date format")
    .toDate()
    .withMessage("Date should be a valid date")
    .notEmpty()
    .withMessage("Please provide a date"),
  body("time")
    .isString()
    .withMessage("Time should be a type of string")
    .notEmpty()
    .withMessage("Please provide a time"),
  body("numberOfPeople")
    .isNumeric()
    .withMessage("Number of people should be a number")
    .notEmpty()
    .withMessage("Please provide the number of people"),
];

// Middleware to check validation results
export const checkReservationValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ message: errorMessages });
  }
  next();
};
