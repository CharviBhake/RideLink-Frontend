
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Clock, User ,ChevronDown,ChevronUp} from 'lucide-react';


const RideCard = ({ ride, onChatClick ,userData}) => {
  const isDriver = ride.driver?.id === userData?.sub;
  const badgeColor = isDriver ? 'bg-white text-black' : 'bg-neutral-800 text-white border border-neutral-700';
  const borderHoverColor = isDriver ? 'hover:border-white' : 'hover:border-neutral-600';
  const primaryBtnColor = isDriver ? 'bg-white hover:bg-neutral-200 text-black' : 'bg-neutral-800 hover:bg-neutral-700 text-white';
 
  const [showBookings, setShowBookings] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
//console.log("ridedata:", ride.driver);
//console.log("driver id",ride.driver.id);
//console.log("userdata id",userData.id);
 const handleChatClick = () => {
    onChatClick?.(ride.id, {
      from: ride.startlocation,
      to: ride.endLocation,
      date: ride.rideDate,
      time: ride.departureTime,
    });
  }

  const fetchBookings = async () => {
    if (showBookings) {
      setShowBookings(false);
      return;
    }

    setLoadingBookings(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8080/booking/${ride.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
        setShowBookings(true);
      } else {
        alert('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8080/booking/${ride.id}/${bookingId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert(`Booking ${action}ed successfully!`);
        fetchBookings();
        fetchBookings(); // Toggle twice to refresh
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || `Failed to ${action} booking`));
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      alert('Network error. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'CONFIRMED':
      case 'ACTIVE':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-neutral-600/20 text-neutral-400 border-neutral-600/50';
    }
  };


  return (
    <div className={`bg-neutral-900 p-5 rounded-lg border border-neutral-800 ${borderHoverColor} transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`${badgeColor} text-xs font-semibold px-3 py-1 rounded-full`}>
              {isDriver ? "You're Driving" : "You're a Passenger"}
            </span>
          </div>
          <div className="flex items-center text-white font-semibold text-lg mb-2">
            <MapPin className="w-5 h-5 mr-2 text-neutral-400" />
            {ride.startlocation} → {ride.endLocation}
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-400 mb-3">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {ride.rideDate}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {ride.departureTime}
            </span>
            {isDriver && ride.filledSeats !== undefined && ride.totalSeats && (
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {ride.availableSeats}/{ride.totalSeats} seats available
              </span>
            )}
          </div>
          {!isDriver && ride.driver && (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center mr-3 border border-neutral-700">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">{ride.driver.username}</div>
                <div className="text-xs text-neutral-400">⭐ {ride.driver.rating || 'null'} • {ride.driver.car || 'Car'}</div>
              </div>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            ₹{ride.pricePerSeat || ride.amount || 0}
          </div>
          <div className="text-xs text-neutral-400">
            {isDriver ? 'Total earnings' : 'Your fare'}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={handleChatClick}
          className={`flex-1 ${primaryBtnColor} py-2 px-4 rounded-lg text-sm font-semibold transition-all`}
        >
          💬 Chat
        </button>
        {isDriver ? (
          <button 
            onClick={fetchBookings}
            disabled={loadingBookings}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all border border-neutral-700 flex items-center justify-center gap-2"
          >
            {loadingBookings ? 'Loading...' : (
              <>
                Check Bookings
                {showBookings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </>
            )}
          </button>
        ) : (
          <button 
            onClick={fetchBookings}
            disabled={loadingBookings}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all border ${getStatusColor(ride.bookingStatus)}`}
          >
            {loadingBookings ? 'Loading...' : (ride.bookingStatus || 'Pending')}
          </button>
        )}
      </div>

      {/* Bookings List (for drivers) */}
      {isDriver && showBookings && (
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <h4 className="text-white font-semibold mb-3 text-sm">Passenger Bookings</h4>
          
          {bookings.length === 0 ? (
            <div className="text-center py-4 text-neutral-500 text-sm">
              No bookings yet
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.map((booking) => (
                <div 
                  key={booking.id}
                  className="bg-black rounded-lg p-3 border border-neutral-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => onViewProfile && onViewProfile(booking.userId)}
                      className="flex items-center hover:text-blue-400 transition-colors"
                    >
                      <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center mr-2">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium text-sm">{booking.userName}</p>
                        <p className="text-xs text-neutral-400">{booking.seats} seat(s)</p>
                      </div>
                    </button>
                    
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleBookingAction(booking.id, 'CONFIRMED')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded text-xs font-semibold transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleBookingAction(booking.id, 'CANCELLED')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded text-xs font-semibold transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Details (for passengers) */}
      {!isDriver && showBookings && bookings.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <div className="bg-black rounded-lg p-3 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">Booking ID:</span>
              <span className="text-white text-sm font-mono">#{bookings[0].id}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">Seats Booked:</span>
              <span className="text-white text-sm">{bookings[0].seats}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm">Total Paid:</span>
              <span className="text-white text-sm font-semibold">₹{bookings[0].totalAmount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-sm">Status:</span>
              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(bookings[0].status)}`}>
                {bookings[0].status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideCard;