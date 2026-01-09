import React, { useState } from 'react';
import { Car, Search, Plus, Bell, User, LogOut, Menu, X } from 'lucide-react';
import AddRide from './AddRide';
import SearchRide from './SearchRide';
import UpcomingRides from './UpcomingRides';
import Profile from './Profile';

export default function CarpoolDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-lg mr-3">
                <Car className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-xl font-bold text-white">
                CarpoolShare
              </h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-neutral-300 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-all">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setActiveView('profile')}
                className="flex items-center space-x-3 px-4 py-2 bg-neutral-800 rounded-lg border border-neutral-700 hover:bg-neutral-700 transition-all"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-black" />
                </div>
                <span className="text-neutral-300">John Doe</span>
              </button>
              <button className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-neutral-300 p-2"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-neutral-800 p-4">
          <div className="space-y-2">
            <button className="w-full text-left text-neutral-300 hover:text-white p-3 rounded-lg hover:bg-neutral-800 transition-all flex items-center">
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </button>
            <button 
              onClick={() => {
                setActiveView('profile');
                setMenuOpen(false);
              }}
              className="w-full text-left text-neutral-300 hover:text-white p-3 rounded-lg hover:bg-neutral-800 transition-all flex items-center"
            >
              <User className="w-5 h-5 mr-3" />
              Profile
            </button>
            <button className="w-full text-left text-neutral-300 hover:text-white p-3 rounded-lg hover:bg-neutral-800 transition-all flex items-center">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Welcome back, John!</h2>
          
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div 
                onClick={() => setActiveView('addRide')}
                className="bg-white p-8 rounded-lg cursor-pointer hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-black p-4 rounded-lg">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-neutral-600 text-sm">Offer a ride</div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Add a Ride</h3>
                <p className="text-neutral-600">Share your journey and earn money by offering rides to others</p>
              </div>
              <div 
                onClick={() => setActiveView('searchRide')}
                className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 cursor-pointer hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <Search className="w-8 h-8 text-black" />
                  </div>
                  <div className="text-neutral-400 text-sm">Find a ride</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Search for Ride</h3>
                <p className="text-neutral-400">Find available rides to your destination and save money</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
                <div className="text-neutral-400 text-sm mb-1">Total Rides</div>
                <div className="text-3xl font-bold text-white">24</div>
              </div>
              <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
                <div className="text-neutral-400 text-sm mb-1">This Month</div>
                <div className="text-3xl font-bold text-white">8</div>
              </div>
              <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
                <div className="text-neutral-400 text-sm mb-1">Rating</div>
                <div className="text-3xl font-bold text-white">4.8</div>
              </div>
              <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
                <div className="text-neutral-400 text-sm mb-1">Saved</div>
                <div className="text-3xl font-bold text-white">₹2.4k</div>
              </div>
            </div>
            <UpcomingRides />
          </div>
        )}
        {activeView === 'addRide' && (
          <AddRide onBack={() => setActiveView('dashboard')} />
        )}

        {activeView === 'searchRide' && (
          <SearchRide onBack={() => setActiveView('dashboard')} />
        )}


        {activeView === 'profile' && (
          <Profile onBack={() => setActiveView('dashboard')} />
        )}
      </div>
    </div>
  );
}