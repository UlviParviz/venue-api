import mongoose from "mongoose";
import Joi from "joi";
import joigoose from "joigoose";

const convertedJoigoose = joigoose(mongoose, { convert: false });

const joiVenueSchema = Joi.object({
  name: Joi.string()
    .max(200)
    .required()
    .messages({
      "string.base": "Venue name should be a type of string",
      "string.max": "Venue name cannot exceed 200 characters",
      "any.required": "Please enter venue name",
    }),
  capacity: Joi.number()
    .required()
    .messages({
      "number.base": "Capacity should be a number",
      "any.required": "Please enter capacity",
    }),
  description: Joi.string()
    .required()
    .messages({
      "string.base": "Description should be a type of string",
      "any.required": "Please enter product description",
    }),
  location: Joi.string()
    .max(200)
    .required()
    .messages({
      "string.base": "Venue location should be a type of string",
      "string.max": "Venue location cannot exceed 200 characters",
      "any.required": "Please enter venue location",
    }),
  user: Joi.string()
    .optional()
    .messages({
      "string.base": "User ID should be a type of string",
    }),
});

// Convert the Joi schema to Mongoose schema
const mongooseSchemaDefinition = convertedJoigoose.convert(joiVenueSchema);

// Add additional fields that are not covered by Joi validation
mongooseSchemaDefinition.user = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false,
};

const { Schema } = mongoose;

const venueSchema = new Schema(mongooseSchemaDefinition, {
  timestamps: true,
});

export default mongoose.model("Venue", venueSchema);
