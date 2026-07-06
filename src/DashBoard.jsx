import React, { useState, useEffect } from 'react';
import { Car, Search, Plus, Bell, User, LogOut, Menu, X, Home, Compass, Clock, DollarSign, Settings, Star, Calendar } from 'lucide-react';
import AddRide from './AddRide';
import SearchRide from './SearchRide';
import UpcomingRides from './UpcomingRides';
import Profile from './Profile';
import Chat from './Chat';
import {jwtDecode} from 'jwt-decode';
import RideHistory from './RideHistory';

export default function CarpoolDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [selectedRideInfo, setSelectedRideInfo] = useState(null);
  const [co2Emission, setCo2Emission]=useState(null);
  const [totalrides, setTotalRides]=useState(null);
  const [savings, setSavings]= useState(null);
  const handleChatClick = (rideId, rideInfo) => {
    console.log('Opening chat for ride:', rideId);
    setSelectedRideId(rideId);
    setSelectedRideInfo(rideInfo);
    setActiveView('chat');
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    const decoded = jwtDecode(token);
    console.log("Decoded user:", decoded);
  }, []);

  console.log("DASHBOARD RENDERS",{loading});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user/me`,{
          headers:{
            Authorization:`Bearer ${token}`,
          },
        });
        if(!res.ok) throw new Error("failed to fetch user");
        const user = await res.json();
        setUserData(user);
        
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/ride/getList`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch rides");
        }

        const rides = await response.json();
        setUpcomingRides(rides);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  console.log("DASHBOARD RENDERS",{loading});

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getDisplayName = () => {
    return userData?.displayName || 
           userData?.username || 
           localStorage.getItem('displayUsername')?.split('@')[0] || 
           'User';
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  useEffect(() => {
  const getStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/total_trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":"application/json",
        },
      });
      const data = await response.json(); 
      console.log(data);
      setUserStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  getStats();
}, []);

useEffect(()=>{
  const getCo2=async()=>{
    try{
      const token=localStorage.getItem("token");
      const response=await fetch(`${import.meta.env.VITE_API_URL}/user/co2`,{
        headers:{
          Authorization: `Bearer ${token}`,
          "Context-Type":"application/json",
        },
      });
      const data= await response.json();
      console.log(data);
      setCo2Emission(data);
    }catch(error){
      console.log("Error fetching co2 emmision",error);
    }
  };
  getCo2();
},[]);

useEffect(()=>{
  const getTotalRides= async()=>{
    try{
      const token=localStorage.getItem("token");
      const response=await fetch(`${import.meta.env.VITE_API_URL}/user/total_trips`,{
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type":"application/json",
        },
      });
      const data=await response.json();
      setTotalRides(data);
    }catch(error){
      console.log("error fetching total rides",error);
    }
  };
  getTotalRides();
},[]);

useEffect(()=>{
  const getSavings= async()=>{
    try{
      const token=localStorage.getItem("token");
      const response=await fetch(`${import.meta.env.VITE_API_URL}/user/savings`,{
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type":"application/json",
        },
      });
      const data=await response.json();
      setSavings(data);
    }catch(error){
      console.log("error fetching savings",error);
    }
  };
  getSavings();
},[]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#121212] border-r border-neutral-800 fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">CarpoolShare</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveView('searchRide')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeView === 'searchRide'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="font-medium">Explore Rides</span>
            </button>

             <button
              onClick={() => setActiveView('RideHistory')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeView === 'RideHistory'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="font-medium">My Activity</span>
            </button>
            
            
           { /* <button
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">My Activity</span>
            </button> */}
            
          { /* <button
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Earnings</span>
            </button> */}
            
            <button
              onClick={() => setActiveView('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeView === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center space-x-3 px-4 py-3 bg-neutral-800 rounded-lg">
            <div className="w-10 h-10 bg-neutral-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm truncate">
                {userData.displayUsername}
              </div>
              <div className="text-neutral-400 text-xs">Premium Member</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-neutral-400 hover:text-white p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <button className="w-full mt-3 p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-all">
            <div className="w-8 h-8 mx-auto bg-white rounded-full" />
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#121212] border-b border-neutral-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">RideLink</h1>
          </div>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-neutral-300 p-2"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      
        {menuOpen && (
          <div className="bg-[#121212] border-t border-neutral-800 p-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setMenuOpen(false);
                }}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('searchRide');
                  setMenuOpen(false);
                }}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
              >
                <Compass className="w-5 h-5" />
                <span>Explore Rides</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('profile');
                  setMenuOpen(false);
                }}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

    
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeView === 'dashboard' && (
            <div>
         
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {getGreeting()}, {userData.displayUsername}
                </h2>
                <p className="text-neutral-400 text-lg">
                  Where shall your journey take you today?
                </p>
              </div>

             
              <div className="grid md:grid-cols-2 gap-6 mb-8">
               
                <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-blue-600 p-3 rounded-xl">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Host</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Offer a Ride</h3>
                  <p className="text-neutral-400 mb-6">
                    Share your journey, offset costs, and meet new professionals on your commute.
                  </p>
                  <button
                    onClick={() => setActiveView('addRide')}
                    className="w-full bg-white text-black font-semibold py-3 px-6 rounded-xl hover:bg-neutral-100 transition-all"
                  >
                    Create Trip
                  </button>
                </div>

                {/* Find a Journey Card */}
                <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-neutral-700 p-3 rounded-xl">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Guest</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Find a Journey</h3>
                  <p className="text-neutral-400 mb-6">
                    Browse available routes and book your seat in a comfortable, shared ride.
                  </p>
                  <button
                    onClick={() => setActiveView('searchRide')}
                    className="w-full bg-transparent border-2 border-neutral-700 text-white font-semibold py-3 px-6 rounded-xl hover:bg-neutral-800 transition-all"
                  >
                    Search Routes
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-neutral-800">
                  <div className="text-neutral-500 text-xs uppercase tracking-wider mb-2">
                    Total Trips
                  </div>
                  <div className="flex items-end space-x-2">
                    <div className="text-4xl font-bold text-white">
                      {totalrides}
                    </div>
                    <div className="text-green-500 text-sm font-medium mb-1">
                      +3 this week
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-neutral-800">
                  <div className="text-neutral-500 text-xs uppercase tracking-wider mb-2">
                    Contribution 
                  </div>
                  <div className="flex flex-col">
                    <div className="text-4xl font-bold text-white">
                     {co2Emission}
                    </div>
                    <div className="text-neutral-500 text-xs">
                      CO<sub>2</sub> saved
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-neutral-800">
                  <div className="text-neutral-500 text-xs uppercase tracking-wider mb-2">
                    User Rating
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-4xl font-bold text-white">
                      {userStats?.rating || '4.9'}
                    </div>
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
c
                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-neutral-800">
                  <div className="text-neutral-500 text-xs uppercase tracking-wider mb-2">
                    Total Savings
                  </div>
                  <div className="text-4xl font-bold text-white">
                    ₹ 1567

                  </div>
                </div>
              </div>

              {/* Upcoming Journeys */}
              <div className="bg-[#1a1a1a] rounded-2xl border border-neutral-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Upcoming Journeys</h3>
                  <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">
                    View all schedule
                  </button>
                </div>

                {upcomingRides.length > 0 ? (
                 <UpcomingRides 
              rides={upcomingRides} 
              onNavigate={setActiveView}
              userData={userData}
              onChatClick={handleChatClick}
            />
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-neutral-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      No journeys scheduled
                    </h4>
                    <p className="text-neutral-400 mb-6">
                      Your calendar is clear. Start by offering a ride or finding a partner for your next trip.
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={() => setActiveView('searchRide')}
                        className="bg-white text-black font-medium px-6 py-2 rounded-lg hover:bg-neutral-100 transition-all"
                      >
                        Quick Find
                      </button>
                      <button
                        onClick={() => setActiveView('addRide')}
                        className="bg-neutral-800 text-white font-medium px-6 py-2 rounded-lg hover:bg-neutral-700 transition-all"
                      >
                        Add Event
                      </button>
                    </div>
                  </div>
                )}
              </div>

            
              
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

           {activeView === 'RideHistory' && (
            <RideHistory onBack={() => setActiveView('dashboard')} />
          )}

          {activeView === 'chat' && selectedRideId && (
            <Chat
              rideId={selectedRideId}
              rideInfo={selectedRideInfo}
              onClose={() => setActiveView('dashboard')}
            />
          )}
        </div>
      </main>
    </div>
  );
}