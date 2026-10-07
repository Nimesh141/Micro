import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to sign JWT token
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

/**
 * Register User (Sign Up)
 */
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required.",
            });
        }

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists.",
            });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Compute avatar initials & color palette pop
        const avatarInitials = name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

        const pastelColors = [
            "#C4F1F7",
            "#C9BDF2",
            "#F2FFDF",
            "#FFE5EC",
            "#FFF3B0",
        ];
        const avatarColor =
            pastelColors[Math.floor(Math.random() * pastelColors.length)];

        // 4. Save new user to database
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            avatarInitials,
            avatarColor,
            status: "Online",
        });

        console.log(user);
        // 5. Sign JWT token
        // console.log(process.env.JWT_SECRET);
        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatarColor: user.avatarColor,
                avatarInitials: user.avatarInitials,
                avatarEmoji: user.avatarEmoji,
                status: user.status,
                role: user.role,
                bio: user.bio,
            },
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during registration.",
            error: error.message,
        });
    }
};

/**
 * Login User
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        // 1. Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // 2. Verify password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Update status to Online upon login
        user.status = "Online";
        await user.save();

        // 3. Generate JWT token
        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatarColor: user.avatarColor,
                avatarInitials: user.avatarInitials,
                avatarEmoji: user.avatarEmoji,
                status: user.status,
                role: user.role,
                bio: user.bio,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login.",
            error: error.message,
        });
    }
};

/**
 * Get Current User Profile (Me)
 */
export const getMe = async (req, res) => {
    try {
        // If authenticated via middleware, req.userId is set
        const userId = req.userId || req.user?.id;
        if (!userId) {
            return res
                .status(401)
                .json({ success: false, message: "Not authorized" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatarColor: user.avatarColor,
                avatarInitials: user.avatarInitials,
                avatarEmoji: user.avatarEmoji,
                status: user.status,
                role: user.role,
                bio: user.bio,
            },
        });
    } catch (error) {
        console.error("GetMe Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error retrieving user profile.",
            error: error.message,
        });
    }
};

/**
 * Search Users using User.findMany()
 */
export const searchUsers = async (req, res) => {
    try {
        const { query, q, search } = req.query;
        const searchTerm = query || q || search || "";

        const filter = {};

        if (searchTerm) {
            filter.$or = [
                { name: { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } },
            ];
        }

        // Query users using User.findMany()
        const users = await User.find(filter, "-password");

        return res.status(200).json({
            success: true,
            count: users.length,
            users: users.map((user) => ({
                id: user._id,
                name: user.name,
                email: user.email,
                avatarColor: user.avatarColor,
                avatarInitials: user.avatarInitials,
                avatarEmoji: user.avatarEmoji,
                status: user.status,
                role: user.role,
                bio: user.bio,
            })),
        });
    } catch (error) {
        console.error("Search Users Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error searching users.",
            error: error.message,
        });
    }
};
