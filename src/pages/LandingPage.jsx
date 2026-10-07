import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { HeroIllustration, FeatureIcon } from '../components/GeometricShapes';
import { useChat } from '../context/ChatContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useChat();

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F2FFDF] page-landing flex flex-col font-['Plus_Jakarta_Sans'] text-[#202020] relative overflow-hidden">
      {/* Background Subtle Dot Pattern */}
      <div className="absolute inset-0 bg-grid-dots opacity-40 pointer-events-none" />

      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Hero Container */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-10 pt-4 pb-24 w-full flex flex-col justify-between relative z-10 space-y-20 md:space-y-28">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-6 md:my-14">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-8">
            
            {/* Editorial Pill Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#C9BDF2] border-[2.5px] border-[#202020] rounded-xl shadow-[3px_3px_0px_#202020]">
              <Sparkles size={18} strokeWidth={2.5} className="text-[#202020]" />
              <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#202020]">
                A Modern Messaging Experience
              </span>
            </div>

            {/* Main Bold Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#202020] leading-[1.06] tracking-tight font-['Space_Grotesk']">
              Connect. Chat. <br />
              <span className="relative inline-block mt-2">
                <span className="bg-[#C4F1F7] px-4 py-1.5 border-[3px] border-[#202020] rounded-2xl shadow-[5px_5px_0px_#202020]">
                  Stay Close.
                </span>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg md:text-xl text-[#3A4D4A] max-w-xl font-semibold leading-relaxed">
              A simple and friendly place to have meaningful conversations with the people who matter.
            </p>

            {/* Hero Actions */}
            <div className="flex flex-wrap items-center gap-5 pt-3">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/chat')}
              >
                Start Chatting <ArrowRight size={22} strokeWidth={2.5} />
              </Button>

              <Button 
                variant="white" 
                size="lg" 
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>

            {/* Quick Proof Badges */}
            <div className="flex flex-wrap items-center gap-8 pt-6 text-xs md:text-sm font-extrabold text-[#3A4D4A]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#202020]" />
                <span>No bloatware</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#202020]" />
                <span>End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#202020]" />
                <span>Instant Setup</span>
              </div>
            </div>

          </div>

          {/* Right Geometric Abstract Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <HeroIllustration />
          </div>

        </section>

        {/* Features Section */}
        <section id="features" className="pt-16 md:pt-20 pb-8 border-t-[2.5px] border-[#202020]">
          
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] tracking-tight">
              Designed for Clarity
            </h2>
            <p className="text-base font-bold text-[#536D6B] mt-2">
              Everything you need for daily communication, distilled to perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Feature 1 */}
            <div className="bg-white border-[2.5px] border-[#202020] rounded-2xl p-8 md:p-10 shadow-[6px_6px_0px_#202020] hover:translate-y-[-3px] transition-transform flex flex-col justify-between gap-6 min-h-[300px]">
              <FeatureIcon type="simple" />
              <div>
                <h3 className="text-2xl font-bold text-[#202020] mb-3 font-['Space_Grotesk']">
                  Simple Conversations
                </h3>
                <p className="text-base font-semibold text-[#4A6361] leading-relaxed">
                  Clean and distraction-free messaging tailored for thoughtful dialogue.
                </p>
              </div>
              <div className="pt-3">
                <span className="inline-block px-3 py-1.5 bg-[#C4F1F7] border-[2px] border-[#202020] rounded-lg text-xs font-extrabold uppercase text-[#202020]">
                  Distraction Free
                </span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border-[2.5px] border-[#202020] rounded-2xl p-8 md:p-10 shadow-[6px_6px_0px_#202020] hover:translate-y-[-3px] transition-transform flex flex-col justify-between gap-6 min-h-[300px]">
              <FeatureIcon type="secure" />
              <div>
                <h3 className="text-2xl font-bold text-[#202020] mb-3 font-['Space_Grotesk']">
                  Private &amp; Secure
                </h3>
                <p className="text-base font-semibold text-[#4A6361] leading-relaxed">
                  Your conversations stay protected with modern encryption and zero tracking.
                </p>
              </div>
              <div className="pt-3">
                <span className="inline-block px-3 py-1.5 bg-[#C9BDF2] border-[2px] border-[#202020] rounded-lg text-xs font-extrabold uppercase text-[#202020]">
                  Privacy First
                </span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border-[2.5px] border-[#202020] rounded-2xl p-8 md:p-10 shadow-[6px_6px_0px_#202020] hover:translate-y-[-3px] transition-transform flex flex-col justify-between gap-6 min-h-[300px]">
              <FeatureIcon type="connect" />
              <div>
                <h3 className="text-2xl font-bold text-[#202020] mb-3 font-['Space_Grotesk']">
                  Connect Easily
                </h3>
                <p className="text-base font-semibold text-[#4A6361] leading-relaxed">
                  Find people and start conversations quickly with instant search.
                </p>
              </div>
              <div className="pt-3">
                <span className="inline-block px-3 py-1.5 bg-[#F2FFDF] border-[2px] border-[#202020] rounded-lg text-xs font-extrabold uppercase text-[#202020]">
                  Instant Access
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Editorial Poster Banner / About Section */}
        <section id="about" className="p-10 md:p-14 bg-[#C9BDF2] border-[3px] border-[#202020] rounded-3xl shadow-[8px_8px_0px_#202020] flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl space-y-4">
            <span className="bg-white border-[2px] border-[#202020] px-3.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-widest text-[#202020]">
              Editorial Design
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] leading-tight text-[#202020]">
              Ready to experience a friendlier chat UI?
            </h3>
            <p className="text-base font-bold text-[#202020]/90">
              No clutter, no ads, just vibrant pastel design and instant real-time messaging.
            </p>
          </div>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => navigate('/chat')}
            className="whitespace-nowrap"
          >
            Launch Chat App →
          </Button>
        </section>

      </main>

      {/* Minimal Editorial Footer */}
      <footer className="w-full border-t-[2.5px] border-[#202020] py-8 bg-white/60 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6 font-extrabold text-xs md:text-sm text-[#536D6B]">
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 bg-[#C4F1F7] border-[2px] border-[#202020] rounded-sm"></span>
            <span>© 2026 ChatApp. Minimal Pastel Design System.</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#features" className="hover:text-[#202020]">Features</a>
            <a href="#about" className="hover:text-[#202020]">About</a>
            <span className="px-2.5 py-1 bg-[#F2FFDF] border border-[#202020] rounded-md text-[#202020]">v2.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
