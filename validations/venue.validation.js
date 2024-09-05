import { body, validationResult } from "express-validator";

export const validateVenue = [
  body("name")
    .isString()
    .withMessage("Venue name should be a type of string")
    .isLength({ max: 80 })
    .withMessage("Venue name cannot exceed 80 characters")
    .notEmpty()
    .withMessage("Please enter venue name"),
  body("capacity")
    .isNumeric()
    .withMessage("Capacity should be a number")
    .notEmpty()
    .withMessage("Please enter capacity"),
  body("description")
    .isString()
    .withMessage("Description should be a type of string")
    .notEmpty()
    .withMessage("Please enter product description"),
  body("location")
    .isString()
    .withMessage("Venue location should be a type of string")
    .isLength({ max: 100 })
    .withMessage("Venue location cannot exceed 100 characters")
    .notEmpty()
    .withMessage("Please enter venue location"),
  body("createdBy")
    .optional()
    .isMongoId()
    .withMessage("User ID should be a valid MongoDB ObjectId")
];

// Middleware to check validation results
export const checkVenueValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ message: errorMessages });
  }
  next();
};
