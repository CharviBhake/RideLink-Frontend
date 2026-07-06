import React, { useState, useEffect, use } from 'react';
import { User, Star, MapPin } from 'lucide-react';

const RideHistory = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('passenger'); // 'driver' or 'passenger'
  const [rideHistory, setRideHistory] = useState({ asDriver: [], asPassenger: [] });
  const [stats, setStats] = useState({ totalSavings: 0, carbonOffset: 0, topDestination: null, totalRides: 0 });
  const [loading, setLoading] = useState(true);
  const [savings,setSavings] =useState(null);
  const [myReviews,setMyReviews]=useState({});
  const [reviewd,setReviewd] =useState({});
  const [tempRating, setTempRating] = useState("");
const [tempComment, setTempComment] = useState("");

  useEffect(() => {
    fetchRideHistory();
  }, [activeTab]); // Refetch when tab changes

  const fetchRideHistory = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    
    try {
        console.log("Active tab",activeTab);
      if (activeTab === 'driver') {
        // Fetch rides where user was driver

        console.log("Calling history driver api");
        const response = await fetch('http://localhost:8080/ride/history/driver', {
          headers: {
             Authorization: `Bearer ${token}`,
            "Content-Type":"application/json",
          }
        });
        console.log("response status:",response.status);
        if (response.ok) {
          const data = await response.json();
          setRideHistory(prev => ({ ...prev, asDriver: data }));
        //  const totalEarnings=rides.reduce((sum,ride)=>sum+(ride.pricePerSeat || 0),0)
        const rides=data || [];
        setStats({
            totalSavings: 0,
            carbonOffset: 0,
            topDestination: rides[0]?.to || 'Tech District',
            totalRides: rides.length
          });

        // Update driver stats
         { /* setStats({
            totalSavings: data.totalEarnings || 0,
            carbonOffset: data.carbonOffset || 0,
            topDestination: data.topDestination,
            totalRides: data.rides.size
          }); */}
        }
      } else {
        // Fetch rides where user was passenger
        console.log("calling passengr api history")
        const response = await fetch('http://localhost:8080/ride/history/passenger', {
          headers: {
             Authorization: `Bearer ${token}`,
            "Content-Type":"application/json",
          }
        });
        console.log("response status",response.status);
        if (response.ok) {
          const data = await response.json();
          setRideHistory(prev => ({ ...prev, asPassenger: data }));
          console.log(data);
          // Update passenger stats
        { /* setStats({
            totalSavings: data.totalSavings || 0,
            carbonOffset: data.carbonOffset || 0,
            topDestination: data.topDestination,
            totalRides: data.rides.size
          });  */}
        }
      }
    } catch (error) {
      console.error('Error fetching ride history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const getSavings= async()=>{
      try{
        const token=localStorage.getItem("token");
        const response=await fetch("http://localhost:8080/ride/savings",{
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

  useEffect(()=>{
    const fetchReviews=async()=>{
      try{
        const token=localStorage.getItem("token");
        const res=await fetch("https://localhost:8080/review/my",{
          headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type":"application/json",
          },
        });
        const data=await res.json();
        setMyReviews(data);

      }catch(error){
        console.log("error fetching my revies");
      }
    };
    fetchReviews();
  },[]);

  const submitReview = async (rideId,rating,comment) => {
  const token = localStorage.getItem("token");
  await fetch("http://localhost:8080/review", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rideId,
      rating: Number(tempRating), // keep fixed for now (fast)
      comment: tempComment,
    }),
  });
  setMyReviews(prev => ({
  ...prev,
  [rideId]: Number(tempRating)
}));
   setTempComment("");
   setTempComment("");

  alert("Review submitted");
};

  const rides = activeTab === 'driver' ? rideHistory.asDriver : rideHistory.asPassenger;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">Ride History</h1>
            <p className="text-neutral-400">Track your movement and environmental savings.</p>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('driver')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'driver'
                  ? 'bg-neutral-800 text-white'
                  : 'bg-transparent text-neutral-400 hover:text-white'
              }`}
            >
              As Driver
            </button>
            <button
              onClick={() => setActiveTab('passenger')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'passenger'
                  ? 'bg-purple-600 text-white'
                  : 'bg-transparent text-neutral-400 hover:text-white'
              }`}
            >
              As Passenger
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Cumulative Savings */}
          <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
              Cumulative Savings
            </div>
            <div className="text-4xl font-bold text-green-500 mb-1">
              ${stats.totalSavings.toFixed(2)}
            </div>
            <div className="text-sm text-neutral-400">
              Total across {stats.totalRides} rides
            </div>
          </div>

          {/* Carbon Offset */}
          <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
              Carbon Offset
            </div>
            <div className="text-4xl font-bold text-blue-500 mb-1">
              {stats.carbonOffset} kg
            </div>
            <div className="text-sm text-neutral-400">
              CO2 emissions avoided
            </div>
          </div>

          {/* Top Destination */}
          <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
              Top Destination
            </div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-lg">🏢</span>
              </div>
              <div className="text-xl font-bold text-white">
                {stats.topDestination || 'Tech District'}
              </div>
            </div>
            <div className="text-sm text-neutral-400">
              18 visits this month
            </div>
          </div>
        </div>

        {/* Recent Journeys */}
        <div className="mb-6">
          <h2 className="text-sm text-neutral-500 uppercase tracking-wider mb-4">
            Recent Journeys
          </h2>
        </div>

        {/* Ride List */}
     {loading ? (
  <div className="text-center py-20">
    <div className="text-neutral-400">Loading ride history...</div>
  </div>
) : rides && rides?.length > 0 ? (

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    
    {rides.map((ride) => (
      
      <div
        key={ride.id}
        className="bg-neutral-900 rounded-xl p-5 border border-neutral-800 hover:border-neutral-700 transition-all aspect-square flex flex-col justify-between"
      >
        
        {/* 🔝 TOP SECTION */}
        <div>

          {/* Ride Date */}
          <div className="text-sm text-neutral-400 uppercase mb-1 flex items-center gap-2">
            📅 Ride Date
          </div>
          <div className="text-white text-xl lg:text-2xl font-semibold mb-4">
            {ride.rideDate}
          </div>

          {/* Price / Profit */}
          <div className="text-sm text-neutral-400 uppercase mb-1">
            PROFIT
          </div>
          <div className="text-green-500 text-3xl  font-bold mb-4">
            + ₹{ride.pricePerSeat || '0.00'}
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-600 my-3"></div>

          {/* FROM */}
          <div className="mb-3">
             <MapPin className="w-5 h-5 mr-2 text-neutral-400" />
            <div className="text-xs text-neutral-400 uppercase mb-1 flex items-center gap-2">
              🟢 From
            </div>
            <div className="text-white font-medium">
              {ride.startlocation}
            </div>
          </div>

          {/* TO */}
          <div>
            <MapPin className="w-5 h-5 mr-2 text-neutral-400" />
            <div className="text-xs text-neutral-400 uppercase mb-1 flex items-center gap-2">
              🔴 To
            </div>
            <div className="text-white font-medium">
              {ride.endLocation}
            </div>
          </div>
        </div>

        {/* 🔻 BOTTOM SECTION */}
        <div className="border-t border-neutral-600 pt-3 flex justify-between items-center text-sm text-neutral-400">
          
          {/* Driver */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-700">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white-2xl">
              {ride.driver?.displayUsername || 'Driver'}
            </span>
          </div>

          {/* Rating */}
    { /*     {activeTab=='passenger' && (
       myReviews[ride.id] ? (
    <div className="text-white">⭐ {myReviews[ride.id]}</div>
  ) : (
    <button onClick={()=>submitReview(ride.id)}
    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm">
      Rate
    </button>
  )
)}  */}

       {activeTab === "passenger" && (
  myReviews[ride.id] ? (
    <div className="text-white">⭐ {myReviews[ride.id]}</div>
  ) : (
    <div className="flex flex-col gap-2">
      
      {/* ⭐ rating select */}
      <select
        onChange={(e) => setTempRating(e.target.value)}
        className="text-white rounded px-2 py-1"
      >
        <option className='text-black' value="">Rate</option>
        <option value="1">1 ⭐</option>
        <option value="2">2 ⭐</option>
        <option value="3">3 ⭐</option>
        <option value="4">4 ⭐</option>
        <option value="5">5 ⭐</option>
      </select>

      {/* ✍️ comment */}
      <input
        type="text"
        placeholder="Write review..."
        onChange={(e) => setTempComment(e.target.value)}
        className="text-white rounded px-2 py-1"
      />

      {/* submit */}
      <button
        onClick={() => submitReview(ride.id)}
        className="bg-blue-600  text-black px-3 py-1 rounded"
      >
        Submit
      </button>

    </div>
  )
)}
          
        </div>
      </div>
    ))}

  </div>

) : (
  <div className="text-center py-20">
    <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-800">
      <div className="w-12 h-12 border-4 border-neutral-700 border-t-neutral-500 rounded-full animate-spin"></div>
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">
      No archived rides found
    </h3>
    <p className="text-neutral-400 mb-2">
      It looks like you haven't completed any rides in this category
    </p>
    <p className="text-neutral-400 mb-6">
      recently. Ready to hit the road?
    </p>
    <button
      onClick={onBack}
      className="text-purple-500 hover:text-purple-400 font-semibold flex items-center gap-2 mx-auto"
    >
      Browse available rides →
    </button>
  </div>
)}
      </div>
    </div>
  );
};

export default RideHistory;