import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import joigoose from "joigoose";

// Initialize Joigoose
const convertedJoigoose = joigoose(mongoose, { convert: false });

// Define the Joi schema
const joiUserSchema = Joi.object({
  username: Joi.string().max(50).required().messages({
    "string.base": "Username should be a type of string",
    "string.max": "Username cannot exceed 50 characters",
    "any.required": "Please enter your username",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of string",
    "string.email": "Please enter a valid email address",
    "any.required": "Please enter your email",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password should be a type of string",
    "string.min": "Password must be longer than 6 characters",
    "any.required": "Please enter your password",
  }),
  role: Joi.string().valid("user", "admin").default("user").messages({
    "string.base": "Role should be a type of string",
    "string.valid": "Role must be either 'user' or 'admin'",
  }),
});

// Convert the Joi schema to Mongoose schema
const mongooseSchemaDefinition = convertedJoigoose.convert(joiUserSchema);

// Add additional fields that are not covered by Joi validation
mongooseSchemaDefinition.password.select = false; // Exclude password field by default

const { Schema } = mongoose;

const userSchema = new Schema(mongooseSchemaDefinition, {
  timestamps: true,
});

// Encrypt password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT Token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
