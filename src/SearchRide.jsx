import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Users, User } from 'lucide-react';

const SearchRide = ({ onBack }) => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    console.log('Searching rides:', formData);
    alert('Searching for rides... (Demo)');
  };

  // Sample search results
  const searchResults = [
    {
      id: 1,
      driver: {
        name: 'Sarah Johnson',
        rating: '4.9',
        rides: 43
      },
      time: '10:30 AM',
      seatsLeft: 2,
      price: 250
    },
    {
      id: 2,
      driver: {
        name: 'Mike Chen',
        rating: '4.7',
        rides: 28
      },
      time: '2:00 PM',
      seatsLeft: 3,
      price: 200
    }
  ];

  return (
    <div>
      <button 
        onClick={onBack}
        className="text-white hover:text-neutral-300 mb-6 flex items-center"
      >
        ← Back to Dashboard
      </button>
      
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 max-w-2xl">
        <h2 className="text-3xl font-bold text-white mb-6">Find a Ride</h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                placeholder="Starting location"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200 placeholder-neutral-600"
                placeholder="Destination"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-neutral-200 transition-all transform hover:scale-[1.02] mt-6"
          >
            Search Rides
          </button>
        </div>

        {/* Search Results */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">Available Rides</h3>
          
          {searchResults.map(result => (
            <div 
              key={result.id}
              className="bg-black p-5 rounded-lg border border-neutral-800 hover:border-neutral-600 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mr-3 border border-neutral-700">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{result.driver.name}</div>
                    <div className="text-sm text-neutral-400">
                      ⭐ {result.driver.rating} ({result.driver.rides} rides)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">₹{result.price}</div>
                  <div className="text-sm text-neutral-400">per seat</div>
                </div>
              </div>
              <div className="flex items-center text-neutral-300 text-sm space-x-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> {result.time}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" /> {result.seatsLeft} seats left
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchRide;