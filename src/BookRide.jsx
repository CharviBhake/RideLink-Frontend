import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, Users, User } from 'lucide-react';

const BookRide = ({ ride, onClose, onSuccess }) => {
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/booking/${rideId}', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
         // rideId: ride.id,
          seats: seatsToBook,
        //  totalAmount: ride.price * seatsToBook
        })
      });

      if (response.ok) {
        const booking = await response.json();
        console.log('Booking successful:', booking);
        
        // Show success message
        alert(`✅ Booking Confirmed!\n\nBooking ID: ${booking.id}\nSeats: ${seatsToBook}\nTotal: ₹${(ride.price * seatsToBook).toFixed(2)}\n\nYou will receive a confirmation email shortly.`);
        
        if (onSuccess) {
          onSuccess(booking);
        }
        onClose();
      } else {
        const error = await response.json();
        alert('❌ Booking Failed: ' + (error.message || 'Please try again'));
      }
    } catch (error) {
      console.error('Error booking ride:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = (ride.price * seatsToBook).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h3 className="text-2xl font-bold text-white">Confirm Booking</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Ride Details */}
          <div className="bg-black rounded-lg p-4 border border-neutral-800 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-400 mr-2" />
                <div>
                  <p className="text-xs text-neutral-400">Route</p>
                  <p className="text-white font-semibold">{ride.from} → {ride.to}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-green-400 mr-2" />
                <div>
                  <p className="text-xs text-neutral-400">Date</p>
                  <p className="text-white">{ride.date}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 text-purple-400 mr-2" />
                <div>
                  <p className="text-xs text-neutral-400">Time</p>
                  <p className="text-white">{ride.time}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center mr-3 border border-neutral-700">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Driver</p>
                  <p className="text-white font-medium">{ride.driverName || 'Driver'}</p>
                  <p className="text-xs text-neutral-400">
                    ⭐ {ride.driverRating || '5.0'} • {ride.carModel || 'Car'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              Number of Seats
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSeatsToBook(Math.max(1, seatsToBook - 1))}
                disabled={seatsToBook <= 1}
                className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white w-12 h-12 rounded-lg font-bold text-xl transition-all"
              >
                -
              </button>
              
              <div className="flex-1 bg-black border border-neutral-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">{seatsToBook}</div>
                <div className="text-xs text-neutral-400 mt-1">
                  {seatsToBook === 1 ? 'seat' : 'seats'}
                </div>
              </div>
              
              <button
                onClick={() => setSeatsToBook(Math.min(ride.seatsLeft || ride.seats, seatsToBook + 1))}
                disabled={seatsToBook >= (ride.seatsLeft || ride.seats)}
                className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white w-12 h-12 rounded-lg font-bold text-xl transition-all"
              >
                +
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-neutral-500">
                <Users className="w-3 h-3 inline mr-1" />
                {ride.seatsLeft || ride.seats} seats available
              </span>
              <span className="text-neutral-400">
                ₹{ride.price} per seat
              </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Price per seat</span>
              <span className="text-white">₹{ride.price}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Number of seats</span>
              <span className="text-white">× {seatsToBook}</span>
            </div>
            <div className="border-t border-neutral-700 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-white">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="flex-1 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black py-3 rounded-lg font-semibold transition-all"
            >
              {loading ? 'Booking...' : 'Confirm & Pay'}
            </button>
          </div>

          <p className="text-xs text-neutral-500 text-center">
            By confirming, you agree to the carpooling terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookRide;