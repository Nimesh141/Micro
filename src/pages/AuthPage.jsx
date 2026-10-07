import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AuthIllustration } from '../components/GeometricShapes';
import { useChat } from '../context/ChatContext';

export const AuthPage = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useChat();

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      navigate('/chat');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setError('');
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  return (
    <div className="min-h-screen page-auth flex flex-col font-['Plus_Jakarta_Sans'] text-[#202020] relative overflow-hidden">
      
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 bg-grid-dots opacity-40 pointer-events-none" />

      {/* Top Header */}
      <header className="w-full px-6 md:px-10 py-6 max-w-7xl mx-auto flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#C4F1F7] border-[2.5px] border-[#202020] rounded-xl flex items-center justify-center shadow-[3px_3px_0px_#202020]">
            <MessageSquare className="w-5 h-5 text-[#202020]" fill="#F2FFDF" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-xl tracking-tight font-['Space_Grotesk'] text-[#202020]">
            ChatApp
          </span>
        </Link>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </Button>
      </header>

      {/* Main Two-Column Auth Layout */}
      <main className="flex-1 max-w-6xl mx-auto px-6 md:px-10 py-10 w-full flex items-center justify-center relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 w-full items-center">
          
          {/* Left Column: Headline & Geometric Illustration */}
          <div className="lg:col-span-6 flex flex-col justify-center gap-8">
            <div className="space-y-4">
              <div className="geo-badge">
                <Sparkles size={16} />
                <span>{mode === 'login' ? 'Welcome Back' : 'Get Started Free'}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#202020] leading-tight font-['Space_Grotesk']">
                {mode === 'login' ? 'Welcome Back.' : 'Create Account.'}
              </h1>
              
              <p className="text-base md:text-lg font-bold text-[#536D6B] max-w-md leading-relaxed">
                {mode === 'login'
                  ? 'Your conversations are waiting for you.'
                  : 'Join thousands having clear, distraction-free conversations everyday.'}
              </p>
            </div>

            {/* Geometric Illustration */}
            <div className="w-full flex justify-center py-4">
              <AuthIllustration />
            </div>
          </div>

          {/* Right Column: Clean Authentication Card */}
          <div className="lg:col-span-6 flex justify-center">
            
            <div className="w-full max-w-md bg-white border-[3px] border-[#202020] rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_#202020] relative space-y-7">
              
              {/* Corner Badge */}
              <div className="absolute -top-4 right-8 bg-[#C9BDF2] border-[2px] border-[#202020] px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-[#202020] shadow-[2px_2px_0px_#202020]">
                {mode === 'login' ? 'Auth / Login' : 'Auth / Sign Up'}
              </div>

              <div>
                <h2 className="text-3xl font-extrabold font-['Space_Grotesk'] text-[#202020]">
                  {mode === 'login' ? 'Log in' : 'Sign up'}
                </h2>
                <p className="text-xs md:text-sm font-bold text-[#536D6B] mt-2">
                  Enter your credentials below to access your chat workspace.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {mode === 'signup' && (
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={User}
                    required
                  />
                )}

                <Input
                  label="Email address"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  required
                />

                {mode === 'login' && (
                  <div className="flex justify-end pt-1">
                    <button 
                      type="button" 
                      onClick={() => alert("Password reset is available via backend API.")}
                      className="text-xs font-extrabold text-[#536D6B] hover:text-[#202020] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <div className="p-3.5 bg-red-100 border-[2.5px] border-red-500 rounded-xl text-xs font-bold text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Authenticating...
                    </span>
                  ) : mode === 'login' ? (
                    'Log In →'
                  ) : (
                    'Sign Up →'
                  )}
                </Button>
              </form>

              {/* Toggle */}
              <div className="pt-6 border-t-[2.5px] border-[#202020]/20 text-center">
                <p className="text-xs md:text-sm font-bold text-[#536D6B]">
                  {mode === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button 
                        type="button" 
                        onClick={toggleMode}
                        className="text-[#202020] font-extrabold underline underline-offset-4 hover:text-[#536D6B]"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button 
                        type="button" 
                        onClick={toggleMode}
                        className="text-[#202020] font-extrabold underline underline-offset-4 hover:text-[#536D6B]"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs md:text-sm font-extrabold text-[#536D6B] relative z-10">
        Protected with 256-bit geometric security &amp; JWT Bearer authentication.
      </footer>
    </div>
  );
};
