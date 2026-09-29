import React, { useState, useEffect } from 'react';
//import { Car, Search, Plus, Bell, User, LogOut, Menu, X, Home, Compass, Clock, DollarSign, Settings, Star, Calendar } from 'lucide-react';
import AddRide from './AddRide';
import SearchRide from './SearchRide';
import UpcomingRides from './UpcomingRides';
import Profile from './Profile';
import Chat from './Chat';
import {jwtDecode} from 'jwt-decode';
import RideHistory from './RideHistory';
import { 
  Car, Home, Compass, Settings, User, LogOut, Menu, X, 
  Plus, Search, Star, Calendar, Zap, Sparkles, IndianRupee 
} from 'lucide-react';

export default function CarpoolDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] =useState(null);
  const [upcomingRides, setUpcomingRides]=useState([]);
  const [loading, setLoading]=useState(true);
  
  const [selectedRideId, setSelectedRideId]=useState(null);
  const [selectedRideInfo, setSelectedRideInfo]=useState(null);
  const [co2Emission, setCo2Emission]=useState(null);
  const [totalRides, setTotalRides]=useState(0);
  const [savings, setSavings]= useState(null);
  const [recentCoRiders, setRecentCoRiders]=useState([]);
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

 /* useEffect(() => {
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
}, []); */

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
      console.log("CO2 Emission:",data);
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
      if (!response.ok) throw new Error(`total_trips failed (${response.status})`);
      const data = await response.json();
      setTotalTrips(typeof data === "number" ? data : 0);
      
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



useEffect(() => {
  const getRecentCoRiders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/coRider`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // 404 = no co-riders found, treat as an empty list, not an error
      if (response.status === 404) {
        setRecentCoRiders([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch co-riders (${response.status})`);
      }

      const data = await response.json();
      // Only accept an array; anything else (like an error object) becomes []
      setRecentCoRiders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("error fetching co-riders", error);
      setRecentCoRiders([]);   // fallback so the UI shows "No co-riders yet"
    }
  };

  getRecentCoRiders();
}, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1116] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0d1116] flex">
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0d1116] border-r border-neutral-800 fixed h-full">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="bg-[#0d1116] p-2 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">CommuteMate</h1>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Eco Mobility Hub</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeView === 'dashboard'
                  ? 'bg-[#10B981] text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveView('searchRide')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeView==='searchRide'
                  ? 'bg-[#10B981] text-white'
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
                  ? 'bg-[#10B981] text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="font-medium">My Activity</span>
            </button>

            <button
              onClick={() => setActiveView('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeView === 'profile'
                  ? 'bg-[#10B981] text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center space-x-3 px-4 py-3 bg-neutral-800 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-[#10B981] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm truncate">
                {userData?.displayUsername || getDisplayName()}
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
        </div>
      </aside>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#121212] border-b border-neutral-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-[#10B981] p-2 rounded-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">CommuteMate</h1>
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
                onClick={() => { setActiveView('dashboard'); setMenuOpen(false); }}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => { setActiveView('searchRide'); setMenuOpen(false); }}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
              >
                <Compass className="w-5 h-5" />
                <span>Explore Rides</span>
              </button>
              <button
                onClick={() => { setActiveView('profile'); setMenuOpen(false); }}
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

      <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 relative overflow-hidden">
        <div className="absolute top-0 right-20 w-96 h-96 bg-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {activeView === 'dashboard' && (
            <div>
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Find your next ride, {userData?.displayUsername || getDisplayName()}
                </h2>
                <p className="text-neutral-400 text-lg">
                  Where shall your shared journey take you today?
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Offer a Ride Card */}
                <div className="relative bg-[#161c24] p-8 rounded-2xl border border-neutral-800 hover:border-[#10B981]/40 transition-all overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10B981] to-transparent" />
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-[#10B981] p-3 rounded-xl">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full">Host</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Offer a Ride</h3>
                  <p className="text-neutral-400 mb-6">
                    Share your journey, offset fuel costs, and meet verified professionals on your daily commute route.
                  </p>
                  <button
                    onClick={() => setActiveView('addRide')}
                    className="w-full bg-white text-black font-semibold py-3 px-6 rounded-xl hover:bg-neutral-100 transition-all"
                  >
                    Create Trip
                  </button>
                </div>

                <div className="bg-[#161c24] p-8 rounded-2xl border border-neutral-800 hover:border-[#10B981]/40 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-transparent border-2 border-[#10B981] p-3 rounded-xl">
                      <Search className="w-6 h-6 text-[#10B981]" />
                    </div>
                    <span className="text-xs text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full">Guest</span>
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <div className="bg-[#161c24] p-6 rounded-xl border border-neutral-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-neutral-500 text-xs uppercase tracking-wider">
                      Total Trips
                    </div>
                    <div className="bg-[#10B981]/10 p-1.5 rounded-lg">
                      <Zap className="w-3.5 h-3.5 text-[#10B981]" />
                    </div>
                  </div>
                  <div className="flex items-end space-x-2">
                    <div className="text-4xl font-bold text-white">
                      {totalRides}
                    </div>
                    <div className="text-green-500 text-sm font-medium mb-1 bg-green-500/10 px-2 py-0.5 rounded-full">
                      +3 this week
                    </div>
                  </div>
                </div>

                <div className="bg-[#161c24] p-6 rounded-xl border border-neutral-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-neutral-500 text-xs uppercase tracking-wider">
                      Contribution
                    </div>
                    <div className="bg-[#10B981]/10 p-1.5 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-[#10B981]">
                    {co2Emission}<span className="text-lg text-neutral-500 ml-1">kg</span>
                  </div>
                  <div className="text-neutral-500 text-xs mt-1">
                    Net CO<sub>2</sub> emissions prevented
                  </div>
                </div>

                <div className="bg-[#161c24] p-6 rounded-xl border border-neutral-800">
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

                <div className="bg-[#161c24] p-6 rounded-xl border border-neutral-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-neutral-500 text-xs uppercase tracking-wider">
                      Total Savings
                    </div>
                    <div className="bg-[#10B981]/10 p-1.5 rounded-lg">
                      <IndianRupee className="w-3.5 h-3.5 text-[#10B981]" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white">
                    ₹ 1,567
                  </div>
                  <div className="text-neutral-500 text-xs mt-1">Fuel costs offset</div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#161c24] rounded-2xl border border-neutral-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-white">Upcoming Rides</h3>
                      {upcomingRides.length > 0 && (
                        <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full font-medium">
                          {upcomingRides.length} Active
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-neutral-500">Next 7 days</span>
                  </div> {/*ONE DIV*/}

                  {upcomingRides.length > 0 ? (
                    <UpcomingRides
                      rides={upcomingRides}
                      onNavigate={setActiveView}
                      userData={userData}
                      onChatClick={handleChatClick}
                      
                    />
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-[#161c24] rounded-full flex items-center justify-center mx-auto mb-4">
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
                          className="bg-[#10B981] text-white font-medium px-6 py-2 rounded-lg hover:bg-emerald-400 transition-all"
                        >
                          Quick Find
                        </button>
                        <button
                          onClick={() => setActiveView('addRide')}
                          className="bg-transparent border-2 border-neutral-700 text-white font-medium px-6 py-2 rounded-lg hover:bg-neutral-800 transition-all"
                        >
                          Add Event
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-[#161c24] rounded-2xl border border-neutral-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Recent Co-riders</h3>
                    <button className="text-xs text-[#10B981] hover:text-emerald-400">View All</button>
                  </div>

                  {recentCoRiders && recentCoRiders.length > 0 ? (
                    <div className="space-y-4">
                      {recentCoRiders.map((coRider) => (
                        <div key={coRider.user.id} className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-[#10B981] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                            {coRider.user.displayUsername?.substring(0, 2).toUpperCase() || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-medium truncate">
                              {coRider.user.displayUsername}
                            </div>
                            <div className="text-neutral-500 text-xs">
                              Traveled {coRider.tripCount} times • {coRider.user.rating ?? "4.9"} ★
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-neutral-500 text-sm">No co-riders yet</p>
                    </div>
                  )}
                </div>
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