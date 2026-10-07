import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Send,
    Phone,
    Video,
    MoreVertical,
    Paperclip,
    FileText,
    LogOut,
    Sparkles,
    CheckCheck,
    Menu,
    X,
    MessageSquare,
    UserPlus,
    Loader2,
    UserCheck,
    Users,
} from "lucide-react";
import { useChat } from "../context/ChatContext";
import { Avatar } from "../components/Avatar";
import { authAPI } from "../api/auth";
import { chatAPI } from "../api/chat";

export const ChatPage = () => {
    const navigate = useNavigate();
    const {
        currentUser,
        contacts,
        activeContactId,
        setActiveContactId,
        activeContact,
        searchQuery,
        setSearchQuery,
        messages,
        sendMessage,
        logout,
        isTyping,
        fetchConversations,
    } = useChat();

    const [inputMessage, setInputMessage] = useState("");
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [showRightPanel, setShowRightPanel] = useState(true);
    const messagesEndRef = useRef(null);

    // User Search Modal state
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [modalSearchTerm, setModalSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [connectingUserId, setConnectingUserId] = useState(null);

    // Fetch users for Search Modal
    useEffect(() => {
        if (!showSearchModal) return;

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await authAPI.searchUsers(modalSearchTerm);
                if (res.success && res.users) {
                    // Filter out current user from results
                    const filtered = res.users.filter(
                        (u) => (u.id || u._id) !== currentUser?.id
                    );
                    setSearchResults(filtered);
                }
            } catch (err) {
                console.error("Search users error:", err);
            } finally {
                setIsSearching(false);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [showSearchModal, modalSearchTerm, currentUser?.id]);

    const handleConnectUser = async (targetUserId) => {
        try {
            setConnectingUserId(targetUserId);
            const res = await chatAPI.createConversation(targetUserId);
            if (res.success && res.conversation) {
                if (fetchConversations) {
                    await fetchConversations();
                }
                const convId = res.conversation._id || res.conversation.id;
                if (convId) {
                    setActiveContactId(convId);
                }
                setShowSearchModal(false);
                setModalSearchTerm("");
            }
        } catch (err) {
            console.error("Connect user error:", err);
        } finally {
            setConnectingUserId(null);
        }
    };

    // Auto-scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;
        sendMessage(inputMessage);
        setInputMessage("");
    };

    return (
        <div className="h-screen w-screen bg-[#EEF7EC] page-chat flex flex-col font-['Plus_Jakarta_Sans'] text-[#202020] overflow-hidden">
            {/* Top Application Bar */}
            <header className="h-20 bg-[#F2FFDF] border-b-[2.5px] border-[#202020] px-6 md:px-8 flex items-center justify-between shrink-0 z-30">
                {/* Left Brand */}
                <div className="flex items-center gap-4">
                    {/* Mobile sidebar toggle */}
                    <button
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        className="md:hidden p-2.5 bg-white border-[2.5px] border-[#202020] rounded-xl shadow-[2.5px_2.5px_0px_#202020]"
                    >
                        {mobileSidebarOpen ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-[#C4F1F7] border-[2.5px] border-[#202020] rounded-xl flex items-center justify-center shadow-[3px_3px_0px_#202020]">
                            <span className="font-extrabold text-base font-['Space_Grotesk']">
                                💬
                            </span>
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight font-['Space_Grotesk'] text-[#202020]">
                            Chat
                            <span className="bg-[#C9BDF2] px-2 py-0.5 border-[2px] border-[#202020] rounded-md text-xs ml-1 font-extrabold">
                                App
                            </span>
                        </span>
                    </div>
                </div>

                {/* User profile & actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Search Users to Connect Button */}
                    <button
                        onClick={() => {
                            setShowSearchModal(true);
                            setModalSearchTerm("");
                        }}
                        className="flex items-center gap-2 px-3.5 py-2 bg-[#C4F1F7] hover:bg-[#AEE6EE] border-[2.5px] border-[#202020] rounded-xl shadow-[2.5px_2.5px_0px_#202020] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#202020] transition-all font-extrabold text-sm text-[#202020]"
                        title="Search Users to Connect"
                    >
                        <UserPlus size={18} strokeWidth={2.5} />
                        <span className="hidden sm:inline font-['Space_Grotesk']">
                            Search Users
                        </span>
                    </button>

                    {currentUser && (
                        <div className="hidden sm:flex items-center gap-3 bg-white border-[2.5px] border-[#202020] px-4 py-2 rounded-xl shadow-[3px_3px_0px_#202020]">
                            <Avatar
                                initials={currentUser.avatarInitials}
                                color={currentUser.avatarColor}
                                size="md"
                            />
                            <div className="text-left">
                                <p className="text-sm font-extrabold leading-none text-[#202020]">
                                    {currentUser.name}
                                </p>
                                <p className="text-xs font-bold text-[#536D6B] mt-1">
                                    {currentUser.status || "Online"}
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                        title="Log Out"
                        className="p-3 bg-[#FFFFFF] hover:bg-[#FFE5EC] border-[2.5px] border-[#202020] rounded-xl shadow-[3px_3px_0px_#202020] transition-colors"
                    >
                        <LogOut
                            size={20}
                            strokeWidth={2.5}
                            className="text-[#202020]"
                        />
                    </button>
                </div>
            </header>

            {/* Main 3-Column Layout */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* SECTION 1 — SIDEBAR (LEFT) */}
                <aside
                    className={`
          w-full md:w-88 lg:w-96 bg-[#F2FFDF] border-r-[2.5px] border-[#202020] flex flex-col shrink-0
          absolute md:relative inset-y-0 left-0 z-20 transition-transform duration-200
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
                >
                    {/* Sidebar Top: Search */}
                    <div className="p-5 border-b-[2.5px] border-[#202020] bg-[#F2FFDF]">
                        <div className="relative">
                            <Search
                                size={20}
                                className="absolute left-4 top-3.5 text-[#536D6B]"
                                strokeWidth={2.5}
                            />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 text-xs md:text-sm font-bold bg-white border-[2.5px] border-[#202020] rounded-xl outline-none focus:shadow-[3px_3px_0px_#202020] placeholder-[#7A9593] min-h-[48px]"
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <div className="px-2 py-1.5 text-xs font-extrabold uppercase text-[#536D6B] tracking-wider flex items-center justify-between">
                            <span>Conversations ({contacts.length})</span>
                            <Sparkles size={14} />
                        </div>

                        {contacts.map((contact) => {
                            const isSelected = contact.id === activeContactId;

                            return (
                                <div
                                    key={contact.id}
                                    onClick={() => {
                                        setActiveContactId(contact.id);
                                        setMobileSidebarOpen(false);
                                    }}
                                    className={`
                    p-4 rounded-xl border-[2.5px] cursor-pointer transition-all duration-150 flex items-center gap-3.5 select-none
                    ${isSelected ? "bg-[#C4F1F7] border-[#202020] shadow-[4px_4px_0px_#202020] translate-x-1" : "bg-white/70 hover:bg-white border-[#202020]/50 hover:border-[#202020]"}
                  `}
                                >
                                    <Avatar
                                        initials={contact.avatarInitials || "U"}
                                        emoji={contact.avatarEmoji}
                                        color={contact.avatarColor || "#C4F1F7"}
                                        size="md"
                                        status={contact.status}
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1 mb-1">
                                            <h4 className="text-sm font-extrabold text-[#202020] truncate font-['Space_Grotesk']">
                                                {contact.name}
                                            </h4>
                                            <span className="text-xs font-bold text-[#536D6B] whitespace-nowrap">
                                                {contact.time}
                                            </span>
                                        </div>

                                        <p className="text-xs font-semibold text-[#4A6361] truncate">
                                            {contact.lastMessage}
                                        </p>
                                    </div>

                                    {contact.unread > 0 && (
                                        <span className="w-6 h-6 bg-[#C9BDF2] border-[2px] border-[#202020] rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 text-[#202020]">
                                            {contact.unread}
                                        </span>
                                    )}
                                </div>
                            );
                        })}

                        {contacts.length === 0 && (
                            <div className="p-8 text-center space-y-3 border-[2px] border-dashed border-[#202020]/30 rounded-2xl bg-white/40">
                                <MessageSquare
                                    className="mx-auto text-[#536D6B]"
                                    size={28}
                                />
                                <p className="text-xs md:text-sm font-bold text-[#536D6B]">
                                    No conversations yet. Start a new chat to
                                    connect!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t-[2.5px] border-[#202020] bg-white/50 text-xs font-bold text-[#536D6B] flex items-center justify-between">
                        <span>Pastel Brutalist UI</span>
                        <span className="px-2.5 py-1 bg-[#C9BDF2] border border-[#202020] rounded text-xs text-[#202020] font-extrabold">
                            Active Session
                        </span>
                    </div>
                </aside>

                {/* SECTION 2 — CHAT AREA (CENTER) */}
                <main className="flex-1 bg-white flex flex-col min-w-0 relative">
                    {activeContact ? (
                        <>
                            {/* Chat Header */}
                            <header className="h-20 px-6 md:px-8 border-b-[2.5px] border-[#202020] bg-white flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        initials={
                                            activeContact.avatarInitials || "U"
                                        }
                                        emoji={activeContact.avatarEmoji}
                                        color={
                                            activeContact.avatarColor ||
                                            "#C4F1F7"
                                        }
                                        size="lg"
                                        status={activeContact.status}
                                    />
                                    <div>
                                        <h3 className="text-base md:text-lg font-extrabold text-[#202020] font-['Space_Grotesk'] flex items-center gap-2.5">
                                            {activeContact.name}
                                            {activeContact.role && (
                                                <span className="text-xs font-extrabold px-2.5 py-0.5 bg-[#F2FFDF] border-[1.5px] border-[#202020] rounded-md text-[#202020]">
                                                    {activeContact.role}
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-xs font-bold text-[#4ADE80] flex items-center gap-1.5 mt-0.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] border border-[#202020]" />
                                            {activeContact.status || "Online"}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Icons */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            alert(
                                                `Starting voice call with ${activeContact.name}...`,
                                            )
                                        }
                                        className="p-3 hover:bg-[#C4F1F7] border-[2.5px] border-[#202020] rounded-xl shadow-[3px_3px_0px_#202020] transition-colors"
                                        title="Voice Call"
                                    >
                                        <Phone
                                            size={18}
                                            strokeWidth={2.5}
                                            className="text-[#202020]"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            alert(
                                                `Starting video call with ${activeContact.name}...`,
                                            )
                                        }
                                        className="p-3 hover:bg-[#C9BDF2] border-[2.5px] border-[#202020] rounded-xl shadow-[3px_3px_0px_#202020] transition-colors"
                                        title="Video Call"
                                    >
                                        <Video
                                            size={18}
                                            strokeWidth={2.5}
                                            className="text-[#202020]"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowRightPanel(!showRightPanel)
                                        }
                                        className={`hidden lg:block p-3 border-[2.5px] border-[#202020] rounded-xl shadow-[3px_3px_0px_#202020] transition-colors ${showRightPanel ? "bg-[#F2FFDF]" : "bg-white hover:bg-slate-100"}`}
                                        title="Toggle Contact Details"
                                    >
                                        <MoreVertical
                                            size={18}
                                            strokeWidth={2.5}
                                            className="text-[#202020]"
                                        />
                                    </button>
                                </div>
                            </header>

                            {/* Chat Messages Container */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-grid-dots bg-[#FAFDF9]">
                                {/* Timestamp Badge */}
                                <div className="flex justify-center my-3">
                                    <span className="px-4 py-1.5 bg-white border-[2.5px] border-[#202020] rounded-xl text-xs font-extrabold uppercase tracking-wider text-[#536D6B] shadow-[3px_3px_0px_#202020]">
                                        End-to-End Encrypted
                                    </span>
                                </div>

                                {/* Render Messages */}
                                {messages.map((msg) => {
                                    const isSent = msg.sender === "me";

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${isSent ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[72%] ${isSent ? "ml-auto" : "mr-auto"}`}
                                        >
                                            <div className="flex items-center gap-2 mb-1.5 text-xs font-extrabold text-[#536D6B]">
                                                <span>
                                                    {isSent
                                                        ? "You"
                                                        : msg.senderName ||
                                                          activeContact.name}
                                                </span>
                                                <span>•</span>
                                                <span>{msg.timestamp}</span>
                                            </div>

                                            {/* Bubble styling */}
                                            <div
                                                className={`
                          p-4 md:p-5 rounded-2xl border-[2.5px] border-[#202020] text-sm md:text-base font-semibold leading-relaxed shadow-[4px_4px_0px_#202020]
                          ${isSent ? "bg-[#C4F1F7] text-[#202020]" : "bg-[#C9BDF2] text-[#202020]"}
                        `}
                                            >
                                                {msg.text}
                                            </div>

                                            {isSent && (
                                                <span className="text-xs font-bold text-[#536D6B] flex items-center gap-1 mt-1.5">
                                                    <CheckCheck
                                                        size={14}
                                                        className="text-[#202020]"
                                                    />{" "}
                                                    Sent
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}

                                {messages.length === 0 && (
                                    <div className="p-12 text-center text-xs md:text-sm font-extrabold text-[#536D6B]">
                                        No messages in this chat yet. Send a
                                        message to start conversing!
                                    </div>
                                )}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex items-center gap-3 text-xs font-bold text-[#536D6B]">
                                        <div className="px-4 py-3 bg-[#C9BDF2] border-[2.5px] border-[#202020] rounded-2xl shadow-[3px_3px_0px_#202020] flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-[#202020] rounded-full animate-bounce" />
                                            <span className="w-2 h-2 bg-[#202020] rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="w-2 h-2 bg-[#202020] rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                        <span className="text-xs font-extrabold text-[#202020]">
                                            {activeContact.name} is typing...
                                        </span>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Composer */}
                            <footer className="p-5 md:p-6 border-t-[2.5px] border-[#202020] bg-white">
                                <form
                                    onSubmit={handleSend}
                                    className="flex items-center gap-3"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            alert("Attachment menu opened")
                                        }
                                        className="p-3.5 bg-[#F2FFDF] hover:bg-[#E4FCBF] border-[2.5px] border-[#202020] rounded-xl shadow-[3px_3px_0px_#202020] transition-colors shrink-0"
                                        title="Attach File"
                                    >
                                        <Paperclip
                                            size={20}
                                            strokeWidth={2.5}
                                            className="text-[#202020]"
                                        />
                                    </button>

                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={inputMessage}
                                        onChange={(e) =>
                                            setInputMessage(e.target.value)
                                        }
                                        className="flex-1 py-4 px-5 text-sm md:text-base font-semibold text-[#202020] placeholder-[#7A9593] bg-white border-[2.5px] border-[#202020] rounded-xl outline-none focus:shadow-[4px_4px_0px_#202020] min-h-[56px]"
                                    />

                                    <button
                                        type="submit"
                                        disabled={!inputMessage.trim()}
                                        className="px-7 py-4 bg-[#202020] text-white border-[2.5px] border-[#202020] rounded-xl shadow-[4px_4px_0px_#536D6B] hover:bg-[#333333] active:translate-x-[1px] active:translate-y-[1px] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center min-h-[60px] h-[60px] shrink-0"
                                    >
                                        <Send size={20} strokeWidth={2.5} />
                                    </button>
                                </form>
                            </footer>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-grid-dots bg-[#FAFDF9]">
                            <div className="w-16 h-16 bg-[#C4F1F7] border-[3px] border-[#202020] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#202020]">
                                <MessageSquare
                                    size={32}
                                    className="text-[#202020]"
                                />
                            </div>
                            <h3 className="text-xl font-extrabold text-[#202020] font-['Space_Grotesk']">
                                Welcome to ChatApp
                            </h3>
                            <p className="text-sm font-semibold text-[#536D6B] max-w-sm">
                                Select a conversation from the sidebar to start
                                messaging.
                            </p>
                        </div>
                    )}
                </main>

                {/* SECTION 3 — USER INFORMATION (RIGHT) */}
                {showRightPanel && activeContact && (
                    <aside className="w-80 bg-[#F2FFDF] border-l-[2.5px] border-[#202020] hidden lg:flex flex-col p-6 shrink-0 overflow-y-auto space-y-6">
                        {/* Header info */}
                        <div className="flex flex-col items-center text-center pb-6 border-b-[2.5px] border-[#202020] space-y-3">
                            <Avatar
                                initials={activeContact.avatarInitials || "U"}
                                emoji={activeContact.avatarEmoji}
                                color={activeContact.avatarColor || "#C4F1F7"}
                                size="xl"
                                status={activeContact.status}
                            />

                            <div>
                                <h3 className="text-lg font-extrabold text-[#202020] font-['Space_Grotesk']">
                                    {activeContact.name}
                                </h3>
                                {activeContact.role && (
                                    <p className="text-xs font-bold text-[#536D6B] mt-0.5">
                                        {activeContact.role}
                                    </p>
                                )}
                            </div>

                            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border-[2px] border-[#202020] rounded-lg text-xs font-extrabold uppercase text-[#202020] shadow-[2px_2px_0px_#202020]">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] border border-[#202020]" />
                                {activeContact.status || "Online"}
                            </div>
                        </div>

                        {/* Bio Section */}
                        {activeContact.bio && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-extrabold uppercase text-[#536D6B] tracking-wider font-['Space_Grotesk']">
                                    About
                                </h4>
                                <p className="text-xs md:text-sm font-medium text-[#202020] leading-relaxed bg-white border-[2.5px] border-[#202020] p-4 rounded-xl shadow-[3px_3px_0px_#202020]">
                                    {activeContact.bio}
                                </p>
                            </div>
                        )}

                        {/* Shared Media */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-extrabold uppercase text-[#536D6B] tracking-wider font-['Space_Grotesk']">
                                    Shared Media
                                </h4>
                                <span className="text-xs font-extrabold px-2 py-0.5 bg-white border border-[#202020] rounded text-[#202020]">
                                    {activeContact.media?.length || 0} items
                                </span>
                            </div>

                            {activeContact.media &&
                            activeContact.media.length > 0 ? (
                                <div className="space-y-2.5">
                                    {activeContact.media.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-3 bg-white border-[2.5px] border-[#202020] rounded-xl shadow-[3px_3px_0px_#202020] flex items-center gap-3 hover:translate-x-0.5 transition-transform cursor-pointer"
                                        >
                                            <div
                                                className="w-9 h-9 rounded-lg border-[2px] border-[#202020] flex items-center justify-center shrink-0"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            >
                                                <FileText
                                                    size={16}
                                                    className="text-[#202020]"
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-[#202020] truncate">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-white/70 border-[2.5px] border-dashed border-[#202020]/40 rounded-xl text-center text-xs font-bold text-[#536D6B]">
                                    No media shared yet
                                </div>
                            )}
                        </div>
                    </aside>
                )}
            </div>

            {/* User Search & Connect Modal */}
            {showSearchModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div
                        className="bg-[#F2FFDF] border-[3px] border-[#202020] rounded-2xl shadow-[6px_6px_0px_#202020] w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-5 bg-[#C9BDF2] border-b-[2.5px] border-[#202020] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white border-[2.5px] border-[#202020] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#202020]">
                                    <UserPlus size={20} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-lg text-[#202020] font-['Space_Grotesk'] leading-tight">
                                        Connect with People
                                    </h3>
                                    <p className="text-xs font-bold text-[#536D6B]">
                                        Search registered users to start chatting
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowSearchModal(false)}
                                className="p-1.5 bg-white hover:bg-[#FFE5EC] border-[2px] border-[#202020] rounded-lg shadow-[2px_2px_0px_#202020] transition-colors"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Modal Search Input */}
                        <div className="p-4 border-b-[2.5px] border-[#202020] bg-white">
                            <div className="relative">
                                <Search
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#536D6B]"
                                    size={18}
                                    strokeWidth={2.5}
                                />
                                <input
                                    type="text"
                                    autoFocus
                                    value={modalSearchTerm}
                                    onChange={(e) => setModalSearchTerm(e.target.value)}
                                    placeholder="Search by name or email address..."
                                    className="w-full bg-[#EEF7EC] border-[2.5px] border-[#202020] rounded-xl pl-10 pr-4 py-2.5 font-bold text-sm text-[#202020] placeholder-[#536D6B] focus:outline-none focus:ring-2 focus:ring-[#C9BDF2]"
                                />
                                {modalSearchTerm && (
                                    <button
                                        onClick={() => setModalSearchTerm("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold bg-[#FFE5EC] border-[1.5px] border-[#202020] px-1.5 py-0.5 rounded"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Results Body */}
                        <div className="p-4 overflow-y-auto flex-1 space-y-3 min-h-[220px]">
                            {isSearching ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-2 text-[#536D6B]">
                                    <Loader2 className="animate-spin" size={28} strokeWidth={2.5} />
                                    <span className="font-extrabold text-sm">Searching users...</span>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-2 text-center text-[#536D6B]">
                                    <Users size={36} strokeWidth={2} />
                                    <p className="font-extrabold text-base text-[#202020]">
                                        No users found
                                    </p>
                                    <p className="text-xs font-semibold max-w-xs">
                                        {modalSearchTerm
                                            ? `No accounts matching "${modalSearchTerm}".`
                                            : "No other registered users found to connect."}
                                    </p>
                                </div>
                            ) : (
                                searchResults.map((user) => {
                                    const userId = user.id || user._id;
                                    const isConnecting = connectingUserId === userId;
                                    const existingContact = contacts.find(
                                        (c) =>
                                            c.participants?.some(
                                                (p) => (p._id || p.id) === userId
                                            ) || c.name === user.name
                                    );

                                    return (
                                        <div
                                            key={userId}
                                            className="bg-white border-[2.5px] border-[#202020] rounded-xl p-3.5 flex items-center justify-between shadow-[3px_3px_0px_#202020] hover:translate-x-0.5 transition-transform"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    initials={user.avatarInitials || "U"}
                                                    color={user.avatarColor || "#C4F1F7"}
                                                    size="md"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-extrabold text-sm text-[#202020]">
                                                            {user.name}
                                                        </h4>
                                                        <span className="bg-[#C4F1F7] px-1.5 py-0.5 text-[10px] font-extrabold border border-[#202020] rounded">
                                                            {user.status || "Online"}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-bold text-[#536D6B]">
                                                        {user.email}
                                                    </p>
                                                    {user.bio && (
                                                        <p className="text-[11px] font-medium text-gray-600 line-clamp-1 mt-0.5">
                                                            {user.bio}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                disabled={isConnecting}
                                                onClick={() => handleConnectUser(userId)}
                                                className={`px-3.5 py-1.5 border-[2px] border-[#202020] rounded-lg shadow-[2px_2px_0px_#202020] font-extrabold text-xs flex items-center gap-1.5 transition-all ${
                                                    existingContact
                                                        ? "bg-[#F2FFDF] hover:bg-[#d9f5ba] text-[#202020]"
                                                        : "bg-[#C9BDF2] hover:bg-[#b5a3ee] text-[#202020]"
                                                }`}
                                            >
                                                {isConnecting ? (
                                                    <Loader2 className="animate-spin" size={14} />
                                                ) : existingContact ? (
                                                    <>
                                                        <UserCheck size={14} strokeWidth={2.5} />
                                                        <span>Chat</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus size={14} strokeWidth={2.5} />
                                                        <span>Connect</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-3 bg-[#EEF7EC] border-t-[2.5px] border-[#202020] flex items-center justify-between text-xs font-extrabold text-[#536D6B]">
                            <span>{searchResults.length} user(s) available</span>
                            <button
                                onClick={() => setShowSearchModal(false)}
                                className="hover:underline text-[#202020]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
