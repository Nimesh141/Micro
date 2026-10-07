import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { setupChatSockets } from "./sockets/chatSocket.js";

dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);

// Enable CORS & Body Parser
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        app: "ChatApp Backend",
        timestamp: new Date(),
    });
});

// Initialize Socket.io Server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"],
    },
});

setupChatSockets(io);

const DB = process.env.MONGO_URI;
try {
    await mongoose.connect(DB);
    console.log("MongoDB connected successfully!");
} catch (error) {
    console.log(error);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(
        `🚀 ChatApp Backend server running on http://localhost:${PORT}`,
    );
});
