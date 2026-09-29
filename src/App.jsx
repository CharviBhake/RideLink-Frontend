import React, { useState } from 'react';
import { Car, Mail, Lock, User, Phone } from 'lucide-react';

export default function CarpoolAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    console.log("HANDLE SUBMIT CALLED");
  setError('');
  setLoading(true);

  try {
    if (isLogin) {
      // LOGIN
      console.log("ABOUT TO CALL LOGIN API");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/public/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,   // ✅ email used as username
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log("LOGIN TOKEN:", data.token);

      // ✅ store ONLY raw JWT
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', formData.email);

      alert('Login successful!');
      window.location.href = '/dashboard';

    } else {
      // SIGN UP
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match!');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/public/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,   // ✅ email as username
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      console.log("SIGNUP TOKEN:", data.token);

      // ✅ store ONLY raw JWT
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', formData.email);

      alert('Account created successfully!');
      window.location.href = '/dashboard';
    }

  } catch (error) {
    console.error('AUTH ERROR:', error.message);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

 return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl h-[650px] rounded-3xl overflow-hidden shadow-2xl flex">
        
        {/* Left side — Welcome panel with abstract shapes */}
        <div className="hidden md:flex flex-col justify-center w-1/2 p-16 relative bg-gradient-to-br from-neutral-950 via-teal-950 to-neutral-900 overflow-hidden">
          
          {/* Abstract shapes */}
          <div className="absolute top-10 left-16 w-2 h-16 bg-teal-500 rounded-full" />
          <div className="absolute top-10 left-24 w-2 h-16 bg-teal-500/60 rounded-full" />
          
          <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-10 w-40 h-40 border border-teal-500/20 rounded-full" />
          <div className="absolute bottom-24 left-10 w-24 h-24 border-2 border-teal-500/30 rotate-45" />
          <div className="absolute top-1/4 left-1/3 w-20 h-20 border border-teal-500/20 rounded-full" />

          {/* Content */}
          <div className="relative z-10">
            <div className="bg-teal-500 p-3 rounded-lg mb-8 w-fit">
              <Car className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-6xl font-bold text-white mb-2">
              RideLink
            </h1>
            <div className="w-16 h-1 bg-teal-500 my-6" />
            <p className="text-neutral-400 text-lg max-w-sm">
              A smart and quick carpooling system — share your journey, offset costs, and move together.
            </p>
          </div>
        </div>

        {/* Right side — Auth card */}
        <div className="w-full md:w-1/2 bg-neutral-900/80 backdrop-blur-xl flex flex-col justify-center p-8 md:p-16 relative">
          
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            {/* Toggle Buttons */}
            <div className="flex mb-8 border-b border-white/10">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className={`flex-1 pb-3 font-semibold text-lg transition-all ${
                  isLogin
                    ? 'text-white border-b-2 border-teal-500'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className={`flex-1 pb-3 font-semibold text-lg transition-all ${
                  !isLogin
                    ? 'text-white border-b-2 border-teal-500'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-900/20 border border-red-900 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-neutral-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent text-neutral-200 placeholder-neutral-600"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent text-neutral-200 placeholder-neutral-600"
                      placeholder="johndoe"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-neutral-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent text-neutral-200 placeholder-neutral-600"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-neutral-500" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent text-neutral-200 placeholder-neutral-600"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2 accent-teal-500" />
                    <span className="text-neutral-400">Remember me</span>
                  </label>
                  <button className="text-teal-400 hover:text-teal-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full bg-gradient-to-r from-teal-500 to-teal-400 text-white py-3 rounded-full font-semibold transition-all transform hover:scale-[1.02] ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-teal-400 hover:to-teal-300'
                }`}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-neutral-400">
              {isLogin ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                    }}
                    className="text-teal-400 font-semibold hover:text-teal-300 transition-colors"
                  >
                    Sign up now
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                    }}
                    className="text-teal-400 font-semibold hover:text-teal-300 transition-colors"
                  >
                    Login here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}