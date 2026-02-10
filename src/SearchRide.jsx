import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Users, User } from 'lucide-react';

const SearchRide = ({ onBack }) => {
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    rideDate: '',
    time:''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingRide, setBookingRide] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
  setLoading(true);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/SearchRides/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        rideDate: formData.rideDate,
        time:formData.time
      }),
    });

    if (response.ok) {
      const rides = await response.json(); // ✅ List<Ride>
      setSearchResults(rides);

      if (rides.length === 0) {
        alert('No rides found for your search criteria');
      }
    } else {
      const err = await response.text();
      alert('Error searching rides: ' + err);
    }
  } catch (error) {
    console.error('Error searching rides:', error);
    alert('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleBookClick = (ride) => {
    setBookingRide(ride);
    setSeatsToBook(1);
  };
  const handleBookConfirm = async () => {
    const token = localStorage.getItem('token');
  
    try {
      const rideId=bookingRide.id;
      const response = await fetch(`http://localhost:8080/booking/${rideId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        //  rideId: bookingRide.id,
      
          seats: seatsToBook
        })
      });

      if (response.ok) {
        const message = await response.text();
        alert(`${message}`);
        alert(`✅ Ride booked successfully!\nBooking ID: ${bookingRide.id}\nTotal: ₹${booking.totalAmount}`);
        setBookingRide(null);
        // Refresh search results
        handleSearch();
      } else {
        const error = await response.json();
        alert('❌ Booking failed: ' + (error.message || 'Please try again'));
      }
    } catch (error) {
      console.error('Error booking ride:', error);
      alert('Network error. Please try again.');
    }
  };

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
                name="startLocation"
                value={formData.startLocation}
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
                name="endLocation"
                value={formData.endLocation}
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
                name="rideDate"
                value={formData.rideDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200"
              />
            </div>
          </div>
         
      { /*  <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Time</label>
          <div className="relative">
          <Clock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
          <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-neutral-200"
           />
           </div>
           </div>
           */}

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-neutral-200 transition-all transform hover:scale-[1.02] mt-6"
          >
            {loading ? 'Searching...' : 'Search Rides'}
          </button>
        </div>

        {/* Search Results */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            {searchResults.length > 0 ? `Found ${searchResults.length} rides` : 'Available Rides'}
          </h3>
          
          {searchResults.map(result => (
            <div 
              key={result.id}
              className="bg-black p-5 rounded-lg border border-neutral-800 hover:border-neutral-600 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mr-3 border border-neutral-700">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">
                      {result.driver?.username || 'Driver'}
                    </div>
                    <div className="text-sm text-neutral-400">
                      ⭐ {result.driver?.rating || '5.0'} 
                      ({result.driver?.rides || 0} rides)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">₹{result.pricePerSeat}</div>
                  <div className="text-sm text-neutral-400">per seat</div>
                </div>
              </div>
              
              <div className="flex items-center text-neutral-300 text-sm space-x-4 mb-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> {result.departureTime}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" /> {result.availableSeats} seats left
                </span>
              </div>

              <button
                onClick={() => handleBookClick(result)}
                className="w-full bg-white hover:bg-neutral-200 text-black py-2 px-4 rounded-lg font-semibold transition-all"
              >
                Book This Ride
              </button>
            </div>
          ))}
        </div>
      </div>

      {bookingRide && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 w-full max-w-md p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Confirm Booking</h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-black rounded-lg p-4 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-400">Route</span>
                  <span className="text-white font-semibold">
                    {bookingRide.startLocation} → {bookingRide.endLocation}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-400">Date & Time</span>
                  <span className="text-white">{bookingRide.rideDate} at {bookingRide.departureTime}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-400">Driver</span>
                  <span className="text-white">{bookingRide.driver.username || 'Driver'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Price per seat</span>
                  <span className="text-white font-semibold">₹{bookingRide.pricePerSeat}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Number of Seats
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSeatsToBook(Math.max(1, seatsToBook - 1))}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white w-10 h-10 rounded-lg font-bold transition-all"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={seatsToBook}
                    onChange={(e) => setSeatsToBook(Math.min(bookingRide.availableSeats || 4, Math.max(1, parseInt(e.target.value) || 1)))}
                    min="1"
                    max={bookingRide.availableSeats || 4}
                    className="flex-1 bg-black border border-neutral-800 rounded-lg px-4 py-2 text-white text-center"
                  />
                  <button
                    onClick={() => setSeatsToBook(Math.min(bookingRide.availableSeats || 4, seatsToBook + 1))}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white w-10 h-10 rounded-lg font-bold transition-all"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Available seats: {bookingRide.availableSeats || bookingRide.totalSeatsS}
                </p>
              </div>

              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Total Amount</span>
                  <span className="text-2xl font-bold text-white">
                    ₹{(bookingRide.pricePerSeat * seatsToBook).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setBookingRide(null)}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBookConfirm}
                className="flex-1 bg-white hover:bg-neutral-200 text-black py-3 rounded-lg font-semibold transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    

  );
};

export default SearchRide;