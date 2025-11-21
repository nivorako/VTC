import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user with email & password
// @access  Public
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login with email & password
// @access  Public
router.post("/login", login);

export default router;
