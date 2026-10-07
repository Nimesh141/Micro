import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { authAPI } from "../api/auth";
import { chatAPI } from "../api/chat";
import {
    initSocket,
    getSocket,
    joinConversationRoom,
    leaveConversationRoom,
    emitSocketMessage,
    disconnectSocket,
} from "../services/socket";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [activeContactId, setActiveContactId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [messages, setMessages] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);

    // Active contact helper
    const activeContact =
        contacts.find((c) => c.id === activeContactId) || null;

    // 1. Automatic Session & Token Validation on Mount
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        authAPI
            .getMe()
            .then((res) => {
                if (res.success && res.user) {
                    setCurrentUser(res.user);
                    setIsAuthenticated(true);
                    initSocket(res.user.id);
                    fetchConversations();
                } else {
                    logout();
                }
            })
            .catch((err) => {
                console.warn(
                    "Session check failed or expired token:",
                    err.message,
                );
                logout();
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // 2. Listen for 401 Unauthorized Expiry Events
    useEffect(() => {
        const handleUnauthorized = () => {
            logout();
        };

        window.addEventListener("auth:unauthorized", handleUnauthorized);
        return () => {
            window.removeEventListener("auth:unauthorized", handleUnauthorized);
        };
    }, []);

    // 3. Fetch Real Conversations from Backend API
    const fetchConversations = useCallback(async () => {
        try {
            const data = await chatAPI.getConversations();
            if (data.success && data.conversations) {
                setContacts(data.conversations);
                if (data.conversations.length > 0 && !activeContactId) {
                    setActiveContactId(data.conversations[0].id);
                }
            }
        } catch (error) {
            console.error(
                "Failed to fetch backend conversations:",
                error.message,
            );
        }
    }, [activeContactId]);

    // 4. Fetch Real Messages when Active Contact Changes
    useEffect(() => {
        if (!activeContactId) return;

        joinConversationRoom(activeContactId);

        chatAPI
            .getMessages(activeContactId)
            .then((data) => {
                if (data.success && data.messages) {
                    setMessages((prev) => ({
                        ...prev,
                        [activeContactId]: data.messages,
                    }));
                }
            })
            .catch((err) => {
                console.error(
                    "Error fetching room messages from backend:",
                    activeContactId,
                    err.message,
                );
            });

        return () => {
            leaveConversationRoom(activeContactId);
        };
    }, [activeContactId]);

    // 5. Socket real-time message listener
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleReceiveMessage = (incomingMsg) => {
            setMessages((prev) => ({
                ...prev,
                [incomingMsg.conversationId]: [
                    ...(prev[incomingMsg.conversationId] || []),
                    {
                        id: incomingMsg.id,
                        sender:
                            incomingMsg.senderId === currentUser?.id
                                ? "me"
                                : "them",
                        text: incomingMsg.text,
                        timestamp: incomingMsg.timestamp,
                    },
                ],
            }));
        };

        socket.on("receive_message", handleReceiveMessage);
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [currentUser?.id]);

    // 6. Real Backend Message Submission
    const sendMessage = async (text) => {
        if (!text || !text.trim() || !activeContactId) return;

        const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        // 1. Emit via Socket.io for immediate peer relay
        emitSocketMessage({
            conversationId: activeContactId,
            senderId: currentUser?.id,
            text: text.trim(),
            timestamp,
        });

        // 2. Persist to MongoDB Database via REST API
        try {
            const res = await chatAPI.sendMessage(activeContactId, text.trim());
            if (res.success && res.message) {
                setMessages((prev) => ({
                    ...prev,
                    [activeContactId]: [
                        ...(prev[activeContactId] || []),
                        res.message,
                    ],
                }));

                setContacts((prev) =>
                    prev.map((c) => {
                        if (c.id === activeContactId) {
                            return {
                                ...c,
                                lastMessage: text.trim(),
                                time: timestamp,
                            };
                        }
                        return c;
                    }),
                );
            }
        } catch (err) {
            console.error("Failed to save message to backend:", err.message);
            throw err;
        }
    };

    // 7. Backend Login
    const login = async (email, password) => {
        const res = await authAPI.login(email, password);
        if (res.token) {
            localStorage.setItem("token", res.token);
        }
        if (res.user) {
            setCurrentUser(res.user);
        }
        setIsAuthenticated(true);
        initSocket(res.user?.id);
        await fetchConversations();
        return res;
    };

    // 8. Backend Signup
    const signup = async (name, email, password) => {
        try {
            const res = await authAPI.signup(name, email, password);
            if (res.token) {
                localStorage.setItem("token", res.token);
            }
            if (res.user) {
                setCurrentUser(res.user);
            }
            setIsAuthenticated(true);
            initSocket(res.user?.id);
            await fetchConversations();
            return res;
        } catch (err) {
            console.error("Signup failed:", err);
            throw err;
        }
    };

    // 9. Logout Session Cleanup
    const logout = () => {
        localStorage.removeItem("token");
        disconnectSocket();
        setIsAuthenticated(false);
        setCurrentUser(null);
        setContacts([]);
        setMessages({});
        setActiveContactId(null);
    };

    // Filtered contacts based on search query
    const filteredContacts = contacts.filter(
        (c) =>
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <ChatContext.Provider
            value={{
                currentUser,
                isAuthenticated,
                loading,
                contacts: filteredContacts,
                allContacts: contacts,
                activeContactId,
                setActiveContactId,
                activeContact,
                searchQuery,
                setSearchQuery,
                messages: messages[activeContactId] || [],
                sendMessage,
                login,
                signup,
                logout,
                isTyping,
                fetchConversations,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
