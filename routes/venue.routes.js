import express from "express";
import {
  deleteVenue,
  getSingleVenue,
  getVenues,
  newVenue,
  updateVenue,
} from "../controllers/venue.controllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
const router = express.Router();

router.route("/venues").get(getVenues);
router
  .route("/venues")
  .post(isAuthenticatedUser, newVenue);
router.route("/venues/:id").get(getSingleVenue);
router
  .route("/venues/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateVenue);
router
  .route("/venues/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteVenue);

export default router;
