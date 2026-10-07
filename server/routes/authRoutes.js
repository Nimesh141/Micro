import express from "express";
import {
    registerUser,
    loginUser,
    getMe,
    searchUsers,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/users", protect, searchUsers);
router.get("/search", protect, searchUsers);

export default router;
