import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controllers.js";
import {
  checkAuthValidation,
  validateUser,
} from "../validations/auth.validation.js";
const router = express.Router();

router
  .route("/auth/register")
  .post(validateUser, checkAuthValidation, registerUser);
router.route("/auth/login").post(loginUser);

export default router;
