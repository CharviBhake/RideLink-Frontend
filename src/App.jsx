import React, { useState } from 'react';
import { Car, Mail, Lock, User, Phone } from 'lucide-react';

export default function CarpoolAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = () => {
    if (isLogin) {
      console.log('Login:', { email: formData.email, password: formData.password });
      alert('Login successful! (Demo)');
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Sign Up:', formData);
      alert('Account created successfully! (Demo)');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 w-full max-w-md overflow-hidden">
  
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

        <div className="flex border-b border-neutral-800">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 font-semibold transition-all ${
              isLogin
                ? 'text-white border-b-2 border-white bg-neutral-800'
                : 'text-neutral-500 hover:bg-neutral-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 font-semibold transition-all ${
              !isLogin
                ? 'text-white border-b-2 border-white bg-neutral-800'
                : 'text-neutral-500 hover:bg-neutral-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-8 space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
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
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-neutral-200 transition-all transform hover:scale-[1.02]"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </div>

        <div className="px-8 pb-8 text-center text-sm text-neutral-400">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-white font-semibold hover:text-neutral-300 transition-colors"
              >
                Sign up now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-white font-semibold hover:text-neutral-300 transition-colors"
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}