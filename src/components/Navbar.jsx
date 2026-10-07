import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { useChat } from "../context/ChatContext";

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useChat();

    const isCurrentPage = (path) => location.pathname === path;

    return (
        <header className="w-full px-6 md:px-10 py-5 max-w-7xl mx-auto flex items-center justify-between sticky top-0 z-50 bg-[#F2FFDF]/95 backdrop-blur-md border-b-[2.5px] border-[#202020] mb-6">
            {/* Brand / Logo */}
            <Link
                to="/"
                className="flex items-center gap-3 group cursor-pointer"
            >
                <div className="w-11 h-11 bg-[#C4F1F7] border-[2.5px] border-[#202020] rounded-xl flex items-center justify-center shadow-[3px_3px_0px_#202020] group-hover:rotate-6 transition-transform">
                    <MessageSquare
                        className="w-6 h-6 text-[#202020]"
                        fill="#F2FFDF"
                        strokeWidth={2.5}
                    />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-[#202020] font-['Space_Grotesk']">
                    Chat
                    <span className="bg-[#C9BDF2] px-2 py-0.5 border-[2px] border-[#202020] rounded-md ml-1 text-lg">
                        App
                    </span>
                </span>
            </Link>

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-10 font-extrabold text-base text-[#202020]">
                <a
                    href="#features"
                    className="hover:text-[#536D6B] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2.5px] after:bg-[#202020] hover:after:w-full after:transition-all"
                >
                    Features
                </a>
                <a
                    href="#about"
                    className="hover:text-[#536D6B] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2.5px] after:bg-[#202020] hover:after:w-full after:transition-all"
                >
                    About
                </a>
                <Link
                    to="/login"
                    className={`hover:text-[#536D6B] transition-colors relative py-1 ${isCurrentPage("/login") ? "underline underline-offset-8 decoration-3" : ""}`}
                >
                    Login
                </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/chat")}
                        className="text-sm font-extrabold px-6 py-3"
                    >
                        Open App <ArrowRight size={18} strokeWidth={2.5} />
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/login")}
                        className="text-sm font-extrabold px-6 py-3"
                    >
                        Get Started <ArrowRight size={18} strokeWidth={2.5} />
                    </Button>
                )}
            </div>
        </header>
    );
};
