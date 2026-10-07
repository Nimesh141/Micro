import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
    },
    avatarColor: {
        type: String,
        default: "#C4F1F7",
    },
    avatarInitials: {
        type: String,
        default: "AJ",
    },
    avatarEmoji: {
        type: String,
        default: "⚡",
    },
    status: {
        type: String,
        enum: ["Online", "Offline", "Busy", "Away"],
        default: "Online",
    },
    role: {
        type: String,
        default: "Member",
    },
    bio: {
        type: String,
        default: "Hey there! Using ChatApp minimal pastel messaging.",
    },
});

export const User = mongoose.model("User", userSchema);
