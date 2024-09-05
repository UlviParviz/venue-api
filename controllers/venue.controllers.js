import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import APIFilters from "../utils/filters.js";
import Venue from "../models/venue.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import redisClient from "../utils/redisClient.js";

// Get Venues   =>  /api/venues
export const getVenues = catchAsyncErrors(async (req, res) => {
  const cacheKey = "venues";
  redisClient.get(cacheKey, async (err, cachedData) => {
    if (err) return res.status(500).json({ message: "Cache error" });

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const apiFilters = new APIFilters(Venue, req.query).search().filters();
    let venues = await apiFilters.query;

    apiFilters.pagination();
    venues = await apiFilters.query.clone();

    const response = {
      venues,
    };

    redisClient.setEx(cacheKey, 3600, JSON.stringify(response));

    res.status(200).json(response);
  });
});

// Create new venue --ADMIN  =>  /api/venues
export const newVenue = catchAsyncErrors(async (req, res) => {
  req.body.createdBy = req.user._id;

  const venue = await Venue.create(req.body);

  // Clear the cache
  redisClient.del("venues", (err) => {
    if (err) console.error("Cache clear error: ", err);
  });

  res.status(200).json({
    venue,
  });
});

// Get single venue details   =>  /api/v1/venues/:id
export const getSingleVenue = catchAsyncErrors(async (req, res, next) => {
  const venue = await Venue.findById(req?.params?.id);

  if (!venue) {
    return next(new ErrorHandler("Venue not found", 404));
  }

  res.status(200).json({
    venue,
  });
});

// Update venue --ADMIN    =>  /api/v1/venues/:id
export const updateVenue = catchAsyncErrors(async (req, res, next) => {
  let venue = await Venue.findById(req?.params?.id);

  if (!venue) {
    return next(new ErrorHandler("Venue not found", 404));
  }

  venue = await Venue.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });

  // Clear the cache
  redisClient.del("venues", (err) => {
    if (err) console.error("Cache clear error: ", err);
  });

  res.status(200).json({
    venue,
  });
});

// Delete venue --ADMIN   =>  /api/v1/venues/:id
export const deleteVenue = catchAsyncErrors(async (req, res, next) => {
  const venue = await Venue.findById(req?.params?.id);

  if (!venue) {
    return next(new ErrorHandler("Venue not found", 404));
  }

  await venue.deleteOne();

  // Clear the cache
  redisClient.del("venues", (err) => {
    if (err) console.error("Cache clear error: ", err);
  });

  res.status(200).json({
    message: "Venue Deleted",
  });
});
