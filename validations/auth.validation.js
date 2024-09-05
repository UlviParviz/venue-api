import { body, validationResult } from "express-validator";

export const validateUser = [
  body("username")
    .isString()
    .withMessage("Username should be a type of string")
    .isLength({ max: 20 })
    .withMessage("Username cannot exceed 20 characters")
    .notEmpty()
    .withMessage("Please enter your username"),
  body("email")
    .isString()
    .withMessage("Email should be a type of string")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .notEmpty()
    .withMessage("Please enter your email"),
  body("password")
    .isString()
    .withMessage("Password should be a type of string")
    .isLength({ min: 8 })
    .withMessage("Password must be longer than 8 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]$/)
    .withMessage("Password must contain at least one letter and one number")
    .notEmpty()
    .withMessage("Please enter your password"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
];

// Middleware to check validation results
export const checkAuthValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ message: errorMessages });
  }
  next();
};
