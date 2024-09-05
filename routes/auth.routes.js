import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controllers.js";
const router = express.Router();

router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);

export default router;
