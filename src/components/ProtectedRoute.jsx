import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useChat();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#F2FFDF] flex flex-col items-center justify-center gap-4 text-[#202020]">
        <Loader2 className="animate-spin text-[#202020]" size={36} strokeWidth={2.5} />
        <span className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
          Authenticating workspace...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
