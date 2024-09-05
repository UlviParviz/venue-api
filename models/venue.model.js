import mongoose from "mongoose";

const { Schema } = mongoose;

const venueSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter venue name"],
    maxlength: [80, "Venue name cannot exceed 80 characters"],
  },
  capacity: {
    type: Number,
    required: [true, "Please enter capacity"],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  location: {
    type: String,
    required: [true, "Please enter venue location"],
    maxlength: [100, "Venue location cannot exceed 100 characters"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Venue", venueSchema);
