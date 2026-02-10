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
      const response = await fetch('http://localhost:8080/public/login', {
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
      
      const response = await fetch('http://localhost:8080/public/sign-up', {
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
      <div className="bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-black p-8 border-b border-neutral-800">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-white p-3 rounded-lg mr-3">
              <Car className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              CarpoolShare
            </h1>
          </div>
          <p className="text-center text-neutral-400 text-sm">Smart Carpooling System</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex border-b border-neutral-800">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-4 font-semibold transition-all ${
              isLogin
                ? 'text-white border-b-2 border-white bg-neutral-800'
                : 'text-neutral-500 hover:bg-neutral-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 py-4 font-semibold transition-all ${
              !isLogin
                ? 'text-white border-b-2 border-white bg-neutral-800'
                : 'text-neutral-500 hover:bg-neutral-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mt-6 p-3 bg-red-900/20 border border-red-900 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                    placeholder="johndoe"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
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
                <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="mr-2 accent-white" />
                <span className="text-neutral-400">Remember me</span>
              </label>
              <button className="text-white hover:text-neutral-300 transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full bg-white text-black py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-200'
            }`}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        
         {/* <button type="button"  onClick={() => alert("BUTTON CLICKED")}  className={`w-full bg-white text-black py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-200'
            }`}
            > TEST CLICK </button> */}

        </div>
          


        {/* Footer */}
        <div className="px-8 pb-8 text-center text-sm text-neutral-400">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="text-white font-semibold hover:text-neutral-300 transition-colors"
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
                className="text-white font-semibold hover:text-neutral-300 transition-colors"
              >
                Login here
              </button>
            </p>
          )}
        </div>

        {/* Backend Connection Status */}
        <div className="px-8 pb-4 text-center">
          <p className="text-xs text-neutral-500">
            Backend: http://localhost:8080/public
          </p>
        </div>
      </div>
    </div>
  );
}