import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
// import { User } from '../models/User.js';

/**
 * Get all conversations for the authenticated user
 */
export const getConversations = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ success: false, message: "User not authenticated" });
        }

        // Find conversations where user is a participant
        const conversations = await Conversation.find({ participants: userId })
            .populate(
                "participants",
                "name email avatarColor avatarInitials avatarEmoji status role bio",
            )
            .populate("lastMessageSender", "name")
            .sort({ updatedAt: -1 });

        // Format list for frontend
        const formattedConversations = conversations.map((conv) => {
            // Find partner (the other participant)
            const partner =
                conv.participants.find(
                    (p) => p._id.toString() !== userId.toString(),
                ) || conv.participants[0];

            return {
                id: conv._id,
                name: conv.isGroup
                    ? conv.groupName
                    : partner?.name || "Chat Partner",
                avatarColor: partner?.avatarColor || "#C4F1F7",
                avatarInitials: partner?.avatarInitials || "AJ",
                avatarEmoji: partner?.avatarEmoji || "⚡",
                status: partner?.status || "Online",
                role: partner?.role || "Member",
                bio: partner?.bio || "",
                lastMessage: conv.lastMessage || "No messages yet",
                time: conv.updatedAt
                    ? new Date(conv.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "",
                unread: 0,
                participants: conv.participants,
            };
        });

        return res.status(200).json({
            success: true,
            conversations: formattedConversations,
        });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch conversations",
            error: error.message,
        });
    }
};

/**
 * Create or Get Existing Conversation between Users
 */
export const createConversation = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const { recipientId, groupName, isGroup = false } = req.body;

        if (!recipientId && !isGroup) {
            return res
                .status(400)
                .json({ success: false, message: "Recipient ID is required" });
        }

        if (!isGroup) {
            // Check if conversation already exists between currentUserId and recipientId
            let existingConversation = await Conversation.findOne({
                isGroup: false,
                participants: { $all: [currentUserId, recipientId] },
            }).populate(
                "participants",
                "name email avatarColor avatarInitials avatarEmoji status role bio",
            );

            if (existingConversation) {
                return res.status(200).json({
                    success: true,
                    conversation: existingConversation,
                    isNew: false,
                });
            }
        }

        // Create new conversation document in MongoDB
        const participantsList = isGroup
            ? req.body.participants
            : [currentUserId, recipientId];
        const newConversation = await Conversation.create({
            participants: participantsList,
            isGroup,
            groupName: isGroup ? groupName : "",
            lastMessage: "Conversation started",
            lastMessageSender: currentUserId,
        });

        const populatedConversation = await Conversation.findById(
            newConversation._id,
        ).populate(
            "participants",
            "name email avatarColor avatarInitials avatarEmoji status role bio",
        );

        return res.status(201).json({
            success: true,
            conversation: populatedConversation,
            isNew: true,
        });
    } catch (error) {
        console.error("Error creating conversation:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create conversation",
            error: error.message,
        });
    }
};

/**
 * Get Messages for a specific Conversation
 */
export const getMessagesByConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;

        if (!conversationId) {
            return res
                .status(400)
                .json({ success: false, message: "Conversation ID required" });
        }

        // Query messages from MongoDB sorted chronologically
        const rawMessages = await Message.find({ conversationId })
            .populate("senderId", "name avatarInitials avatarColor")
            .sort({ createdAt: 1 });

        // Format for frontend message bubble structure
        const formattedMessages = rawMessages.map((msg) => ({
            id: msg._id,
            conversationId: msg.conversationId,
            senderId: msg.senderId?._id,
            sender:
                msg.senderId?._id.toString() === userId.toString()
                    ? "me"
                    : "them",
            senderName: msg.senderId?.name || "User",
            text: msg.text,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        }));

        return res.status(200).json({
            success: true,
            conversationId,
            messages: formattedMessages,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message,
        });
    }
};

/**
 * Post a New Message to a Conversation & update Conversation metadata
 */
export const postMessage = async (req, res) => {
    try {
        const { conversationId, text } = req.body;
        const senderId = req.userId;

        if (!conversationId || !text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Conversation ID and non-empty text are required",
            });
        }

        // 1. Save new message to MongoDB
        const newMessage = await Message.create({
            conversationId,
            senderId,
            text: text.trim(),
            readBy: [senderId],
        });

        // 2. Update Conversation lastMessage & lastMessageSender in MongoDB
        await Conversation.findByIdAndUpdate(
            conversationId,
            {
                lastMessage: text.trim(),
                lastMessageSender: senderId,
            },
            { new: true },
        );

        // 3. Populate sender info for immediate response
        const populatedMessage = await Message.findById(
            newMessage._id,
        ).populate("senderId", "name avatarInitials avatarColor");

        const formattedMessage = {
            id: populatedMessage._id,
            conversationId: populatedMessage.conversationId,
            senderId: populatedMessage.senderId?._id,
            sender: "me",
            senderName: populatedMessage.senderId?.name || "You",
            text: populatedMessage.text,
            timestamp: new Date(populatedMessage.createdAt).toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                },
            ),
        };

        return res.status(201).json({
            success: true,
            message: formattedMessage,
        });
    } catch (error) {
        console.error("Error posting message:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to post message",
            error: error.message,
        });
    }
};
